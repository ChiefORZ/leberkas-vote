import { NexusGenFieldTypes } from 'generated/nexus-typegen';

import ListView from '@/components/ListView';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

type User = NexusGenFieldTypes['User'];

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

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="border-styria flex h-[85vh] flex-col rounded-lg bg-white px-5 py-6 sm:px-6">
        <div>
          <h1 className="mt-10 scroll-m-20 font-sans-alt text-xl font-normal transition-colors first:mt-0 dark:border-b-slate-700 lg:text-2xl">
            So schau ma aus...
          </h1>
        </div>
        <div className="relative h-full overflow-hidden">
          <ListView items={transformedItems} />
        </div>
      </div>
    </div>
  );
};

export default Page;
