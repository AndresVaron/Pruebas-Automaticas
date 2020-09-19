const path = require('path');
const S3 = require('aws-sdk/clients/s3');
const mime = require('mime-types');
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;
const bucketName = process.env.BUCKET;
const s3 = new S3({ accessKeyId, secretAccessKey });
const options = { partSize: 10 * 1024 * 1024, queueSize: 2 };

const uploadFile = (file, fileKey) => {
    return new Promise((resolve, reject) => {
        const mimeType = mime.lookup(fileKey) || 'application/octet-stream';
        const uploadParams = { ACL: 'public-read', Bucket: bucketName, Key: fileKey, Body: file, ContentType: mimeType };
        s3.upload(uploadParams, options).on('http').on('httpUploadProgress', (event) => {
            console.log(`Uploaded ${event.loaded} of ${event.total}`);
        }).send((error, data) => {
            if (error) {
                reject({ error, message: 'Se presentó un error cargando el archivo' });
            } else {
                resolve(true);
            }
        });
    });
};

const PostUploadFile = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log(req.files);
        console.log(accessKeyId);
        console.log(secretAccessKey);
        console.log(bucketName);
        let { filePath, fileName } = JSON.parse(req.body.data);

        if (!filePath || filePath.includes('..')) {
            return res.status(400).json({ message: 'No se definió la ruta del archivo' });
        }
        const fileToUpload = req.files.file;
        if (!fileToUpload) {
            return res.status(400).json({ message: 'No se seleccionó ningún archivo' });
        }

        console.log(fileToUpload.mimetype);

        if (fileToUpload.mimetype !== 'application/zip' && fileToUpload.mimetype !== 'application/x-zip-compressed') {
            return res.status(400).json({ message: 'El formato del archivo no es válido' });
        }

        const fileToUploadName = `${filePath}/${fileName || new Date().getTime()}${path.extname(fileToUpload.name)}`;

        uploadFile(req.files.file.data, fileToUploadName).then(data => {
            console.log(data);
            res.json({ data: `https://${bucketName}.s3.amazonaws.com/${fileToUploadName}` });
        }).catch(err => {
            res.status(400).json({ message: 'No fue posible cargar el archivo' });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'No fue posible cargar el archivo' });
    }
}

module.exports = { PostUploadFile };