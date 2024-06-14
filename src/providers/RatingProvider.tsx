'use client';

import { Rating } from '@prisma/client';
import { gql, request } from 'graphql-request';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
  isSubmitting: boolean;
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
  const displayError = (error: string) => {
    toast.error(error);
  };
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValue = useRef(
    JSON.stringify((user?.ratings || []).sort((a, b) => a.itemId.localeCompare(b.itemId))),
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
          1,
        );
      } else if (
        newRatings.find((r) => r.itemId === itemId) &&
        newRatings.find((r) => r.itemId === itemId)?.value !== rating
      ) {
        // update rating immutable
        newRatings[newRatings.findIndex((r) => r.itemId === itemId)].value = rating;
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
      // set loading state
      setIsSubmitting(true);
      // make a graphql mutation to create a rating with window.fetch
      await request('/api', SetRatingsMutation, {
        ratings,
      });
      trackEvent('Vote', {
        starsLeft: restStars,
        userId: user.id,
      });
      // redirect to /results
      window.location.href = '/results';
    } catch (e) {
      if (typeof e === 'string') {
        console.error(e.toUpperCase());
      } else if (e instanceof Error) {
        console.error(e.message);
      }
      displayError('Uje, da is was schief glaufen!');
    }
  };

  useEffect(() => {
    const onBeforeUnload = (ev) => {
      ev.returnValue = 'Du hast deine Änderungen noch nicht gespeichert!';
      return 'Du hast deine Änderungen noch nicht gespeichert!';
    };

    if (ratingsChanged && !isSubmitting) {
      window.addEventListener('beforeunload', onBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', onBeforeUnload);
      };
    }
  }, [ratingsChanged, isSubmitting]);

  return (
    <RatingContext.Provider
      value={{
        handleOnRatingChange,
        handleSubmitForm,
        isSubmitting,
        ratings,
        ratingsChanged,
        restStars,
      }}
    >
      {children}
      <Toaster />
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
