import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-1">
        <Outlet />
      </main>
      <footer className="border-t p-4 text-center text-sm text-gray-500">Alumni Tracking App</footer>
    </div>
  );
}
