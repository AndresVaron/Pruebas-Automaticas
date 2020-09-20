import React from 'react';
import { withRouter } from 'react-router-dom';
import mobileIcon from '../Media/Icons/mobile.svg';
import webIcon from '../Media/Icons/web.svg';
import './Inicio.css';

function Inicio(props) {
    return (
        <div>
            <div className="containerInicioBotones">
                <div className="lblTituloInicio">Tipo de AUT</div>
                <div className="contBotonesIniciales">
                    <div
                        className="btnProbarMovilInicio btnInicio"
                        onClick={() => {
                            props.history.push('/mobile');
                        }}
                    >
                        <div className="contenedorBtnInicio">
                            <img
                                alt=""
                                className="movilInicioIcon"
                                src={mobileIcon}
                            />
                            <div className="lblBtnInicio">Móvil</div>
                        </div>
                    </div>
                    <div
                        className="btnProbarWebInicio btnInicio "
                        onClick={() => {
                            props.history.push('/web');
                        }}
                    >
                        <div className="contenedorBtnInicio">
                            <img
                                alt=""
                                className="webInicioIcon"
                                src={webIcon}
                            />
                            <div className="lblBtnInicio">Web</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="containerBtnHistorico">
                <div
                    className="btnHistorico"
                    onClick={() => {
                        props.history.push('/historico');
                    }}
                >
                    Ver Historico
                </div>
            </div> */}
        </div>
    );
}

export default withRouter(Inicio);
