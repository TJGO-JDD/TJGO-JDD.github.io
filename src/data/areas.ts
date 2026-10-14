import type { AreaId } from './types';

export interface Area {
  id: AreaId;
  code: string;
  title: string;
  short: string;
  description: string;
  image: string;
  capabilities: string[];
}

export const areas: Area[] = [
  {
    id: 'estructuras',
    code: 'STR',
    title: 'Estructuras y puentes',
    short: 'Líneas de influencia, dinámica y análisis de vigas continuas.',
    description:
      'Herramientas para el análisis de puentes y estructuras: líneas de influencia de momentos, cortantes y reacciones para n tramos, respuesta dinámica de sistemas de un grado de libertad y diseño en concreto armado.',
    image: '/assets/img/BRIDGE.png',
    capabilities: ['Líneas de influencia', 'Cargas de carril', 'Dinámica SDOF', 'ETABS · SAP2000 · SAFE'],
  },
  {
    id: 'topografia',
    code: 'GEO',
    title: 'Topografía y fotogrametría',
    short: 'Levantamientos con dron, ortofotos, MDT/MDS y curvas de nivel.',
    description:
      'Levantamientos aéreos con DJI Matrice 4E, georreferenciación con GCP y procesamiento de ortomosaicos, nubes de puntos, MDT y MDS para expedientes técnicos.',
    image: '/assets/img/FOT1.jpg',
    capabilities: ['Ortofotos', 'MDT / MDS', 'Curvas de nivel', 'Volúmenes'],
  },
  {
    id: 'hidrologia',
    code: 'HYD',
    title: 'Hidrología e hidráulica',
    short: 'Delimitación de cuencas, morfometría y estadística hidrológica.',
    description:
      'Delimitación automática de cuencas con algoritmos D8, red de drenaje, parámetros morfométricos, hipsometría y ajuste de distribuciones teóricas de precipitación.',
    image: '/assets/img/HTJGO (12).png',
    capabilities: ['DEM · D8', 'Morfometría', 'Distribuciones teóricas', 'Reportes LaTeX'],
  },
  {
    id: 'vial',
    code: 'VIA',
    title: 'Ingeniería vial',
    short: 'Estudios de tráfico, ESAL y diseño geométrico DG-2018.',
    description:
      'Procesamiento de conteos vehiculares, demanda proyectada, factores de corrección y ESAL según la normativa del MTC; memorias de diseño geométrico de carreteras.',
    image: '/assets/img/TRAFIX1.png',
    capabilities: ['IMDA', 'ESAL', 'DG-2018', 'Civil 3D'],
  },
  {
    id: 'geotecnia',
    code: 'GTC',
    title: 'Geotecnia',
    short: 'Cimentaciones superficiales y capacidad portante.',
    description:
      'Diseño de zapatas aisladas, combinadas, conectadas y de muros considerando capacidad portante, pesos específicos y profundidad de desplante.',
    image: '/assets/img/ZAP2.png',
    capabilities: ['Zapatas', 'Capacidad portante', 'HP Prime'],
  },
  {
    id: 'software',
    code: 'SFT',
    title: 'Software y automatización',
    short: 'Aplicaciones de escritorio y reportes automáticos Python · LaTeX · Word.',
    description:
      'Desarrollo de software técnico propio e interoperabilidad: interfaces PyQt, automatización de reportes en LaTeX y Word, y programas para calculadora HP Prime.',
    image: '/assets/img/HTJGO (5).png',
    capabilities: ['Python · PyQt', 'LaTeX', 'Word / Excel', 'MATLAB'],
  },
];

export const findArea = (id: string) => areas.find((a) => a.id === id);
