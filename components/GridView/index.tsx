'use client';

import autoAnimate from '@formkit/auto-animate';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import Image from 'next/image';
import Link from 'next/link';
import { useRatingContext } from 'providers/RatingProvider';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { UploadItemGridItem } from '@/app/UploadItem.client';
import RatingOverlay from '@/components/GridView/RatingOverlay';
import Overlay from '@/components/Overlay';
import { Spinner } from '@/components/Spinner';
import { useUserContext } from '@/providers/UserProvider';

type User = NexusGenFieldTypes['User'];

interface GridViewProps {
  items: {
    id: string;
    name: string;
    imageUrl: string;
    imagePlaceholder: string;
    avgRating: number;
  }[];
}
const GridViewOuter = styled.div``;
const GridViewWrapper = styled.div``;
const Tile = styled(Image)``;
const GridItem = styled.div`
  ${Tile} {
    transition: transform 0.3s ease;
  }
  :hover ${Tile} {
    transform: scale(1.05);
  }
`;
const GridItemDetails = styled.div``;

const GridItemTitle = styled.div``;

const FloatingActionButton = styled.button`
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  animation: bounce 1s normal forwards;
  animation-iteration-count: 1;
`;

function GridView(props: GridViewProps) {
  const { items } = props;
  const { user } = useUserContext();

  const [triedToInteract, setTriedToInteract] = React.useState(false);

  const {
    handleOnRatingChange,
    handleSubmitForm,
    isSubmitting,
    ratings,
    ratingsChanged,
  } = useRatingContext();

  const interceptedHandleOnRatingChange = React.useCallback(
    ({ itemId, rating }: { itemId: string; rating: number }) => {
      if (!triedToInteract && (!user || !user.id)) {
        setTriedToInteract(true);
        return;
      }
      setTriedToInteract(true);
      handleOnRatingChange({ itemId, rating });
    },
    [handleOnRatingChange, triedToInteract, user]
  );

  // always sort rated items to the top
  // and when same rating, sort by name
  const sortedItems = items.sort((a, b) => {
    const aRating = ratings.find((r) => r.itemId === a.id)?.value;
    const bRating = ratings.find((r) => r.itemId === b.id)?.value;
    if (aRating && bRating) {
      if (aRating === bRating) {
        return a.name.localeCompare(b.name);
      }
      return bRating - aRating;
    }
    if (aRating) {
      return -1;
    }
    if (bRating) {
      return 1;
    }
    return 0;
  });

  /* autoAnimate */
  const animationParent = useRef(null);

  useEffect(() => {
    animationParent.current && autoAnimate(animationParent.current);
  }, [animationParent]);

  return (
    <React.Fragment>
      <div className="relative h-full overflow-auto">
        <div
          className="grid grid-cols-my-grid gap-4 overflow-y-auto p-4"
          ref={animationParent}
        >
          {sortedItems.map((item) => (
            <GridItem
              key={item.id}
              style={{ '--aspect-ratio': 4 / 3 }}
              className="relative flex justify-center overflow-hidden rounded-md shadow-sm transition hover:shadow-md"
            >
              <Tile
                alt={item.name}
                className="block w-full select-none object-cover"
                fill
                placeholder="blur"
                blurDataURL={item.imagePlaceholder}
                src={item.imageUrl}
              />
              <div className="absolute bottom-0 flex w-full flex-col justify-center bg-[rgba(255,255,255,0.9)] p-2 text-center leading-none">
                <div>{item.name}</div>
                <RatingOverlay
                  rating={ratings.find((r) => r.itemId === item.id)?.value}
                  onRatingChange={(value) =>
                    interceptedHandleOnRatingChange({
                      itemId: item.id,
                      rating: value,
                    })
                  }
                />
              </div>
            </GridItem>
          ))}
          {user ? <UploadItemGridItem /> : null}
        </div>
        {ratingsChanged ? (
          <FloatingActionButton
            onClick={handleSubmitForm}
            className="z-90 fixed bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-400 p-3 text-xl text-white drop-shadow-lg duration-300 hover:bg-brand-300 hover:drop-shadow-2xl"
          >
            {isSubmitting ? <Spinner /> : <ArrowRightIcon />}
          </FloatingActionButton>
        ) : null}
      </div>
      {triedToInteract && (!user || !user.id) ? (
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
    </React.Fragment>
  );
}

export default GridView;
