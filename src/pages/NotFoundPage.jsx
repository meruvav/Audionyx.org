import { Link } from 'react-router-dom';
import Panel from '../components/Panel';

export default function NotFoundPage() {
  return (
    <Panel title="Page not found">
      <p>The page you requested does not exist.</p>
      <Link className="button-link" to="/">Return home</Link>
    </Panel>
  );
}
