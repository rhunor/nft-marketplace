export const namespaces = [
  'common',
  'home',
  'explore',
  'nftDetail',
  'collection',
  'dashboard',
  'upload',
  'fund',
  'auth',
  'legal',
  'about',
  'contact',
  'help',
] as const;

export type Namespace = (typeof namespaces)[number];
