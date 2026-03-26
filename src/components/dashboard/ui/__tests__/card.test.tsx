import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';

describe('Card Component', () => {
  it('renders card with default styles', () => {
    render(<Card>Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-slot', 'card');
  });

  it('renders CardHeader', () => {
    render(<Card><CardHeader>Header Content</CardHeader></Card>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders CardTitle', () => {
    render(<CardTitle>My Card Title</CardTitle>);
    const title = screen.getByText('My Card Title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H4');
    expect(title).toHaveAttribute('data-slot', 'card-title');
  });

  it('renders CardContent', () => {
    render(<CardContent>Main Content</CardContent>);
    const content = screen.getByText('Main Content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-slot', 'card-content');
  });

  it('applies custom className', () => {
    render(<Card className="custom-card">Custom Card</Card>);
    const card = screen.getByText('Custom Card');
    expect(card.className).toContain('custom-card');
  });

  it('renders nested components correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Nested Title</CardTitle>
        </CardHeader>
        <CardContent>
          Nested Content
        </CardContent>
      </Card>
    );
    expect(screen.getByText('Nested Title')).toBeInTheDocument();
    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });
});
