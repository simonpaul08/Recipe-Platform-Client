import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './routes/ProtectedRoutes'
import RecipeDetails from './pages/RecipeDetails'
import AddRecipe from './pages/AddRecipe'
import SavedRecipes from './pages/SavedRecipes'

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/recipes/:id" element={
          <ProtectedRoute>
            <RecipeDetails />
          </ProtectedRoute>
        } />

        <Route path="/recipes/new" element={
          <ProtectedRoute>
            <AddRecipe />
          </ProtectedRoute>
        } />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedRecipes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
