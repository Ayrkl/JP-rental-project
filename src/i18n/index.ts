import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES, NAMESPACES } from './config';

// Türkçe paketler
import trCommon from './locales/tr/common.json';
import trNavigation from './locales/tr/navigation.json';
import trDashboard from './locales/tr/dashboard.json';
import trProperties from './locales/tr/properties.json';
import trContracts from './locales/tr/contracts.json';
import trMap from './locales/tr/map.json';
import trValidation from './locales/tr/validation.json';
import trUsers from './locales/tr/users.json';
import trPortal from './locales/tr/portal.json';

// İngilizce paketler
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enProperties from './locales/en/properties.json';
import enContracts from './locales/en/contracts.json';
import enMap from './locales/en/map.json';
import enValidation from './locales/en/validation.json';
import enUsers from './locales/en/users.json';
import enPortal from './locales/en/portal.json';

const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code) as string[];

const savedLang = localStorage.getItem('i18n-lang');
const browserLang = navigator.language.split('-')[0];

const detectedLang = supportedCodes.includes(savedLang ?? '')
  ? savedLang!
  : supportedCodes.includes(browserLang)
  ? browserLang
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    tr: {
      common: trCommon,
      navigation: trNavigation,
      dashboard: trDashboard,
      properties: trProperties,
      contracts: trContracts,
      map: trMap,
      validation: trValidation,
      users: trUsers,
      portal: trPortal,
    },
    en: {
      common: enCommon,
      navigation: enNavigation,
      dashboard: enDashboard,
      properties: enProperties,
      contracts: enContracts,
      map: enMap,
      validation: enValidation,
      users: enUsers,
      portal: enPortal,
    },
  },
  lng: detectedLang,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: NAMESPACES,
  interpolation: { escapeValue: false },
  missingKeyHandler: import.meta.env.DEV
    ? (_lng: readonly string[], ns: string, key: string) =>
        console.warn(`[i18n] Missing key: ${ns}:${key}`)
    : undefined,
});

export default i18n;
