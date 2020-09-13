import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './WebAppConfigList.css';
import AddIcon from '../../Media/Icons/addIcon.svg';
import closeIcon from '../../Media/Icons/close.svg';
import WebAppConfigCard from './WebAppConfigCard/WebAppConfigCard.jsx';

function WebAppConfigList(props) {
    const [app, setApp] = useState(null);
    const [configs, setConfigs] = useState([]);
    const [showDeleteConf, setShowDeleteConf] = useState(undefined);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setApp({
            _id: 'abcd',
            nombre: 'Habitica',
            fechaCreacion: '17/08/27',
            numEjecuciones: '10',
            numPruebas: '5',
            numConfiguraciones: '3',
            version: {
                _id: '12345',
                version: '1.1.1',
                url: 'https://habitica.com',
            },
        });
        setConfigs([
            {
                _id: '654321',
                nombre: 'Habitica E2E + HT',
                fechaCreacion: '17/08/27',
                numEjecuciones: '10',
                numPruebas: '5',
                pruebas: [
                    [
                        {
                            nombre: 'End to End',
                            short: 'HT',
                            _id: 'gasdas',
                        },
                    ],
                    [
                        {
                            nombre: 'End to End',
                            short: 'MT',
                            _id: 'gasdas',
                        },
                        {
                            nombre: 'End to End',
                            short: 'IT',
                            _id: 'gasdas',
                        },
                        {
                            nombre: 'End to End',
                            short: 'MT',
                            _id: 'gasdas',
                        },
                        {
                            nombre: 'End to End',
                            short: 'IT',
                            _id: 'gasdas',
                        },
                    ],
                    [
                        {
                            nombre: 'End to End',
                            short: 'E2E',
                            _id: 'gasdas',
                        },
                    ],
                    [
                        {
                            nombre: 'End to End',
                            short: 'BT',
                            _id: 'gasdas',
                        },
                    ],
                    [
                        {
                            nombre: 'End to End',
                            short: 'ATE',
                            _id: 'gasdas',
                        },
                        {
                            nombre: 'End to End',
                            short: 'ATBC',
                            _id: 'gasdas',
                        },
                    ],
                    [
                        {
                            nombre: 'End to End',
                            short: 'E2E',
                            _id: 'gasdas',
                        },
                    ],
                ],
            },
        ]);
    }, []);

    const renderList = () => {
        return configs.map((config) => (
            <div key={config._id} className="contWebAppCard">
                <WebAppConfigCard
                    app={app}
                    config={config}
                    setShowDeleteConf={setShowDeleteConf}
                />
            </div>
        ));
    };

    if (app !== null) {
        return (
            <div>
                {showDeleteConf && <div className="curtain"></div>}
                {showDeleteConf && (
                    <div className="modalCreateWebAppVersionCont">
                        <div className="modalCreateWebApp modalDeleteConfig">
                            <img
                                alt=""
                                src={closeIcon}
                                className="closeButtonModal"
                                onClick={() => {
                                    setShowDeleteConf(false);
                                }}
                            />
                            <div className="createContainer">
                                <h1>Borrar Configuracion</h1>
                                <div className="lblBorrarApp">
                                    {'¿Estás seguro que quieres borrar la configuracion ' +
                                        showDeleteConf.nombre +
                                        ' ?'}
                                </div>
                                <div className="rowGuardarCrearVersionApp">
                                    <button
                                        className="bntCancelarWebAppList"
                                        onClick={() => {
                                            //Borar la conf en showDeleteConf
                                        }}
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="rowConfWebAppTitle">
                    <div className="lblTitleWebAppConfig">
                        {app.nombre + ' v' + app.version.version}
                    </div>
                    <div
                        className="lblTitleWebAppConfigUrl"
                        onClick={() => {
                            const win = window.open(app.version.url, '_blank');
                            win.focus();
                        }}
                    >
                        {app.version.url}
                    </div>
                </div>
                <div className="lblsubTitleWebApp">
                    Selecciona la configuracion que desas usar:
                </div>
                <div className="containerAppsWeb">{renderList()}</div>
                <div className="containerAppsWeb containerAppsWebCenter">
                    <div
                        className="botonCrearOtraAppWeb"
                        onClick={() => {
                            props.history.push(
                                '/web/' +
                                    app._id +
                                    '/' +
                                    app.version._id +
                                    '/config'
                            );
                        }}
                    >
                        <img src={AddIcon} alt="" />
                    </div>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default withRouter(WebAppConfigList);