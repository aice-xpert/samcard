// Card templates — 10 distinct visual presets the user can pick from.
// Each template provides:
//  - defaultContent: form data and sections that will populate BusinessProfile
//  - defaultDesign:  CardDesignPayload-compatible design settings (these are
//                    written through Design's saveDesign pipeline so the
//                    PhonePreview AND the public /[slug] page both render the
//                    template's look)
//  - preview:        small visual descriptors used by TemplatePicker to draw a
//                    real mini-card for each template (no external images).

export type SocialLink = { platform: string; url: string };

export type SectionPreset =
  | { id: 'about';   type: 'about';   enabled: boolean; order: number; content: { text: string } }
  | { id: 'contact'; type: 'contact'; enabled: boolean; order: number; content: { email?: string; phone?: string } }
  | { id: 'social';  type: 'social';  enabled: boolean; order: number; content: Record<string, never> }
  | { id: 'links';   type: 'links';   enabled: boolean; order: number; content: { links: { label: string; url: string }[] } }
  | { id: 'heading'; type: 'heading'; enabled: boolean; order: number; content: { heading: string; body: string } };

export interface TemplateDesign {
  // matches CardDesignPayload from src/lib/api.ts
  palette: string;
  accentColor: string;
  accentLight: string;
  bgColor: string;
  cardColor: string;
  textPrimary: string;
  textMuted: string;
  phoneBgPreset: string; // 'aurora' | 'deep-space' | ... | 'custom'
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  phoneBgType: 'solid' | 'gradient';
  font: string;
  bodyFontSize: number;
  nameFontSize: number;
  boldHeadings: boolean;
  cardRadius: number;
  shadowIntensity: 'none' | 'soft' | 'medium' | 'strong';
  glowEffect: boolean;
}

export interface TemplateContent {
  name: string;
  jobTitle?: string;
  company?: string;
  tagline?: string;
  headingText?: string;
  bio?: string;
  profileImage?: string | null;
  brandLogo?: string | null;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  socialLinks: SocialLink[];
  sections: SectionPreset[];
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  // Used by TemplatePicker to render a real mini-preview tile (no images needed).
  preview: {
    bg: string;            // background fill / gradient
    accent: string;        // primary accent
    accentLight: string;   // secondary accent
    text: string;          // primary text color (on accent panel)
    panel: string;         // bottom info panel color
    layout:                // structural variant for the mini-preview
      | 'full-photo-wave'
      | 'side-panel'
      | 'top-banner'
      | 'circle-center'
      | 'dark-hero'
      | 'curve-photo'
      | 'group-photo'
      | 'torn-paper'
      | 'sky-circle'
      | 'gold-curve';
  };
  defaultContent: TemplateContent;
  defaultDesign: TemplateDesign;
}

const baseSections = (overrides: Partial<Record<'about' | 'contact' | 'social' | 'links', boolean>> = {}): SectionPreset[] => [
  { id: 'about',   type: 'about',   enabled: overrides.about   ?? true,  order: 1, content: { text: 'Passionate about delivering exceptional results and building meaningful relationships.' } },
  { id: 'contact', type: 'contact', enabled: overrides.contact ?? true,  order: 2, content: {} },
  { id: 'social',  type: 'social',  enabled: overrides.social  ?? true,  order: 3, content: {} },
  { id: 'links',   type: 'links',   enabled: overrides.links   ?? true,  order: 4, content: { links: [] } },
];

