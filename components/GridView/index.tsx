'use client';

import { useState } from 'react';
import styled from 'styled-components';

import RatingOverlay from '@/components/GridView/RatingOverlay';

interface GridViewProps {
  items: {
    id: string;
    name: string;
    imageUrl: string;
    avgRating: number;
  }[];
  user?: {
    id: string;
    email: string;
  };
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

function GridView(props: GridViewProps) {
  const { items, user } = props;
  const [ratings, setRatings] = useState();

  const handleOnRatingChange = (index: number) => async (rating: number) => {
    if (!user || !user.id) return;
    // make a graphql mutation to create a rating with window.fetch
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            createRating(
              value: "${rating}",
              itemId: "${items[index].id}",
              userId: "${user.id}",
            ) {
              id
              value
            }
          }
        `,
      }),
    });
  };

  return (
    <div className="h-full overflow-auto">
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
                rating={item.avgRating}
                onRatingChange={handleOnRatingChange(index)}
              />
            </GridItemDetails>
          </GridItem>
        ))}
      </GridViewWrapper>
    </div>
  );
}

export default GridView;
