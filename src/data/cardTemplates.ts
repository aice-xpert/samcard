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
    bg: string;             // background CSS value (gradient or solid)
    accent: string;         // primary accent solid color (for SVG paths, borders)
    accentLight: string;    // secondary accent solid color
    accentGradient: string; // gradient for buttons, pills, highlights
    text: string;           // primary text color (on accent panel)
    panel: string;          // panel solid color (for SVG fill paths)
    panelGradient: string;  // gradient for info panels / bottom sections
    layout:                 // structural variant for the mini-preview
      | 'full-photo-wave'
      | 'side-panel'
      | 'top-banner'
      | 'circle-center'
      | 'dark-hero'
      | 'curve-photo'
      | 'group-photo'
      | 'torn-paper'
      | 'sky-circle'
      | 'gold-curve'
      | 'wave-logo-curve'
      | 'wave-badge-center'
      | 'photo-right-side'
      | 'hero-wave-icons'
      | 'slash-group';
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
      bg: 'linear-gradient(160deg, #0d5c54 0%, #1f4d4a 45%, #0e2e38 100%)',
      accent: '#0fa68a',
      accentLight: '#48d3b6',
      accentGradient: 'linear-gradient(135deg, #0fa68a 0%, #48d3b6 100%)',
      text: '#ffffff',
      panel: '#143835',
      panelGradient: 'linear-gradient(180deg, #1a4d47 0%, #0d2e2b 100%)',
      layout: 'full-photo-wave',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Cardiologist',
      company: 'MediCare Clinic',
      tagline: 'Caring for hearts, every beat matters.',
      headingText: 'About Me',
      bio: 'Board-certified cardiologist with 12+ years of experience in preventive heart care.',
      profileImage: '/profileImages/doctor-1.jpeg',
      brandLogo: '/brandLogos/logoipsum-327.png',
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
      bg: 'linear-gradient(150deg, #0a1428 0%, #12213d 60%, #1a1830 100%)',
      accent: '#ff6a2c',
      accentLight: '#ffa472',
      accentGradient: 'linear-gradient(135deg, #ff4500 0%, #ffa472 100%)',
      text: '#ffffff',
      panel: '#162250',
      panelGradient: 'linear-gradient(180deg, #1e2f6a 0%, #0e1840 100%)',
      layout: 'side-panel',
    },
    defaultContent: {
      name: 'Sarah',
      jobTitle: 'Project Manager',
      company: 'Teamwork.Co',
      tagline: 'Building teams that ship great products.',
      headingText: 'About Me',
      bio: 'Agile enthusiast helping cross-functional teams hit their goals.',
      profileImage: '/profileImages/female-2.jpg',
      brandLogo: '/brandLogos/logoipsum-339.png',
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
      bgColor: '#0a1428',
      cardColor: '#162250',
      textPrimary: '#ffffff',
      textMuted: '#c8d0e8',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#1a2a4a',
      phoneBgColor2: '#050c1a',
      phoneBgAngle: 160,
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
      bg: 'linear-gradient(160deg, #0f1a2e 0%, #1a2845 55%, #0c1220 100%)',
      accent: '#e8b339',
      accentLight: '#ffd866',
      accentGradient: 'linear-gradient(135deg, #c9922a 0%, #ffd866 100%)',
      text: '#ffffff',
      panel: '#0a1220',
      panelGradient: 'linear-gradient(180deg, #14203a 0%, #080e1a 100%)',
      layout: 'gold-curve',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Senior Real Estate Agent',
      company: 'Heritage Homes',
      tagline: 'Find your forever home.',
      headingText: 'About Me',
      bio: 'Helping families find homes they love for over a decade.',
      profileImage: '/profileImages/female-3.png',
      brandLogo: '/brandLogos/logoipsum-361.png',
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
      bg: 'linear-gradient(155deg, #0f1c3d 0%, #172950 50%, #0a1225 100%)',
      accent: '#ff7e3d',
      accentLight: '#ffae80',
      accentGradient: 'linear-gradient(135deg, #ff5500 0%, #ffae80 100%)',
      text: '#ffffff',
      panel: '#0f1c3d',
      panelGradient: 'linear-gradient(180deg, #172950 0%, #0a1225 100%)',
      layout: 'group-photo',
    },
    defaultContent: {
      name: 'John Frank',
      jobTitle: 'Head of People Ops',
      company: 'Northwind Group',
      tagline: 'Together, we go further.',
      headingText: 'About Me',
      bio: 'Leading people-first cultures across distributed teams.',
      profileImage: '/profileImages/male-2.jpg',
      brandLogo: '/brandLogos/logoipsum-397.png',
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
      phoneBgColor1: '#1f3060',
      phoneBgColor2: '#060e20',
      phoneBgAngle: 170,
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
      bg: 'linear-gradient(160deg, #1c0d3a 0%, #2e1560 55%, #130828 100%)',
      accent: '#7a4cd9',
      accentLight: '#a884f0',
      accentGradient: 'linear-gradient(135deg, #5e2fc0 0%, #c084fc 100%)',
      text: '#ffffff',
      panel: '#2a1455',
      panelGradient: 'linear-gradient(180deg, #3a1c72 0%, #1c0d3a 100%)',
      layout: 'sky-circle',
    },
    defaultContent: {
      name: 'Sarah Tess',
      jobTitle: 'Brand Strategist',
      company: 'Studio Lila',
      tagline: 'Bold ideas, considered design.',
      headingText: 'About Me',
      bio: 'Crafting brand stories that make people lean in.',
      profileImage: '/profileImages/female-1.jpg',
      brandLogo: '/brandLogos/logoipsum-413.png',
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

  // 6. Minimal Mono — circular avatar centered on dark mono canvas
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    description: 'Less is more — circular avatar centered on a dark mono canvas',
    preview: {
      bg: 'linear-gradient(145deg, #1a1a1a 0%, #242424 50%, #111111 100%)',
      accent: '#e0e0e0',
      accentLight: '#ffffff',
      accentGradient: 'linear-gradient(135deg, #888888 0%, #ffffff 100%)',
      text: '#ffffff',
      panel: '#282828',
      panelGradient: 'linear-gradient(180deg, #323232 0%, #1c1c1c 100%)',
      layout: 'circle-center',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Photographer',
      company: 'Walsh Studio',
      tagline: 'Quiet stories, captured.',
      headingText: 'About Me',
      bio: 'Fine-art and editorial photography across natural light.',
      profileImage: '/profileImages/female-4.png',
      brandLogo: '/brandLogos/logoipsum-415.png',
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
      accentColor: '#e0e0e0',
      accentLight: '#ffffff',
      bgColor: '#1a1a1a',
      cardColor: '#282828',
      textPrimary: '#ffffff',
      textMuted: '#888888',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#2a2a2a',
      phoneBgColor2: '#0a0a0a',
      phoneBgAngle: 150,
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
      bg: 'linear-gradient(160deg, #142243 0%, #1e3060 50%, #0a1430 100%)',
      accent: '#ff7a3a',
      accentLight: '#ffb380',
      accentGradient: 'linear-gradient(135deg, #ff4500 0%, #ffb380 100%)',
      text: '#ffffff',
      panel: '#142243',
      panelGradient: 'linear-gradient(180deg, #1e3060 0%, #0a1430 100%)',
      layout: 'top-banner',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Account Executive',
      company: 'Apex Sales',
      tagline: 'Closing deals with a smile.',
      headingText: 'About Me',
      bio: '8 years in B2B SaaS. Top performer 2023, 2024.',
      profileImage: '/profileImages/male-3.png',
      brandLogo: '/brandLogos/logoipsum-424.png',
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
      bg: 'linear-gradient(160deg, #1a2148 0%, #262e62 50%, #111830 100%)',
      accent: '#5b78ff',
      accentLight: '#a8b8ff',
      accentGradient: 'linear-gradient(135deg, #3a5bff 0%, #c0cbff 100%)',
      text: '#ffffff',
      panel: '#262e62',
      panelGradient: 'linear-gradient(180deg, #333f80 0%, #1a2148 100%)',
      layout: 'sky-circle',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'UX Researcher',
      company: 'Bloom Labs',
      tagline: 'Listening to users, designing with empathy.',
      headingText: 'About Me',
      bio: 'Mixed-methods researcher focused on accessibility.',
      profileImage: '/profileImages/male-4.png',
      brandLogo: '/brandLogos/logoipsum-427.png',
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
      phoneBgColor1: '#2a3268',
      phoneBgColor2: '#080d1e',
      phoneBgAngle: 165,
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
      bg: 'linear-gradient(160deg, #0c1a14 0%, #122212 50%, #060e0a 100%)',
      accent: '#22d3a8',
      accentLight: '#7af0c8',
      accentGradient: 'linear-gradient(135deg, #0aaf88 0%, #7af0c8 100%)',
      text: '#ffffff',
      panel: '#0c1a14',
      panelGradient: 'linear-gradient(180deg, #152a1e 0%, #060e0a 100%)',
      layout: 'dark-hero',
    },
    defaultContent: {
      name: 'John Frank',
      jobTitle: 'Full-stack Engineer',
      company: 'TechFlow Inc',
      tagline: 'Code that ships, systems that scale.',
      headingText: 'About Me',
      bio: 'TypeScript, Rust, and clean architecture advocate.',
      profileImage: '/profileImages/male-1.jpg',
      brandLogo: '/brandLogos/brand-2.png',
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
      bg: 'linear-gradient(160deg, #2a1a10 0%, #3d2516 55%, #1a0e08 100%)',
      accent: '#c4883c',
      accentLight: '#e8b97a',
      accentGradient: 'linear-gradient(135deg, #a0622a 0%, #f0c878 100%)',
      text: '#f5e8d8',
      panel: '#3d2516',
      panelGradient: 'linear-gradient(180deg, #50321e 0%, #2a1a10 100%)',
      layout: 'torn-paper',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Stylist & Creative Director',
      company: 'Atelier Camille',
      tagline: 'Wearable poetry.',
      headingText: 'About Me',
      bio: 'Editorial styling and brand campaigns across Paris and NYC.',
      profileImage: '/profileImages/alex-morgan.jpg',
      brandLogo: '/brandLogos/ACME.png',
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
      accentColor: '#c4883c',
      accentLight: '#e8b97a',
      bgColor: '#2a1a10',
      cardColor: '#3d2516',
      textPrimary: '#f5e8d8',
      textMuted: '#c4a882',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#3d2516',
      phoneBgColor2: '#0e0704',
      phoneBgAngle: 155,
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
  // 11. Navy Gold — S-curve wave with gold accents on deep navy, circular logo at wave
  {
    id: 'navy-gold',
    name: 'Navy Gold',
    description: 'Corporate prestige — gold wave divider with circular logo on deep navy',
    preview: {
      bg: 'linear-gradient(160deg, #0c1428 0%, #162040 50%, #080e1e 100%)',
      accent: '#e8b339',
      accentLight: '#ffd866',
      accentGradient: 'linear-gradient(135deg, #c9922a 0%, #ffd866 100%)',
      text: '#ffffff',
      panel: '#0c1428',
      panelGradient: 'linear-gradient(180deg, #14203a 0%, #080e1a 100%)',
      layout: 'wave-logo-curve',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Senior Real Estate Agent',
      company: 'Heritage Homes',
      tagline: 'Your dream home awaits.',
      headingText: 'About Me',
      bio: 'Helping families find their perfect home for over 15 years with dedication and expertise.',
      profileImage: '/profileImages/male-5.png',
      brandLogo: '/brandLogos/brand-3.png',
      email: 'alex@heritagehomes.com',
      phone: '+1 (555) 808-2244',
      website: 'https://heritagehomes.com',
      address: '200 Park Avenue, New York, NY',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/alexmorgan' },
        { platform: 'facebook', url: 'https://facebook.com/heritagehomes' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'navy-gold',
      accentColor: '#e8b339',
      accentLight: '#ffd866',
      bgColor: '#0c1428',
      cardColor: '#14203a',
      textPrimary: '#fffaf0',
      textMuted: '#c2c8d6',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#162040',
      phoneBgColor2: '#080e1a',
      phoneBgAngle: 170,
      phoneBgType: 'gradient',
      font: 'playfair',
      bodyFontSize: 12,
      nameFontSize: 26,
      boldHeadings: true,
      cardRadius: 16,
      shadowIntensity: 'medium',
      glowEffect: false,
    },
  },

  // 12. Emerald Wave — S-curve wave with emerald accents on dark teal, circular logo
  {
    id: 'emerald-wave',
    name: 'Emerald Wave',
    description: 'Medical elegance — emerald wave divider with circular logo on deep teal',
    preview: {
      bg: 'linear-gradient(160deg, #0a2e2b 0%, #14403c 50%, #061e1b 100%)',
      accent: '#2ec4a0',
      accentLight: '#5bdfcc',
      accentGradient: 'linear-gradient(135deg, #1aa888 0%, #5bdfcc 100%)',
      text: '#ffffff',
      panel: '#0a2e2b',
      panelGradient: 'linear-gradient(180deg, #123d38 0%, #061e1b 100%)',
      layout: 'wave-logo-curve',
    },
    defaultContent: {
      name: 'Sarah Tess',
      jobTitle: 'Cardiologist',
      company: 'TrustCare Medical',
      tagline: 'Caring for hearts, every beat matters.',
      headingText: 'About Me',
      bio: 'Board-certified cardiologist with 12+ years of experience in preventive heart care and wellness.',
      profileImage: '/profileImages/doctor-1.jpeg',
      brandLogo: '/brandLogos/logoipsum-397.png',
      email: 'sarah@trustcare.com',
      phone: '+1 (555) 222-7788',
      website: 'https://trustcare.com',
      address: '500 Wellness Blvd, Boston, MA',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarahtess' },
        { platform: 'instagram', url: 'https://instagram.com/dr.sarah' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'emerald-wave',
      accentColor: '#2ec4a0',
      accentLight: '#5bdfcc',
      bgColor: '#0a2e2b',
      cardColor: '#123d38',
      textPrimary: '#f0fffd',
      textMuted: '#9ad8cf',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#14403c',
      phoneBgColor2: '#061e1b',
      phoneBgAngle: 170,
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

  // 13. Azure Flow — bright blue wave panel, tech / corporate
  {
    id: 'azure-flow',
    name: 'Azure Flow',
    description: 'Crisp blue wave — clean tech and corporate style',
    preview: {
      bg: 'linear-gradient(160deg, #0c1e38 0%, #1a3258 50%, #091524 100%)',
      accent: '#2e9fe0',
      accentLight: '#7ad0f5',
      accentGradient: 'linear-gradient(135deg, #1a80cc 0%, #7ad0f5 100%)',
      text: '#ffffff',
      panel: '#0c1e38',
      panelGradient: 'linear-gradient(180deg, #18304c 0%, #091524 100%)',
      layout: 'full-photo-wave',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Product Manager',
      company: 'TechFlow Inc',
      tagline: 'Building products people love.',
      headingText: 'About Me',
      bio: 'Experienced product leader focused on user-centric design and scalable solutions.',
      profileImage: '/profileImages/female-2.jpg',
      brandLogo: '/brandLogos/logoipsum-361.png',
      email: 'alex@techflow.com',
      phone: '+1 (555) 123-4567',
      website: 'https://techflow.com',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/alexmorgan' },
        { platform: 'twitter', url: 'https://twitter.com/alexmorgan' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'azure-flow',
      accentColor: '#2e9fe0',
      accentLight: '#7ad0f5',
      bgColor: '#0c1e38',
      cardColor: '#182d4a',
      textPrimary: '#f0f8ff',
      textMuted: '#a0c8e8',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#1a3258',
      phoneBgColor2: '#091524',
      phoneBgAngle: 175,
      phoneBgType: 'gradient',
      font: 'sora',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: true,
      cardRadius: 16,
      shadowIntensity: 'medium',
      glowEffect: true,
    },
  },

  // 14. Rose Wave — warm rose wave panel, beauty / lifestyle / personal brand
  {
    id: 'rose-wave',
    name: 'Rose Wave',
    description: 'Warm rose wave — elegant personal branding and lifestyle',
    preview: {
      bg: 'linear-gradient(160deg, #2a0d1e 0%, #401428 55%, #180608 100%)',
      accent: '#e05880',
      accentLight: '#f5a0b8',
      accentGradient: 'linear-gradient(135deg, #c0304c 0%, #f5a0b8 100%)',
      text: '#ffffff',
      panel: '#2a0d1e',
      panelGradient: 'linear-gradient(180deg, #3d1228 0%, #180608 100%)',
      layout: 'full-photo-wave',
    },
    defaultContent: {
      name: 'Sophie Laurent',
      jobTitle: 'Creative Director',
      company: 'Maison Créative',
      tagline: 'Crafting beauty in every detail.',
      headingText: 'About Me',
      bio: 'Award-winning creative director blending art and commerce for luxury brands.',
      profileImage: '/profileImages/female-3.png',
      brandLogo: '/brandLogos/logoipsum-327.png',
      email: 'sophie@maisoncreative.com',
      phone: '+1 (555) 892-3344',
      website: 'https://maisoncreative.com',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/maisoncreative' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/sophielaurent' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'rose-wave',
      accentColor: '#e05880',
      accentLight: '#f5a0b8',
      bgColor: '#2a0d1e',
      cardColor: '#3d1228',
      textPrimary: '#fff5f7',
      textMuted: '#e0b0c0',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#401428',
      phoneBgColor2: '#180608',
      phoneBgAngle: 170,
      phoneBgType: 'gradient',
      font: 'raleway',
      bodyFontSize: 12,
      nameFontSize: 26,
      boldHeadings: true,
      cardRadius: 20,
      shadowIntensity: 'soft',
      glowEffect: true,
    },
  },

  // 15. Navy Amber — golden wave with badge on deep navy
  {
    id: 'navy-amber',
    name: 'Navy Amber',
    description: 'Professional golden wave — amber badge over deep navy',
    preview: {
      bg: 'linear-gradient(160deg, #0b1428 0%, #1a2845 55%, #070d1c 100%)',
      accent: '#f5c518',
      accentLight: '#ffe566',
      accentGradient: 'linear-gradient(135deg, #d4a210 0%, #ffe566 100%)',
      text: '#ffffff',
      panel: '#0b1428',
      panelGradient: 'linear-gradient(180deg, #14203a 0%, #070d1a 100%)',
      layout: 'wave-badge-center',
    },
    defaultContent: {
      name: 'Alex Morgan',
      jobTitle: 'Senior Consultant',
      company: 'Apex Advisory',
      tagline: 'Turning vision into results.',
      headingText: 'About Me',
      bio: 'Transforming businesses with strategic insight and hands-on leadership.',
      profileImage: '/profileImages/male-1.jpg',
      brandLogo: '/brandLogos/logoipsum-339.png',
      email: 'alex@apexadvisory.com',
      phone: '+1 (555) 320-4411',
      website: 'https://apexadvisory.com',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/alexmorgan' },
        { platform: 'twitter', url: 'https://twitter.com/alexmorgan' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'navy-amber',
      accentColor: '#f5c518',
      accentLight: '#ffe566',
      bgColor: '#0b1428',
      cardColor: '#14203a',
      textPrimary: '#fffdf0',
      textMuted: '#c8c0a0',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#1a2845',
      phoneBgColor2: '#070d1c',
      phoneBgAngle: 170,
      phoneBgType: 'gradient',
      font: 'playfair',
      bodyFontSize: 12,
      nameFontSize: 26,
      boldHeadings: true,
      cardRadius: 16,
      shadowIntensity: 'medium',
      glowEffect: false,
    },
  },

  // 16. Blush Soft — rose side-panel with light pink background
  {
    id: 'blush-soft',
    name: 'Blush Soft',
    description: 'Elegant rose side-panel — warm blush with red accents',
    preview: {
      bg: 'linear-gradient(160deg, #fdf0f3 0%, #fce8ee 50%, #fad8e4 100%)',
      accent: '#e8304a',
      accentLight: '#f5a0b8',
      accentGradient: 'linear-gradient(135deg, #cc1a30 0%, #f5a0b8 100%)',
      text: '#1a0a12',
      panel: '#fdf0f3',
      panelGradient: 'linear-gradient(180deg, #fce8ee 0%, #fad8e4 100%)',
      layout: 'photo-right-side',
    },
    defaultContent: {
      name: 'Sophie Laurent',
      jobTitle: 'Marketing Director',
      company: 'Maison Rose',
      tagline: 'Creating brands people love.',
      headingText: 'About Me',
      bio: 'Brand strategist and creative director with a passion for beautiful design.',
      profileImage: '/profileImages/female-1.jpg',
      brandLogo: '/brandLogos/logoipsum-424.png',
      email: 'sophie@maisonrose.com',
      phone: '+1 (555) 760-4422',
      website: 'https://maisonrose.com',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/maisonrose' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/sophielaurent' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'blush-soft',
      accentColor: '#e8304a',
      accentLight: '#f5a0b8',
      bgColor: '#fdf0f3',
      cardColor: '#fce4ec',
      textPrimary: '#1a0a12',
      textMuted: '#9a5060',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#fce8ee',
      phoneBgColor2: '#fad8e4',
      phoneBgAngle: 160,
      phoneBgType: 'gradient',
      font: 'raleway',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: true,
      cardRadius: 18,
      shadowIntensity: 'soft',
      glowEffect: false,
    },
  },

  // 17. Violet Pro — deep violet wave with floating social icons
  {
    id: 'violet-pro',
    name: 'Violet Pro',
    description: 'Bold violet wave — deep purple with floating social icons',
    preview: {
      bg: 'linear-gradient(160deg, #180832 0%, #281448 55%, #0e0520 100%)',
      accent: '#7040e0',
      accentLight: '#a880f8',
      accentGradient: 'linear-gradient(135deg, #5028c8 0%, #c084fc 100%)',
      text: '#ffffff',
      panel: '#200a38',
      panelGradient: 'linear-gradient(180deg, #2a1050 0%, #0e0520 100%)',
      layout: 'hero-wave-icons',
    },
    defaultContent: {
      name: 'Jordan Wei',
      jobTitle: 'UX Lead',
      company: 'Pixel Studio',
      tagline: 'Design that moves people.',
      headingText: 'About Me',
      bio: 'Award-winning UX designer crafting intuitive, beautiful digital experiences.',
      profileImage: '/profileImages/female-4.png',
      brandLogo: '/brandLogos/logoipsum-427.png',
      email: 'jordan@pixelstudio.io',
      phone: '+1 (555) 490-8833',
      website: 'https://pixelstudio.io',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/pixelstudio' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/jordanwei' },
      ],
      sections: baseSections(),
    },
    defaultDesign: {
      palette: 'violet-pro',
      accentColor: '#7040e0',
      accentLight: '#a880f8',
      bgColor: '#180832',
      cardColor: '#220a42',
      textPrimary: '#f8f4ff',
      textMuted: '#c0a8f0',
      phoneBgPreset: 'custom',
      phoneBgColor1: '#281448',
      phoneBgColor2: '#0e0520',
      phoneBgAngle: 175,
      phoneBgType: 'gradient',
      font: 'sora',
      bodyFontSize: 12,
      nameFontSize: 24,
      boldHeadings: true,
      cardRadius: 16,
      shadowIntensity: 'medium',
      glowEffect: true,
    },
  },

];

export const getTemplateById = (id: string | null | undefined): CardTemplate | undefined =>
  cardTemplates.find((t) => t.id === id);