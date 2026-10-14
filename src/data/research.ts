import type { ResearchItem } from './types';

const img = (n: string) => `/assets/img/${n}`;
const REPO_INTERP = 'https://github.com/TJGO-JDD/INTERPOLACION-Y-APROXIMACION-LINEAL';
const REPO_1VAR = 'https://github.com/TJGO-JDD/SISTEMA-DE-ECUACIONES-DE-UNA-VARIABLE';
const REPO_NL = 'https://github.com/TJGO-JDD/SISTEMA-DE-ECUACIONES-NO-LINEAS';

/** Métodos numéricos y recursos académicos (contenido del sitio original). */
export const research: ResearchItem[] = [
  {
    slug: 'lagrange',
    title: 'Interpolación de Lagrange',
    group: 'Interpolación y aproximación',
    summary:
      'Construye un único polinomio que pasa por un conjunto de puntos mediante polinomios base. Adecuado cuando los puntos son pocos y el polinomio puede escribirse explícitamente.',
    tex: 'P(x)=\\sum_{i=0}^{n} y_i \\prod_{j\\neq i}\\frac{x-x_j}{x_i-x_j}',
    tool: 'MATLAB',
    images: [1, 2, 3, 4, 5].map((i) => img(`LAGRANGE${i}.png`)),
    links: [{ kind: 'github', label: 'Repositorio', href: REPO_INTERP }],
  },
  {
    slug: 'newton-interpolacion',
    title: 'Interpolación de Newton',
    group: 'Interpolación y aproximación',
    summary:
      'Usa diferencias divididas para construir el polinomio; puede extenderse al añadir nuevos puntos sin recalcular todo. Eficiente con datos no uniformes.',
    tex: 'P_n(x)=f[x_0]+\\sum_{k=1}^{n} f[x_0,\\dots,x_k]\\prod_{j=0}^{k-1}(x-x_j)',
    tool: 'MATLAB',
    images: [img('NEWTONIN.png')],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/NEWTONINTER.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_INTERP },
    ],
  },
  {
    slug: 'hermite',
    title: 'Interpolación de Hermite',
    group: 'Interpolación y aproximación',
    summary:
      'Utiliza los valores de la función y también sus derivadas en los nodos; útil cuando se conocen pendientes o la función original es suave.',
    tex: 'H(x_i)=f(x_i),\\qquad H\'(x_i)=f\'(x_i)',
    tool: 'MATLAB',
    images: [img('HERMITE.png')],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/HERMITE_IVAN.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_INTERP },
    ],
  },
  {
    slug: 'neville',
    title: 'Método de Neville',
    group: 'Interpolación y aproximación',
    summary: 'Esquema recursivo en tabla para interpolar en un solo punto sin construir el polinomio completo.',
    tex: 'P_{i,j}=\\frac{(x-x_{i-j})P_{i,j-1}-(x-x_i)P_{i-1,j-1}}{x_i-x_{i-j}}',
    tool: 'MATLAB',
    images: [],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/NEVILLE.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_INTERP },
    ],
  },
  {
    slug: 'biseccion',
    title: 'Método de bisección',
    group: 'Ecuaciones en una variable',
    summary:
      'Basado en el teorema del valor intermedio: si f(a)·f(b) < 0 existe una raíz en [a, b]. Divide el intervalo a la mitad en cada iteración; siempre converge.',
    tex: 'c=\\frac{a+b}{2},\\qquad f(a)\\,f(b)<0',
    tool: 'MATLAB',
    images: [4, 1, 2, 3].map((i) => img(`BISECCION${i}.png`)),
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/BISECCION.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_1VAR },
    ],
  },
  {
    slug: 'secante',
    title: 'Método de la secante',
    group: 'Ecuaciones en una variable',
    summary: 'Aproxima la derivada con dos puntos anteriores; no requiere calcular f\'(x).',
    tex: 'x_{n+1}=x_n-f(x_n)\\,\\frac{x_n-x_{n-1}}{f(x_n)-f(x_{n-1})}',
    tool: 'MATLAB',
    images: [img('SECANTE1.png'), img('SECANTE2.png')],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/SECANTE.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_1VAR },
    ],
  },
  {
    slug: 'newton-raphson',
    title: 'Método de Newton-Raphson',
    group: 'Ecuaciones en una variable',
    summary: 'Convergencia rápida mediante linealización con la derivada; requiere una buena aproximación inicial.',
    tex: 'x_{n+1}=x_n-\\frac{f(x_n)}{f\'(x_n)}',
    tool: 'MATLAB',
    images: [img('NEWTON1.png'), img('NEWTON2.png')],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/NEWTON.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_1VAR },
    ],
  },
  {
    slug: 'punto-fijo',
    title: 'Método de punto fijo',
    group: 'Ecuaciones en una variable',
    summary: 'Reescribe f(x)=0 como x=g(x) e itera desde x₀; la convergencia depende de la elección de g(x).',
    tex: 'x_{n+1}=g(x_n)',
    tool: 'MATLAB',
    images: [1, 2, 3].map((i) => img(`PUNTOFIJO${i}.png`)),
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/PUNTO_FIJO.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_1VAR },
    ],
  },
  {
    slug: 'broyden',
    title: 'Método de Broyden',
    group: 'Sistemas no lineales',
    summary: 'Cuasi-Newton: sustituye el Jacobiano exacto por una aproximación actualizada en cada iteración.',
    tex: 'B_{k+1}=B_k+\\frac{(\\Delta F_k-B_k\\Delta x_k)\\,\\Delta x_k^{T}}{\\Delta x_k^{T}\\Delta x_k}',
    tool: 'MATLAB',
    images: [],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/SENL_MB.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_NL },
    ],
  },
  {
    slug: 'newton-raphson-sistemas',
    title: 'Newton-Raphson para sistemas (3 variables)',
    group: 'Sistemas no lineales',
    summary: 'Linealiza el sistema con una expansión de Taylor y resuelve el sistema lineal con el Jacobiano en cada iteración.',
    tex: 'J(\\mathbf{x}_k)\\,\\Delta\\mathbf{x}_k=-\\mathbf{F}(\\mathbf{x}_k)',
    tool: 'MATLAB',
    images: [],
    links: [
      { kind: 'pdf', label: 'PDF', href: '/PDF/SENL_NR%20PARA_3_VARIABLES.pdf' },
      { kind: 'github', label: 'Repositorio', href: REPO_NL },
    ],
  },
];

export const academicResources = [
  {
    title: 'Plantillas LaTeX y Beamer — Prácticas preprofesionales (UNSCH)',
    summary:
      'Plantillas gratuitas para informes y presentaciones de prácticas preprofesionales de la UNSCH. Promueven herramientas libres, buenas prácticas de redacción técnica y ahorran tiempo en el formato.',
    images: [img('PRACPRO1.png'), img('PRACPRO2.png')],
    links: [
      { kind: 'pdf' as const, label: 'Informe (PDF)', href: '/PDF/PRACPRO1.pdf' },
      { kind: 'pdf' as const, label: 'Presentación (PDF)', href: '/PDF/PRACPRO2.pdf' },
      { kind: 'whatsapp' as const, label: 'Solicitar plantillas', href: 'https://wa.me/51917726087?text=Deseo%20informaci%C3%B3n%20sobre!%20....' },
    ],
  },
];
