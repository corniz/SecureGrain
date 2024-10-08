import { isLoggedIn, logout } from '../classes/Auth';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../images/grainsecure.png';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSystem = () => {
        navigate('/system');
    }

    const handleAccount = () => {
        navigate('/users');
    }

    return (
        <nav className="bg-customGreen max-w-7xl mx-auto rounded-full shadow-md py-5 px-8 mt-2">
            <div className="flex justify-between items-center">
                <div className="text-white font-semibold text-xl flex items-center">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-10 mr-1" />
                    </Link>
                    <span className="text-lg ml-2 flex items-center font-bold">SecureGrains</span>
                </div>
                {isLoggedIn() ? (
                    <ul className="flex space-x-4 flex items-center">
                        <li><a href="#" className="text-black hover:text-gray-500">Services</a></li>
                        <li><a href="#" className="text-black hover:text-gray-500">About</a></li>
                        <li><a href="#" className="text-black hover:text-gray-500">FAQ</a></li>
                        <li>
                            <button className="bg-white text-black py-2 px-5 rounded-full hover:bg-green-800" onClick={handleSystem}>System</button>
                        </li>
                        <li>
                            <button className="bg-white text-black py-2 px-5 rounded-full hover:bg-green-800" onClick={handleAccount}>Accounts</button>
                        </li>
                        <li>
                            <button className="bg-white text-black py-2 px-5 rounded-full hover:bg-green-800">Contact Us</button>
                        </li>
                        <li>
                            <button className="bg-green-500 text-white py-2 px-5 rounded-full hover:bg-green-800" onClick={handleLogout}>Log Out</button>
                        </li>
                    </ul>
                ) : (
                    <ul className="flex space-x-4 flex items-center">
                        <li><a href="#" className="text-black hover:text-gray-500">Services</a></li>
                        <li><a href="#" className="text-black hover:text-gray-500">About</a></li>
                        <li><a href="#" className="text-black hover:text-gray-500">FAQ</a></li>
                        <li>
                            <button onClick={() => navigate('/login')} className="bg-black text-white py-2 px-5 rounded-full hover:bg-green-800">Sign In</button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/register')} className="bg-white text-black py-2 px-5 rounded-full hover:bg-green-800">Sign Up</button>
                        </li>
                    </ul>
                )}
                
            </div>
        </nav>


    );
  }
  
  export default Navbar;