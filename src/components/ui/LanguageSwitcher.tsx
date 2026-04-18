import { useTranslation } from 'react-i18next';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18n-lang', code);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center justify-center p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none"
          aria-label="Change language"
          title="Dili Değiştir"
        >
          <Globe className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-[9999] min-w-[140px] rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-xl p-1 animate-in fade-in-0 zoom-in-95"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenu.Item
              key={lang.code}
              onSelect={() => handleChange(lang.code)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none transition-colors ${
                i18n.language === lang.code
                  ? 'bg-[#1e1e1e] text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-zinc-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
