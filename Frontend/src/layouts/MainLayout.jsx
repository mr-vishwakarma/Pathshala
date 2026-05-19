import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
    <div>
        <Navbar/>
        <main>
            <Outlet/>
        </main>
    </div>
}

export default MainLayout;