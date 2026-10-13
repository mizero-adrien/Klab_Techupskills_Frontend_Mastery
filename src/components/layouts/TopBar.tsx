import { Link } from "react-router";
import { BRAND_NAME } from "../../config/brand";
import { MapPin, Truck, BadgePercent } from "lucide-react";

function TopBar(){
    return (
        <div className = "bg-slate-100 p-4 text-xs text-slate-500">
            <div className= "flex mx-auto max-w-7xl justify-between px-4 py-2">
                <p>Welcome to {BRAND_NAME}!</p>
                <div className = "hidden items-center gap-6 sm:flex">
                    <span className = "flex items-center gap-1">
                        <MapPin size = {14} className = "text-brand" />
                        Deliver to <b className  = "text-slate-700">Kigali</b>
                    </span>
                    <span className = "flex items-center gap-1">
                        <Truck size = {14} className = "text-brand" />
                        Track your order
                    </span>
                    <Link to = "/products" className = "flex items-center gap-1 hover:text-brand">
                        <BadgePercent size = {14} className = "text-brand" />
                        All offers
                    </Link>
                </div>

            </div>

        </div>
    )
}

export default TopBar;