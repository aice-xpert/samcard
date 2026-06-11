import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComprehensiveDashboard } from '../Dashboard';

vi.mock('next/image', () => ({
  default: (props: { src: string; alt: string; width: number; height: number }) => (
    <img {...props} />
  ),
}));

describe('ComprehensiveDashboard Component', () => {
  it('renders welcome banner with user name', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
  });

  it('displays profile completion progress', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Profile Completion')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('renders all four stats cards', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Total NFC Taps')).toBeInTheDocument();
    expect(screen.getByText('Unique Visitors')).toBeInTheDocument();
    expect(screen.getByText('Profile Views')).toBeInTheDocument();
    expect(screen.getByText('Leads')).toBeInTheDocument();
  });

  it('displays stat values correctly', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getAllByText('2,547').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1,892').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3,421').length).toBeGreaterThan(0);
    expect(screen.getAllByText('189').length).toBeGreaterThan(0);
  });

  it('shows trend indicators on stats cards', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getAllByText('+12.5%')).toHaveLength(1);
    expect(screen.getAllByText('+8.2%')).toHaveLength(1);
    expect(screen.getAllByText('+24.1%')).toHaveLength(1);
    expect(screen.getAllByText('+5.3%')).toHaveLength(1);
  });

  it('renders Engagement Analytics section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Engagement Analytics')).toBeInTheDocument();
    expect(screen.getByText('Track your performance over time')).toBeInTheDocument();
  });

  it('renders Conversion Funnel section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Conversion Funnel')).toBeInTheDocument();
    expect(screen.getByText('7.4% end-to-end')).toBeInTheDocument();
  });

  it('renders Device Distribution section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Device Distribution')).toBeInTheDocument();
    expect(screen.getByText('iOS')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();
    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('renders Top Locations section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Top Locations')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('renders Recent Card Taps section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Recent Card Taps')).toBeInTheDocument();
    expect(screen.getByText('Sarah Anderson')).toBeInTheDocument();
    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    expect(screen.getByText('Emma Wilson')).toBeInTheDocument();
  });

  it('renders Most Clicked Links section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Most Clicked Links')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('renders Smart Insights section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Smart Insights')).toBeInTheDocument();
    expect(screen.getByText('Add Instagram Stories Link')).toBeInTheDocument();
    expect(screen.getByText('Complete Your Portfolio')).toBeInTheDocument();
  });

  it('renders Month-over-Month Performance section', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Month-over-Month Performance')).toBeInTheDocument();
    expect(screen.getByText('Taps')).toBeInTheDocument();
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Leads')).toBeInTheDocument();
    expect(screen.getByText('Link Clicks')).toBeInTheDocument();
  });

  it('renders Goals section with progress bars', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByText('Monthly Goal')).toBeInTheDocument();
    expect(screen.getByText('Weekly Challenge')).toBeInTheDocument();
    expect(screen.getByText('67% Complete')).toBeInTheDocument();
    expect(screen.getByText('82% Complete')).toBeInTheDocument();
  });

  it('renders View All button in Recent Card Taps', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument();
  });

  it('renders date range filter buttons', () => {
    render(<ComprehensiveDashboard />);
    expect(screen.getByRole('button', { name: /30 days/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /7 days/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /90 days/i })).toBeInTheDocument();
  });
});
