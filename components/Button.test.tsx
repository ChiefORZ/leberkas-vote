import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    const buttonRef = screen.getByRole('button');
    expect(buttonRef).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonRef = screen.getByRole('button');
    expect(buttonRef).toBeInTheDocument();
    await user.click(buttonRef);
    expect(handleClick).toHaveBeenCalled();
  });

  it('disables the button when loading is true', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when loading is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} loading>
        Click me
      </Button>
    );
    const buttonRef = screen.getByRole('button');
    expect(buttonRef).toBeInTheDocument();
    await user.click(buttonRef);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
