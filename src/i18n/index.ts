import translations from './pt-BR.json';

type Translations = typeof translations;

let current: Translations = translations;

export function t(path: string, params?: Record<string, string | number>) {
  const parts = path.split('.');
  let value: any = current as any;
  for (const p of parts) {
    value = value?.[p];
    if (value === undefined) break;
  }
  if (value === undefined) return path;
  if (params) {
    return String(value).replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''));
  }
  return String(value);
}

export function setLocale(newTranslations: Translations) {
  current = newTranslations;
}
