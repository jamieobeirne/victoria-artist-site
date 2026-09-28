// The public site's two languages. Spanish is the default and the fallback:
// anything but an explicit "en" in the cookie means Spanish.
//
// Only the public site is translated. The admin panel is Victoria's alone and
// stays in Spanish, and so does the text she uploads (titles and descriptions
// are stored once, with no language attached).
export type Lang = 'es' | 'en'

// Set by components/LangToggle.tsx only when a visitor picks a language. The
// Privacidad page describes this cookie; keep the two in step.
export const LANG_COOKIE = 'lang'

export function parseLang(value: string | undefined | null): Lang {
  return value === 'en' ? 'en' : 'es'
}

const es = {
  language: 'Idioma',
  mainMenu: 'Menú principal',
  secondaryNav: 'Navegación secundaria',
  home: 'Inicio',
  work: 'Trabajo',
  projects: 'Proyectos',
  statement: 'Statement',
  cv: 'CV',
  bio: 'Bio',
  fullCv: 'CV extendido',
  enter: 'Entrar',
  untitled: 'Sin título',
  featuredWork: 'Obra destacada',
  selectedWork: 'Obra seleccionada',
  galleryError: 'No se pudo cargar la galería en este momento.',
  retry: 'Reintentar',
  enlarge: 'Ampliar imagen',
  enlarged: 'ampliada',
  close: 'Cerrar',
  entryImages: 'Imágenes de la entrada',
  social: 'Redes sociales',
  showEmail: 'Mostrar dirección de correo',
  hideEmail: 'Ocultar dirección de correo',
  copy: 'copiar',
  copied: 'copiado',
  siteDescription: 'Portafolio de Victoria Ruiz Diaz',
}

type Dictionary = Record<keyof typeof es, string>

const en: Dictionary = {
  language: 'Language',
  mainMenu: 'Main menu',
  secondaryNav: 'Secondary navigation',
  home: 'Home',
  work: 'Work',
  projects: 'Projects',
  statement: 'Statement',
  cv: 'CV',
  bio: 'Bio',
  fullCv: 'Full CV',
  enter: 'Enter',
  untitled: 'Untitled',
  featuredWork: 'Featured work',
  selectedWork: 'Selected work',
  galleryError: 'The gallery could not be loaded right now.',
  retry: 'Try again',
  enlarge: 'Enlarge image',
  enlarged: 'enlarged',
  close: 'Close',
  entryImages: 'Images in this entry',
  social: 'Social media',
  showEmail: 'Show email address',
  hideEmail: 'Hide email address',
  copy: 'copy',
  copied: 'copied',
  siteDescription: 'Portfolio of Victoria Ruiz Diaz',
}

export const dict: Record<Lang, Dictionary> = { es, en }
