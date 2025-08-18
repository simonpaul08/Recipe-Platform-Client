import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface Recipe {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    ingredients: string[];
    instructions: string[];
    averageRating: number;
    totalRatings: number;
}

export default function RecipeDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [myRating, setMyRating] = useState<number | null>(null);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/recipe/${id}`);
            setRecipe(res.data);
        } catch (err) {
            setError("Failed to load recipe");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const handleRate = async (rating: number) => {
        try {
            await api.patch(`/recipe/${id}/rate`, { rating });
            setMyRating(rating);
            fetchRecipe()
        } catch (err) {
            console.error("Rating failed", err);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (!recipe) return <p className="text-center mt-10">Recipe not found</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-block bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white shadow rounded-xl p-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">{recipe.title}</h1>
                    {recipe.imageUrl && (
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                    )}

                    {recipe.description && (
                        <p className="text-gray-700 text-lg mb-6 text-center">
                            {recipe.description}
                        </p>
                    )}

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-2 mb-3">
                            Ingredients
                        </h2>
                        {recipe.ingredients ? (
                            <ul className="grid grid-cols-2 gap-2 text-gray-700">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="list-disc list-inside">
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No ingredients listed.</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-2 mb-3">
                            Instructions
                        </h2>
                        {recipe.instructions ? (
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {recipe.instructions.join(", ")}
                            </p>
                        ) : (
                            <p className="text-gray-500">No instructions provided.</p>
                        )}
                    </div>

                    <div className="mb-6 text-center">
                        <p className="text-yellow-600 text-lg font-medium">
                            ⭐ {recipe.averageRating.toFixed(1)} ({recipe.totalRatings} ratings)
                        </p>
                    </div>

                    {user && (
                        <div className="mt-6 text-center">
                            <h3 className="font-semibold mb-3">Rate this recipe:</h3>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        className={`px-3 py-1 rounded ${myRating === star
                                            ? "bg-yellow-500 text-white"
                                            : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {star} ⭐
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
