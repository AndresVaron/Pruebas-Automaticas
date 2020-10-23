const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const TestPersistence = require('../persistence/TestsPersistence');
const VersionPersistence = require('../persistence/VersionsPersistence');
const MongoFunctions = require('../utils/MongoFunctions');
const axios = require('axios');
const executeVRT = require('../utils/ExecuteVRT');
const url = process.env.JENKINS_URL || 'http://localhost:8080';
const key = process.env.JENKINS_KEY || 'admin';

/*
Método encargado de obtener todas las apps web
*/
module.exports.fetchWebAppVersionConfigs = async (id) => {
    try {
        const configs = await WebAppPersistence.fetchWebAppVersionConfigs(id);
        for (const config of configs) {
            for (let j = 0; j < config.pruebas.length; j++) {
                for (let i = 0; i < config.pruebas[j].length; i++) {
                    //Mandar el elemento completo
                    const version = await VersionPersistence.fetchVersion(
                        config.pruebas[j][i]
                    );
                    if (version !== null) {
                        config.pruebas[j][
                            i
                        ] = await TestPersistence.findTestById(version.test);
                    }
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
                password: key,
            },
        };

        axios.post(
            url + '/createItem?name=' + response.ops[0]._id.toString(),
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
        let pipeline = `def buildId = '${id}-' + BUILD_NUMBER
pipeline {
    agent any
    stages {\n`;
        const endCommands = [];
        if (config.pruebas.length > 0) {
            for (let i = 0; i < config.pruebas.length; i++) {
                const isParallel = config.pruebas[i].length > 1;
                if (isParallel) {
                    pipeline += `        stage('${[i + 1]}') {  
            parallel {\n`;
                }
                for (let j = 0; j < config.pruebas[i].length; j++) {
                    pipeline += await calcSteps(
                        config.pruebas[i][j],
                        isParallel,
                        i + 1,
                        j + 1,
                        endCommands
                    );
                    config.pruebas[i][j] = MongoFunctions.convertObjectId(
                        config.pruebas[i][j]
                    );
                }
                if (isParallel) {
                    pipeline += `            }
        }\n`;
                }
            }
        } else {
            pipeline += `stage('Empty'){
                steps{ 
                    sh "echo /"This pipeline is empty/""
                }
            }`;
        }
        pipeline += '    }\n';
        pipeline += `    post {
        always {\n`;
        for (let i = 0; i < endCommands.length; i++) {
            pipeline += endCommands[i] + '\n';
        }
        pipeline += '            cleanWs()\n       }\n    }\n}';
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
                    <script>${pipeline}</script>
                    <sandbox>true</sandbox>
                </definition>
                <triggers/>
                <disabled>false</disabled>
            </flow-definition>`;

        const configuration = {
            headers: { 'Content-Type': 'text/xml' },
            auth: {
                username: 'admin',
                password: key,
            },
        };
        axios
            .post(url + '/job/' + id + '/config.xml', xmlBodyStr, configuration)
            .catch((err) => {
                console.error(err);
            });
        updateResponse = await WebAppConfigPersistence.updateWebAppConfig(
            id,
            config
        );
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
    if (updateResponse.result.n !== 1) {
        errJson.errMsg += 'Esta configuración no existe';
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    return 'Se actualizó la configuracion';
};

const calcSteps = async (id_version, isParallel, index, jndex, endCommands) => {
    const version = await VersionPersistence.fetchVersion(id_version);
    const prueba = await TestPersistence.findTestById(version.test);
    if (version === null || prueba === null) {
        const errJson = {
            errMsg: 'Las pruebas no son validas',
            errCode: 400,
        };
        errJson.error = new Error();
        throw errJson;
    }
    const ver = '${buildId}-' + index + '-' + jndex;
    const parallel = isParallel ? '        ' : '';
    let pipeline = `${parallel}        stage('${(isParallel ? index + '-' + jndex + '-' : index + '-') +
        prueba.shortName +
        '-v' +
        version.version
        }'){
    ${parallel}        steps{\n`;
    if (prueba.type === 'Cypress') {
        pipeline += `               ${parallel}sh "wget -O ${ver}-files.zip ${version.url}"\n`;
        pipeline += `               ${parallel}sh "mkdir -p ${ver}-cypress/cypress/integration"\n`;
        pipeline += `               ${parallel}sh "unzip ${ver}-files.zip -d ./${ver}-cypress/cypress/integration"\n`;
        pipeline += `               ${parallel}sh "echo '{\\n    \\"reporter\\": \\"junit\\",\\n    \\"reporterOptions\\": {\\n        \\"mochaFile\\": \\"results/${ver}.xml\\",\\n        \\"video\\": false\\n    }\\n}' > ./${ver}-cypress/cypress.json"\n`;
        pipeline += `               ${parallel}sh "docker create --ipc=host -w /home/cypress --name ${ver} cypress/included:5.0.0"\n`;
        pipeline += `               ${parallel}sh "docker cp ./${ver}-cypress/. ${ver}:/home/cypress"\n`;
        pipeline += `               ${parallel}sh "docker start -a ${ver} || echo 'Failed Tests' &amp;&amp; docker cp ${ver}:/home/cypress/results/ ./results/ "\n`;
        endCommands.push(
            `            sh "docker stop ${ver} || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}|| echo 'Not Found'"`
        );
        if (endCommands.find((c) => c.includes('junit')) === undefined) {
            endCommands.push('            junit "**/results/*.xml"');
        }
    } else if (prueba.type === 'Cucumber') {
        pipeline += `               ${parallel}sh "wget -O ${ver}-files.zip ${version.url}"\n`;
        pipeline += `               ${parallel}sh "mkdir -p ${ver}-cucumber"\n`;
        pipeline += `               ${parallel}sh "unzip ${ver}-files.zip -d ./${ver}-cucumber"\n`;
        pipeline += `               ${parallel}sh "echo 'FROM node:lts' >> ./${ver}-cucumber/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'WORKDIR /home/cucumber' >>  ./${ver}-cucumber/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY . /home/cucumber' >> ./${ver}-cucumber/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'RUN npm install --loglevel verbose' >> ./${ver}-cucumber/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "ls"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver} ./${ver}-cucumber/"\n`;
        pipeline += `               ${parallel}sh "docker run  --rm --name ${ver} ${ver} npm test|| echo 'Failed Tests'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver} || echo 'Not Found'"`
        );
    }
    pipeline += `${parallel}            }
    ${parallel}    }\n`;
    return pipeline;
};

module.exports.execWebAppConfig = async (id) => {
    try {
        const errJson = {
            errMsg: 'No existe una configuracion con este id',
            errCode: 400,
        };
        const response = await WebAppConfigPersistence.fetchWebAppVersionConfig(
            id
        );
        if (response === null) {
            errJson.error = new Error();
            throw errJson;
        } else {
            const config = {
                auth: {
                    username: 'admin',
                    password: key,
                },
            };
            const testsToMake = response.pruebas.flat();
            if (testsToMake.length === 0) {
                errJson.errMsg = 'No hay pruebas a ejecutar';
                errJson.error = new Error();
                throw errJson;
            }
            const testsVersions = await VersionPersistence.findVersions({ _id: { $in: testsToMake } });
            if (!testsVersions || testsVersions.length !== testsToMake.length) {
                errJson.errMsg = 'No se encontró la versión de la prueba a ejecutar';
                errJson.error = new Error();
                throw errJson;
            }
            const testsId = testsVersions.map(test => test.test);
            const testsInformation = await TestPersistence.findTests({ _id: { $in: testsId } });
            if (!testsInformation || testsInformation.length !== testsId.length) {
                errJson.errMsg = 'No se encontraron las pruebas a ejecutar';
                errJson.error = new Error();
                throw errJson;
            }
            const vrtTest = testsInformation.find(test => test.type === 'VRT');
            if (vrtTest) {
                const testVersion = testsVersions.find(test => String(test.test) === String(vrtTest._id));
                executeVRTTest(testVersion, testsInformation[0].aut, { _id: response.id_version, id_app: testsInformation[0].aut });
            }
            // axios.post(url + '/job/' + id + '/build', {}, config);
            return true;
        }
    } catch (err) {
        console.log(err);
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
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
                password: key,
            },
        };
        axios.post(url + '/job/' + id + '/doDelete', {}, config);
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


const executeVRTTest = async (test, currentApp, appVersion) => {
    const directory = `./cypress/integration/${currentApp}/versions/${appVersion._id}`;
    const packageName = 'index.spec';
    await executeVRT(test, directory, packageName, "", appVersion, false);
    console.log('VRT finished');
};