export const cardTemplates: CardTemplate[] = [
  // 1. Medical Teal — clean teal/green, full-bleed photo with curved bottom panel
  {
    id: 'medical-teal',
    name: 'Medical Teal',
    description: 'Clean medical & wellness — teal accents with a soft wave divider',
    preview: {
      bg: 'linear-gradient(180deg,#5fb3a8 0%,#2f7a72 50%,#1f4d4a 100%)',
      accent: '#0fa68a',
      accentLight: '#48d3b6',
      text: '#ffffff',
      panel: '#1f4d4a',
      layout: 'full-photo-wave',
    },
    defaultContent: {
      name: 'Dr. Aisha Khan',
      jobTitle: 'Cardiologist',
      company: 'MediCare Clinic',
      tagline: 'Caring for hearts, every beat matters.',
      headingText: 'About Me',
      bio: 'Board-certified cardiologist with 12+ years of experience in preventive heart care.',
      email: 'aisha@medicare.com',
      phone: '+1 (555) 222-7788',
      website: 'https://medicare.com',
      address: '500 Wellness Blvd, Boston, MA',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/aishakhan' },
        { platform: 'instagram', url: 'https://instagram.com/dr.aisha' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'medical-teal',
      accentColor: '#0fa68a',
      accentLight: '#48d3b6',
      bgColor: '#0e2826',
      cardColor: '#143a37',
      textPrimary: '#f0fffd',
      textMuted: '#9ad8cf',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#5fb3a8',
      phoneBgColor2: '#1f4d4a',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'inter',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: true,
      cardRadius: 18,
      shadowIntensity: 'soft',
      glowEffect: true,
    },
  },

  // 2. Teamwork Orange — orange/navy side panel
  {
    id: 'teamwork-orange',
    name: 'Teamwork Orange',
    description: 'Corporate side-panel layout — orange highlights on deep navy',
    preview: {
      bg: '#f5f5f7',
      accent: '#ff6a2c',
      accentLight: '#ffa472',
      text: '#ffffff',
      panel: '#15224a',
      layout: 'side-panel',
    },
    defaultContent: {
      name: 'Marcus Chen',
      jobTitle: 'Project Manager',
      company: 'Teamwork.Co',
      tagline: 'Building teams that ship great products.',
      headingText: 'About Me',
      bio: 'Agile enthusiast helping cross-functional teams hit their goals.',
      email: 'marcus@teamwork.co',
      phone: '+1 (555) 410-9911',
      website: 'https://teamwork.co',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/marcuschen' },
        { platform: 'twitter', url: 'https://twitter.com/marcuschen' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'teamwork-orange',
      accentColor: '#ff6a2c',
      accentLight: '#ffa472',
      bgColor: '#f5f5f7',
      cardColor: '#15224a',
      textPrimary: '#ffffff',
      textMuted: '#b8c1de',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#f5f5f7',
      phoneBgColor2: '#e8e8ee',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'poppins',
      bodyFontSize: 12,
      nameFontSize: 22,
      boldHeadings: true,
      cardRadius: 14,
      shadowIntensity: 'medium',
      glowEffect: false,
    },
  },

  // 3. Heritage Gold — real estate, gold/navy with curve and home icon
  {
    id: 'heritage-gold',
    name: 'Heritage Gold',
    description: 'Real-estate flair — gold curve over deep navy',
    preview: {
      bg: 'linear-gradient(180deg,#3a4a5e 0%,#0f1a2e 100%)',
      accent: '#e8b339',
      accentLight: '#ffd866',
      text: '#ffffff',
      panel: '#0f1a2e',
      layout: 'gold-curve',
    },
    defaultContent: {
      name: 'Olivia Bennett',
      jobTitle: 'Senior Real Estate Agent',
      company: 'Heritage Homes',
      tagline: 'Find your forever home.',
      headingText: 'About Me',
      bio: 'Helping families find homes they love for over a decade.',
      email: 'olivia@heritagehomes.com',
      phone: '+1 (555) 808-2244',
      website: 'https://heritagehomes.com',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/oliviab' },
        { platform: 'facebook', url: 'https://facebook.com/oliviab' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'heritage-gold',
      accentColor: '#e8b339',
      accentLight: '#ffd866',
      bgColor: '#0f1a2e',
      cardColor: '#16223d',
      textPrimary: '#fffaf0',
      textMuted: '#c2c8d6',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#3a4a5e',
      phoneBgColor2: '#0f1a2e',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'playfair',
      bodyFontSize: 12,
      nameFontSize: 26,
      boldHeadings: true,
      cardRadius: 12,
      shadowIntensity: 'medium',
      glowEffect: false,
    },
  },

  // 4. Team Pro — group photo, navy + orange accents
  {
    id: 'team-pro',
    name: 'Team Pro',
    description: 'Showcase a team — orange ribbon highlights over deep navy',
    preview: {
      bg: 'linear-gradient(180deg,#c1a98f 0%,#1a2a4f 60%)',
      accent: '#ff7e3d',
      accentLight: '#ffae80',
      text: '#ffffff',
      panel: '#0f1c3d',
      layout: 'group-photo',
    },
    defaultContent: {
      name: 'Sara Patel',
      jobTitle: 'Head of People Ops',
      company: 'Northwind Group',
      tagline: 'Together, we go further.',
      headingText: 'About Me',
      bio: 'Leading people-first cultures across distributed teams.',
      email: 'sara@northwind.com',
      phone: '+1 (555) 311-7700',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarapatel' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'team-pro',
      accentColor: '#ff7e3d',
      accentLight: '#ffae80',
      bgColor: '#0f1c3d',
      cardColor: '#172950',
      textPrimary: '#ffffff',
      textMuted: '#aab3cf',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#c1a98f',
      phoneBgColor2: '#1a2a4f',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'sora',
      bodyFontSize: 11,
      nameFontSize: 22,
      boldHeadings: true,
      cardRadius: 16,
      shadowIntensity: 'soft',
      glowEffect: false,
    },
  },

  // 5. Royal Purple — b&w photo over a violet curve
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Editorial vibe — purple curve under a monochrome portrait',
    preview: {
      bg: 'linear-gradient(180deg,#bdbdbd 0%,#7a4cd9 55%,#4d20a8 100%)',
      accent: '#7a4cd9',
      accentLight: '#a884f0',
      text: '#ffffff',
      panel: '#3b1d8a',
      layout: 'curve-photo',
    },
    defaultContent: {
      name: 'Naomi Reyes',
      jobTitle: 'Brand Strategist',
      company: 'Studio Lila',
      tagline: 'Bold ideas, considered design.',
      headingText: 'About Me',
      bio: 'Crafting brand stories that make people lean in.',
      email: 'naomi@studiolila.co',
      phone: '+1 (555) 999-3030',
      website: 'https://studiolila.co',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/studiolila' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/naomireyes' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'royal-purple',
      accentColor: '#7a4cd9',
      accentLight: '#a884f0',
      bgColor: '#1c0d3a',
      cardColor: '#2a1455',
      textPrimary: '#f8f6ff',
      textMuted: '#c8b8ee',
      phoneBgPreset: 'midnight-purple',
      phoneBgColor1: '#7a4cd9',
      phoneBgColor2: '#1c0d3a',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'raleway',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: true,
      cardRadius: 18,
      shadowIntensity: 'medium',
      glowEffect: true,
    },
  },

  // 6. Minimal Mono — circular avatar centered on cream
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    description: 'Less is more — circular avatar centered on a cream canvas',
    preview: {
      bg: '#f3efe7',
      accent: '#1a1a1a',
      accentLight: '#444444',
      text: '#1a1a1a',
      panel: '#ffffff',
      layout: 'circle-center',
    },
    defaultContent: {
      name: 'Emma Walsh',
      jobTitle: 'Photographer',
      company: 'Walsh Studio',
      tagline: 'Quiet stories, captured.',
      headingText: 'About Me',
      bio: 'Fine-art and editorial photography across natural light.',
      email: 'emma@walshstudio.com',
      phone: '+1 (555) 240-1188',
      website: 'https://walshstudio.com',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/walshstudio' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'minimal-mono',
      accentColor: '#1a1a1a',
      accentLight: '#444444',
      bgColor: '#f3efe7',
      cardColor: '#ffffff',
      textPrimary: '#1a1a1a',
      textMuted: '#6b6b6b',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#f3efe7',
      phoneBgColor2: '#e8e2d4',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'dm-sans',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: false,
      cardRadius: 22,
      shadowIntensity: 'soft',
      glowEffect: false,
    },
  },

  // 7. Sunset Banner — name banner above photo on navy
  {
    id: 'sunset-banner',
    name: 'Sunset Banner',
    description: 'Top banner over a hero photo — energetic orange on navy',
    preview: {
      bg: '#142243',
      accent: '#ff7a3a',
      accentLight: '#ffb380',
      text: '#ffffff',
      panel: '#142243',
      layout: 'top-banner',
    },
    defaultContent: {
      name: 'Jenna Ortega',
      jobTitle: 'Account Executive',
      company: 'Apex Sales',
      tagline: 'Closing deals with a smile.',
      headingText: 'About Me',
      bio: '8 years in B2B SaaS. Top performer 2023, 2024.',
      email: 'jenna@apexsales.com',
      phone: '+1 (555) 612-0099',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/jennaortega' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'sunset-banner',
      accentColor: '#ff7a3a',
      accentLight: '#ffb380',
      bgColor: '#142243',
      cardColor: '#1d2d57',
      textPrimary: '#ffffff',
      textMuted: '#b9c2dc',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#142243',
      phoneBgColor2: '#0a1430',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'poppins',
      bodyFontSize: 12,
      nameFontSize: 22,
      boldHeadings: true,
      cardRadius: 14,
      shadowIntensity: 'medium',
      glowEffect: false,
    },
  },

  // 8. Sky Circle — bright blue with circular avatar
  {
    id: 'sky-circle',
    name: 'Sky Circle',
    description: 'Friendly bright-blue card with circular portrait',
    preview: {
      bg: 'linear-gradient(180deg,#dde6ff 0%,#6c8bff 60%)',
      accent: '#5b78ff',
      accentLight: '#a8b8ff',
      text: '#ffffff',
      panel: '#5b78ff',
      layout: 'sky-circle',
    },
    defaultContent: {
      name: 'Zara Hill',
      jobTitle: 'UX Researcher',
      company: 'Bloom Labs',
      tagline: 'Listening to users, designing with empathy.',
      headingText: 'About Me',
      bio: 'Mixed-methods researcher focused on accessibility.',
      email: 'zara@bloomlabs.io',
      phone: '+1 (555) 707-1212',
      website: 'https://bloomlabs.io',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/zarahill' },
        { platform: 'twitter', url: 'https://twitter.com/zarahill' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'sky-circle',
      accentColor: '#5b78ff',
      accentLight: '#a8b8ff',
      bgColor: '#1a2148',
      cardColor: '#262e62',
      textPrimary: '#ffffff',
      textMuted: '#b8c0e8',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#dde6ff',
      phoneBgColor2: '#6c8bff',
      phoneBgAngle: 180,
      phoneBgType: 'gradient',
      font: 'inter',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: true,
      cardRadius: 20,
      shadowIntensity: 'soft',
      glowEffect: true,
    },
  },

  // 9. Onyx Pro — dark hero, navy + neon green
  {
    id: 'onyx-pro',
    name: 'Onyx Pro',
    description: 'Tech executive — deep onyx with neon green accents',
    preview: {
      bg: 'linear-gradient(180deg,#1a1a1a 0%,#0c1a14 100%)',
      accent: '#22d3a8',
      accentLight: '#7af0c8',
      text: '#ffffff',
      panel: '#0c1a14',
      layout: 'dark-hero',
    },
    defaultContent: {
      name: 'Jordan Lee',
      jobTitle: 'Full-stack Engineer',
      company: 'TechFlow Inc',
      tagline: 'Code that ships, systems that scale.',
      headingText: 'About Me',
      bio: 'TypeScript, Rust, and clean architecture advocate.',
      email: 'jordan@techflow.dev',
      phone: '+1 (555) 987-6543',
      website: 'https://jordanlee.dev',
      socialLinks: [
        { platform: 'github', url: 'https://github.com/jordanlee' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/jordanlee' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'onyx-pro',
      accentColor: '#22d3a8',
      accentLight: '#7af0c8',
      bgColor: '#0c1a14',
      cardColor: '#15261f',
      textPrimary: '#f0f0f0',
      textMuted: '#7da89a',
      phoneBgPreset: 'aurora',
      phoneBgColor1: '#1a1a1a',
      phoneBgColor2: '#0c1a14',
      phoneBgAngle: 160,
      phoneBgType: 'gradient',
      font: 'mono',
      bodyFontSize: 11,
      nameFontSize: 22,
      boldHeadings: true,
      cardRadius: 8,
      shadowIntensity: 'strong',
      glowEffect: true,
    },
  },

  // 10. Mocha Torn — brown/beige torn paper effect
  {
    id: 'mocha-torn',
    name: 'Mocha Torn',
    description: 'Boutique fashion — warm mocha with a torn-paper hero',
    preview: {
      bg: 'linear-gradient(180deg,#a78a6c 0%,#fdf6ec 60%)',
      accent: '#8a5a3a',
      accentLight: '#caa07c',
      text: '#ffffff',
      panel: '#8a5a3a',
      layout: 'torn-paper',
    },
    defaultContent: {
      name: 'Camille Rousseau',
      jobTitle: 'Stylist & Creative Director',
      company: 'Atelier Camille',
      tagline: 'Wearable poetry.',
      headingText: 'About Me',
      bio: 'Editorial styling and brand campaigns across Paris and NYC.',
      email: 'hello@ateliercamille.com',
      phone: '+1 (555) 444-9090',
      website: 'https://ateliercamille.com',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/ateliercamille' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'mocha-torn',
      accentColor: '#8a5a3a',
      accentLight: '#caa07c',
      bgColor: '#2a1a10',
      cardColor: '#fdf6ec',
      textPrimary: '#2a1a10',
      textMuted: '#8a7060',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#fdf6ec',
      phoneBgColor2: '#a78a6c',
      phoneBgAngle: 0,
      phoneBgType: 'gradient',
      font: 'playfair',
      bodyFontSize: 12,
      nameFontSize: 26,
      boldHeadings: true,
      cardRadius: 20,
      shadowIntensity: 'soft',
      glowEffect: false,
    },
  },
];

export const getTemplateById = (id: string | null | undefined): CardTemplate | undefined =>
  cardTemplates.find((t) => t.id === id);
