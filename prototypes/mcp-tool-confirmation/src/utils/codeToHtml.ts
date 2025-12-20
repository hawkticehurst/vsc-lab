import { type BuiltinTheme, type BundledLanguage, codeToHtml, type ShikiTransformer } from 'shiki'

export async function convertCodeToHtml(code: string, lang: BundledLanguage, theme: { light: BuiltinTheme, dark: BuiltinTheme }, transformers?: ShikiTransformer[]) {
  return await codeToHtml(code, {
    lang,
    themes: {
      light: theme.light,
      dark: theme.dark,
    },
    transformers,
  })
}