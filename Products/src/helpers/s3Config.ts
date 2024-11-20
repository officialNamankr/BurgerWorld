// import AWS from "aws-sdk";

// AWS.config.update({
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     region: "ap-south-1",
// });

// export const s3 = new AWS.S3();




// const { S3Client } = require("@aws-sdk/client-s3");
// import S3Client from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";


export const s3Client = new S3Client({
  region: "ap-south-1", // e.g., "us-east-1"
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

// Example usage
// console.log("S3 Client is ready:", s3Client);
