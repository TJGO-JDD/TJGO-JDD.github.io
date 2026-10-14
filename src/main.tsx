import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import './styles/index.css';
import { Layout } from './components/Layout';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Engineering = lazy(() => import('./pages/Engineering'));
const SoftwareCatalog = lazy(() => import('./pages/SoftwareCatalog'));
const SoftwareDetail = lazy(() => import('./pages/SoftwareDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Research = lazy(() => import('./pages/Research'));
const Lab = lazy(() => import('./pages/Lab'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sobre-mi', element: <About /> },
      { path: '/ingenieria', element: <Engineering /> },
      { path: '/software', element: <SoftwareCatalog /> },
      { path: '/software/:slug', element: <SoftwareDetail /> },
      { path: '/proyectos', element: <Projects /> },
      { path: '/proyectos/:slug', element: <ProjectDetail /> },
      { path: '/investigacion', element: <Research /> },
      { path: '/lab', element: <Lab /> },
      { path: '/contacto', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
);
