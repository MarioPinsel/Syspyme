import { useAuth } from "../context/useAuth";
import HeaderPublic from "./HeaderPublic";
import HeaderUser from "./HeaderUser";
import HeaderEmployee from "./HeaderEmployee";
import HeaderDian from "./HeaderDian";

export default function HeaderSelector() {
    const { user } = useAuth();

    if (!user) return <HeaderPublic />;

    if (user.role === "admin") return <HeaderUser />;

    if (user.role === "employee") return <HeaderEmployee />;

    if (user.role === "dian") return <HeaderDian/>

    return <HeaderPublic />;
}
