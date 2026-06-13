import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../Sidebar';

describe('Sidebar Component', () => {
  const defaultProps = {
    activePage: 'dashboard',
    onNavigate: vi.fn(),
  };

  it('renders logo and brand name', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Sam')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('renders all navigation menu items', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Digital business card')).toBeInTheDocument();
    expect(screen.getByText('My Cards')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Billing & Subscription')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('calls onNavigate when menu item is clicked', async () => {
    const onNavigate = vi.fn();
    render(<Sidebar {...defaultProps} onNavigate={onNavigate} />);
    
    await userEvent.click(screen.getByText('My Cards'));
    expect(onNavigate).toHaveBeenCalledWith('my-cards');
  });

  it('highlights the active menu item', () => {
    render(<Sidebar {...defaultProps} activePage="dashboard" />);
    const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardButton.className).toContain('bg-[');
  });

  it('renders badges for menu items', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('+12%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('New').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pro').length).toBeGreaterThan(0);
  });

  it('renders user profile section', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@company.com')).toBeInTheDocument();
  });

  it('renders Pro Plan badge', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Sidebar {...defaultProps} />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('calls onNavigate with logout when logout is clicked', async () => {
    const onNavigate = vi.fn();
    render(<Sidebar {...defaultProps} onNavigate={onNavigate} />);
    
    await userEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(onNavigate).toHaveBeenCalledWith('logout');
  });

  it('renders close button when onClose is provided', () => {
    const onClose = vi.fn();
    render(<Sidebar {...defaultProps} onClose={onClose} />);
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Sidebar {...defaultProps} onClose={onClose} />);
    
    await userEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
  });
});
