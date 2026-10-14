import { Outlet } from "react-router";
import TopBar from "./TopBar";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginModal from "../auth/LoginModal";

function MainLayout(){
    return (
        <div className = "min-h-screen bg-white text-slate-800">
            <TopBar />
            <Header />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <LoginModal />
        </div>
    )
}
export default MainLayout;