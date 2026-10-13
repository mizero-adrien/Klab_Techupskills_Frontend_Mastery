import { Outlet } from "react-router";
import TopBar from "./TopBar";
import Header from "./Header";
import Navbar from "./Navbar";

function MainLayout(){
    return (
        <div className = "min-h-screen bg-white text-slate-800">
            <TopBar />
            <Header />
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
export default MainLayout;