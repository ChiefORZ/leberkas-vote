/* eslint-disable import/no-extraneous-dependencies */
import { createContext } from 'react';
import { vi } from 'vitest';

import { mockedUser } from '@/providers/__mocks__/UserProvider';

const mockedRatingContext = {
  handleOnRatingChange: vi.fn(),
  handleSubmitForm: vi.fn(),
  isSubmitting: false,
  ratings: mockedUser.ratings,
  ratingsChanged: false,
  restStars: 0,
};

const RatingContext = createContext(mockedRatingContext);

const useRatingContext = () => mockedRatingContext;

export { RatingContext, useRatingContext };
