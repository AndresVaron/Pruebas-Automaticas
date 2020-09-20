import React, { useState } from 'react';
import Modal from '../../../Modal/Modal';
import Loading from '../../../Loading/Loading';
import FileUploader from '../../../FileUploader/FileUploader';
import axiosInstance from '../../../AxiosAPI';

const TestForm = ({ autId, setShowModal, web, reloadData }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        shortName: '',
        version: '',
        url: '',
    });

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    const defineValue = (name, value) => {
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        axiosInstance
            .post(`/tests/${autId}`, form)
            .then((data) => {
                reloadData();
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
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
                        filePath={`${web ? 'web' : 'mobile'}/tests/${autId}`}
                        uploadedFileName={new Date().getTime()}
                        acceptedFiles={'application/zip'}
                    ></FileUploader>
                </div>
                <div className="text-right mt-4">
                    {!loading && <button className="btn-confirm">Crear</button>}
                    {loading && <Loading />}
                </div>
            </form>
        </Modal>
    );
};

export default TestForm;
