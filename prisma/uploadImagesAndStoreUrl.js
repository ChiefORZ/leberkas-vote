// // load dotenv
// require('dotenv').config();

// const AWS = require('aws-sdk');
// const fs = require('fs');
// const path = require('path');

// // S3_UPLOAD_KEY=AKIAUMMCHXQ3VHK2EDKW
// // S3_UPLOAD_SECRET=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
// // S3_UPLOAD_BUCKET=basil-images-dev
// // S3_UPLOAD_REGION=eu-west-1

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_UPLOAD_KEY,
//   secretAccessKey: process.env.S3_UPLOAD_SECRET,
//   region: process.env.S3_UPLOAD_REGION,
// });

// const itemData = [
//   {
//     id: 1,
//     name: 'Frittatensuppe',
//   },
//   {
//     id: 2,
//     name: 'Griesnockerlsuppe',
//   },
//   {
//     id: 3,
//     name: 'Kürbiscremesuppe',
//   },
//   {
//     id: 4,
//     name: 'Lauchcremesuppe',
//   },
//   {
//     id: 5,
//     name: 'Leberknödelsuppe',
//   },
//   {
//     id: 7,
//     name: 'Schwammerlsuppe',
//   },
//   {
//     id: 8,
//     name: 'Erdapfelsalat',
//   },
//   {
//     id: 9,
//     name: 'Vogerlsalat mit Erdäpfel',
//   },
//   {
//     id: 10,
//     name: 'Backhendl',
//   },
//   {
//     id: 11,
//     name: 'Erdapfelgulasch',
//   },
//   {
//     id: 12,
//     name: 'Erdapfelgröstl',
//   },
//   {
//     id: 13,
//     name: 'Gfüllte Paprika',
//   },
//   {
//     id: 14,
//     name: 'Kaiserschmarrn',
//   },
//   {
//     id: 15,
//     name: 'Kartoffelpüree mit Faschiertem Laibchen und Speck-Fisolen',
//   },
//   {
//     id: 16,
//     name: 'Kaspressknödel',
//   },
//   {
//     id: 17,
//     name: 'Knedl mit Ei',
//   },
//   {
//     id: 18,
//     name: 'Krautfleckerl',
//   },
//   {
//     id: 19,
//     name: 'Krautstrudel',
//   },
//   {
//     id: 20,
//     name: 'Käsespätzle mit Röstzwiebel',
//   },
//   {
//     id: 21,
//     name: 'Lauchstrudel',
//   },
//   {
//     id: 22,
//     name: 'Linseneintopf mit Semmelknedl',
//   },
//   {
//     id: 23,
//     name: 'Schinkenfleckerl',
//   },
//   {
//     id: 24,
//     name: 'Schnitzel mit Petersilkartoffel',
//   },
//   {
//     id: 25,
//     name: 'Schwammerlsauce mit Semmelknödel',
//   },
//   {
//     id: 26,
//     name: 'Schweinsbraten mit Sauerkraut und Semmelknödel',
//   },
//   {
//     id: 27,
//     name: 'Spinat mit Spiegelei und gröste',
//   },
//   {
//     id: 28,
//     name: 'Tafelspitz mit Wurzelgemüse und Krenn',
//   },
//   {
//     id: 29,
//     name: 'Zwiebelrostbraten mit Bratkartoffeln',
//   },
//   {
//     id: 30,
//     name: 'Apfelstrudel',
//   },
//   {
//     id: 31,
//     name: 'Marillenknödel',
//   },
//   {
//     id: 32,
//     name: 'Mohnnudeln',
//   },
//   {
//     id: 33,
//     name: 'Topfenknödel',
//   },
//   {
//     id: 34,
//     name: 'Topfenpalatschinken',
//   },
// ];

// // get all images from ../ressources/images
// const uploadImagesAndStoreUrl = async () => {
//   const images = fs
//     .readdirSync(path.resolve(__dirname, '../ressources/images'))
//     .sort((a, b) => {
//       // split filenames by filename and extension
//       const [aName, aExt] = a.split('.');
//       const [bName, bExt] = b.split('.');
//       // parse filenames to numbers
//       const aNumber = parseInt(aName, 10);
//       const bNumber = parseInt(bName, 10);
//       // compare numbers
//       return aNumber - bNumber;
//     });

