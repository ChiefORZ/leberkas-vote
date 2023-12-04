/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import GridView from '@/app/GridView.client';
import { useInteractionContext } from '@/providers/InteractionProvider';
import { useRatingContext } from '@/providers/RatingProvider';

vi.mock('@/providers/InteractionProvider');
vi.mock('@/providers/UserProvider');
vi.mock('@/providers/RatingProvider');

describe('GridView', () => {
  const items = [
    {
      avgRating: 3,
      id: '1',
      imagePlaceholder:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFDQJcG9AAAAABJRU5ErkJggg==',
      imageUrl: 'https://example.com/item1.jpg',
      name: 'Item 1',
    },
    {
      avgRating: 4,
      id: '2',
      imagePlaceholder:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFDQJcG9AAAAABJRU5ErkJggg==',
      imageUrl: 'https://example.com/item2.jpg',
      name: 'Item 2',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the items in a grid', () => {
    render(<GridView items={items} />);
    expect(screen.getAllByTestId('grid-item')).toHaveLength(2);
  });

  it('sorts the items by rating and name', () => {
    render(<GridView items={items} />);
    const itemNames = Array.from(screen.getAllByTestId('grid-item')).map((el) => el.textContent);
    expect(itemNames).toEqual(['Item 2', 'Item 1']);
  });

  it('calls the onRatingChange handler when a rating is selected', async () => {
    const user = userEvent.setup();
    const { handleOnRatingChange } = useRatingContext();
    const { handleAllowedToInteract } = useInteractionContext();
    // @ts-ignore because we are mocking
    handleAllowedToInteract.mockReturnValue(new Promise((resolve) => resolve(true)));
    render(<GridView items={items} />);

    const ratingHandle = await within(screen.getAllByTestId('grid-item').at(0)).findByTestId(
      'grid-item-rating-1',
    );
    await user.click(ratingHandle);

    await waitFor(() =>
      expect(handleOnRatingChange).toHaveBeenCalledWith({
        itemId: '2',
        rating: 1,
      }),
    );
  });
});
