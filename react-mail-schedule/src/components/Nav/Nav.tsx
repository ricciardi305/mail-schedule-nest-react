import { Button, NavLogo } from 'components';
import { Link } from 'react-router-dom';

export function Nav() {
  return (
    <nav className="w-full h-20 bg-gray-50 border-b border-gray-200 ">
      <div className="w-ful h-full max-w-7xl m-auto flex items-center justify-between self-center">
        <NavLogo />

        <div className="flex items-center gap-4">
          {' '}
          <Link to="/">
            <Button>Dashboard</Button>
          </Link>
          <Link to="/escrever-agora">
            {' '}
            <Button variant="light">Escrever Agora</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
