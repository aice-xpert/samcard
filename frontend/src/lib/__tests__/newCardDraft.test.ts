import { describe, it, expect } from 'vitest';
import { draftJsonHasData } from '@/lib/newCardDraft';

describe('draftJsonHasData', () => {
  it('is false for an empty / default draft', () => {
    expect(draftJsonHasData(JSON.stringify({ formData: { name: '', title: '' } }))).toBe(false);
    expect(draftJsonHasData(JSON.stringify({}))).toBe(false);
    expect(draftJsonHasData(JSON.stringify({ socialLinks: [{ platform: 0, value: '' }], customLinks: [{ label: '', url: '' }] }))).toBe(false);
  });

  it('is true when the user entered any meaningful data', () => {
    expect(draftJsonHasData(JSON.stringify({ formData: { name: 'Zainab' } }))).toBe(true);
    expect(draftJsonHasData(JSON.stringify({ profileImage: 'https://x/y.png' }))).toBe(true);
    expect(draftJsonHasData(JSON.stringify({ brandLogo: 'data:...' }))).toBe(true);
    expect(draftJsonHasData(JSON.stringify({ socialLinks: [{ platform: 0, value: 'https://li/in' }] }))).toBe(true);
    expect(draftJsonHasData(JSON.stringify({ customLinks: [{ label: 'Site', url: '' }] }))).toBe(true);
    expect(draftJsonHasData(JSON.stringify({ extraSections: [{ id: 'a', type: 'extra-button' }] }))).toBe(true);
  });
});
