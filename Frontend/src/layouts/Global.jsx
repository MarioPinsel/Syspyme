import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { Toaster } from 'sonner'

export default function AuthLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <Toaster position="bottom-left" />
        </>
    );
}
