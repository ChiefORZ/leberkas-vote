import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import React from 'react';
import styled, { css } from 'styled-components';

import { classNames } from '@/utils/index';

const RatedHeart = styled<{ 'data-active'?: boolean }>(HeartIconSolid)`
  transition: 0.5s ease-in;
  opacity: 100;

  clip-path: circle(0px at center);
  ${(p) =>
    p['data-active'] &&
    css`
      clip-path: circle(100% at center);
    `}
`;

interface RatingOverlayProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function RatingOverlay(props: RatingOverlayProps) {
  const { rating, onRatingChange } = props;

  const [isHovering, setIsHovering] = React.useState<number | undefined>(
    undefined
  );

  // Create a list of star SVG icons for the ratings 0-5
  const ratingItems = [];
  for (let i = 1; i <= 5; i++) {
    ratingItems.push(
      <div
        className="relative cursor-pointer"
        data-role="button"
        data-testid={`grid-item-rating-${i}`}
        key={i}
        onClick={() => onRatingChange(i)}
        onMouseEnter={() => setIsHovering(i)}
        onMouseLeave={() => setIsHovering(undefined)}
      >
        <HeartIcon
          className={classNames(
            'h-6 w-6',
            isHovering && i <= isHovering ? 'text-red-300' : 'text-gray-300'
          )}
        />
        <RatedHeart
          className={classNames(
            'h6 absolute left-0 top-0 w-6 text-red-500 opacity-0'
          )}
          data-active={i <= rating}
        />
      </div>
    );
  }

  return (
    <div className="bg-grey-200 inline-flex justify-center text-center">
      {ratingItems}
    </div>
  );
}

export default RatingOverlay;