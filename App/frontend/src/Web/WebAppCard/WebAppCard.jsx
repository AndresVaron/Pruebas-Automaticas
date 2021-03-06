import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './WebAppCard.css';
import Select from 'react-select';
import AddIcon from '../../Media/Icons/addIcon.svg';

function WebAppCard(props) {
    const [currentVersion, setCurrentVersion] = useState(
        props.app.versiones.length > 0
            ? {
                  label: props.app.versiones[0].version,
                  value: props.app.versiones[0],
              }
            : null
    );

    const renderSelect = () => {
        return (
            <React.Fragment>
                <div className="seleccionarVersionListAppWeb">
                    <div className="lblVersionListAppWeb">Version:</div>
                    <div className="containerSelectorAppWeb">
                        <Select
                            onChange={(inputValue) => {
                                setCurrentVersion(inputValue);
                            }}
                            defaultValue={
                                props.app.versiones.length > 0
                                    ? {
                                          label: props.app.versiones[0].version,
                                          value: props.app.versiones[0].url,
                                      }
                                    : null
                            }
                            options={props.app.versiones.map((version) => {
                                return {
                                    label: version.version,
                                    value: version,
                                };
                            })}
                            placeholder="Seleccionar"
                            className="selectWebAppVersion"
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: 'rgba(29, 47, 111, 0.25)',
                                    primary: '#989898',
                                },
                            })}
                        />
                    </div>
                    {currentVersion && (
                        <>
                            {props.mobile && (
                                <a
                                    href={currentVersion.value.url}
                                    // eslint-disable-next-line react/jsx-no-target-blank
                                    target="_blank"
                                    className="btn btn-info ml-2 btn-sm shadow-none"
                                >
                                    <em className="fas fa-download" />
                                </a>
                            )}
                            {!props.mobile && (
                                <>
                                    <div className="lblVersionListAppWeb">
                                        Url:
                                    </div>
                                    <div
                                        className="lblUrlListAppWeb"
                                        onClick={() => {
                                            const win = window.open(
                                                currentVersion.value.url,
                                                '_blank'
                                            );
                                            win.focus();
                                        }}
                                    >
                                        {currentVersion.value.url}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div className="crearVersionBtnListAppCont">
                        <button
                            className="createButtonVersionListWebApp"
                            onClick={() => {
                                props.setShowCreateVersion(props.app);
                            }}
                        >
                            <img src={AddIcon} alt="" />
                        </button>
                    </div>
                </div>
                <div className="containerConfirmarListAppWebCard">
                    <button
                        className="bntCancelarWebAppList"
                        onClick={() => {
                            props.setShowDeleteApp(props.app);
                        }}
                    >
                        Borrar
                    </button>
                    {props.app.versiones.length > 1 && (
                        <button
                            className="btnCompararWebAppList"
                            onClick={() => {
                                props.history.push(
                                    `/vrt/${props.mobile ? 'mobile' : 'web'}/${
                                        props.app._id
                                    }`
                                );
                            }}
                        >
                            Comparar (VRT)
                        </button>
                    )}
                    <button
                        disabled={!currentVersion}
                        className="bntConfirmarWebAppList"
                        onClick={() => {
                            if (currentVersion) {
                                props.history.push(
                                    `/${props.mobile ? 'mobile' : 'web'}/${
                                        props.app._id
                                    }/versions/${currentVersion.value._id}`
                                );
                            }
                        }}
                    >
                        Seleccionar
                    </button>
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="cardWebAppList">
            <div className="webAppTitleRow">
                <div className="lblNombreWebApp">
                    {props.app.nombre}
                    {props.app.package && <span> ({props.app.package})</span>}
                </div>
                <div className="lblFechaWebApp">
                    Creada: {props.app.fechaCreacion.substring(0, 10)}
                </div>
            </div>
            <div className="containerRowSelectAppWebList">{renderSelect()}</div>
        </div>
    );
}

export default withRouter(WebAppCard);
