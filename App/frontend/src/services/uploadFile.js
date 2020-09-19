import axios from 'axios';

const uploadFile = (filePath, fileName, file) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify({ filePath, fileName }));
        const headers = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post('/upload', formData, headers).then(response => {
            resolve(response.data.data);
        }).catch(err => {
            console.log(err);
            if (!err.response) {
                return reject("Se presentó un error realizando la petición");
            }
            console.log(err.response);
            const { status, data: { message } } = err.response;
            if (status === 400 || status === 404) {
                if (message) {
                    return reject(message);
                }
            }
            return reject("Se presentó un error realizando la petición");
        });
    });
};

export { uploadFile };