import AWS, { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const s3 = new AWS.S3();

const downloadFileFromS3 = async (bucketName, fileKey) => {
    const params = {
        Bucket: bucketName,
        Key: fileKey,
    };

    try {
        const data = await s3.getObject(params).promise();
        // שמירת הקובץ במחשב
        fs.writeFileSync(path.join(__dirname, fileKey), data.Body);
        console.log(`File downloaded successfully: ${fileKey}`);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

const downloadFolderFromS3 = async (bucketName: string, folderKey: string) => {
    const params = {
        Bucket: bucketName,
        Prefix: folderKey,
    };

    try {
        const data = await new Promise((resolve, reject) => {
            s3.listObjectsV2(params, (err, data: S3.ListObjectsV2Output) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        const zip = new JSZip();
        if(data){
        for (const item of data.Contents) {
            const fileData = await s3.getObject({ Bucket: bucketName, Key: item.Key }).promise();
            zip.file(item.Key.replace(folderKey, ''), fileData.Body);
        }
    }

        const content = await zip.generateAsync({ type: 'nodebuffer' });
        fs.writeFileSync(path.join(__dirname, `${folderKey}.zip`), content);
        console.log(`Folder downloaded and zipped successfully: ${folderKey}`);
    } catch (error) {
        console.error('Error downloading folder:', error);
    }
};

export { downloadFileFromS3, downloadFolderFromS3 };