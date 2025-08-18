import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Recipe {
    id: number;
    title: string;
    description: string | null;
    averageRating: number;
    totalRatings: number;
    isSaved?: boolean;
}

export default function Home() {
    const { user, logout } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/recipe", {
                params: { q: query, page, limit: 5 },
            });
            setRecipes(res.data?.data);
            setTotalPages(res.data?.totalPages || 1); 
        } catch (err: any) {
            setError("Failed to load recipes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchRecipes();
    };

    const toggleSave = async (id: number) => {
        try {
            const res = await api.post(`/recipe/${id}/save`);
            const saved = res.data.saved;
            setRecipes((prev) =>
                prev.map((r) => (r.id === id ? { ...r, isSaved: saved } : r))
            );
        } catch (err) {
            console.error("Save failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    🍳 CookTogether
                </Link>
                <nav className="flex gap-4">
                    {user ? (
                        <>
                            <Link to="/recipes/new" className="text-blue-600">
                                Add Recipe
                            </Link>
                            <Link to="/saved" className="text-blue-600">
                                Saved
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-blue-600">
                                Login
                            </Link>
                            <Link to="/register" className="text-blue-600">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <form onSubmit={handleSearch} className="p-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-1/2 p-2 border rounded-l"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700"
                >
                    Search
                </button>
            </form>

            <div className="p-4">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="grid gap-4">
                    {recipes.map((r) => (
                        <div key={r.id} className="bg-white shadow p-4 rounded-lg">
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

                                {user && (
                                    <button
                                        onClick={() => toggleSave(r.id)}
                                        className={`px-3 py-1 rounded ${r.isSaved
                                                ? "bg-pink-600 text-white hover:bg-pink-700"
                                                : "bg-pink-500 text-white hover:bg-pink-600"
                                            }`}
                                    >
                                        {r.isSaved ? "Unsave" : "Save"} 
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="self-center">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
