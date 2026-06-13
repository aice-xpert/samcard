import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedHeader } from '../Header';

describe('EnhancedHeader Component', () => {
  const defaultProps = {
    title: 'Dashboard',
    subtitle: 'Dashboard / Home',
  };

  it('renders with title and subtitle', () => {
    render(<EnhancedHeader {...defaultProps} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard / Home')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<EnhancedHeader {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search anything...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders notification badge', () => {
    render(<EnhancedHeader {...defaultProps} />);
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('renders user info', () => {
    render(<EnhancedHeader {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Pro Member')).toBeInTheDocument();
  });

  it('renders date filter when showDateFilter is true', () => {
    render(<EnhancedHeader {...defaultProps} showDateFilter={true} />);
    const dateFilter = screen.getByRole('combobox');
    expect(dateFilter).toBeInTheDocument();
  });

  it('does not render date filter when showDateFilter is false', () => {
    render(<EnhancedHeader {...defaultProps} showDateFilter={false} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('uses default subtitle when not provided', () => {
    render(<EnhancedHeader title="Test Title" />);
    expect(screen.getByText('Dashboard / Home')).toBeInTheDocument();
  });
});
