'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Rating } from '@prisma/client';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { gql, request } from 'graphql-request';
import Image from 'next/image';
import { useRef, useState } from 'react';
import styled from 'styled-components';

import RatingOverlay from '@/components/GridView/RatingOverlay';

type User = NexusGenFieldTypes['User'];

interface GridViewProps {
  items: {
    id: string;
    name: string;
    imageUrl: string;
    avgRating: number;
  }[];
  user?: User;
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

const SetRatingsMutation = gql`
  mutation setRatings($ratings: [RatingInput!]!) {
    setRatings(ratings: $ratings) {
      itemId
      userId
      value
    }
  }
`;

function GridView(props: GridViewProps) {
  const { items, user } = props;
  const defaultValue = useRef(
    JSON.stringify(
      (user?.ratings || []).sort((a, b) => a.itemId.localeCompare(b.itemId))
    )
  );
  const [ratings, setRatings] = useState<Rating[]>(user?.ratings || []);

  const ratingsChanged =
    JSON.stringify(ratings.sort((a, b) => a.itemId.localeCompare(b.itemId))) !==
    defaultValue.current;

  const handleOnRatingChange = async ({
    itemId,
    rating,
  }: {
    itemId: string;
    rating: number;
  }) => {
    if (!user || !user.id) return;
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      if (
        newRatings.find((r) => r.itemId === itemId) &&
        newRatings.find((r) => r.itemId === itemId)?.value === rating
      ) {
        // delete rating
        newRatings.splice(
          newRatings.findIndex((r) => r.itemId === itemId),
          1
        );
      } else if (
        newRatings.find((r) => r.itemId === itemId) &&
        newRatings.find((r) => r.itemId === itemId)?.value !== rating
      ) {
        // update rating immutable
        newRatings[newRatings.findIndex((r) => r.itemId === itemId)].value =
          rating;
      } else {
        newRatings.push({ itemId, userId: user.id, value: rating });
      }
      return newRatings;
    });
  };

  const handleSubmitForm = async () => {
    try {
      if (!user || !user.id) return;
      // make a graphql mutation to create a rating with window.fetch

      await request('/api', SetRatingsMutation, {
        ratings,
      });
      // redirect to /results
      window.location.href = '/results';
    } catch (err) {
      // TODO: show a toast message
      console.error(err);
    }
  };

  return (
    <div className="relative h-full overflow-auto">
      <div className="grid grid-cols-my-grid gap-4 overflow-y-auto p-4">
        {items.map((item) => (
          <GridItem
            key={item.id}
            style={{ '--aspect-ratio': 4 / 3 }}
            className="relative flex justify-center overflow-hidden rounded-md shadow-sm transition hover:shadow-md"
          >
            <Tile
              alt={item.name}
              className="block w-full select-none object-cover"
              src={item.imageUrl}
            />
            <div className="absolute bottom-0 flex w-full flex-col justify-center bg-[rgba(255,255,255,0.9)] p-2 text-center leading-none">
              <div>{item.name}</div>
              <RatingOverlay
                rating={ratings.find((r) => r.itemId === item.id)?.value}
                onRatingChange={(value) =>
                  handleOnRatingChange({ itemId: item.id, rating: value })
                }
              />
            </div>
          </GridItem>
        ))}
      </div>
      {ratingsChanged ? (
        <FloatingActionButton
          onClick={handleSubmitForm}
          className="z-90 fixed bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-400 p-3 text-xl text-white drop-shadow-lg duration-300 hover:bg-brand-300 hover:drop-shadow-2xl"
        >
          <ArrowRightIcon />
        </FloatingActionButton>
      ) : null}
    </div>
  );
}

export default GridView;
