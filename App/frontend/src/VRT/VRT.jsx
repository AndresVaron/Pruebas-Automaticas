import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import axiosInstance from '../AxiosAPI';

const VRT = ({ match, history, location }) => {
    const aut = match.params.aut;
    const web = location.pathname.includes('web');
    const [loading, setLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const [currentApp, setCurrentApp] = useState(null);
    const [testResults, setTestsResults] = useState([]);
    const [vrtComparations, setVrtComparations] = useState([]);
    const [comparation, setComparation] = useState({
        test: 0,
        testVersion: 0,
        firstVersion: 0,
        secondVersion: -1,
    });
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const loadData = async () => {
        try {
            const currentApp = await axiosInstance.get(
                `/web?mobile=${!web}&id=${aut}`
            );
            setCurrentApp(currentApp.data[0]);
            const currentTests = await axiosInstance.get(
                `/tests/${aut}?type=VRT`
            );
            setTests(currentTests.data);
            const currentTestResults = await axiosInstance.get(
                `/testResults/${aut}?type=VRT`
            );
            setTestsResults(currentTestResults.data);
            loadVrtResults();
        } catch (error) {
            alert('No es posible realizar VRT sin pruebas cargadas');
            history.push(web ? '/web' : '/mobile');
        }
    };
    const loadVrtResults = () => {
        setLoading(true);
        axiosInstance
            .get('/vrtResults/' + aut)
            .then((data) => {
                setVrtComparations(data.data);
                setLoading(false);
                setLoadingSubmit(false);
            })
            .catch((err) => {
                alert('No es posible realizar VRT sin pruebas cargadas');
                history.push(web ? '/web' : '/mobile');
            });
    };
    const createComparation = () => {
        const testVersion =
            tests[comparation.test]?.versions[comparation.testVersion];
        const firstVersion = testResults.find(
            (test) =>
                test.appVersion ===
                    currentApp.versiones[comparation.firstVersion]._id &&
                test.testVersion === testVersion?._id
        );
        const secondVersion = testResults.find(
            (test) =>
                test.appVersion ===
                    currentApp.versiones[comparation.secondVersion]._id &&
                test.testVersion === testVersion?._id
        );

        if (!firstVersion) {
            alert(
                'Aún no has ejecutado la versión de la prueba que seleccionaste sobre la versión 1 de la aplicación'
            );
            return;
        } else if (!secondVersion) {
            alert(
                'Aún no has ejecutado la versión de la prueba que seleccionaste sobre la versión 2 de la aplicación'
            );
            return;
        } else {
            setLoadingSubmit(true);
            axiosInstance
                .post('/vrtResults/' + aut, {
                    test: tests[comparation.test]._id,
                    testVersion: testVersion._id,
                    firstAppVersion: firstVersion._id,
                    firstAppImages: firstVersion.images,
                    secondAppVersion: secondVersion._id,
                    secondAppImages: secondVersion.images,
                })
                .then((data) => {
                    alert(
                        'La comparación esta siendo procesada. Esto puede tardar hasta 5 minutos'
                    );
                    setTimeout(() => {
                        loadVrtResults();
                    }, 60000);
                })
                .catch((err) => {
                    console.log(err);
                    setLoadingSubmit(false);
                });
        }
    };

    const handleChange = (event) => {
        setComparation({
            ...comparation,
            [event.target.name]: Number(event.target.value),
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <main className="row pt-5 pb-5 no-gutters">
            {currentApp && (
                <div className="col-12 mb-4 text-center">
                    <h3>{currentApp.nombre}</h3>
                </div>
            )}
            {loading && (
                <div className="col-12 mb-5">
                    <h4 className="text-center mb-0">Cargando...</h4>
                </div>
            )}
            {!loading && (
                <>
                    <div className="col-12 text-center mb-3">
                        <h5 className="mb-1">
                            Selecciona la prueba, las versión de las prueba y
                            las versiones de la aplicación que quieres comparar
                        </h5>
                        <small>
                            * Recuerda que antes de poder comparar dos versiones
                            de la aplicación debes haber ejecutado la versión de
                            la prueba que usarás para su comparación
                        </small>
                    </div>
                    <div className="col-6 mb-3 text-center">
                        <label className="font-weight-bold">Prueba</label>
                        <select
                            disabled={loadingSubmit}
                            name="test"
                            className="form-control w-75 mx-auto"
                            onChange={handleChange}
                            value={comparation.test}
                        >
                            <option value={-1}></option>
                            {tests.map((test, index) => (
                                <option value={index}>{test.shortName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-6 mb-3 text-center">
                        <label className="font-weight-bold">
                            Versión de la prueba
                        </label>
                        <select
                            disabled={loadingSubmit}
                            className="form-control w-75 mx-auto"
                            name="testVersion"
                            onChange={handleChange}
                            value={comparation.testVersion}
                        >
                            <option value={-1}></option>
                            {tests[comparation.test]?.versions.map(
                                (version, index) => (
                                    <option value={index}>
                                        {version.version}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                    <div className="col-6 mb-3 text-center">
                        <label className="font-weight-bold">
                            Versión 1 de la aplicación
                        </label>
                        <select
                            disabled={loadingSubmit}
                            className="form-control w-75 mx-auto"
                            name="firstVersion"
                            onChange={handleChange}
                            value={comparation.firstVersion}
                        >
                            <option value={-1}></option>
                            {currentApp.versiones.map((version, index) => (
                                <option value={index}>{version.version}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-6 mb-3 text-center">
                        <label className="font-weight-bold">
                            Versión 2 de la aplicación
                        </label>
                        <select
                            disabled={loadingSubmit}
                            className="form-control w-75 mx-auto"
                            name="secondVersion"
                            onChange={handleChange}
                            value={comparation.secondVersion}
                        >
                            <option value={-1}></option>
                            {currentApp.versiones.map((version, index) => (
                                <option value={index}>{version.version}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-8 col-md-9 col-12 mx-auto text-center mb-5 mt-5">
                        <button
                            onClick={() => createComparation()}
                            disabled={
                                loadingSubmit ||
                                comparation.firstVersion === -1 ||
                                comparation.secondVersion === -1 ||
                                comparation.test === -1 ||
                                comparation.testVersion === -1 ||
                                comparation.firstVersion ===
                                    comparation.secondVersion
                            }
                            className="btn btn-primary shadow p-2"
                        >
                            Generar comparación de VRT
                        </button>
                    </div>
                    {vrtComparations.length === 0 && (
                        <div className="col-12 text-center">
                            <h4 className="mb-0">
                                No se han generado comparaciones
                            </h4>
                        </div>
                    )}
                    {vrtComparations.length > 0 && (
                        <div className="col-12 row d-flex align-items-center no-gutters">
                            {vrtComparations.map(
                                ({ comparationResults, creationDate }) => (
                                    <div className="col-12">
                                        <details>
                                            <summary className="text-center">
                                                Reporte creado a las{' '}
                                                {new Date(
                                                    creationDate
                                                ).toLocaleString()}
                                            </summary>
                                            {comparationResults.map(
                                                (result) => (
                                                    <React.Fragment
                                                        key={result.reportDate}
                                                    >
                                                        <div className="row mt-3">
                                                            <div className="col">
                                                                <br />
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <h6 className="mb-0 font-weight-bold">
                                                                    Imagen Base
                                                                </h6>
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <h6 className="mb-0 font-weight-bold">
                                                                    Imagen
                                                                    Modificada
                                                                </h6>
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <h6 className="mb-0 font-weight-bold">
                                                                    Diferencias
                                                                </h6>
                                                            </div>
                                                            <div className="col">
                                                                <br />
                                                            </div>
                                                            <div className="col-12"></div>
                                                            <div className="col">
                                                                <br />
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <img
                                                                    alt="Base"
                                                                    src={`${result.first}`}
                                                                    className="w-100 shadow"
                                                                />
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <img
                                                                    alt="Modified"
                                                                    src={`${result.second}`}
                                                                    className="w-100 shadow"
                                                                />
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <img
                                                                    alt="Result"
                                                                    src={`${result.result}`}
                                                                    className="w-100 shadow"
                                                                />
                                                            </div>
                                                            <div className="col">
                                                                <h5>
                                                                    Información
                                                                    Importante
                                                                </h5>
                                                                <p className="mb-0">
                                                                    <strong>
                                                                        Diferencia:
                                                                    </strong>
                                                                    &nbsp;
                                                                    {
                                                                        result
                                                                            .report
                                                                            .misMatchPercentage
                                                                    }{' '}
                                                                    %
                                                                </p>
                                                                <p className="mb-0">
                                                                    <strong>
                                                                        Tiempo:
                                                                    </strong>
                                                                    &nbsp;
                                                                    {
                                                                        result
                                                                            .report
                                                                            .analysisTime
                                                                    }{' '}
                                                                    ms
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                )
                                            )}
                                        </details>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default withRouter(VRT);
