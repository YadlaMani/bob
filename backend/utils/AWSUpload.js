import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv/config";


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const uploadToS3 = async (file) => {
  console.log('File Buffer:', file.buffer);
  console.log('File Size:', file.buffer ? file.buffer.length : 'No file buffer');


  const fileName = generateFileName();

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };


  const uploadResponse = await s3Client.send(new PutObjectCommand(uploadParams));
  return `${process.env.AWS_BUCKET_URL}/${fileName}`;
};

export default uploadToS3;
