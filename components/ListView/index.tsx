'use client';

import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import Image from 'next/image';
import styled, { css } from 'styled-components';

type User = NexusGenFieldTypes['User'];

interface ListViewProps {
  items: {
    id: string;
    name: string;
    imageUrl: string;
    imagePlaceholder: string;
    avgRating: number;
  }[];
}

// display a ListView that displays items like a barchart
// the items are sorted by avgRating
// in the background of the bar item, the user can see the image of the item
// where the percentage of the bar is the avgRating
// the chart is not interactable

const ListView = ({ items }: ListViewProps) => {
  const maxRating = items.reduce((acc, cur) => {
    if (cur.avgRating > acc) {
      return cur.avgRating;
    }
    return acc;
  }, 0);
  return (
    <div className="relative h-full overflow-auto">
      <List>
        {items.map((item, index) => (
          <Item key={item.id}>
            <ImageContainer>
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                style={{
                  objectFit: 'cover',
                  // opacity: 0.2,
                }}
                placeholder="blur"
                blurDataURL={item.imagePlaceholder}
              />
            </ImageContainer>
            <BarContainer>
              <BarFilled
                style={{
                  flex: `${(item.avgRating / maxRating) * 100}%`,
                }}
              />
              <BarRest
                style={{
                  flex: `${(1 - item.avgRating / maxRating) * 100}%`,
                }}
              />
              {/* item name with ranking and percentage 1. name (60%) */}

              <BarText>
                <Ranking>{`${index + 1}. `}</Ranking>
                {`${item.name} (${Math.round(
                  (item.avgRating / maxRating) * 100
                )}%)`}
              </BarText>
            </BarContainer>
          </Item>
        ))}
      </List>
    </div>
  );
};

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  align-items: flex-end;

  height: 4rem;
  width: 100%;
  overflow: hidden;
  border-radius: 1rem;
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${(p) =>
    p.blurred &&
    css`
      filter: blur(0.15rem);
    `}
`;

const BarContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
`;

const BarFilled = styled.div``;

const BarRest = styled.div`
  background-color: rgba(255, 255, 255, 0.9);

  backdrop-filter: blur(0.1rem);
`;

const BarText = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0.5rem;

  background-color: rgba(255, 255, 255, 0.9);
`;

const Ranking = styled.span`
  font-weight: 700;
`;

export default ListView;
