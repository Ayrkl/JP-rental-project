export const NAMESPACES = ['common', 'navigation', 'dashboard', 'properties', 'contracts', 'map', 'validation', 'users', 'portal'] as const;
export type Namespace = typeof NAMESPACES[number];

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const;

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
