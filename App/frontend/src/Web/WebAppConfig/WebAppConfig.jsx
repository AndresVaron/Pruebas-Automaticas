import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './WebAppConfig.css';
import AddIcon from '../../Media/Icons/addIcon.svg';
import closeIcon from '../../Media/Icons/close.svg';
import EditIcon from '../../Media/Icons/editWhite.svg';
import CheckIcon from '../../Media/Icons/check.svg';
import RightArrowIcon from '../../Media/Icons/right-arrow.svg';
import PruebaDisponible from './PruebaDisponible/PruebaDisponible';
import PruebaActual from './PruebaActual/PruebaActual';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EmptySlot from './EmptySlot/EmptySlot.jsx';
import axiosInstance from '../../AxiosAPI';
import TestForm from './TestForm/TestForm';
import VersionManager from './VersionManager/VersionManager';

export const ItemTypes = {
    PRUEBA: 'prueba',
};

const PRUEBAS = [
    {
        nombre: 'End to End',
        short: 'E2E',
        _id: '5f5f76b979c83c60f468d67f',
    },
    {
        nombre: 'End to End',
        short: 'E3E',
        _id: '1235',
    },
];

function WebAppConfig(props) {
    const autId = props.match.params.id_app;
    const [config, setConfig] = useState(undefined);
    const [pruebasActuales, setPruebasActuales] = useState(undefined);
    const [pruebasDisponibles, setPruebasDisponibles] = useState(undefined);
    const [nombre, setNombre] = useState(undefined);
    const [editingName, setEditingName] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [showTestForm, setShowTestForm] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);

    const showVersionManager = (testToShow) => {
        if (testToShow) {
            setCurrentTest(testToShow);
        } else {
            setCurrentTest(null);
        }
    };

    const loadTests = () => {
        setShowTestForm(false);
        setCurrentTest(null);
        setPruebasDisponibles(undefined);
        axiosInstance.get(`/tests/${autId}`).then(resp => {
            setPruebasDisponibles(resp.data);
        }).catch(err => {
            setPruebasDisponibles([]);
        });
    };

    useEffect(() => {
        if (
            props.match.params.id_config !== undefined &&
            autId !== undefined &&
            props.match.params.id_version !== undefined
        ) {
            axiosInstance
                .get(
                    '/web/' +
                    autId +
                    '/versiones/' +
                    props.match.params.id_version +
                    '/configs/' +
                    props.match.params.id_config
                )
                .then((resp) => {
                    setConfig(resp.data);
                    setNombre(resp.data.nombre);
                    setPruebasActuales(resp.data.pruebas);
                    loadTests();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    //Cuando se crea el componente
    useEffect(function () {
        //Listener del resize.
        function handleResize() {
            setWidth(window.innerWidth);
            setHeight((window.innerHeight / 10) * 7);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        //Se quitan los listeners cuando se destruye el componente.
        return function () {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderNombre = () => {
        if (!editingName) {
            return <label className="WebConfigNombreContainer">{nombre}</label>;
        } else {
            return (
                <input
                    className="createInput nombreInputWebConfig"
                    placeholder={'Configuración'}
                    value={nombre}
                    type="text"
                    onChange={(e) => {
                        setNombre(e.target.value);
                    }}
                />
            );
        }
    };

    const renderPruebas = () => {
        return pruebasDisponibles.map((prueba, index) => {
            return (
                <div key={index} className="containerPruebasDispWebConf">
                    <PruebaDisponible prueba={prueba} showVersionManager={showVersionManager} />
                </div>
            );
        });
    };

    const renderPipeline = () => {
        if (pruebasActuales.length === 0) {
            return (
                <EmptySlot
                    width={width - 200}
                    height={height}
                    position="CENTER"
                    dropped={(prueba) => {
                        setPruebasActuales([[prueba]]);
                    }}
                />
            );
        } else {
            let columnas = pruebasActuales.map((columna, index) => {
                const filas = columna.map((prueba, index2) => {
                    return (
                        <div
                            key={'pruebaActual' + prueba._id + index2}
                            className="pruebaActualWebConfigContainer"
                        >
                            <PruebaActual
                                prueba={prueba}
                                borrar={() => {
                                    const pruebas = [...pruebasActuales];
                                    pruebas[index].splice(index2, 1);
                                    if (pruebas[index].length === 0) {
                                        pruebas.splice(index, 1);
                                    }
                                    setPruebasActuales(pruebas);
                                }}
                            />
                        </div>
                    );
                });
                const currentHeight = height - columna.length * 100;
                return (
                    <div className="columnaConfigWebCreate" key={index}>
                        <EmptySlot
                            width={'140px'}
                            height={currentHeight / 2}
                            position="BOTTOM"
                            dropped={(prueba) => {
                                const pruebas = [...pruebasActuales];
                                pruebas[index].unshift(prueba);
                                setPruebasActuales(pruebas);
                                //TODO Quitar prueba de Disponibles
                            }}
                        />
                        {filas}
                        <EmptySlot
                            width={'140px'}
                            height={currentHeight / 2}
                            position="TOP"
                            dropped={(prueba) => {
                                const pruebas = [...pruebasActuales];
                                pruebas[index].push(prueba);
                                setPruebasActuales(pruebas);
                                //TODO Quitar prueba de Disponibles
                            }}
                        />
                    </div>
                );
            });
            //Se hace el join de las flechas
            columnas = [...columnas]
                .map((e, i) =>
                    i < columnas.length - 1
                        ? [
                            e,
                            <div
                                key={'columnaArrowConfigWeb' + i}
                                className="columnaArrowConfigWeb"
                            >
                                <img
                                    alt=""
                                    src={RightArrowIcon}
                                    className="arrowConfigWeb"
                                />
                            </div>,
                        ]
                        : [e]
                )
                .reduce((a, b) => a.concat(b));
            //Se agrega al inicio y al final el para poder agregar otra columna.
            let newWidth = width - 200 - pruebasActuales.length * 140;
            if (pruebasActuales.length > 0) {
                newWidth -= pruebasActuales.length - 1 * 0;
            }
            newWidth = newWidth / 2;
            columnas.unshift(
                <EmptySlot
                    width={newWidth}
                    height={height}
                    position="RIGHT"
                    dropped={(prueba) => {
                        const pruebas = [...pruebasActuales];
                        pruebas.unshift([prueba]);
                        setPruebasActuales(pruebas);
                        //TODO Quitar prueba de Disponibles
                    }}
                />
            );
            columnas.push(
                <EmptySlot
                    width={newWidth}
                    height={height}
                    position="LEFT"
                    dropped={(prueba) => {
                        const pruebas = [...pruebasActuales];
                        pruebas.push([prueba]);
                        setPruebasActuales(pruebas);
                        //TODO Quitar prueba de Disponibles
                    }}
                />
            );
            return columnas;
        }
    };

    const renderLayout = () => {
        if (width < 769) {
            return <React.Fragment></React.Fragment>;
        } else {
            return (
                <DndProvider backend={HTML5Backend}>
                    <div className="WebConfigSideColumn">
                        <div className="contLblPruebasDisponiblesWebConfi">
                            <div className="lblPruebasWebConfig">Pruebas:</div>
                        </div>
                        <div className="containerPruebasDispWebConfig">
                            {renderPruebas()}
                            <div className="containerPruebasDispWebConf">
                                <div
                                    className="botonCrearOtraPruebaWebConfig"
                                    onClick={() => setShowTestForm(true)}
                                >
                                    <img src={AddIcon} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="WebConfigPipeLineContainer">
                        <div className="WebConfigContainerTitle">
                            {renderNombre()}
                            <button
                                className="btnEditarNombreConfigWeb"
                                onClick={() => {
                                    setEditingName(!editingName);
                                }}
                                style={{
                                    backgroundColor: editingName
                                        ? '#1d2f6f'
                                        : '#989898',
                                }}
                            >
                                <img
                                    alt=""
                                    src={editingName ? CheckIcon : EditIcon}
                                    className="btnEditarNombreConfigWebImg"
                                />
                            </button>
                        </div>
                        <div className="WebConfigPipeLineCont">
                            {renderPipeline()}
                        </div>
                        <div className="WebConfigPipeLineBtns">
                            <button
                                className="bntCancelarWebAppList"
                                onClick={() => {
                                    setShowDelete(true);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bntConfirmarWebAppList btnGuardarConfWeb"
                                onClick={() => {
                                    axiosInstance
                                        .put(
                                            '/web/' +
                                            props.match.params.id_app +
                                            '/versiones/' +
                                            props.match.params.id_version +
                                            '/configs/' +
                                            props.match.params.id_config,
                                            {
                                                nombre: nombre,
                                                pruebas: pruebasActuales.map(
                                                    (prueba) =>
                                                        prueba.map(
                                                            (prueb) => prueb._id
                                                        )
                                                ),
                                            }
                                        )
                                        .then(() => { })
                                        .catch((err) => {
                                            console.error(err);
                                        });
                                }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                    {showTestForm && <TestForm autId={autId} reloadData={loadTests} setShowModal={setShowTestForm} web={true} />}
                    {currentTest && <VersionManager test={currentTest} setShowModal={showVersionManager} reloadData={loadTests} />}
                </DndProvider>
            );
        }
    };

    if (
        nombre !== undefined &&
        pruebasActuales !== undefined &&
        pruebasDisponibles !== undefined &&
        config !== undefined
    ) {
        return (
            <div className="containerWebConfig">
                {showDelete && <div className="curtain"></div>}
                {showDelete && (
                    <div className="modalCreateWebAppVersionCont">
                        <div className="modalCreateWebApp">
                            <img
                                alt=""
                                src={closeIcon}
                                className="closeButtonModal"
                                onClick={() => {
                                    setShowDelete(false);
                                }}
                            />
                            <div className="createContainer">
                                <h1>Deshacer</h1>
                                <div className="lblBorrarApp">
                                    {
                                        '¿Estás seguro que quieres deshacerte de todos los cambios?'
                                    }
                                </div>
                                <div className="rowGuardarCrearVersionApp">
                                    <button
                                        className="bntCancelarWebAppList"
                                        onClick={() => {
                                            setNombre(config.nombre);
                                            setPruebasActuales(config.pruebas);
                                            //Todo Calcular Pruebas Actuales
                                            setShowDelete(false);
                                        }}
                                    >
                                        Deshacer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {renderLayout()}
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default withRouter(WebAppConfig);
