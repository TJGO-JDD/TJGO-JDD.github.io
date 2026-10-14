export type AreaId = 'estructuras' | 'topografia' | 'hidrologia' | 'vial' | 'geotecnia' | 'software';

export type LinkKind = 'github' | 'pdf' | 'drive' | 'youtube' | 'demo' | 'download' | 'whatsapp' | 'web';

export interface ExtLink {
  kind: LinkKind;
  label: string;
  href: string;
}

export type SoftwareStatus = 'estable' | 'en-desarrollo' | 'ficha-pendiente';

export interface Software {
  slug: string;
  name: string;
  version?: string;
  /** Categoría que se usa en los filtros del catálogo. */
  category: 'Hidrología' | 'Cartografía / GIS' | 'Ingeniería vial' | 'Estructuras' | 'Reportes técnicos' | 'Productividad';
  areas: AreaId[];
  status: SoftwareStatus;
  /** Frase corta para la tarjeta. */
  summary: string;
  /** Párrafos de descripción (texto del sitio original). */
  description: string[];
  features?: string[];
  /** Solo tecnologías declaradas en el repositorio original. */
  tech: string[];
  /** Capturas auténticas (rutas en /assets/img). La primera es la portada. */
  images: string[];
  links: ExtLink[];
  /** ID de un video de YouTube (solo la parte después de v=). */
  youtubeId?: string;
  featured?: boolean;
}

export type WorkKind = 'profesional' | 'desarrollo-propio' | 'academico';

export interface Project {
  slug: string;
  title: string;
  kind: WorkKind;
  discipline: string;
  areas: AreaId[];
  summary: string;
  body: string[];
  bullets?: { title: string; items: string[] }[];
  tags: string[];
  images: string[];
  links: ExtLink[];
  relatedSoftware?: string;
}

export interface ResearchItem {
  slug: string;
  title: string;
  group: string;
  summary: string;
  /** Ecuación representativa en LaTeX (KaTeX). */
  tex?: string;
  tool: string;
  images: string[];
  links: ExtLink[];
}
