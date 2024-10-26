import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { request } from 'graphql-request';
import { describe, expect, it, vi } from 'vitest';

import { PublishButton, PublishItemMutation } from '@/app/admin/PublishButton.client';

vi.mock('graphql-request', async (importOriginal) => {
  const orig = await importOriginal();

  return {
    // @ts-expect-error
    ...orig,
    request: vi.fn(),
  };
});

describe('PublishButton', () => {
  const item = { id: '1', published: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a button with a check icon', () => {
    render(<PublishButton item={item} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveAttribute('disabled', '');
    expect(screen.getByRole('button')).toContainElement(
      // get the svg element inside the button
      screen.getByTestId('check-icon'),
    );
  });

  it('calls the publishItem mutation when clicked', async () => {
    const user = userEvent.setup();

    render(<PublishButton item={item} />);
    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(request).toHaveBeenCalledWith('http://localhost:3000/api', PublishItemMutation, {
      id: item.id,
    });
  });
});
