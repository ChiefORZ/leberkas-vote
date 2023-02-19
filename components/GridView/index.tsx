'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Rating } from '@prisma/client';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { gql, request } from 'graphql-request';
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

const GridViewWrapper = styled.div`
  display: grid;
  padding: 1rem;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  overflow-y: auto;
`;

const Tile = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
  user-select: none;
`;

const GridItem = styled.div`
  position: relative;
  display: flex;
  /* flex-direction: column; */
  // horizontal center
  justify-content: center;
  overflow: hidden;

  ${Tile} {
    transition: transform 0.3s ease;
  }
  :hover ${Tile} {
    transform: scale(1.05);
  }
`;

const GridItemDetails = styled.div`
  position: absolute;
  bottom: 0;
  padding: 0.5em;
  /* border-radius: 16px; */
  width: 100%;
  line-height: 1;
  background-color: rgba(255, 255, 255, 0.9);

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

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
      <GridViewWrapper>
        {items.map((item, index) => (
          <GridItem
            key={item.id}
            style={{ '--aspect-ratio': 4 / 3 }}
            className="rounded-md shadow-sm transition hover:shadow-md"
          >
            <Tile src={item.imageUrl} />
            <GridItemDetails>
              <GridItemTitle>{item.name}</GridItemTitle>
              <RatingOverlay
                rating={ratings.find((r) => r.itemId === item.id)?.value}
                onRatingChange={(value) =>
                  handleOnRatingChange({ itemId: item.id, rating: value })
                }
              />
            </GridItemDetails>
          </GridItem>
        ))}
      </GridViewWrapper>
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
