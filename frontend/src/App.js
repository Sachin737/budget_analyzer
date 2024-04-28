import MainPage from "./pages/MainPage";
import Login from "./pages/Login"
import Register from "./pages/Register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login></Login>} />
                <Route exact path="/register" element={<Register></Register>}></Route>
                <Route exact path="/user" element={<MainPage></MainPage>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
