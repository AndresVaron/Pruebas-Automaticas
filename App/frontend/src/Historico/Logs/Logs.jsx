import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axiosInstance from '../../AxiosAPI.js';
import Loader from '../../Loader/Loader';

function Historico(props) {
    const [log, setLog] = useState('');
    const [version, setVersion] = useState();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const refresh = () => {
        if (
            props.match.params.id_config !== undefined &&
            props.match.params.num_build !== undefined
        ) {
            axiosInstance
                .get(
                    '/historico/logs/' +
                        props.match.params.id_config +
                        '/' +
                        props.match.params.num_build +
                        '?timestamp=' +
                        new Date().getTime()
                )
                .then((resp) => {
                    setVersion({
                        nombre: resp.data.config.nombre,
                        num: resp.data.build.id,
                    });
                    setLog(resp.data.logs);
                    if (resp.data.build.result === null) {
                        setLoading(true);
                        setTimeout(refresh(), 2000);
                    } else {
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setError(true);
                });
        }
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (version !== undefined) {
        return (
            <div className="containerListMain">
                <div className="lblTitleWebApp">
                    Logs de {version.nombre} #{version.num}
                </div>
                <p className="parrLogs">
                    {log}
                    {loading && (
                        <div className="containerLoaderLogs">
                            <Loader />
                        </div>
                    )}
                </p>
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
