# Card Template Workflow Guide

This guide explains how templates fit into the app and provides a complete example component to apply a template from Step 1 (Profile) so the design and content are prefilled for the user.

## Overview

- Templates are frontend presets (no backend changes required).
- A template provides `defaultDesign` (maps to `DesignSettings`) and `defaultContent` (partial `FormData`).
- The design cache key used across steps is `cardDesign_v1:draft` (localStorage). We also store the selected template id in `selectedTemplate:draft`.

## Files

- `src/data/cardTemplates.ts` — typed templates array (example templates included, e.g., "Ocean Executive").
- `src/components/TemplatePicker/TemplatePicker.tsx` — component shipped with this repo to pick and apply a template.
- `docs/template-workflow.md` — this guide.

## UX / Flow

1. Show a horizontal scrollable row of template thumbnails in `BusinessProfile.tsx` (Step 1).
2. When a user clicks a thumbnail call `applyTemplate(template)` which should:
   - write `template.defaultDesign` to `localStorage` under `cardDesign_v1:draft` (so `Design.tsx` picks it up);
   - write `template.id` to `selectedTemplate:draft` (optional, for analytics or previews);
   - merge `template.defaultContent` into the profile form state (e.g., `setFormData(prev => ({ ...prev, ...template.defaultContent }))`).
3. Trigger a re-render of the preview (the repo already renders `PhonePreview` using the cached design and form state).

## Integration snippet (BusinessProfile)

Below is a minimal integration example showing how to mount the picker and handle template application.

```tsx
// BusinessProfile.tsx (snippet)
import TemplatePicker from '@/components/TemplatePicker/TemplatePicker';
import { useState } from 'react';
import type { FormData } from '@/types/card';

function BusinessProfile() {
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const handleTemplateApply = (content: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...content }));
  };

  const handleDesignApply = (design: any) => {
    try {
      localStorage.setItem('cardDesign_v1:draft', JSON.stringify(design));
      localStorage.setItem('selectedTemplate:draft', design?.id ?? '');
    } catch (e) {
      console.error('failed to persist design', e);
    }
  };

  return (
    <div>
      <TemplatePicker onApply={handleTemplateApply} onDesignApply={handleDesignApply} />
      {/* rest of profile form that reads/writes `formData` */}
    </div>
  );
}

export default BusinessProfile;
```

## Notes

- `Design.tsx` should already read `cardDesign_v1:draft` from `localStorage`; if it's using a different cache key adapt accordingly.
- The `TemplatePicker` component dispatches a `template:applied` DOM event — other parts of the app can listen for this if they prefer event-driven updates.
- For thumbnails, consider generating SSR previews of `PhonePreview` per template and storing PNGs under `/public/templates/` for fast client-side thumbnails.

## Example template included

The repository already includes an `Ocean Executive` template in `src/data/cardTemplates.ts` with `defaultContent` and `defaultDesign`. You can extend that file with more templates as needed.

---
If you want, I can add the TemplatePicker to `BusinessProfile.tsx` directly and wire the form merging. Want me to do that now?
