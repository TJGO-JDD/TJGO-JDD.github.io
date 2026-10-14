import type { Project } from './types';

const img = (n: string) => `/assets/img/${n}`;

/**
 * SELECTED ENGINEERING WORK
 * kind:
 *  - 'profesional'       → servicio o trabajo ejecutado para terceros.
 *  - 'desarrollo-propio' → herramienta/estudio desarrollado por TJGO.
 *  - 'academico'         → trabajo de curso o investigación universitaria.
 */
export const projects: Project[] = [
  {
    slug: 'fotogrametria-topografia-dron',
    title: 'Fotogrametría y topografía con dron',
    kind: 'profesional',
    discipline: 'Fotogrametría · Topografía',
    areas: ['topografia'],
    summary:
      'Levantamientos aéreos con DJI Matrice 4E y procesamiento geoespacial para expedientes técnicos, estudios definitivos e inversión pública y privada.',
    body: [
      'Especialista en fotogrametría aplicada a la ingeniería civil, con 3 años de experiencia en levantamientos aéreos mediante dron y procesamiento de información geoespacial para proyectos de infraestructura.',
      'Generación de ortofotos, modelos digitales del terreno (MDT), modelos digitales de superficie (MDS), curvas de nivel y nubes de puntos orientados a expedientes técnicos, estudios definitivos y proyectos de inversión pública y privada.',
    ],
    bullets: [
      {
        title: 'Equipamiento y método',
        items: [
          'Dron profesional DJI Matrice 4E.',
          'Planificación de vuelos fotogramétricos con control de traslape y GSD.',
          'Georreferenciación mediante puntos de control (GCP).',
          'Procesamiento de imágenes para ortomosaicos de alta precisión.',
          'Licencia correspondiente para operación de RPAS.',
        ],
      },
      {
        title: 'Productos',
        items: [
          'Ortofotos georreferenciadas de alta resolución.',
          'MDT y MDS.',
          'Curvas de nivel y nube de puntos densa.',
          'Cálculo de volúmenes y movimiento de tierras.',
          'Mapas topográficos listos para expedientes técnicos.',
        ],
      },
      {
        title: 'Competencias en Civil 3D',
        items: [
          'Diseño de explanaciones y modelado de superficies.',
          'Diseño preliminar de vías.',
          'Cálculo de cortes y rellenos.',
          'Integración topográfica en proyectos de ingeniería civil.',
        ],
      },
      {
        title: 'Aplicaciones',
        items: ['Infraestructura vial.', 'Saneamiento.', 'Habilitaciones urbanas.', 'Movimiento de tierras.', 'Supervisión y control de obra.'],
      },
    ],
    tags: ['DJI Matrice 4E', 'GCP', 'Ortofoto', 'MDT/MDS', 'Civil 3D', 'Metashape'],
    images: [img('FOT1.jpg'), img('FOT3.jpg'), img('FOT4.jpg'), img('FOT2.jpg')],
    links: [{ kind: 'whatsapp', label: 'Solicitar servicio', href: 'https://wa.me/51917726087?text=Deseo%20informaci%C3%B3n%20sobre!%20....' }],
  },
  {
    slug: 'analisis-hidrologico-cuencas',
    title: 'Análisis hidrológico y geomorfológico de cuencas',
    kind: 'desarrollo-propio',
    discipline: 'Hidrología · GIS',
    areas: ['hidrologia'],
    summary:
      'Delimitación automática de cuencas a partir de DEM, red de drenaje, parámetros morfométricos, hipsometría y memoria técnica automática.',
    body: [
      'Flujo completo de análisis de cuencas con HYDROTJGO: del modelo digital de elevación a la memoria técnica en LaTeX, con interpretación automática de los parámetros morfométricos e hidrológicos.',
    ],
    tags: ['DEM', 'D8', 'Morfometría', 'Hipsometría', 'LaTeX'],
    images: [img('HTJGO (12).png'), img('HTJGO (5).png'), img('HTJGO (30).png'), img('RP (8).png')],
    links: [
      { kind: 'pdf', label: 'Reporte (PDF)', href: '/PDF/HYDROTJGO.pdf' },
      { kind: 'github', label: 'CUENCASPRO', href: 'https://github.com/TJGO-JDD/CUENCASPRO' },
    ],
    relatedSoftware: 'hydrotjgo',
  },
  {
    slug: 'estudio-trafico-esal',
    title: 'Estudio de tráfico y cálculo de ESAL',
    kind: 'desarrollo-propio',
    discipline: 'Ingeniería vial',
    areas: ['vial'],
    summary:
      'Procesamiento de conteos vehiculares (Anexo 5 MTC), proyección de demanda, factores de corrección y ESAL según R.D. N° 10-2014-MTC/14.',
    body: [
      'Automatización del estudio de tráfico para expedientes viales: desde la ficha estándar de conteo hasta el número de repeticiones de ejes equivalentes y la memoria en LaTeX.',
    ],
    tags: ['IMDA', 'ESAL', 'MTC', 'Pavimentos', 'LaTeX'],
    images: [img('TRAFIX1.png'), img('TRAFIX4.png'), img('TRAFIX2.png')],
    links: [
      { kind: 'pdf', label: 'Memoria (PDF)', href: '/PDF/TRAFIXREPORT.pdf' },
      { kind: 'github', label: 'TRAFIX_V1', href: 'https://github.com/TJGO-JDD/TRAFIX_V1' },
    ],
    relatedSoftware: 'trafix',
  },
  {
    slug: 'lineas-influencia-puentes',
    title: 'Líneas de influencia en puentes continuos',
    kind: 'desarrollo-propio',
    discipline: 'Estructuras · Puentes',
    areas: ['estructuras'],
    summary:
      'Cálculo y animación de líneas de influencia de momentos, cortantes y reacciones para vigas de n tramos; base de TJGO Bridge Tools.',
    body: [
      'Herramientas computacionales que determinan la respuesta de vigas continuas ante una carga móvil, con métricas de valor máximo y áreas positiva y negativa para el posicionamiento de cargas de carril.',
    ],
    tags: ['Línea de influencia', 'Viga continua', 'Python', 'Jupyter'],
    images: [img('PG1.gif'), img('BRIDGE.png'), img('PG7.gif')],
    links: [
      { kind: 'pdf', label: 'Documento (PDF)', href: '/PDF/LI.pdf' },
      { kind: 'github', label: 'Repositorio', href: 'https://github.com/TJGO-JDD/LineasDeInfluenciPython' },
    ],
    relatedSoftware: 'tjgo-bridge-tools',
  },
  {
    slug: 'diseno-zapatas',
    title: 'Diseño de cimentaciones superficiales',
    kind: 'academico',
    discipline: 'Geotecnia · Concreto armado',
    areas: ['geotecnia', 'estructuras'],
    summary:
      'Programas HP Prime para zapatas aisladas, combinadas, conectadas y de muros: esfuerzos en el suelo, dimensionamiento y detallado.',
    body: [
      'Desarrollados en el curso de Concreto Armado II (UNSCH), integran capacidad portante, peso específico del suelo y del concreto, sobrecargas y profundidad de desplante para el diseño completo de la cimentación.',
    ],
    tags: ['HP Prime', 'Zapatas', 'Capacidad portante', 'Concreto armado'],
    images: [img('ZAP2.png'), img('ZAPATAAISLADA.gif'), img('ZAP12.png')],
    links: [
      { kind: 'github', label: 'Repositorio', href: 'https://github.com/TJGO-JDD/ZAPATAS-HP-PRIME' },
      { kind: 'drive', label: 'Descarga', href: 'https://drive.google.com/drive/folders/1kXZPhPcEOJm0wNkLVXE5Ml3qUSBW-hq9?usp=drive_link' },
    ],
    relatedSoftware: 'zapatas-hp-prime',
  },
  {
    slug: 'diseno-geometrico-dg2018',
    title: 'Memoria de diseño geométrico DG-2018',
    kind: 'academico',
    discipline: 'Ingeniería vial',
    areas: ['vial'],
    summary: 'Clasificación de la vía, velocidad de diseño, curvas y secciones transversales documentadas automáticamente en LaTeX.',
    body: ['Automatización de la memoria de diseño geométrico de carreteras según el Manual DG-2018. Proyecto en desarrollo.'],
    tags: ['DG-2018', 'Alineamiento', 'Python', 'LaTeX'],
    images: [img('DG2.png'), img('DG1.png'), img('DG3.png')],
    links: [
      { kind: 'pdf', label: 'Memoria (PDF)', href: '/PDF/DG2018.pdf' },
      { kind: 'github', label: 'Repositorio', href: 'https://github.com/TJGO-JDD/LATEX-DG-2018-' },
    ],
    relatedSoftware: 'dg-2018-report',
  },
  {
    slug: 'dinamica-sdof',
    title: 'Dinámica estructural de un grado de libertad',
    kind: 'academico',
    discipline: 'Dinámica estructural',
    areas: ['estructuras'],
    summary: 'Simulación interactiva de vibración libre y forzada con amortiguamiento en MATLAB.',
    body: ['Interfaz para estudiar el efecto de masa, rigidez, amortiguamiento y excitación sobre la respuesta de un sistema SDOF.'],
    tags: ['SDOF', 'MATLAB', 'Vibraciones'],
    images: [img('MATLAB2.jpeg'), img('MATLAB1.jpeg'), img('MATLAB3.jpeg')],
    links: [{ kind: 'github', label: 'Repositorio', href: 'https://github.com/TJGO-JDD/SISTEMA-DE-UN-GRADO-DE-LIBERTAD' }],
    relatedSoftware: 'sdof-matlab',
  },
];

export const kindLabel: Record<Project['kind'], string> = {
  profesional: 'Trabajo profesional',
  'desarrollo-propio': 'Desarrollo propio',
  academico: 'Académico',
};

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
