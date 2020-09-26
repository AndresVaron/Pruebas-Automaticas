import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axiosInstance from '../AxiosAPI.js';
import './Web.css';
import WebAppCard from './WebAppCard/WebAppCard.jsx';
import closeIcon from '../Media/Icons/close.svg';
import AddIcon from '../Media/Icons/addIcon.svg';
import FileUploader from '../FileUploader/FileUploader.jsx';

function Web({ location }) {
    const mobile = location.pathname.includes('mobile');
    const [apps, setApps] = useState([]);
    const [showCreateVersion, setShowCreateVersion] = useState(undefined);
    const [showDeleteApp, setShowDeleteApp] = useState(undefined);
    const [showCreateApp, setShowCreateApp] = useState(false);
    const [createVersionVersion, setCreateVersionVersion] = useState('');
    const [createVersionUrl, setCreateVersionUrl] = useState('');
    const [createAppNombre, setCreateAppNombre] = useState('');

    useEffect(() => {
        axiosInstance.get(`/web?mobile=${mobile ? 'true' : 'false'}`)
            .then((resp) => {
                setApps(resp.data);
            })
            .catch((err) => {
                console.error(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateApp = () => {
        if (createAppNombre !== '') {
            axiosInstance
                .post(`/web?mobile=${mobile ? 'true' : 'false'}`, {
                    nombre: createAppNombre,
                })
                .then(() => {
                    setCreateAppNombre('');
                    setShowCreateApp(false);
                    axiosInstance
                        .get(`/web?mobile=${mobile ? 'true' : 'false'}`)
                        .then((resp) => {
                            setApps(resp.data);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    const handleCreateAppVersion = () => {
        if (createVersionUrl !== '' && createVersionVersion !== '') {
            axiosInstance
                .post('/web/' + showCreateVersion._id + '/versiones', {
                    version: createVersionVersion,
                    url: createVersionUrl,
                })
                .then(() => {
                    setCreateVersionUrl('');
                    setCreateVersionVersion('');
                    axiosInstance
                        .get(`/web?mobile=${mobile ? 'true' : 'false'}`)
                        .then((resp) => {
                            setApps(resp.data);
                            setShowCreateVersion(undefined);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const handleDeleteApp = () => {
        axiosInstance
            .delete('/web/' + showDeleteApp._id)
            .then(() => {
                setShowDeleteApp(undefined);
                axiosInstance
                    .get(`/web?mobile=${mobile ? 'true' : 'false'}`)
                    .then((resp) => {
                        setApps(resp.data);
                        setShowCreateVersion(undefined);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const renderList = () => {
        return apps.map((app) => (
            <div key={app._id} className="contWebAppCard">
                <WebAppCard
                    app={app}
                    setShowCreateVersion={setShowCreateVersion}
                    setShowDeleteApp={setShowDeleteApp}
                    mobile={mobile}
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
            return 'X.X.X';
        }
    };

    return (
        <div className="containerListMain">
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
                            {mobile &&
                                <div className="mt-3">
                                    <label className="mb-2 font-weight-bold">Carga el .apk</label>
                                    <FileUploader currentFileName={''} emitValue={(name, value) => setCreateVersionUrl(value)} formName="url" filePath={`${mobile ? 'mobile' : 'web'}/tests/${showCreateVersion?._id}`} uploadedFileName={new Date().getTime()} acceptedFiles={'application/vnd.android.package-archive'}></FileUploader>
                                </div>
                            }
                            {!mobile &&
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
                            }
                            <div className="rowGuardarCrearVersionApp">
                                <button
                                    className="bntConfirmarWebAppList guardarCrearVersionApp"
                                    disabled={
                                        createVersionUrl === '' ||
                                        createVersionVersion === ''
                                    }
                                    onClick={() => {
                                        //Crear la version de la app y refresca la info.
                                        handleCreateAppVersion();
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
                                        handleDeleteApp();
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
                                        handleCreateApp();
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
                Selecciona la aplicación {mobile ? 'móvil' : 'web'} que deseas probar:
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
