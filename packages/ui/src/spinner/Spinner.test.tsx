import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces its accessible label', () => {
    render(<Spinner label="正在发布" />);

    expect(screen.getByRole('status')).toHaveTextContent('正在发布');
  });
});
