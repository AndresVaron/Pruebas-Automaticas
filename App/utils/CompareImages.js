const compareImages = require("resemblejs/compareImages");
const { uploadFile } = require('../logic/FilesUploadLogic');
// const fs = require("mz/fs");

const compare = async (aut, start, firstArray, secondArray, folder) => {
    const options = {
        output: {
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true,
            ignoredBox: { left: 0, top: 0, bottom: 46 }
        },
        scaleToSameSize: true,
        ignore: 'less'
    };

    const results = [];
    const id = new Date().getTime();
    firstArray.sort();
    secondArray.sort();
    for (let index = 0; index < (firstArray.length < secondArray.length ? firstArray.length : secondArray.length); index++) {
        try {
            const first = firstArray[index];
            const imageName = first.substring(first.lastIndexOf('/') + 1);
            const second = secondArray.find(image => image.includes(imageName));
            if (second) {
                const data = await compareImages(first, second);
                console.log(`Image processed with difference of: ${data.misMatchPercentage}`);
                const imageUrl = await uploadFile(data.getBuffer(), `/${start}vrt/${aut}/${id}/${imageName}`);
                const result = { reportDate: new Date(), report: data, first, second, result: imageUrl };
                results.push(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return results;
};

module.exports = compare;