import dotenv from "dotenv";
import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);
dotenv.config();
const region = "us-east-1";
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});
export const generateUploadURL = async (folder, fileName, del) => {
  // export async function generateUploadURL() {
  try {
    if (del) {
      let params1 = { Bucket: `${bucketName}`, Key: `${folder}/${del}` };
      console.log(del);
      await s3.deleteObject(params1, function (err, data) {
        if (err) console.log(err, err.stack); // error
        else console.log(); // deleted
      });
    }
    const rawBytes = await randomBytes(16);
    let name = `${rawBytes.toString("hex")}-${fileName}`;
    const params = {
      Bucket: `${bucketName}/${folder}`,
      Key: name,
      Expires: 60,
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
  } catch (error) {
    consle.log(error);
    return error;
  }
};
export const deleteUploadedURL = async (folder, fileName) => {
  // export async function generateUploadURL() {
  try {
    let params1 = { Bucket: `${bucketName}`, Key: `${folder}/${fileName}` };
    await s3.deleteObject(params1, function (err, data) {
      if (err) return err; // error
      else return data; // deleted
    });
  } catch (error) {
    return error;
  }
};
