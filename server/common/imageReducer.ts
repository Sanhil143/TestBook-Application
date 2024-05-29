import path from 'path';
import fs from 'fs';
import sharp from 'sharp';


async function compressImages(file:any, folderPath:any, subFolder:any) {
  const targetSizeInBytes = 100 * 1024; 

  return new Promise((resolve, reject) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const outputPath = path.join(folderPath, `${Date.now()}-${file.originalname}`);
    const url = path.join(subFolder, `${Date.now()}-${file.originalname}`);

    if (ext === '.pdf') {
      const pdfInputPath = file.path;
      fs.copyFile(pdfInputPath,outputPath,(err) => {
        if(err){
          reject(err)
        }else{
          resolve(url)
        }
      })
    } else {
      
      const sharpInstance = sharp(file.path);

      // Resize the image to the desired dimensions
      sharpInstance.resize(480, 640);

      // Convert to JPEG if it's not already JPEG or JPG
      if (ext !== '.jpg' && ext !== '.jpeg') {
        sharpInstance.jpeg();
      }
      sharpInstance
        .toBuffer()
        .then((compressedBuffer) => {
          if (compressedBuffer.length <= targetSizeInBytes) {
            fs.writeFile(outputPath, compressedBuffer, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(url);
              }
            });
          } else {
            let quality = 100;
            const reduceQuality = () => {
              quality -= 5;
              sharp(file.path)
                .resize(640, 480)
                .jpeg({ quality })
                .toBuffer()
                .then((buffer) => {
                  if (buffer.length <= targetSizeInBytes || quality <= 5) {
                    fs.writeFile(outputPath, buffer, (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(url);
                      }
                    });
                  } else {
                    reduceQuality();
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            };

            reduceQuality();
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

export { compressImages };
