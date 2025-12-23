import { PrismaClient } from '@prisma/client';
import { getPlaiceholder } from 'plaiceholder';

const prisma = new PrismaClient();

const getBase64 = async (url: string) => {
  const buffer = await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );
  const { base64 } = await getPlaiceholder(buffer);
  return base64;
};

const itemData: {
  id: string;
  name: string;
  imageUrl: string;
  imagePlaceholder?: string;
}[] = [
  {
    id: '1',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/1.jpeg',
    name: 'Frittatensuppe',
  },
  {
    id: '2',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/2.jpeg',
    name: 'Griesnockerlsuppe',
  },
  {
    id: '3',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/3.jpeg',
    name: 'Kürbiscremesuppe',
  },
  {
    id: '4',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/4.jpeg',
    name: 'Lauchcremesuppe',
  },
  {
    id: '5',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/5.jpeg',
    name: 'Leberknödelsuppe',
  },
  {
    id: '7',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/7.jpeg',
    name: 'Schwammerlsuppe',
  },
  {
    id: '8',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/8.jpeg',
    name: 'Erdapfelsalat',
  },
  {
    id: '9',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/9.jpeg',
    name: 'Vogerlsalat mit Erdäpfel',
  },
  {
    id: '10',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/10.jpeg',
    name: 'Backhendl',
  },
  {
    id: '11',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/11.jpeg',
    name: 'Erdapfelgulasch',
  },
  {
    id: '12',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/12.jpeg',
    name: 'Erdapfelgröstl',
  },
  {
    id: '13',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/13.jpeg',
    name: 'Gfüllte Paprika',
  },
  {
    id: '14',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/14.jpeg',
    name: 'Kaiserschmarrn',
  },
  {
    id: '15',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/15.jpeg',
    name: 'Kartoffelpüree mit Faschiertem Laibchen und Speck-Fisolen',
  },
  {
    id: '16',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/16.jpeg',
    name: 'Kaspressknödel',
  },
  {
    id: '17',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/17.jpeg',
    name: 'Knedl mit Ei',
  },
  {
    id: '18',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/18.jpeg',
    name: 'Krautfleckerl',
  },
  {
    id: '19',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/19.jpeg',
    name: 'Krautstrudel',
  },
  {
    id: '20',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/20.jpeg',
    name: 'Käsespätzle mit Röstzwiebel',
  },
  {
    id: '21',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/21.jpeg',
    name: 'Lauchstrudel',
  },
  {
    id: '22',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/22.jpeg',
    name: 'Linseneintopf mit Semmelknedl',
  },
  {
    id: '23',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/23.jpeg',
    name: 'Schinkenfleckerl',
  },
  {
    id: '24',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/24.jpeg',
    name: 'Schnitzel mit Petersilkartoffel',
  },
  {
    id: '25',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/25.jpeg',
    name: 'Schwammerlsauce mit Semmelknödel',
  },
  {
    id: '26',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/26.jpeg',
    name: 'Schweinsbraten mit Sauerkraut und Semmelknödel',
  },
  {
    id: '27',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/27.jpeg',
    name: 'Spinat mit Spiegelei und gröste',
  },
  {
    id: '28',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/28.jpeg',
    name: 'Tafelspitz mit Wurzelgemüse und Krenn',
  },
  {
    id: '29',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/29.jpeg',
    name: 'Zwiebelrostbraten mit Bratkartoffeln',
  },
  {
    id: '30',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/30.jpeg',
    name: 'Apfelstrudel',
  },
  {
    id: '31',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/31.jpeg',
    name: 'Marillenknödel',
  },
  {
    id: '32',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/32.jpeg',
    name: 'Mohnnudeln',
  },
  {
    id: '33',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/33.jpeg',
    name: 'Topfenknödel',
  },
  {
    id: '34',
    imageUrl:
      'https://basil-images-dev.s3.eu-west-1.amazonaws.com/images/34.jpeg',
    name: 'Topfenpalatschinken',
  },
];

export async function main() {
  for (const item of itemData) {
    item.imagePlaceholder = await getBase64(item.imageUrl);
  }
  try {
    console.info('Start seeding ...');
    for (const u of itemData) {
      const item = await prisma.item.upsert({
        create: {
          id: u.id,
          imagePlaceholder: u?.imagePlaceholder,
          imageUrl: u.imageUrl,
          name: u.name,
        },
        update: {
          imagePlaceholder: u?.imagePlaceholder,
          imageUrl: u.imageUrl,
          name: u.name,
        },
        where: { id: u.id },
      });
      console.info(`Created item with id: ${item.id}`);
    }
    console.info('Seeding finished.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
