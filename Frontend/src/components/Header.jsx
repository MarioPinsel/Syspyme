import './Header.css';
import { FaUser, FaRightToBracket } from "react-icons/fa6";

export default function Header() {

    return (
        <>
            <header className="barranav">
                <div className="left">
                    <div className="logo">
                        <img src="/Logo S.png" alt="Logo S" />
                    </div>
                    <div className="sep"/>
                    <nav className="navegacion">
                        <a href="#">INICIO</a>
                        <a href="#">PLANES</a>
                        <a href="#">ABOUT US</a>
                    </nav>
                </div>
                <div className="iconos">
                    <FaUser />
                    <FaRightToBracket />
                </div>
            </header>
        </>
    );
}
