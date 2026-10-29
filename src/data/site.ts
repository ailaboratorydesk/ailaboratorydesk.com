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
   * Web3Forms endpoint for the contact form (static site, no server).
   * The access key is public by design (an alias for the inbox, not a secret),
   * so the inbox address does not appear in the page source.
   * Replace the placeholder with the real access key before merging.
   */
  contactFormAction: 'https://api.web3forms.com/submit',
  contactFormKey: 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER',
  contactFormSubject: 'New consultation inquiry — AI Laboratory',
  contactFormFromName: 'AI Laboratory website',
  /** Same-domain redirect after a successful submit (free plan); shows the #inquiry-sent message. */
  contactFormRedirect: 'https://www.ailaboratorydesk.com/#inquiry-sent',
} as const;
