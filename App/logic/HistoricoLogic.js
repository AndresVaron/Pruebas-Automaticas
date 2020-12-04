const axios = require('axios');
const url = process.env.JENKINS_URL || 'http://127.0.0.1:8080';
const key = process.env.JENKINS_KEY || 'admin';
const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');

const getHistorico = async (id_config) => {
    try {
        const response = await WebAppConfigPersistence.fetchWebAppVersionConfig(
            id_config
        );
        const config = {
            auth: {
                username: 'admin',
                password: key,
            },
        };

        const resp = await axios.get(
            url +
                '/job/' +
                id_config +
                '/api/json?tree=builds[number,status,timestamp,id,result]',
            config
        );
        return { nombre: response.nombre, builds: resp.data.builds };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

const getLogs = async (id_config, numBuild) => {
    try {
        const response = await WebAppConfigPersistence.fetchWebAppVersionConfig(
            id_config
        );
        const config = {
            auth: {
                username: 'admin',
                password: key,
            },
        };

        const resp = await axios.get(
            url + '/job/' + id_config + '/' + numBuild + '/api/json',
            config
        );

        const resp2 = await axios.get(
            url + '/job/' + id_config + '/' + numBuild + '/consoleText',
            config
        );
        return {
            build: resp.data,
            logs: resp2.data.replace(
                // eslint-disable-next-line no-control-regex
                /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                ''
            ),
            config: response,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getHistorico, getLogs };
