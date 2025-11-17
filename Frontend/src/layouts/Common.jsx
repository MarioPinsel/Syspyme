import { Outlet } from "react-router-dom";
import HeaderSelector from "../components/HeaderSelector";
import Footer from "./Footer"
import { Toaster } from "sonner"

export default function Common() {
    return (
        <>
            <HeaderSelector />
            <Outlet />
            <Footer />
            <Toaster position="bottom-left" />
        </>
    );
}
