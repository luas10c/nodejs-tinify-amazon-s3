import tinify from 'tinify';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
dotenv.config();

tinify.key = process.env.TINIFY_KEY as string;

(async () => {
  try {
    console.log('Iniciando upload...');
    const file = fs.readFileSync(path.resolve(__dirname, 'uploads', 'default.jpg'));
    const source = tinify.fromBuffer(file);
    const resized = source.resize({
      method: 'fit',
      width: 512,
      height: 512
    });

    const upload = resized.store({
      service: 's3',
      aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
      aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      headers: {
        'Cache-Control': 'public, max-age=31536000'
      },
      path: `55a2fad3-0174-4250-943f-605d325f5247/${crypto.randomUUID()}.jpg`
    });

    const location = await upload.location();
    console.log(location);
  } catch (error) {
    console.log(error);
  } finally {
    console.log('Upload finalizado!');
  }
})()