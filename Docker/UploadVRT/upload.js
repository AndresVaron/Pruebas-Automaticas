const { mkdirSync, readdirSync, readFileSync } = require("fs");
const mime = require("mime-types");
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config();
const axios = require("axios");

const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;
const bucketName = process.env.BUCKET;
const s3 = new S3({ accessKeyId, secretAccessKey });
const options = { partSize: 10 * 1024 * 1024, queueSize: 2 };

const mobile = process.env.MOBILE === "true";
const id_app = process.env.ID_APP;
const id_app_version = process.env.ID_APP_VERSION;
const id_test = process.env.ID_TEST;
const id_version = process.env.ID_VERSION;
const url = process.env.SERVER_URL;

const uploadFile = (file, fileKey) => {
  return new Promise((resolve, reject) => {
    const mimeType = mime.lookup(fileKey) || "application/octet-stream";
    const uploadParams = {
      ACL: "public-read",
      Bucket: bucketName,
      Key: fileKey,
      Body: file,
      ContentType: mimeType,
    };
    s3.upload(uploadParams, options)
      .on("http")
      .on("httpUploadProgress", (event) => {
        console.log(`Uploaded ${event.loaded} of ${event.total}`);
      })
      .send((error, data) => {
        if (error) {
          reject({
            error,
            message: "Se presentó un error cargando el archivo",
          });
        } else {
          console.log("Loaded");
          resolve(`https://${bucketName}.s3.amazonaws.com/${fileKey}`);
        }
      });
  });
};
const flattenPath = (inicial, currentPath, results) => {
  const content = readdirSync(inicial + currentPath.join("/"), {
    withFileTypes: true,
  });
  for (file of content) {
    if (file.isDirectory()) {
      let arr = [...currentPath];
      arr.push(file.name);
      flattenPath(inicial, arr, results);
    } else {
      const newPath = [...currentPath];
      newPath.push(file.name);
      const element = {
        path: inicial + newPath.join("/"),
        flattened: newPath.join("-").replace(/\s/g, ""),
      };
      results.push(element);
    }
  }
};
upload = async () => {
  const results = [];
  flattenPath("./screenshots/", [], results);

  const fileToUploadName = `${
    mobile ? "mobile" : "web"
  }/${id_app}/${id_app_version}/${id_test}/${id_version}/`;
  const uploaded = [];

  for (fileInfo of results) {
    try {
      const file = readFileSync(fileInfo.path);
      const uploadedUrl = await uploadFile(
        file,
        fileToUploadName + fileInfo.flattened
      );
      uploaded.push(uploadedUrl);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(uploaded);
  try {
    axios.post(url + "/api/vrtdone", {
      id_app: id_app,
      id_app_version: id_app_version,
      id_test: id_test,
      id_version: id_version,
      mobile: mobile,
      images: uploaded,
      numberOfImages: uploaded.length,
    });
  } catch (error) {
    console.log(error);
  }
};
upload();
