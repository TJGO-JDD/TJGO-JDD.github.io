/**
 * Datos generales del sitio. Edita aquí nombre, enlaces y redes.
 * Todos los enlaces provienen del sitio original (index.md).
 */
export const site = {
  brand: 'TJGO',
  tagline: 'Civil Engineering, Research & Technology',
  owner: 'Ñol Iván Juan de Dios Rojas',
  shortOwner: 'Iván Juan de Dios Rojas',
  labs: ['TJGO INFRATEC', 'JUAN DE DIOS GEOLAB'],
  university: 'Universidad Nacional de San Cristóbal de Huamanga (UNSCH)',
  url: 'https://tjgo-jdd.github.io',
  bio:
    'Ingeniero civil en formación por la Universidad Nacional de San Cristóbal de Huamanga, enfocado en automatización y programación aplicada a la ingeniería civil. Especializado en interoperabilidad de software y desarrollo de herramientas tecnológicas para optimizar procesos en proyectos de ingeniería. Creador de software de escritorio orientado a la automatización de tareas técnicas, integrando análisis estructural, procesamiento de datos y flujos de trabajo computacionales para mejorar la eficiencia y precisión en proyectos de ingeniería.',
  photo: '/assets/img/FOTO.png',
  fieldPhoto: '/assets/img/PROFILE_PHOTO.jpg',
  logo: '/assets/img/LOGO2.png',
  emblem: '/assets/img/savicon.png',
};

export type Social = { id: string; label: string; href: string };

export const socials: Social[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/TJGO-JDD' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@TJGO-JDD' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/%C3%B1ol-ivan-juan-de-dios-rojas-600b36273/' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/51917726087?text=Deseo%20informaci%C3%B3n%20sobre!%20....' },
  { id: 'x', label: 'X', href: 'https://x.com/ivanjuandedios1' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/ivan_jdd_tjgo/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/nolivan.juandediosrojas/' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@ivanjddhood' },
  { id: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/user/21crxkbqieguhc6ogdkcf4hey?si=nde5_d97ShukDvxHakioQQ' },
];

export const socialHref = (id: string) => socials.find((s) => s.id === id)?.href ?? '#';

export const nav = [
  { to: '/', label: 'Inicio' },
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/ingenieria', label: 'Ingeniería' },
  { to: '/software', label: 'Software' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/investigacion', label: 'Investigación' },
  { to: '/lab', label: 'Lab' },
  { to: '/contacto', label: 'Contacto' },
];

/** Herramientas que aparecen en el sitio original (logos en assets/img). */
export const toolStack = [
  { name: 'Python', img: '/assets/img/python logo.png' },
  { name: 'Jupyter', img: '/assets/img/jupyter logo.png' },
  { name: 'VS Code', img: '/assets/img/vs code logo.png' },
  { name: 'Google Colab', img: '/assets/img/colab logo.png' },
  { name: 'Anaconda', img: '/assets/img/anaconda logo.png' },
  { name: 'GitHub', img: '/assets/img/github logo.png' },
  { name: 'ETABS', img: '/assets/img/etabs logo.png' },
  { name: 'SAP2000', img: '/assets/img/sap2000 logo.png' },
  { name: 'SAFE', img: '/assets/img/safe logo.png' },
  { name: 'Revit', img: '/assets/img/revit logo.png' },
  { name: 'AutoCAD', img: '/assets/img/autocad logo1.png' },
  { name: 'Excel', img: '/assets/img/excel logo.png' },
  { name: 'LaTeX', img: '/assets/img/latex logo.png' },
  { name: 'Agisoft Metashape', img: '/assets/img/METASHAPE.jpeg' },
  { name: 'Global Mapper', img: '/assets/img/mapper.png' },
  { name: 'MATLAB', img: '/assets/img/logo matlab.png' },
];
