/* eslint-disable @typescript-eslint/ban-ts-comment */
import Image from 'next/image';

import { DeleteButton } from '@/app/admin/DeleteButton.client';
import { PublishButton } from '@/app/admin/PublishButton.client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

// display a grid that displays not yet published items
// there is a button to publish the item
// the grid is not interactable
const Page = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userSession = await getCurrentUser();
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      imagePlaceholder: true,
      imageUrl: true,
      name: true,
    },
    where: { published: false },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="border-styria flex h-[85vh] flex-col rounded-lg bg-white px-5 py-6 sm:px-6">
        <div>
          <h1 className="mt-10 scroll-m-20 font-sans-alt text-xl font-normal transition-colors first:mt-0 dark:border-b-slate-700 lg:text-2xl">
            Neue Eintr&auml;ge
          </h1>
        </div>
        <div className="relative h-full overflow-hidden">
          <div className="relative h-full overflow-auto">
            <div className="grid grid-cols-my-grid gap-4 overflow-y-auto p-4">
              {items.map((item) => (
                <div
                  className="relative flex justify-center overflow-hidden rounded-md shadow-sm transition hover:shadow-md"
                  key={item.id}
                  // @ts-ignore
                  style={{ '--aspect-ratio': 4 / 3 }}
                >
                  <Image
                    alt={item.name}
                    blurDataURL={item.imagePlaceholder}
                    className="block w-full select-none object-cover"
                    fill
                    placeholder="blur"
                    src={item.imageUrl}
                  />
                  <div className="absolute right-0 top-0">
                    <DeleteButton item={item} />
                    <PublishButton item={item} />
                  </div>
                  <div className="absolute bottom-0 flex w-full flex-col justify-center bg-[rgba(255,255,255,0.9)] p-2 text-center leading-none">
                    <div>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
