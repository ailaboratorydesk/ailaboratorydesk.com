/**
 * Site-wide settings. Change contact routes here, in one place.
 *
 * "Available for AI consulting" plus a working contact route must stay on the
 * site: it is the specimen for the AI LABORATORY trademark filing.
 */
export const SITE = {
  url: 'https://www.ailaboratorydesk.com',
  name: 'AI Laboratory',
  author: 'Daniel Stroup',
  title: 'AI Laboratory — Daniel Stroup',
  description:
    'Daniel Stroup builds real projects with AI across many fields — from concept to delivery, executed as intended. Available for AI consulting.',
  /** Default share image (Open Graph / Twitter card), served from public/. */
  ogImage: '/AI%20Lab%20Logo.png',
  ogImageAlt: 'AI Laboratory logo',
  linkedin: 'https://www.linkedin.com/in/daniel-stroup-11010366/',
  youtube: 'https://www.youtube.com/@AI_Laboratory_Desk',
  /**
   * FormSubmit endpoint for the contact form. This is the same action the
   * live site uses today. The LAB-3 pull request replaces it with FormSubmit's
   * random-string alias so the inbox address is no longer in the page source;
   * when porting LAB-3, change only this value.
   */
  contactFormAction: 'https://formsubmit.co/ailaboratorydesk@gmail.com',
} as const;
