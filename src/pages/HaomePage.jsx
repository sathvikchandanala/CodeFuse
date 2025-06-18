import { KeepAlive } from 'react-activation';
import Dashboard from './Dashboard';

export default function Homepage() {
  return (
    <KeepAlive id="dashboard">
      <Dashboard />
    </KeepAlive>
  );
}
