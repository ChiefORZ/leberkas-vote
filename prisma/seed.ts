import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const itemData = [
  {
    id: '1',
    name: 'Frittatensuppe',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/1.jpeg',
  },
  {
    id: '2',
    name: 'Griesnockerlsuppe',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/2.jpeg',
  },
  {
    id: '3',
    name: 'Kürbiscremesuppe',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/3.jpeg',
  },
  {
    id: '4',
    name: 'Lauchcremesuppe',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/4.jpeg',
  },
  {
    id: '5',
    name: 'Leberknödelsuppe',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/5.jpeg',
  },
  {
    id: '7',
    name: 'Schwammerlsuppe',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/7.jpeg',
  },
  {
    id: '8',
    name: 'Erdapfelsalat',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/8.jpeg',
  },
  {
    id: '9',
    name: 'Vogerlsalat mit Erdäpfel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/9.jpeg',
  },
  {
    id: '10',
    name: 'Backhendl',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/10.jpeg',
  },
  {
    id: '11',
    name: 'Erdapfelgulasch',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/11.jpeg',
  },
  {
    id: '12',
    name: 'Erdapfelgröstl',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/12.jpeg',
  },
  {
    id: '13',
    name: 'Gfüllte Paprika',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/13.jpeg',
  },
  {
    id: '14',
    name: 'Kaiserschmarrn',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/14.jpeg',
  },
  {
    id: '15',
    name: 'Kartoffelpüree mit Faschiertem Laibchen und Speck-Fisolen',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/15.jpeg',
  },
  {
    id: '16',
    name: 'Kaspressknödel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/16.jpeg',
  },
  {
    id: '17',
    name: 'Knedl mit Ei',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/17.jpeg',
  },
  {
    id: '18',
    name: 'Krautfleckerl',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/18.jpeg',
  },
  {
    id: '19',
    name: 'Krautstrudel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/19.jpeg',
  },
  {
    id: '20',
    name: 'Käsespätzle mit Röstzwiebel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/20.jpeg',
  },
  {
    id: '21',
    name: 'Lauchstrudel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/21.jpeg',
  },
  {
    id: '22',
    name: 'Linseneintopf mit Semmelknedl',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/22.jpeg',
  },
  {
    id: '23',
    name: 'Schinkenfleckerl',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/23.jpeg',
  },
  {
    id: '24',
    name: 'Schnitzel mit Petersilkartoffel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/24.jpeg',
  },
  {
    id: '25',
    name: 'Schwammerlsauce mit Semmelknödel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/25.jpeg',
  },
  {
    id: '26',
    name: 'Schweinsbraten mit Sauerkraut und Semmelknödel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/26.jpeg',
  },
  {
    id: '27',
    name: 'Spinat mit Spiegelei und gröste',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/27.jpeg',
  },
  {
    id: '28',
    name: 'Tafelspitz mit Wurzelgemüse und Krenn',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/28.jpeg',
  },
  {
    id: '29',
    name: 'Zwiebelrostbraten mit Bratkartoffeln',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/29.jpeg',
  },
  {
    id: '30',
    name: 'Apfelstrudel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/30.jpeg',
  },
  {
    id: '31',
    name: 'Marillenknödel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/31.jpeg',
  },
  {
    id: '32',
    name: 'Mohnnudeln',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/32.jpeg',
  },
  {
    id: '33',
    name: 'Topfenknödel',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/33.jpeg',
  },
  {
    id: '34',
    name: 'Topfenpalatschinken',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/34.jpeg',
  },
];

export async function main() {
  try {
    console.info(`Start seeding ...`);
    for (const u of itemData) {
      const item = await prisma.item.create({
        data: u,
      });
      console.info(`Created item with id: ${item.id}`);
    }
    console.info(`Seeding finished.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
