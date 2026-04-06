// Canonical NAP — single source of truth for all business data.
// NEVER re-type the phone number, address, or business name in any component.
// Always import from this file.

export const SITE_URL = 'https://redbirdlawnservice.com';

export const NAP = {
  name: 'Redbird Lawn Service',
  phone: '(314) 497-6152',
  phoneHref: 'tel:+13144976152',
  email: 'sales@redbirdlawnservic.com',
  address: {
    street: '[CONFIRM FROM GBP]',
    city: 'Wentzville',
    state: 'MO',
    zip: '63385',
    country: 'US',
  },
} as const;

export const SOCIAL = {
  facebook: '[CONFIRM FROM GBP]',
} as const;
