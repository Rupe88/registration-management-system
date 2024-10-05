
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Palm Mind Technology</div>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/dashboard"
              className={`text-white ${location.pathname === '/' ? 'font-bold border-b-2 border-white' : ''} hover:underline`}
            >
              Dashboard
            </Link>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
