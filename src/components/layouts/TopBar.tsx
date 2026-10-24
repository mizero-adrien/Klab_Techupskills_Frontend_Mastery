import { Link } from "react-router";
import { BRAND_NAME } from "../../config/brand";
import { MapPin, Truck, BadgePercent } from "lucide-react";

function TopBar(){
    return (
        <div className = "bg-slate-100 text-xs text-white-smoke">
            <div className= "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
                <p className = "truncate">Welcome to {BRAND_NAME}!</p>
                <div className = "hidden shrink-0 items-center gap-6 sm:flex">
                    <span className = "flex items-center gap-1">
                        <MapPin size = {14} className = "text-brand" />
                        Deliver to <b className  = "text-slate-700">Kigali</b>
                    </span>
                    <span className = "flex items-center gap-1">
                        <Truck size = {14} className = "text-brand" />
                        Track your order
                    </span>
                    <Link to = "/products" className = "flex items-center gap-1 hover:text-brand">
                        <BadgePercent size = {14} className = "text-dark" />
                        All offers
                    </Link>
                </div>

            </div>

        </div>
    )
}

export default TopBar;