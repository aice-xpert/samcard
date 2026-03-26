import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyCardsNew } from '../MyCards';

describe('MyCardsNew Component', () => {
  it('renders page title and card count', () => {
    render(<MyCardsNew />);
    expect(screen.getByText('My Cards')).toBeInTheDocument();
    expect(screen.getByText(/of 3 cards/)).toBeInTheDocument();
  });

  it('renders Create New Card button', () => {
    render(<MyCardsNew />);
    expect(screen.getByRole('button', { name: /create new card/i })).toBeInTheDocument();
  });

  it('renders all initial cards', () => {
    render(<MyCardsNew />);
    expect(screen.getAllByText('Primary Business Card').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Personal Card').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Event Networking Card').length).toBeGreaterThan(0);
  });

  it('renders search input', () => {
    render(<MyCardsNew />);
    const searchInput = screen.getByPlaceholderText('Search cards...');
    expect(searchInput).toBeInTheDocument();
  });

  it('filters cards based on search input', async () => {
    render(<MyCardsNew />);
    const searchInput = screen.getByPlaceholderText('Search cards...');
    
    await userEvent.type(searchInput, 'Primary');
    expect(screen.getAllByText('Primary Business Card').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Personal Card').length).toBe(0);
    expect(screen.getAllByText('Event Networking Card').length).toBe(0);
  });

  it('opens create card modal when Create button is clicked', async () => {
    render(<MyCardsNew />);
    
    await userEvent.click(screen.getByRole('button', { name: /create new card/i }));
    expect(screen.getByText('Create New Card')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Conference Card')).toBeInTheDocument();
  });

  it('creates a new card with the provided title', async () => {
    render(<MyCardsNew />);
    
    await userEvent.click(screen.getByRole('button', { name: /create new card/i }));
    await userEvent.type(screen.getByPlaceholderText('e.g. Conference Card'), 'Conference Card');
    await userEvent.click(screen.getByRole('button', { name: /create card/i }));
    
    expect(screen.getAllByText('Conference Card').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/of 4 cards/).length).toBeGreaterThan(0);
  });

  it('shows toast notification when card is created', async () => {
    render(<MyCardsNew />);
    
    await userEvent.click(screen.getByRole('button', { name: /create new card/i }));
    await userEvent.type(screen.getByPlaceholderText('e.g. Conference Card'), 'New Card');
    await userEvent.click(screen.getByRole('button', { name: /create card/i }));
    
    expect(await screen.findByText('New card created!')).toBeInTheDocument();
  });

  it('opens edit modal when Edit button is clicked', async () => {
    render(<MyCardsNew />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]);
    
    expect(screen.getByText('Edit Card')).toBeInTheDocument();
  });

  it('updates card title when edited', async () => {
    render(<MyCardsNew />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]);
    
    const titleInput = screen.getByRole('textbox');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Title');
    
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    
    expect(screen.getAllByText('Updated Title').length).toBeGreaterThan(0);
  });

  it('opens preview modal when Preview button is clicked', async () => {
    render(<MyCardsNew />);
    
    const previewButtons = screen.getAllByRole('button', { name: /preview/i });
    await userEvent.click(previewButtons[0]);
    
    expect(screen.getByText('Card Preview')).toBeInTheDocument();
  });

  it('opens share modal when Share button is clicked', async () => {
    render(<MyCardsNew />);
    
    const shareButtons = screen.getAllByRole('button', { name: /share/i });
    await userEvent.click(shareButtons[0]);
    
    expect(screen.getByText('Share Card')).toBeInTheDocument();
  });

  it('opens stats modal when Stats button is clicked', async () => {
    render(<MyCardsNew />);
    
    const statsButtons = screen.getAllByRole('button', { name: /stats/i });
    await userEvent.click(statsButtons[0]);
    
    expect(screen.getByText(/Stats — Primary Business Card/)).toBeInTheDocument();
  });

  it('opens delete confirmation when Delete is clicked', async () => {
    render(<MyCardsNew />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);
    
    expect(screen.getByText('Delete Card')).toBeInTheDocument();
    expect(screen.getByText('Are you sure? This cannot be undone.')).toBeInTheDocument();
  });

  it('deletes card when confirmed', async () => {
    render(<MyCardsNew />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);
    
    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    
    expect(screen.getAllByText('Primary Business Card').length).toBe(0);
    expect(screen.getAllByText(/of 2 cards/).length).toBeGreaterThan(0);
  });

  it('duplicates card when Duplicate is clicked', async () => {
    render(<MyCardsNew />);
    
    const duplicateLinks = screen.getAllByText('Duplicate');
    await userEvent.click(duplicateLinks[0]);
    
    expect(screen.getAllByText('(Copy)').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/of 4 cards/).length).toBeGreaterThan(0);
  });

  it('toggles card status with switch', async () => {
    render(<MyCardsNew />);
    
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);
    
    await userEvent.click(switches[0]);
  });

  it('shows no results message when search has no matches', async () => {
    render(<MyCardsNew />);
    
    const searchInput = screen.getByPlaceholderText('Search cards...');
    await userEvent.type(searchInput, 'NonExistentCard');
    
    expect(screen.getByText('No cards match your search.')).toBeInTheDocument();
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('clears filters when Clear filters is clicked', async () => {
    render(<MyCardsNew />);
    
    const searchInput = screen.getByPlaceholderText('Search cards...');
    await userEvent.type(searchInput, 'NonExistentCard');
    
    await userEvent.click(screen.getByText('Clear filters'));
    
    expect(searchInput).toHaveValue('');
    expect(screen.getAllByText('Primary Business Card').length).toBeGreaterThan(0);
  });

  it('closes modal when close button is clicked', async () => {
    render(<MyCardsNew />);
    
    await userEvent.click(screen.getByRole('button', { name: /create new card/i }));
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    
    expect(screen.queryByText('Create New Card')).not.toBeInTheDocument();
  });
});
