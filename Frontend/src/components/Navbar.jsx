import { Link } from "react-router-dom";
const Navbar = () => {
    return(
        <nav className="bg-amber-50 shadow-emerald-100 px-4 flex items-center justify-between h-screen">
            <h1 className=" text-2xl font-semibold text-blue-600">
                Pathshla
            </h1>

            <div className="flex gap-4"></div>

            <Link to="/" className="text-grey-700 hover:text-blue-700">Home</Link>
            <Link to="/login" className="text-grey-700 hover:text-blue-700">Login</Link>
            <Link to="/register" className="text-grey-700 hover:text-blue-700">Register</Link>

        </nav>

    );

    
}

export default Navbar;