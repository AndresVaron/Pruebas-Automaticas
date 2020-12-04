import React from 'react';
import { withRouter } from 'react-router-dom';
import './HistoricoCard.css';

function WebAppCard(props) {
    const renderResultado = () => {
        if (props.build.result === null) {
            return <div style={{ color: '#1d2f6f' }}> En Progreso</div>;
        } else if (props.build.result === 'ABORTED') {
            return <div className="contentHistorico">ABORTED</div>;
        } else if (props.build.result === 'SUCCESS') {
            return (
                <div style={{ color: 'green' }} className="contentHistorico">
                    SUCCESS
                </div>
            );
        } else if (props.build.result === 'FAILURE') {
            return (
                <div style={{ color: 'red' }} className="contentHistorico">
                    FAILURE
                </div>
            );
        }
    };
    const renderSelect = () => {
        return (
            <React.Fragment>
                <div className="containerHistoricoEstado">
                    <div className="lblVersionListAppWeb">
                        Resultado:{renderResultado()}
                    </div>
                </div>
                <div className="containerConfirmarListAppWebCard">
                    <button
                        className="bntVerHistorico"
                        onClick={() => {
                            props.history.push(
                                `/logs/${props.id_config}/${props.build.id}`
                            );
                        }}
                    >
                        Ver Output
                    </button>
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="cardWebAppList">
            <div className="webAppTitleRow">
                <div className="lblNombreWebApp">{props.build.id}</div>
                <div className="lblFechaWebApp">
                    {new Date(props.build.timestamp).toLocaleDateString() +
                        ' a las ' +
                        new Date(props.build.timestamp).toLocaleTimeString({
                            minute: '2-digit',
                        })}
                </div>
            </div>
            <div className="containerRowSelectAppWebListHistorico">
                {renderSelect()}
            </div>
        </div>
    );
}

export default withRouter(WebAppCard);
