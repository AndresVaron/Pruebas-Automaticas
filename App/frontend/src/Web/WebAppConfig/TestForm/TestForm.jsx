import React, { useState } from 'react';
import Modal from '../../../Modal/Modal';
import Loading from '../../../Loading/Loading';
import FileUploader from '../../../FileUploader/FileUploader';
import axiosInstance from '../../../AxiosAPI';
import Select from 'react-select';

function TestForm({ autId, setShowModal, web, reloadData }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        shortName: '',
        version: '',
        url: '',
        numberOfEvents: '',
    });
    const [dispositivo, setDispositivo] = useState(null);
    const [type, setType] = useState();
    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    const defineValue = (name, value) => {
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        form.type = type;
        if (type === 'MobileMonkey') {
            form.version = form.numberOfEvents;
        }
        if (dispositivo !== null) {
            form.dispositivo = dispositivo;
        }

        axiosInstance
            .post(`/tests/${autId}`, form)
            .then(() => {
                reloadData();
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const renderVersion = () => {
        if (web || (!web && type && type !== 'MobileMonkey')) {
            return (
                <>
                    <div className="d-flex align-items-center mt-3">
                        <label className="mb-0 mr-3 font-weight-bold lblTest">
                            Versión:
                        </label>
                        <input
                            name="version"
                            value={form.version}
                            disabled={loading}
                            onChange={handleChange}
                            className="createInput"
                            type="text"
                            maxLength={15}
                            required
                        />
                    </div>

                    <div className="mt-3">
                        <label className="mb-2 font-weight-bold">
                            Carga el archivo de la prueba:
                        </label>
                        <FileUploader
                            loadingSubmit={loading || !form.shortName}
                            currentFileName={''}
                            emitValue={defineValue}
                            formName="url"
                            filePath={`${
                                web ? 'web' : 'mobile'
                            }/tests/${autId}`}
                            uploadedFileName={new Date().getTime()}
                            acceptedFiles={
                                web && type !== 'VRT'
                                    ? 'application/zip'
                                    : 'text/javascript'
                            }
                        ></FileUploader>
                    </div>
                </>
            );
        } else {
            return <div></div>;
        }
    };
    return (
        <Modal setShowModal={setShowModal} loading={loading}>
            <h1 className="content-title">Crear prueba</h1>
            <form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center">
                    <label className="mb-0 mr-3 font-weight-bold lblTest">
                        Nombre:
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        disabled={loading}
                        onChange={handleChange}
                        className="createInput"
                        type="text"
                        required
                        maxLength={50}
                    />
                </div>
                <div className="d-flex align-items-center mt-3">
                    <label className="mb-0 mr-3 font-weight-bold lblTest">
                        Alias:
                    </label>
                    <input
                        name="shortName"
                        value={form.shortName}
                        disabled={loading}
                        onChange={handleChange}
                        className="createInput"
                        type="text"
                        maxLength={4}
                        required
                    />
                </div>
                {!web && (
                    <div className="d-flex align-items-center mt-3">
                        <label className="mb-0 mr-3 font-weight-bold lblDispositivo">
                            Dispositivo:
                        </label>
                        <Select
                            name="dispositivo"
                            onChange={(inputValue) => {
                                setDispositivo(inputValue.value);
                            }}
                            options={[
                                {
                                    label: 'Samsung Galaxy S10',
                                    value: 'Samsung Galaxy S10',
                                },
                                {
                                    label: 'Samsung Galaxy S9',
                                    value: 'Samsung Galaxy S9',
                                },
                                {
                                    label: 'Samsung Galaxy S8',
                                    value: 'Samsung Galaxy S8',
                                },
                                {
                                    label: 'Samsung Galaxy S7 Edge',
                                    value: 'Samsung Galaxy S7 Edge',
                                },
                                {
                                    label: 'Samsung Galaxy S7',
                                    value: 'Samsung Galaxy S7',
                                },
                                {
                                    label: 'Samsung Galaxy S6',
                                    value: 'Samsung Galaxy S6',
                                },
                                {
                                    label: 'Nexus 4',
                                    value: 'Nexus 4',
                                },
                                {
                                    label: 'Nexus 5',
                                    value: 'Nexus 5',
                                },
                                {
                                    label: 'Nexus One',
                                    value: 'Nexus One',
                                },
                                {
                                    label: 'Nexus S',
                                    value: 'Nexus S',
                                },
                                {
                                    label: 'Nexus 7',
                                    value: 'Nexus 7',
                                },
                            ]}
                            placeholder="Seleccionar"
                            className="selectWebAppDeviceType"
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
                )}
                <div className="d-flex align-items-center mt-3">
                    <label className="mb-0 mr-3 font-weight-bold lblTest">
                        Tipo:
                    </label>
                    <Select
                        name="type"
                        onChange={(inputValue) => {
                            setType(inputValue.value);
                        }}
                        options={
                            web
                                ? [
                                      {
                                          label: 'Cypress',
                                          value: 'Cypress',
                                      },
                                      {
                                          label: 'VRT',
                                          value: 'VRT',
                                      },
                                  ]
                                : [
                                      {
                                          label: 'Random',
                                          value: 'MobileMonkey',
                                      },
                                      {
                                          label: 'Appium',
                                          value: 'Appium',
                                      },
                                      {
                                          label: 'VRT',
                                          value: 'VRT',
                                      },
                                  ]
                        }
                        placeholder="Seleccionar"
                        className="selectWebAppTestType"
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
                {renderVersion()}
                {!web && type === 'MobileMonkey' && (
                    <div className="d-flex align-items-center mt-3">
                        <label className="mb-0 mr-3 font-weight-bold lblTest">
                            Eventos:
                        </label>
                        <input
                            name="numberOfEvents"
                            value={form.numberOfEvents}
                            disabled={loading}
                            onChange={handleChange}
                            className="createInput"
                            type="number"
                            max="10000"
                            required
                        />
                    </div>
                )}
                <div className="text-right mt-4">
                    {!loading && <button className="btn-confirm">Crear</button>}
                    {loading && <Loading />}
                </div>
            </form>
        </Modal>
    );
}

export default TestForm;
