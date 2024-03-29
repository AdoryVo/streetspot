import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import * as fs from 'fs'

const AWS_BUCKET = process.env.AWS_BUCKET

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

/** Uploads a file to the cloud AWS S3 bucket. */
async function uploadFile(file: { filepath: string, newFilename: string }) {
  const fileStream = fs.createReadStream(file.filepath)
  const params = {
    Bucket: AWS_BUCKET,
    Key: file.newFilename,
    Body: fileStream,
  }
  await s3Client.send(new PutObjectCommand(params))

  // Delete the temporarily created file after uploading
  fs.unlink(file.filepath, (err) => {
    if (err) console.error(err)
  })
}

export { s3Client, uploadFile }
