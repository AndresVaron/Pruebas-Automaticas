const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const TestPersistence = require('../persistence/TestsPersistence');
const VersionPersistence = require('../persistence/VersionsPersistence');
const MongoFunctions = require('../utils/MongoFunctions');
const axios = require('axios');
const AppVersionsPersistence = require('../persistence/AppVersionsPersistence');
const url = process.env.JENKINS_URL || 'http://127.0.0.1:8080';
const key = process.env.JENKINS_KEY || 'admin';

const SERVER_URL = 'http://localhost';

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

    const configur = await WebAppConfigPersistence.fetchWebAppVersionConfig(id);
    const appVersion = await AppVersionsPersistence.fetchWebAppVersion(
        configur.id_version
    );
    if (!appVersion) {
        const errJson = {
            errMsg: 'No se encontró la versión de la aplicación a probar',
            errCode: 404,
        };
        errJson.error = new Error();
        throw errJson;
    }
    const currentApp = await WebAppPersistence.fetchApp(appVersion.id_app);
    if (!currentApp) {
        const errJson = {
            errMsg: 'No se encontró la aplicación a probar',
            errCode: 404,
        };
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
        if (currentApp.mobile) {
            pipeline += `        stage('Download') {
            steps{
                sh "mkdir -p APK"
                sh "wget -O ./APK/app.apk ${appVersion.url}"
            }\n        }\n`;
        }
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
                        endCommands,
                        currentApp,
                        configur
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
        // pipeline += '            sh "echo 123"\n       }\n    }\n}';
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

const calcSteps = async (
    id_version,
    isParallel,
    index,
    jndex,
    endCommands,
    currentApp,
    currentConfig
) => {
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
    let pipeline = `${parallel}        stage('${
        (isParallel ? index + '-' + jndex + '-' : index + '-') +
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
    } else if (prueba.type === 'MobileMonkey') {
        // const packageName = currentApp.package;
        pipeline += `               ${parallel}sh "mkdir -p ${ver}-monkey"\n`;
        pipeline += `               ${parallel}sh "cp ./APK/app.apk ./${ver}-monkey/app.apk"\n`;
        pipeline += `               ${parallel}sh "echo 'FROM budtmo/docker-android-x86-11.0' >> ./${ver}-monkey/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./app.apk /APK/' >> ./${ver}-monkey/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV DEVICE=\\"${prueba.dispositivo}\\"' >> ./${ver}-monkey/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver} ./${ver}-monkey/"\n`;
        pipeline += `               ${parallel}sh "docker run --privileged -d -p 90${index}${jndex}:6080 --rm --name ${ver} ${ver} || echo 'Failed Tests'"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb wait-for-device"\n`;
        //Se espera a que cargue el emulador.
        pipeline += `               ${parallel}sh "#!/bin/sh -e\\n while [ \\"\`docker exec ${ver} adb shell getprop sys.boot_completed | tr -d '\\r' \`\\" != \\"1\\" ] ; do sleep 10; done"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb install /APK/app.apk"\n`;
        pipeline += `               ${parallel}sh "mkdir -p ./${ver}-monkey/Results"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb shell monkey -p ${currentApp.package} -v ${version.events} > ./${ver}-monkey/Results/${ver}-monkey.log"\n`;
        pipeline += `               ${parallel}sh "cat ./${ver}-monkey/Results/${ver}-monkey.log"\n`;
        pipeline += `               ${parallel}sh "docker stop ${ver} || echo 'Not Found'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver} || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}|| echo 'Not Found'"`
        );
    } else if (prueba.type === 'Appium') {
        pipeline += `               ${parallel}sh "docker network create ${ver}-net"\n`;
        pipeline += `               ${parallel}sh "mkdir -p ${ver}-vrt"\n`;
        pipeline += `               ${parallel}sh "cp ./APK/app.apk ./${ver}-vrt/app.apk"\n`;
        pipeline += `               ${parallel}sh "echo 'FROM budtmo/docker-android-x86-11.0' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./app.apk /APK/' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV DEVICE=\\"${
            prueba.dispositivo || 'Samsung Galaxy S9'
        }\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver} ./${ver}-vrt/"\n`;
        pipeline += `               ${parallel}sh "docker run --network=\\"${ver}-net\\" --privileged -d -p 90${index}${jndex}:6080 -e APPIUM=true --rm --name ${ver} ${ver} || echo 'Failed Tests'"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb wait-for-device"\n`;
        pipeline += `               ${parallel}sh "#!/bin/sh -e\\n while [ \\"\`docker exec ${ver} adb shell getprop sys.boot_completed | tr -d '\\r' \`\\" != \\"1\\" ] ; do sleep 10; done"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb install /APK/app.apk"\n`;
        endCommands.push(
            `            sh "docker stop ${ver} || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}|| echo 'Not Found'"`
        );
        pipeline += `               ${parallel}sh "wget -O ./${ver}-vrt/script.js ${version.url}"\n`;
        pipeline += `               ${parallel}sh "echo 'FROM andresvm/execappium:fourth' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./script.js /usr/src/app/script.js' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'RUN mkdir -p /usr/src/app/screenshots' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV HOST=\\"${ver}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV DEVICE=\\"emulator-5554\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver}-exec ./${ver}-vrt/"\n`;
        pipeline += `               ${parallel}sh "docker create --network=\\"${ver}-net\\" --name ${ver}-exec ${ver}-exec"\n`;
        pipeline += `               ${parallel}sh "docker start -a ${ver}-exec || echo 'Failed Tests' &amp;&amp; docker cp ${ver}-exec:/usr/src/app/screenshots ./${ver}-vrt/screenshots || echo 'no screenshots'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver}-exec || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}-exec|| echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker network rm ${ver}-net || echo 'Not Found'"`
        );
    } else if (currentApp.mobile && prueba.type === 'VRT') {
        pipeline += `               ${parallel}sh "docker network create ${ver}-net"\n`;
        pipeline += `               ${parallel}sh "mkdir -p ${ver}-vrt"\n`;
        pipeline += `               ${parallel}sh "cp ./APK/app.apk ./${ver}-vrt/app.apk"\n`;
        pipeline += `               ${parallel}sh "echo 'FROM budtmo/docker-android-x86-11.0' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./app.apk /APK/' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV DEVICE=\\"${
            prueba.dispositivo || 'Samsung Galaxy S9'
        }\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver} ./${ver}-vrt/"\n`;
        pipeline += `               ${parallel}sh "docker run --network=\\"${ver}-net\\" --privileged -d -p 90${index}${jndex}:6080 -e APPIUM=true --rm --name ${ver} ${ver} || echo 'Failed Tests'"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb wait-for-device"\n`;
        pipeline += `               ${parallel}sh "#!/bin/sh -e\\n while [ \\"\`docker exec ${ver} adb shell getprop sys.boot_completed | tr -d '\\r' \`\\" != \\"1\\" ] ; do sleep 10; done"\n`;
        pipeline += `               ${parallel}sh "docker exec ${ver} adb install /APK/app.apk"\n`;
        endCommands.push(
            `            sh "docker stop ${ver} || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}|| echo 'Not Found'"`
        );
        pipeline += `               ${parallel}sh "wget -O ./${ver}-vrt/script.js ${version.url}"\n`;
        pipeline += `               ${parallel}sh "echo 'FROM andresvm/execappium:fourth' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./script.js /usr/src/app/script.js' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'RUN mkdir -p /usr/src/app/screenshots' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV HOST=\\"${ver}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV DEVICE=\\"emulator-5554\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver}-exec ./${ver}-vrt/"\n`;
        pipeline += `               ${parallel}sh "docker create --network=\\"${ver}-net\\" --name ${ver}-exec ${ver}-exec"\n`;
        pipeline += `               ${parallel}sh "docker start -a ${ver}-exec || echo 'Failed Tests' &amp;&amp; docker cp ${ver}-exec:/usr/src/app/screenshots ./${ver}-vrt/screenshots || echo 'no screenshots'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver}-exec || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}-exec|| echo 'Not Found'"`
        );
        pipeline += `               ${parallel}sh "rm  ./${ver}-vrt/Dockerfile"\n`;
        //Se suben las imagenes al servidor.
        pipeline += `               ${parallel}sh "echo 'FROM andresvm/uploadvrt:lts' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./screenshots/ /usr/src/app/screenshots/' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ACCESS_KEY=\\"${process.env.ACCESS_KEY}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV SECRET_KEY=\\"${process.env.SECRET_KEY}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV BUCKET=\\"${process.env.BUCKET}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV MOBILE=\\"true\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_APP=\\"${currentApp._id}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_APP_VERSION=\\"${currentConfig.id_version}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_TEST=\\"${prueba._id}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_VERSION=\\"${version._id}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV SERVER_URL=\\"${SERVER_URL}\\"' >> ./${ver}-vrt/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver}-node ./${ver}-vrt/"\n`;
        pipeline += `               ${parallel}sh "docker run --rm --name ${ver}-node ${ver}-node || echo 'Upload Failed'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver}-node || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}-node|| echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker network rm ${ver}-net || echo 'Not Found'"`
        );
    } else if (prueba.type === 'VRT') {
        pipeline += `               ${parallel}sh "wget -O ${ver}-files.zip ${version.url}"\n`;
        pipeline += `               ${parallel}sh "mkdir -p ${ver}-cypress/cypress/integration"\n`;
        pipeline += `               ${parallel}sh "unzip ${ver}-files.zip -d ./${ver}-cypress/cypress/integration"\n`;
        pipeline += `               ${parallel}sh "echo '{\\n}' > ./${ver}-cypress/cypress.json"\n`;
        pipeline += `               ${parallel}sh "docker create --ipc=host -w /home/cypress --name ${ver} cypress/included:5.0.0"\n`;
        pipeline += `               ${parallel}sh "docker cp ./${ver}-cypress/. ${ver}:/home/cypress"\n`;
        pipeline += `               ${parallel}sh "docker start -a ${ver} || echo 'Failed Tests' &amp;&amp; docker cp ${ver}:/home/cypress/cypress/screenshots/ ./${ver}-cypress/screenshots/ || echo 'no screenshots'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver} || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}|| echo 'Not Found'"`
        );
        //Se suben las imagenes al servidor.
        pipeline += `               ${parallel}sh "echo 'FROM andresvm/uploadvrt:lts' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'COPY ./screenshots/ /usr/src/app/screenshots/' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ACCESS_KEY=\\"${process.env.ACCESS_KEY}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV SECRET_KEY=\\"${process.env.SECRET_KEY}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV BUCKET=\\"${process.env.BUCKET}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV MOBILE=\\"false\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_APP=\\"${currentApp._id}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_APP_VERSION=\\"${currentConfig.id_version}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_TEST=\\"${prueba._id}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV ID_VERSION=\\"${version._id}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "echo 'ENV SERVER_URL=\\"${SERVER_URL}\\"' >> ./${ver}-cypress/Dockerfile"\n`;
        pipeline += `               ${parallel}sh "docker build -t ${ver}-node ./${ver}-cypress/"\n`;
        pipeline += `               ${parallel}sh "docker run --rm --name ${ver}-node ${ver}-node || echo 'Upload Failed'"\n`;
        endCommands.push(
            `            sh "docker stop ${ver}-node || echo 'Not Found'"`
        );
        endCommands.push(
            `            sh "docker container rm ${ver}-node|| echo 'Not Found'"`
        );
    }
    //docker run
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
            axios.post(url + '/job/' + id + '/build', {}, config);
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
