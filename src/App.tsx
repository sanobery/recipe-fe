import { Routes, Route, Navigate } from 'react-router-dom'
import RecipeDetail from './views/pages/receipe/GetRecipeDetail'
import NavbarNew from './views/Navbar'
import MainRecipe from './views/pages/receipe/MainRecipe'

function App() {
    return (
        <>
            <NavbarNew />
            <Routes>
                <Route path="/" element={<Navigate to="/recipe" replace />} />
                <Route path="/recipe" element={<MainRecipe />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="*" element={<Navigate to="/recipe" replace />} />
            </Routes>
        </>
    )
}

export default App
