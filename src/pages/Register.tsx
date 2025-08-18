import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await api.post("/auth/register", { name, email, password });

            setSuccess("✅ You have been registered successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || "Register failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
