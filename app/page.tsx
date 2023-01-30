import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';

import GridView from '@/components/GridView';
import Overlay from '@/components/GridView/Overlay';
import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
} from '@/components/Typography';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

const restStars = 0;

const Page = async () => {
  const user = await getCurrentUser();
  const items = await await prisma.item.findMany({
    select: { id: true, name: true, imageUrl: true, ratings: true },
  });
  const transformedItems = items
    .map((item) => ({
      ...item,
      // calculate the average rating
      rating:
        item.ratings.reduce((sum, rating) => sum + rating.value, 0) /
        item.ratings.length,
    }))
    .sort(() => Math.random() - 0.5);

  const renderVotesLeft = () => {
    return user?.id ? (
      <span>&nbsp;-&nbsp;{String(restStars)} verbleibend</span>
    ) : null;
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex h-[85vh] flex-col rounded-lg bg-white px-5 py-6 shadow sm:px-6">
          <div>
            <TypographyH2>
              Endlich wird über die wichtigen Sachen in Österreich abgstimmt!
            </TypographyH2>
            <TypographyLead>
              Verteile deine Herzal an deine Lieblingsgerichte
              {renderVotesLeft()}
            </TypographyLead>
          </div>
          <div className="relative h-full overflow-hidden">
            <GridView items={transformedItems} />
            {!user || !user.id ? (
              <Overlay>
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    To vote please login using your email&nbsp;
                    <ArrowRightCircleIcon className="inline h-6 w-6" />
                  </Link>
                </div>
              </Overlay>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
