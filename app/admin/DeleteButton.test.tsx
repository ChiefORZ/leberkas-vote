import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { gql, request } from 'graphql-request';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DeleteButton,
  DeleteItemMutation,
} from '@/app/admin/DeleteButton.client';

vi.mock('graphql-request', async (importOriginal) => {
  const orig = await importOriginal();

  return {
    // @ts-ignore
    ...orig,
    request: vi.fn(),
  };
});

describe('DeleteButton', () => {
  const item = { id: '1', deleted: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a button with a trash icon', () => {
    render(<DeleteButton item={item} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveAttribute('disabled', '');
    expect(screen.getByRole('button')).toContainElement(
      // get the svg element inside the button
      screen.getByTestId('trash-icon')
    );
  });

  it('calls the deleteItem mutation when clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteButton item={item} />);
    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(request).toHaveBeenCalledWith('/api', DeleteItemMutation, {
      id: item.id,
    });
  });
});
