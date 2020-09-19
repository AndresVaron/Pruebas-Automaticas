import React, { useState } from 'react';
import Modal from '../../../Modal/Modal';
import Loading from '../../../Loading/Loading';

const TestForm = ({ autId, setShowModal }) => {

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', shortName: '', version: '', url: '' });

    const handleChange = (event) => { setForm({ ...form, [event.target.name]: event.target.value }); };

    const handleSubmit = event => { event.preventDefault(); setLoading(true); console.log(form) };

    return (
        <Modal setShowModal={setShowModal} loading={loading}>
            <h1>Crear prueba</h1>
            <form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center">
                    <label className="mb-0 mr-3 font-weight-bold">Nombre:</label>
                    <input name="name" value={form.name} disabled={loading} onChange={handleChange} className="createInput" type="text" required maxLength={50} />
                </div>
                <div className="d-flex align-items-center mt-3">
                    <label className="mb-0 mr-3 font-weight-bold">Alias:</label>
                    <input name="shortName" value={form.shortName} disabled={loading} onChange={handleChange} className="createInput" type="text" maxLength={4} required />
                </div>
                <div className="d-flex align-items-center mt-3">
                    <label className="mb-0 mr-3 font-weight-bold">Versión:</label>
                    <input name="version" value={form.version} disabled={loading} onChange={handleChange} className="createInput" type="text" maxLength={15} required />
                </div>
                <div className="text-right mt-2">
                    {!loading && <button className="btn-confirm">Confirmar</button>}
                    {loading && <Loading />}
                </div>
            </form>
        </Modal>
    )
};

export default TestForm;