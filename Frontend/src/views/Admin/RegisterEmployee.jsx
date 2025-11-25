import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Layouts/Auth.css";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegisterView() {

  
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        nombre: "",
        correo: "",
        handle: "",
        password: "",
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues,
    });

    const handleRegister = async (formData) => {
        setIsSubmitting(true);
           const normalizedData = {
            nombre: formData.nombre.trim(),              
            correo: formData.correo.trim().toLowerCase(), 
            handle: formData.handle.trim().toLowerCase(), 
            password: formData.password.trim(),
        };
        try {
            const token = Cookies.get("token")

            const { data } = await api.post(
                "/auth/registerUser",
                normalizedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(data.message);
        } catch (error) {
            if (isAxiosError(error) && error.response) {

                if (error.response.data.errors) {
                    toast.error(error.response.data.errors[0].msg);
                    setIsSubmitting(false);
                    return;
                }

                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                    setIsSubmitting(false);
                    return;
                }
            }
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Registrar Empleado</h2>

                <form onSubmit={handleSubmit(handleRegister)}>
                    <label>Nombre del Empleado</label>
                    <input
                        type="text"
                        {...register("nombre", {
                            required: "El nombre del empleado es obligatorio",
                        })}
                        placeholder="Ej: Juan Pérez"
                    />
                    {errors.nombre && (
                        <p className="error-message">{errors.nombre.message}</p>
                    )}

                    <label>Correo del Empleado</label>
                    <input
                        type="email"
                        {...register("correo", {
                            required: "El correo del empleado es obligatorio",
                        })}
                        placeholder="Ej: employee@empresa.com"
                    />
                    {errors.correo && (
                        <p className="error-message">{errors.correo.message}</p>
                    )}

                    <label>Handle o Identificador</label>
                    <input
                        type="text"
                        {...register("handle", {
                            required: "El identificador es obligatorio",
                        })}
                        placeholder="Ej: employee123"
                    />
                    {errors.handle && (
                        <p className="error-message">{errors.handle.message}</p>
                    )}

                    <label>Contraseña del empleado</label>

                    
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"} 
                            {...register("password", {
                                required: "La contraseña del empleado es obligatoria",
                            })}
                            placeholder="********"
                        />

                      
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)} 
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible /> 
                            ) : (
                                <AiOutlineEye /> 
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="error-message">{errors.password.message}</p>
                    )}

                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
}
