import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function AddRecipe() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/recipe", {
                title,
                description,
                ingredients: ingredients.split("\n").map((line) => line.trim()).filter(Boolean),
                instructions: instructions.split("\n").map((line) => line.trim()).filter(Boolean),
                imageUrl,
            });

            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add recipe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Add a New Recipe</h2>
                    <Link
                        to="/"
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                    >
                        ← Back
                    </Link>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Recipe Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                        required
                    />

                    <textarea
                        placeholder="Short Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                    />

                    <textarea
                        placeholder="Ingredients (one per line)"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-green-200 h-32"
                        required
                    />

                    <textarea
                        placeholder="Instructions (one per line)"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-green-200 h-40"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Image URL (optional)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add Recipe"}
                    </button>
                </form>
            </div>
        </div>
    );
}
