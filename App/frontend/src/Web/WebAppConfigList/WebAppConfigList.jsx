import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './WebAppConfigList.css';
import AddIcon from '../../Media/Icons/addIcon.svg';
import closeIcon from '../../Media/Icons/close.svg';
import WebAppConfigCard from './WebAppConfigCard/WebAppConfigCard.jsx';
import axiosInstance from '../../AxiosAPI.js';

function WebAppConfigList(props) {
    const [app, setApp] = useState(null);
    const [configs, setConfigs] = useState([]);
    const [showDeleteConf, setShowDeleteConf] = useState(undefined);

    useEffect(() => {
        if (
            props.match.params.id_app !== undefined &&
            props.match.params.id_version !== undefined
        ) {
            axiosInstance
                .get(
                    '/web/' +
                    props.match.params.id_app +
                    '/versiones/' +
                    props.match.params.id_version
                )
                .then((resp) => {
                    setApp(resp.data);
                    axiosInstance
                        .get(
                            '/web/' +
                            props.match.params.id_app +
                            '/versiones/' +
                            props.match.params.id_version +
                            '/configs'
                        )
                        .then((resp) => {
                            const conf = resp.data;
                            conf.push({
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
                                            versiones: [
                                                {
                                                    url: 'adsasd',
                                                    version: '1.1.1',
                                                },
                                            ],
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
                            });
                            setConfigs(conf);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
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
            <div className="containerListMain">
                {showDeleteConf && <div className="curtain"></div>}
                {showDeleteConf && (
                    <div className="modalCreateWebAppVersionCont">
                        <div className="modalCreateWebApp modalDeleteConfig">
                            <img
                                alt=""
                                src={closeIcon}
                                className="closeButtonModal"
                                onClick={() => {
                                    setShowDeleteConf(undefined);
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

                                            axiosInstance
                                                .delete(
                                                    '/web/' +
                                                    props.match.params
                                                        .id_app +
                                                    '/versiones/' +
                                                    props.match.params
                                                        .id_version +
                                                    '/configs/' +
                                                    showDeleteConf._id
                                                )
                                                .then(() => {
                                                    setShowDeleteConf(
                                                        undefined
                                                    );
                                                    axiosInstance
                                                        .get(
                                                            '/web/' +
                                                            props.match
                                                                .params
                                                                .id_app +
                                                            '/versiones/' +
                                                            props.match
                                                                .params
                                                                .id_version +
                                                            '/configs'
                                                        )
                                                        .then((resp) => {
                                                            setConfigs(
                                                                resp.data
                                                            );
                                                        })
                                                        .catch((err) => {
                                                            console.error(err);
                                                        });
                                                })
                                                .catch((err) => {
                                                    console.error(err);
                                                });
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
                    Selecciona la configuración que desas usar:
                </div>
                <div className="containerAppsWeb">{renderList()}</div>
                <div className="containerAppsWeb containerAppsWebCenter">
                    <div
                        className="botonCrearOtraAppWeb"
                        onClick={() => {
                            axiosInstance
                                .post(
                                    '/web/' +
                                    props.match.params.id_app +
                                    '/versiones/' +
                                    props.match.params.id_version +
                                    '/configs'
                                )
                                .then((resp) => {
                                    console.log(resp);
                                    props.history.push(`/web/${app._id}/versions/${app.version._id}/configs/${resp.data._id}`);
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
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
