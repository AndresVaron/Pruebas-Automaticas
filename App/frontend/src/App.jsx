import React, { useEffect } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import axiosInstance from './AxiosAPI.js';
import './App.css';
import VanillaToasts from './Toast/Toast.js';
import './Toast/Toast.css';

import Inicio from './Inicio/Inicio.jsx';
import Web from './Web/Web.jsx';
import WebAppConfigList from './Web/WebAppConfigList/WebAppConfigList.jsx';
import WebAppConfig from './Web/WebAppConfig/WebAppConfig.jsx';
import VRT from './VRT/VRT.jsx';

function App() {
    useEffect(() => {
        const authInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response !== undefined) {
                    console.error(error);
                    VanillaToasts.create({
                        title: 'Error:',
                        text: error.response.data,
                        type: 'error',
                        timeout: 5000,
                        callback: function () {},
                    });
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosInstance.interceptors.response.eject(authInterceptor);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="App">
                <Switch>
                    <Route exact path="/" render={() => <Inicio />} />
                    <Route
                        path="/(web|mobile)/:id_app/versions/:id_version/configs/:id_config"
                        render={() => <WebAppConfig />}
                    />
                    <Route
                        path="/(web|mobile)/:id_app/versions/:id_version"
                        render={() => <WebAppConfigList />}
                    />
                    <Route
                        path="/vrt/(web|mobile)/:aut"
                        render={() => <VRT />}
                    ></Route>
                    <Route exact path="/(web|mobile)/" render={() => <Web />} />
                    <Route path="*" exact render={() => <div>Not Found</div>} />
                </Switch>
            </div>
        </div>
    );
}

export default withRouter(App);
