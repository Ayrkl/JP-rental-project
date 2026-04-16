import 'i18next';
import type trCommon from './locales/tr/common.json';
import type trNavigation from './locales/tr/navigation.json';
import type trDashboard from './locales/tr/dashboard.json';
import type trProperties from './locales/tr/properties.json';
import type trContracts from './locales/tr/contracts.json';
import type trMap from './locales/tr/map.json';
import type trValidation from './locales/tr/validation.json';
import type trUsers from './locales/tr/users.json';
import type trPortal from './locales/tr/portal.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof trCommon;
      navigation: typeof trNavigation;
      dashboard: typeof trDashboard;
      properties: typeof trProperties;
      contracts: typeof trContracts;
      map: typeof trMap;
      validation: typeof trValidation;
      users: typeof trUsers;
      portal: typeof trPortal;
    };
  }
}
