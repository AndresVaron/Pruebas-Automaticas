import React, { useState } from 'react';
import Modal from '../../../Modal/Modal';
import Loading from '../../../Loading/Loading';
import FileUploader from '../../../FileUploader/FileUploader';
import axiosInstance from '../../../AxiosAPI';

const VersionsManager = ({ test: { _id, versions, aut }, reloadData, setShowModal, web }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ version: '', url: '' });

    const handleChange = (event) => { setForm({ ...form, [event.target.name]: event.target.value }); };
    const defineValue = (name, value) => { setForm({ ...form, [name]: value }); };
    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true);
        axiosInstance.post(`/versions/${_id}`, form).then(data => {
            reloadData();
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    };
    const getFormattedDate = (dateString) => {
        const currentDate = new Date(dateString);
        return currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString();
    };

    return (
        <Modal setShowModal={setShowModal} loading={loading}>
            <h1 className="content-title">{web ? 'Versiones actuales' : 'Número de eventos'}</h1>
            {versions.map(version =>
                <div className="row d-flex align-items-center">
                    <div className="col-5">
                        {web ? <a className="font-weight-bold" href={version.url} target="_blank">{version.version}</a> : <p className="font-weight-bold mb-0">{version.events}</p>}
                    </div>
                    <div className="col-7 text-right">
                        <p className="small mb-0 font-weight-bold"><em className="fas fa-calendar text-info"></em>&nbsp;{getFormattedDate(version.creationDate)}</p>
                    </div>
                </div>
            )}
            <hr />
            <h1 className="content-title">Crear {web ? 'versión' : ''}</h1>
            <form onSubmit={handleSubmit}>
                {web &&
                    <>
                        <div className="d-flex align-items-center mt-3">
                            <label className="mb-0 mr-3 font-weight-bold">Versión:</label>
                            <input name="version" value={form.version} disabled={loading} onChange={handleChange} className="createInput" type="text" maxLength={15} required />
                        </div>
                        <div className="mt-3">
                            <label className="mb-2 font-weight-bold">Carga el archivo de la prueba:</label>
                            <FileUploader loadingSubmit={loading || !form.version} currentFileName={''} emitValue={defineValue} formName="url" filePath={`${web ? 'web' : 'mobile'}/${aut}/tests`} uploadedFileName={new Date().getTime()} acceptedFiles={'application/zip'}></FileUploader>
                        </div>
                    </>
                }
                {!web &&
                    <div className="d-flex align-items-center mt-3">
                        <label className="mb-0 mr-3 font-weight-bold">Eventos:</label>
                        <input name="events" value={form.events} disabled={loading} onChange={handleChange} className="createInput" type="number" max="10000" required />
                    </div>
                }
                <div className="text-right mt-4">
                    {!loading && <button className="btn-confirm">Crear</button>}
                    {loading && <Loading />}
                </div>
            </form>
        </Modal>
    )
};

export default VersionsManager;