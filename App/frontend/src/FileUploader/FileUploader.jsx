import React, { useState } from 'react';
import { uploadFile } from '../services/uploadFile';

const FileUploader = ({ filePath, acceptedFiles, currentFileName, uploadedFileName, formName, emitValue, loadingSubmit }) => {
    const [file, setFile] = useState();

    const [fileName, setFileName] = useState(currentFileName || '');

    const [loading, setLoading] = useState(false);

    const handleInput = event => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setFileName(file.name);
            setLoading(true);
            uploadCurrentFile(file);
        } else {
            setFile();
            setFileName('');
            setLoading(false);
        }
    };

    const uploadCurrentFile = (fileToUpload) => {
        uploadFile(filePath || 'uploads', uploadedFileName, fileToUpload).then(data => {
            console.log(data);
            setLoading(false);
            emitValue(formName, data);
        }).catch(err => {
            window.alert(err);
            setFile();
            setFileName('');
            setLoading(false);
        });
    };

    const removeFile = () => {
        setFile();
        setFileName('');
        emitValue(formName, '');
    };

    return (
        <>
            {!fileName &&
                <>
                    <div className="custom-file pointer">
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept={acceptedFiles || '*'}
                            className="custom-file-input pointer"
                            onChange={handleInput}
                            disabled={loading || loadingSubmit} />
                        <label className="custom-file-label" htmlFor="file" data-browse="Seleccionar">Selecciona un archivo</label>
                    </div>
                    <p className="small mb-0">* El archivo será subido de forma automática</p>
                </>
            }
            {fileName &&
                <div className="input-group">
                    <input disabled={loading || loadingSubmit} type="text" className="form-control" value={fileName} />
                    <div className="input-group-append">
                        {!loading && !loadingSubmit && <span className="input-group-text bg-danger text-white border-danger pointer" onClick={removeFile}><i className="fas fa-trash"></i></span>}
                        {loading && !loadingSubmit && <span className="input-group-text bg-info text-white border-info"><i className="fas fa-spin fa-spinner"></i></span>}
                    </div>
                </div>
            }
        </>
    );
};

export default FileUploader;