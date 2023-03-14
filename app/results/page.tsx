import Image from 'next/image';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

// display a ListView that displays items like a barchart
// the items are sorted by avgRating
// in the background of the bar item, the user can see the image of the item
// where the percentage of the bar is the avgRating
// the chart is not interactable
const Page = async () => {
  const userSession = await getCurrentUser();
  const items = await await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      imagePlaceholder: true,
      ratings: true,
    },
    where: { published: true },
  });
  const transformedItems = items
    .map((item) => ({
      ...item,
      avgRating:
        item.ratings.reduce((acc, cur) => acc + cur.value, 0) /
          item.ratings.length || 0,
    }))
    // sort them by avgRating
    .sort((a, b) => b.avgRating - a.avgRating);

  const maxRating = transformedItems.reduce((acc, cur) => {
    if (cur.avgRating > acc) {
      return cur.avgRating;
    }
    return acc;
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="border-styria flex h-[85vh] flex-col rounded-lg bg-white px-5 py-6 sm:px-6">
        <div>
          <h1 className="mt-10 scroll-m-20 font-sans-alt text-xl font-normal transition-colors first:mt-0 dark:border-b-slate-700 lg:text-2xl">
            So schau ma aus...
          </h1>
        </div>
        <div className="relative h-full overflow-hidden">
          <div className="relative h-full overflow-auto">
            <ul className="m-0 flex flex-col gap-4 p-0">
              {transformedItems.map((item, index) => (
                <li
                  className="relative flex h-16 w-full items-end overflow-hidden rounded-2xl"
                  key={item.id}
                >
                  <div className="absolute left-0 top-0 h-full w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div className="relative flex h-full w-full flex-row">
                    <div
                      style={{
                        flex: `${(item.avgRating / maxRating) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-[rgba(255,255,255,0.9)]"
                      style={{
                        flex: `${(1 - item.avgRating / maxRating) * 100}%`,
                      }}
                    />
                    <div className="absolute left-0 bottom-0 bg-[rgba(255,255,255,0.9)] p-2">
                      <span className="font-bold">{`${index + 1}. `}</span>
                      {`${item.name} (${Math.round(
                        (item.avgRating / maxRating) * 100
                      )}%)`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
