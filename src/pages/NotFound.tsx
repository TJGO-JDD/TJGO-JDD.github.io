import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo('Página no encontrada');
  return (
    <PageHeader eyebrow="Error 404" title={<>Esta ruta no existe <span className="text-muted">en el plano.</span></>}
      intro="Puede que el enlace haya cambiado con el rediseño del sitio.">
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        <Link to="/software" className="btn btn-ghost">Ver software</Link>
      </div>
    </PageHeader>
  );
}