//   const params = images.map((image) => ({
//     Bucket: process.env.S3_UPLOAD_BUCKET,
//     Key: `images/${image}`,
//     Body: fs.readFileSync(
//       path.resolve(__dirname, `../ressources/images/${image}`)
//     ),
//   }));

//   const uploadImages = await Promise.all(
//     params.map((param) => s3.upload(param).promise())
//   );
//   console.log('uploadImages ', uploadImages);

//   // const imageUrls = uploadImages.map((image) => image.Location);

//   // return imageUrls;
// };

// const main = async () => {
//   const imageUrls = await uploadImagesAndStoreUrl();

//   // const data = itemData.map((item, index) => ({
//   //   ...item,
//   //   imageUrl: imageUrls[index],
//   // }));

//   // console.log(data);
// };

// void main();

// const itemData = [
//   {
//     id: 1,
//     name: 'Frittatensuppe',
//   },
//   {
//     id: 2,
//     name: 'Griesnockerlsuppe',
//   },
//   {
//     id: 3,
//     name: 'Kürbiscremesuppe',
//   },
//   {
//     id: 4,
//     name: 'Lauchcremesuppe',
//   },
//   {
//     id: 5,
//     name: 'Leberknödelsuppe',
//   },
//   {
//     id: 7,
//     name: 'Schwammerlsuppe',
//   },
//   {
//     id: 8,
//     name: 'Erdapfelsalat',
//   },
//   {
//     id: 9,
//     name: 'Vogerlsalat mit Erdäpfel',
//   },
//   {
//     id: 10,
//     name: 'Backhendl',
//   },
//   {
//     id: 11,
//     name: 'Erdapfelgulasch',
//   },
//   {
//     id: 12,
//     name: 'Erdapfelgröstl',
//   },
//   {
//     id: 13,
//     name: 'Gfüllte Paprika',
//   },
//   {
//     id: 14,
//     name: 'Kaiserschmarrn',
//   },
//   {
//     id: 15,
//     name: 'Kartoffelpüree mit Faschiertem Laibchen und Speck-Fisolen',
//   },
//   {
//     id: 16,
//     name: 'Kaspressknödel',
//   },
//   {
//     id: 17,
//     name: 'Knedl mit Ei',
//   },
//   {
//     id: 18,
//     name: 'Krautfleckerl',
//   },
//   {
//     id: 19,
//     name: 'Krautstrudel',
//   },
//   {
//     id: 20,
//     name: 'Käsespätzle mit Röstzwiebel',
//   },
//   {
//     id: 21,
//     name: 'Lauchstrudel',
//   },
//   {
//     id: 22,
//     name: 'Linseneintopf mit Semmelknedl',
//   },
//   {
//     id: 23,
//     name: 'Schinkenfleckerl',
//   },
//   {
//     id: 24,
//     name: 'Schnitzel mit Petersilkartoffel',
//   },
//   {
//     id: 25,
//     name: 'Schwammerlsauce mit Semmelknödel',
//   },
//   {
//     id: 26,
//     name: 'Schweinsbraten mit Sauerkraut und Semmelknödel',
//   },
//   {
//     id: 27,
//     name: 'Spinat mit Spiegelei und gröste',
//   },
//   {
//     id: 28,
//     name: 'Tafelspitz mit Wurzelgemüse und Krenn',
//   },
//   {
//     id: 29,
//     name: 'Zwiebelrostbraten mit Bratkartoffeln',
//   },
//   {
//     id: 30,
//     name: 'Apfelstrudel',
//   },
//   {
//     id: 31,
//     name: 'Marillenknödel',
//   },
//   {
//     id: 32,
//     name: 'Mohnnudeln',
//   },
//   {
//     id: 33,
//     name: 'Topfenknödel',
//   },
//   {
//     id: 34,
//     name: 'Topfenpalatschinken',
//   },
// ];

// // create new object array with id and imageUrl
// const data = itemData.map((item, index) => ({
//   ...item,
//   imageUrl: `https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/${item.id}.jpeg`,
// }));

// console.log(data);
