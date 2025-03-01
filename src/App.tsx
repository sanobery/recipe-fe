import { Routes, Route, Navigate } from "react-router-dom";
import RecipeDetail from "./pages/receipe/RecipeDetail";
import ViewRecipe from "./pages/receipe/ViewRecipe";
import NavbarNew from "./components/NavbarNew";
import RecipeHeader from "./pages/receipe/RecipeHeader";

function App() {
    return (
        <>
            <NavbarNew />
            <RecipeHeader/>
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
