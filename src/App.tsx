import { Routes, Route, Navigate } from "react-router-dom";
import RecipeDetail from "./pages/receipe/RecipeDetail";
import ViewRecipe from "./pages/receipe/ViewRecipe";
import NavbarNew from "./components/Navbar";

function App() {
    return (
        <>
            <NavbarNew />
            <Routes>
                <Route path="/" element={<Navigate to="/recipe" replace />} />
                <Route path="/recipe" element={<ViewRecipe />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="*" element={<Navigate to="/recipe" replace />} />
            </Routes>
        </>
    );
}

export default App;
