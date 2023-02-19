import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import Link from 'next/link';
import React from 'react';

import GridView from '@/components/GridView';
import Overlay from '@/components/GridView/Overlay';
import { TypographyH2, TypographyLead } from '@/components/Typography';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

const restStars = 0;

type User = NexusGenFieldTypes['User'];

const Page = async () => {
  const userSession = await getCurrentUser();
  let user: User | null = null;
  if (userSession?.id) {
    user = await prisma.user.findUnique({
      where: { id: userSession?.id },
      select: { id: true, email: true, name: true, ratings: true },
    });
  }
  const items = await await prisma.item.findMany({
    select: { id: true, name: true, imageUrl: true, ratings: true },
  });
  const transformedItems = items
    .map((item) => ({
      ...item,
      avgRating:
        item.ratings.reduce((acc, cur) => acc + cur.value, 0) /
          item.ratings.length || 0,
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
              Verteil deine Herzal an deine Lieblingsgerichte
              {renderVotesLeft()}
            </TypographyLead>
          </div>
          <div className="relative h-full overflow-hidden">
            <GridView items={transformedItems} user={user} />
            {!user || !user.id ? (
              <Overlay>
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Zum Abstimmen bitte mit E-Mail anmelden&nbsp;
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
