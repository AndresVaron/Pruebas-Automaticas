const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const MongoFunctions = require('../utils/MongoFunctions');
const axios = require('axios');
const { response } = require('express');

/*
Método encargado de obtener todas las apps web
*/
module.exports.fetchWebAppVersionConfigs = async (id) => {
    try {
        const configs = await WebAppPersistence.fetchWebAppVersionConfigs(id);
        for (const config of configs) {
            for (let j = 0; j < config.pruebas.length; j++) {
                for (let i = 0; i < config.pruebas[j].length; i++) {
                    config.pruebas[j][
                        i
                    ] = await WebAppPersistence.fetchWebAppPrueba(
                        config.pruebas[j][i]
                    );
                }
            }
        }
        return configs;
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

module.exports.postWebAppVersionConfig = async (id_version) => {
    //Se intenta crear la webapp
    try {
        const finalWebAppConfig = {
            nombre: 'Configuración',
            pruebas: [],
            id_version: id_version,
        };
        const today = new Date(Date.now());
        finalWebAppConfig.fechaCreacion = new Date(
            Date.now() - today.getTimezoneOffset() * 60 * 1000
        );
        const response = await WebAppConfigPersistence.insertWebAppConfig(
            finalWebAppConfig
        );
        //Crear un job de Jenkins
        const xmlBodyStr = `<?xml version='1.1' encoding='UTF-8'?>
            <flow-definition plugin="workflow-job@2.40">
                <actions>
                    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.7.2"/>
                    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.7.2">
                        <jobProperties/>
                        <triggers/>
                        <parameters/>
                        <options/>
                    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
                </actions>
                <description></description>
                <keepDependencies>false</keepDependencies>
                <properties>
                    <hudson.plugins.jira.JiraProjectProperty plugin="jira@3.1.1"/>
                </properties>
                <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.83">
                    <script></script>
                    <sandbox>true</sandbox>
                </definition>
                <triggers/>
                <disabled>false</disabled>
            </flow-definition>`;

        const config = {
            headers: { 'Content-Type': 'text/xml' },
            auth: {
                username: 'admin',
                password: '11b004d566e08c56110575b2d65393db5d',
            },
        };

        axios.post(
            'http://localhost:8080/createItem?name=' +
                response.ops[0]._id.toString(),
            xmlBodyStr,
            config
        );

        return response.ops[0];
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

module.exports.getWebAppVersionConfig = async (
    id_app,
    id_version,
    id_config
) => {
    try {
        const response = await WebAppConfigPersistence.fetchWebAppVersionConfig(
            id_config
        );
        if (response === null) {
            const errJson = {
                errMsg: 'No existe una configuracion con este id',
                errCode: 400,
            };
            errJson.error = new Error();
            throw errJson;
        } else {
            if (response.id_version.toString() !== id_version) {
                const errJson = {
                    errMsg: 'Esta configuracion no pertenece a esta version',
                    errCode: 400,
                };
                errJson.error = new Error();
                throw errJson;
            }
            for (let j = 0; j < response.pruebas.length; j++) {
                for (let i = 0; i < response.pruebas[j].length; i++) {
                    //TODO
                    response.pruebas[j][
                        i
                    ] = await WebAppPersistence.fetchWebAppPrueba(
                        response.pruebas[j][i]
                    );
                }
            }
            return response;
        }
    } catch (err) {
        if (err.errCode) {
            throw err;
        }
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

module.exports.updateWebAppVersionConfig = async (id, config) => {
    const errJson = {
        errMsg: '',
        errCode: 500,
    };
    let err = false;
    if (
        config.nombre === undefined ||
        typeof config.nombre !== 'string' ||
        config.nombre === ''
    ) {
        //Append mensaje de error correspondiente
        err = true;
        errJson.errMsg +=
            'Nombre de la configuración incorrecto o undefined \n';
    }

    // En caso de error se lanza una respuesta de tipo 400 con los errores
    if (err) {
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    //Hacer el put.
    let updateResponse;
    try {
        let pipeline = `pipeline {
                            agent any
                            stages {
                        `;
        if (config.pruebas.length > 0) {
            for (let i = 0; i < config.pruebas.length; i++) {
                if (config.pruebas[i].length > 1) {
                    pipeline += ` stage('${[i]}') {  
                        parallel {`;
                }
                for (let j = 0; j < config.pruebas[i].length; j++) {
                    pipeline += await calcSteps(config.pruebas[i][j]);
                    config.pruebas[i][j] = MongoFunctions.convertObjectId(
                        config.pruebas[i][j]
                    );
                }
                if (config.pruebas[i].length > 1) {
                    pipeline += `}
                        }`;
                }
            }
        } else {
            pipeline += `stage('Empty'){
                steps{ 
                    sh "echo /"This pipeline is empty/""
                }
            }`;
        }
        pipeline += `    }
                    }`;

        //Crear un job de Jenkins
        const xmlBodyStr = `<?xml version='1.1' encoding='UTF-8'?>
            <flow-definition plugin="workflow-job@2.40">
                <actions>
                    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.7.2"/>
                    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.7.2">
                        <jobProperties/>
                        <triggers/>
                        <parameters/>
                        <options/>
                    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
                </actions>
                <description></description>
                <keepDependencies>false</keepDependencies>
                <properties>
                    <hudson.plugins.jira.JiraProjectProperty plugin="jira@3.1.1"/>
                </properties>
                <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.83">
                    <script>UPDATE</script>
                    <sandbox>${pipeline}</sandbox>
                </definition>
                <triggers/>
                <disabled>false</disabled>
            </flow-definition>`;

        const configuration = {
            headers: { 'Content-Type': 'text/xml' },
            auth: {
                username: 'admin',
                password: '11b004d566e08c56110575b2d65393db5d',
            },
        };

        axios.post(
            'http://localhost:8080/job/' + id + '/config.xml',
            xmlBodyStr,
            configuration
        );

        updateResponse = await WebAppConfigPersistence.updateWebAppConfig(
            id,
            config
        );
    } catch (err) {
        console.log(err);
        if (err.errCode) {
            throw err;
        }
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
    if (updateResponse.result.n !== 1) {
        errJson.errMsg += 'Esta configuración no existe';
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    return 'Se actualizó la configuracion';
};

const calcSteps = async (prueba) => {
    const test = await WebAppPersistence.fetchWebAppTest(prueba);
    if (prueba === null) {
        const errJson = {
            errMsg: 'Las pruebas no son validas',
            errCode: 400,
        };
        errJson.error = new Error();
        throw errJson;
    }
    let pipeline = `stage('${[tipo]}'){
        steps{ `;

    pipeline += `}
             }`;
    return pipeline;
};

/* 
Método encargado de borrar una config de una web app 
Retorna error 404 si la web app no existe o 500 si hay un error de base de datos.
*/
module.exports.deleteWebAppConfig = async (id) => {
    try {
        const config = {
            auth: {
                username: 'admin',
                password: '11b004d566e08c56110575b2d65393db5d',
            },
        };
        axios.post('http://localhost:8080/job/' + id + '/doDelete', {}, config);
        const response = await WebAppConfigPersistence.deleteWebAppConfig(id);
        //Se revisa si existia una web app con ese id
        if (response.result.n == 1) {
            return response;
        } else {
            throw Error('Esta config de web App config no existe');
        }
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};
