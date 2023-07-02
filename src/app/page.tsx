import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import Link from 'next/link';

import GridView from '@/app/GridView.client';
import VotesLeft from '@/app/VotesLeft.client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { InteractionContextProvider } from '@/providers/InteractionProvider';
import { RatingContextProvider } from '@/providers/RatingProvider';
import { UserContextProvider } from '@/providers/UserProvider';

type User = NexusGenFieldTypes['User'];

const Page = async () => {
  const userSession = await getCurrentUser();
  let user: User | null = null;
  if (userSession?.id) {
    user = await prisma.user.findUnique({
      where: { id: userSession?.id },
      select: { id: true, email: true, name: true, ratings: true, role: true },
    });
  }
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
    .sort(() => Math.random() - 0.5);

  return (
    <UserContextProvider user={user}>
      <InteractionContextProvider>
        <RatingContextProvider>
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="border-styria flex h-[85vh] flex-col rounded-lg bg-white px-5 py-6 sm:px-6">
              <div>
                <h1 className="mt-10 scroll-m-20 font-sans-alt text-xl font-normal transition-colors first:mt-0 dark:border-b-slate-700 lg:text-2xl">
                  Endlich wird über die wichtigen Sachen in Österreich
                  abgstimmt!
                </h1>
                <VotesLeft />
              </div>
              <div className="relative h-full overflow-hidden">
                <GridView items={transformedItems} />
              </div>
            </div>
          </div>
        </RatingContextProvider>
      </InteractionContextProvider>
    </UserContextProvider>
  );
};

export default Page;
