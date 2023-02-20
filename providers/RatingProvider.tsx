'use client';

import { Rating } from '@prisma/client';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { gql, request } from 'graphql-request';
import { createContext, useContext, useMemo, useRef, useState } from 'react';

import { numVotes } from '@/constants/index';
import { useUserContext } from '@/providers/UserProvider';

interface IRatingContextProviderProps {
  children: React.ReactNode;
}

interface IRatingContext {
  handleOnRatingChange: ({
    itemId,
    rating,
  }: {
    itemId: string;
    rating: number;
  }) => void;
  handleSubmitForm: () => void;
  ratings: Rating[];
  ratingsChanged: boolean;
  restStars: number;
}

const SetRatingsMutation = gql`
  mutation setRatings($ratings: [RatingInput!]!) {
    setRatings(ratings: $ratings) {
      itemId
      userId
      value
    }
  }
`;

const RatingContext = createContext<IRatingContext | null>(null);

const RatingContextProvider = ({ children }: IRatingContextProviderProps) => {
  const { user } = useUserContext();
  const defaultValue = useRef(
    JSON.stringify(
      (user?.ratings || []).sort((a, b) => a.itemId.localeCompare(b.itemId))
    )
  );
  const [ratings, setRatings] = useState<Rating[]>(user?.ratings || []);

  const ratingsChanged =
    JSON.stringify(ratings.sort((a, b) => a.itemId.localeCompare(b.itemId))) !==
    defaultValue.current;

  const calcRestStars = (r: Rating[]) => {
    const sum = r.reduce((acc, curr) => acc + curr.value, 0);
    return numVotes - sum;
  };

  const restStars = useMemo(() => calcRestStars(ratings), [ratings]);

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
      if (calcRestStars(newRatings) < 0) return prevRatings;
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
      // window.location.href = '/results';
    } catch (err) {
      // TODO: show a toast message
      console.error(err);
    }
  };

  return (
    <RatingContext.Provider
      value={{
        ratings,
        handleOnRatingChange,
        ratingsChanged,
        handleSubmitForm,
        restStars,
      }}
    >
      {children}
    </RatingContext.Provider>
  );
};

const useRatingContext = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a RatingContextProvider');
  }
  return context;
};

export { RatingContext, RatingContextProvider, useRatingContext };
