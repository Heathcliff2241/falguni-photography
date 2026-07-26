export interface NavItem {
  label: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SectionContent {
  section_name: string;
  heading_tag: 'h1' | 'h2' | 'h3';
  headline: string;
  subheadline?: string;
  body_copy: string;
  cta_text?: string;
  cta_path?: string;
  image_source: string;
  image_alt_text: string;
  seo_notes?: string;
}

export interface PageData {
  name: string;
  url: string;
  purpose: string;
  meta_title: string;
  meta_description: string;
  sections: SectionContent[];
  faq_block: FaqItem[];
}

export interface PortfolioImage {
  id: string;
  title: string;
  category: 'newborn' | 'maternity' | 'family' | 'cake-smash';
  src: string;
  alt: string;
  description: string;
  rotation: string;
  aspect: string;
}

export interface BookingLead {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  serviceRequested: string;
  preferredDate?: string;
  babyDueDateOrBirthDate?: string;
  notes?: string;
  source: 'ai_poppy' | 'direct_form' | 'contact_page';
  transcript?: { sender: string; text: string; time: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'poppy';
  text: string;
  timestamp: string;
  bookingExtracted?: Partial<BookingLead>;
}
