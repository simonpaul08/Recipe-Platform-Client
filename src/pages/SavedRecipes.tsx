import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface Recipe {
    id: number;
    title: string;
    description: string | null;
    averageRating: number;
    totalRatings: number;
}

export default function SavedRecipes() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSaved = async () => {
        try {
            setLoading(true);
            const res = await api.get("/recipe/me/saved");
            setRecipes(res.data?.data);
        } catch (err) {
            setError("Failed to load saved recipes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchSaved();
    }, [user, navigate]);

    const handleUnsave = async (id: number) => {
        try {
            await api.post(`/recipe/${id}/save`); 
            setRecipes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to unsave");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (recipes.length === 0) return <p className="text-center mt-10">No saved recipes yet.</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">❤️ Saved Recipes</h1>
                    <Link
                        to="/"
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                    >
                        ← Back to Home
                    </Link>
                </div>

                <div className="grid gap-4">
                    {recipes.map((r) => (
                        <div key={r.id} className="bg-white shadow rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-1">{r.title}</h2>
                            <p className="text-gray-600 mb-2">
                                {r.description || "No description"}
                            </p>
                            <p className="text-yellow-600 mb-3">
                                ⭐ {r.averageRating.toFixed(1)} ({r.totalRatings} ratings)
                            </p>

                            <div className="flex gap-2">
                                <Link
                                    to={`/recipes/${r.id}`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    View
                                </Link>

                                <button
                                    onClick={() => handleUnsave(r.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Unsave
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
