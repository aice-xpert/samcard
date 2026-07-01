// Shared helpers for the in-progress "create card" draft.
//
// The create-card wizard persists content/design/qr to these `:draft`
// localStorage keys so a page reload restores unfinished work. NEW_CARD_SAVED_KEY
// records that the user explicitly clicked Save (content or design): saved drafts
// survive tab changes silently, unsaved ones warn before the user navigates away.

export const NEW_CARD_DRAFT_KEYS = [
  'businessProfile_v1:draft',
  'cardDesign_v1:draft',
  'samcard_qr_config_v1:draft',
  'selectedTemplate:draft',
] as const;

export const NEW_CARD_SAVED_KEY = 'samcard:newCardDraftSaved';

export function clearNewCardDraft(): void {
  try {
    [...NEW_CARD_DRAFT_KEYS, NEW_CARD_SAVED_KEY].forEach(k => localStorage.removeItem(k));
  } catch { /* ignore storage errors */ }
}

export function markNewCardDraftSaved(): void {
  try { localStorage.setItem(NEW_CARD_SAVED_KEY, '1'); } catch { /* quota */ }
}

export function newCardDraftSaved(): boolean {
  try { return localStorage.getItem(NEW_CARD_SAVED_KEY) === '1'; } catch { return false; }
}

// True if the content draft holds anything the user actually entered.
export function newCardDraftHasData(): boolean {
  try {
    const raw = localStorage.getItem('businessProfile_v1:draft');
    if (!raw) return false;
    return draftJsonHasData(raw);
  } catch { return false; }
}

// Pure core, split out so it can be unit-tested without touching localStorage.
export function draftJsonHasData(raw: string): boolean {
  const p = JSON.parse(raw) as Record<string, any>;
  const f = p.formData ?? {};
  const anyField = ['name', 'title', 'company', 'tagline', 'email', 'phone', 'website', 'headingText', 'bodyText']
    .some(k => typeof f[k] === 'string' && f[k].trim());
  const anyLink = Array.isArray(p.socialLinks) && p.socialLinks.some((s: any) => String(s?.value ?? s?.url ?? '').trim());
  const anyCustom = Array.isArray(p.customLinks) && p.customLinks.some((l: any) => String(l?.label ?? '').trim() || String(l?.url ?? '').trim());
  const anyExtra = Array.isArray(p.extraSections) && p.extraSections.length > 0;
  return anyField || !!p.profileImage || !!p.brandLogo || !!anyLink || !!anyCustom || !!anyExtra;
}
