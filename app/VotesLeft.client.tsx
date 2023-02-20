'use client';

import { TypographyH2, TypographyLead } from '@/components/Typography';
import { useRatingContext } from '@/providers/RatingProvider';
import { useUserContext } from '@/providers/UserProvider';

const VotesLeft = () => {
  const { user } = useUserContext();
  const { restStars } = useRatingContext();

  const renderVotesLeft = () => {
    return user?.id ? (
      <span>
        &nbsp;-&nbsp;<span className="text-brand-400">{String(restStars)}</span>
        &nbsp;verbleibend
      </span>
    ) : null;
  };
  return (
    <TypographyLead>
      Verteil deine Herzal an deine Lieblingsgerichte
      {renderVotesLeft()}
    </TypographyLead>
  );
};

export default VotesLeft;
