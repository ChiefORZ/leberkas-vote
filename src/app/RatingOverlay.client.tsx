import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import React from 'react';

import styles from '@/app/styles.module.scss';
import { classNames } from '@/utils/index';

interface RatingOverlayProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function RatingOverlay(props: RatingOverlayProps) {
  const { rating, onRatingChange } = props;

  const [isHovering, setIsHovering] = React.useState<number | undefined>(undefined);

  // Create a list of star SVG icons for the ratings 0-5
  const ratingItems = [];
  for (let i = 1; i <= 5; i++) {
    ratingItems.push(
      // biome-ignore lint/a11y/useKeyWithClickEvents: reasonable explanation
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
            isHovering && i <= isHovering ? 'text-red-300' : 'text-gray-300',
          )}
        />
        <HeartIconSolid
          className={classNames(
            styles.ratedHeart,
            'h6 absolute left-0 top-0 w-6 text-red-500 opacity-0',
          )}
          data-active={i <= rating}
        />
      </div>,
    );
  }

  return <div className="bg-grey-200 inline-flex justify-center text-center">{ratingItems}</div>;
}

export default RatingOverlay;
