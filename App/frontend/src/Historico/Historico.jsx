import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axiosInstance from '../AxiosAPI.js';
import HistoricoCard from './HistoricoCard/HistoricoCard.jsx';

function Historico(props) {
    const [builds, setBuilds] = useState([]);
    const [version, setVersion] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (props.match.params.id_config !== undefined) {
            axiosInstance
                .get('/historico/' + props.match.params.id_config)
                .then((resp) => {
                    setVersion(resp.data.nombre);
                    setBuilds(resp.data.builds);
                })
                .catch(() => {
                    setError(true);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderList = () => {
        if (props.match.params.id_config !== undefined) {
            return builds.map((build) => (
                <div key={build.id} className="contWebAppCard">
                    <HistoricoCard
                        build={build}
                        id_config={props.match.params.id_config}
                    />
                </div>
            ));
        } else {
            return <div></div>;
        }
    };

    if (version !== undefined) {
        return (
            <div className="containerListMain">
                <div className="lblTitleWebApp">Historico de {version}</div>
                <div className="containerAppsWeb">{renderList()}</div>
            </div>
        );
    } else if (error) {
        return (
            <div className="containerListMain">
                <div className="lblTitleWebApp">
                    No se encontró esta configuracion en jenkins
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default withRouter(Historico);
