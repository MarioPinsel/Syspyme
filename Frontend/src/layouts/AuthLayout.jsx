import { Outlet } from 'react-router-dom';
import Header from '../components/header.jsx';

export default function AuthLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
