import React from 'react';
import { withRouter } from 'react-router-dom';
import './WebAppConfigCard.css';
import RightArrowIcon from '../../../Media/Icons/right-arrow.svg';

function WebAppCard(props) {
    const renderPipeLinePrev = () => {
        return (
            <div className="containerPipeLineConfPrev">
                {props.config.pruebas.map((prueba, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div
                                className="colPruebaPrev"
                                style={{
                                    marginLeft: index === 0 ? 'auto' : 0,
                                    marginRight:
                                        index ===
                                            props.config.pruebas.length - 1
                                            ? 'auto'
                                            : 0,
                                }}
                            >
                                {prueba.map((prueba) => {
                                    return (
                                        <div
                                            key={prueba._id}
                                            className="elemPruebaPrev"
                                        >
                                            {prueba.shortName}
                                        </div>
                                    );
                                })}
                            </div>
                            {index < props.config.pruebas.length - 1 && (
                                <img
                                    alt=""
                                    src={RightArrowIcon}
                                    className="arrowColPruebaPrev"
                                    onClick={() => { }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="cardWebAppList">
            <div className="webAppTitleRow">
                <div className="lblNombreWebApp">{props.config.nombre}</div>
                <div className="lblFechaWebApp">
                    Creada: {props.config.fechaCreacion}
                </div>
            </div>
            <div className="webAppInfoRow">
                <div className="webAppInfoLbl">
                    Ejecuciones: {props.config.numEjecuciones}
                </div>
                <div className="webAppInfoLbl">
                    Pruebas: {props.config.numPruebas}
                </div>
            </div>
            <div className="containerRowSelectAppWebConfigList">
                {renderPipeLinePrev()}
                <div className="containerConfirmarListAppWebCard">
                    <button
                        className="bntCancelarWebAppList"
                        onClick={() => {
                            props.setShowDeleteConf(props.config);
                        }}
                    >
                        Borrar
                    </button>
                    <button
                        className="bntModificarWebAppList"
                        onClick={() => { props.history.push(`/web/${props.app._id}/versions/${props.app.version._id}/configs/${props.config._id}`) }}
                    >
                        Modificar
                    </button>
                    <button
                        className="bntConfirmarWebAppList"
                        onClick={() => { }}
                    >
                        Ejecutar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default withRouter(WebAppCard);
