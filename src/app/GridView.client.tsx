'use client';

import autoAnimate from '@formkit/auto-animate';
import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import RatingOverlay from '@/app/RatingOverlay.client';
import styles from '@/app/styles.module.scss';
import { UploadItemGridItem } from '@/app/UploadItem.client';
import Overlay from '@/components/Overlay';
import { Spinner } from '@/components/Spinner';
import { useInteractionContext } from '@/providers/InteractionProvider';
import { useRatingContext } from '@/providers/RatingProvider';
import { useUserContext } from '@/providers/UserProvider';

interface GridViewProps {
  items: {
    id: string;
    name: string;
    imageUrl: string;
    imagePlaceholder: string;
    avgRating: number;
  }[];
}

function GridView(props: GridViewProps) {
  const { items } = props;
  const { user } = useUserContext();
  const { displayLoginOverlay, handleAllowedToInteract } =
    useInteractionContext();

  const {
    handleOnRatingChange,
    handleSubmitForm,
    isSubmitting,
    ratings,
    ratingsChanged,
  } = useRatingContext();

  const interceptedHandleOnRatingChange = React.useCallback(
    async ({ itemId, rating }: { itemId: string; rating: number }) => {
      if (await handleAllowedToInteract()) {
        handleOnRatingChange({ itemId, rating });
      }
    },
    [handleOnRatingChange, handleAllowedToInteract]
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
    if (animationParent.current) {
      autoAnimate(animationParent.current);
    }
  }, []);

  return (
    <>
      <div className="relative h-full overflow-auto">
        <div
          className="grid grid-cols-my-grid gap-4 overflow-y-auto p-4"
          ref={animationParent}
        >
          {sortedItems.map((item) => (
            <div
              className={clsx(
                styles.gridItem,
                'relative flex justify-center overflow-hidden rounded-md shadow-sm transition hover:shadow-md'
              )}
              data-testid="grid-item"
              key={item.id}
              // @ts-expect-error - aspect-ratio is a custom variable
              style={{ '--aspect-ratio': 4 / 3 }}
            >
              <Image
                alt={item.name}
                blurDataURL={item.imagePlaceholder}
                className={clsx(
                  styles.tile,
                  'block w-full select-none object-cover'
                )}
                fill
                placeholder="blur"
                src={item.imageUrl}
              />
              <div className="absolute bottom-0 flex w-full flex-col justify-center bg-[rgba(255,255,255,0.9)] p-2 text-center leading-none">
                <div>{item.name}</div>
                <RatingOverlay
                  onRatingChange={(value) =>
                    interceptedHandleOnRatingChange({
                      itemId: item.id,
                      rating: value,
                    })
                  }
                  rating={ratings.find((r) => r.itemId === item.id)?.value}
                />
              </div>
            </div>
          ))}
          <UploadItemGridItem onClick={handleAllowedToInteract} user={user} />
        </div>
        {ratingsChanged ? (
          <button
            className={clsx(
              styles.button,
              'fixed right-10 bottom-10 z-90 flex h-14 w-14 items-center justify-center rounded-full bg-brand-400 p-3 text-white text-xl drop-shadow-lg duration-300 hover:bg-brand-300 hover:drop-shadow-2xl'
            )}
            onClick={handleSubmitForm}
            type="button"
          >
            {isSubmitting ? <Spinner /> : <ArrowRightIcon />}
          </button>
        ) : null}
      </div>
      {displayLoginOverlay ? (
        <Overlay>
          <div className="inline-flex rounded-md shadow">
            <Link
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 font-medium text-base text-gray-900 hover:bg-gray-50"
              href="/login"
            >
              Zum Abstimmen bitte mit E-Mail anmelden&nbsp;
              <ArrowRightCircleIcon className="inline h-6 w-6" />
            </Link>
          </div>
        </Overlay>
      ) : null}
    </>
  );
}

export default GridView;
