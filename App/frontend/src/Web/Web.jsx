import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axiosInstance from '../AxiosAPI.js';
import './Web.css';
import WebAppCard from './WebAppCard/WebAppCard.jsx';
import closeIcon from '../Media/Icons/close.svg';
import AddIcon from '../Media/Icons/addIcon.svg';

function Web() {
    const [apps, setApps] = useState([
        {
            _id: 'abcd',
            nombre: 'Habitica',
            fechaCreacion: '17/08/27',
            numEjecuciones: '10',
            numPruebas: '5',
            numConfiguraciones: '3',
            versiones: [
                {
                    _id: '12345',
                    version: '1.1.1',
                    url: 'https://habitica.com',
                    fechaCreacion: '17/08/27',
                },
                {
                    _id: '123456',
                    version: '2.1',
                    url: 'https://habiticaTest.com',
                    fechaCreacion: '17/08/27',
                },
            ],
        },
        {
            _id: 'abcd',
            nombre: 'Habitica',
            fechaCreacion: '17/08/27',
            numEjecuciones: '10',
            numPruebas: '5',
            numConfiguraciones: '3',
            versiones: [
                {
                    _id: '12345',
                    version: '1.1.1',
                    url: 'https://habitica.com',
                    fechaCreacion: '17/08/27',
                },
                {
                    _id: '123456',
                    version: '2.1',
                    url: 'https://habiticaTest.com',
                    fechaCreacion: '17/08/27',
                },
            ],
        },
    ]);

    const [showCreateVersion, setShowCreateVersion] = useState(undefined);
    const [showDeleteApp, setShowDeleteApp] = useState(undefined);
    const [showCreateApp, setShowCreateApp] = useState(false);
    const [createVersionVersion, setCreateVersionVersion] = useState('');
    const [createVersionUrl, setCreateVersionUrl] = useState('');
    const [createAppNombre, setCreateAppNombre] = useState('');

    useEffect(() => {
        axiosInstance
            .get('/web')
            .then((resp) => {
                setApps(resp);
            })
            .catch((err) => {
                console.error(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderList = () => {
        return apps.map((app) => (
            <div key={app._id} className="contWebAppCard">
                <WebAppCard
                    app={app}
                    setShowCreateVersion={setShowCreateVersion}
                    setShowDeleteApp={setShowDeleteApp}
                />
            </div>
        ));
    };
    const calcVersionPlaceHolder = () => {
        if (
            showCreateVersion !== undefined &&
            showCreateVersion.versiones.length > 0
        ) {
            const valores = showCreateVersion.versiones[0].version.split('.');
            if (valores.length > 0 && !isNaN(valores[valores.length - 1])) {
                valores[valores.length - 1] =
                    parseInt(valores[valores.length - 1]) + 1;
            }
            return valores.join('.');
        } else {
            return 'Version';
        }
    };

    return (
        <div>
            {(showCreateVersion || showCreateApp || showDeleteApp) && (
                <div className="curtain"></div>
            )}
            {showCreateVersion && (
                <div className="modalCreateWebAppVersionCont">
                    <div className="modalCreateWebAppVersion">
                        <img
                            alt=""
                            src={closeIcon}
                            className="closeButtonModal"
                            onClick={() => {
                                setShowCreateVersion(undefined);
                            }}
                        />
                        <div className="createContainer">
                            <h1>Agregar Version</h1>
                            <div className="rowVersionCrearVersionApp">
                                <div className="lblCrearVersionApp">
                                    Version:
                                </div>
                                <input
                                    className="createInput"
                                    placeholder={calcVersionPlaceHolder()}
                                    value={createVersionVersion}
                                    type="text"
                                    onChange={(e) => {
                                        setCreateVersionVersion(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="rowUrlCrearVersionApp">
                                <div className="lblCrearVersionApp">Url:</div>
                                <input
                                    className="createInput"
                                    placeholder="Url"
                                    value={createVersionUrl}
                                    type="text"
                                    onChange={(e) => {
                                        setCreateVersionUrl(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="rowGuardarCrearVersionApp">
                                <button
                                    className="bntConfirmarWebAppList guardarCrearVersionApp"
                                    disabled={
                                        createVersionUrl === '' ||
                                        createVersionVersion === ''
                                    }
                                    onClick={() => {
                                        //Crear la version de la app y refresca la info.
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteApp && (
                <div className="modalCreateWebAppVersionCont">
                    <div className="modalCreateWebApp">
                        <img
                            alt=""
                            src={closeIcon}
                            className="closeButtonModal"
                            onClick={() => {
                                setShowDeleteApp(false);
                            }}
                        />
                        <div className="createContainer">
                            <h1>Borrar App</h1>
                            <div className="lblBorrarApp">
                                {'¿Estás seguro que quieres borrar la app ' +
                                    showDeleteApp.nombre +
                                    ' ?'}
                            </div>
                            <div className="rowGuardarCrearVersionApp">
                                <button
                                    className="bntCancelarWebAppList"
                                    onClick={() => {
                                        //Borar la app en showDeleteApp
                                    }}
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showCreateApp && (
                <div className="modalCreateWebAppVersionCont">
                    <div className="modalCreateWebApp">
                        <img
                            alt=""
                            src={closeIcon}
                            className="closeButtonModal"
                            onClick={() => {
                                setShowCreateApp(false);
                            }}
                        />
                        <div className="createContainer">
                            <h1>Agregar App</h1>
                            <div className="rowVersionCrearVersionApp">
                                <div className="lblCrearVersionApp">
                                    Nombre:
                                </div>
                                <input
                                    className="createInput"
                                    placeholder={'Nombre'}
                                    value={createAppNombre}
                                    type="text"
                                    onChange={(e) => {
                                        setCreateAppNombre(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="rowGuardarCrearVersionApp">
                                <button
                                    className="bntConfirmarWebAppList guardarCrearVersionApp"
                                    disabled={createAppNombre === ''}
                                    onClick={() => {
                                        //Crear la version la app y refresca la info.
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="lblTitleWebApp">
                Selecciona la pagina web que deseas probar:
            </div>
            <div className="containerAppsWeb">{renderList()}</div>
            <div className="containerAppsWeb containerAppsWebCenter">
                <div
                    className="botonCrearOtraAppWeb"
                    onClick={() => {
                        setShowCreateApp(true);
                    }}
                >
                    <img src={AddIcon} alt="" />
                </div>
            </div>
        </div>
    );
}

export default withRouter(Web);
