import MainPage from "./pages/MainPage";
import Analyser from "./pages/Analyzer";
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoute from "./components/Routes/Private";
import NotFoundPage from "./pages/NotFoundPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./style.scss";

function App() {
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route exact path="/" element={<Login></Login>} />
                <Route exact path="/register" element={<Register></Register>}></Route>
                <Route exact path="/user" element={<PrivateRoute></PrivateRoute>}>
                    <Route exact path="" element={<MainPage></MainPage>}></Route>
                    <Route exact path="analyzer" element={<Analyser></Analyser>}></Route>
                </Route>
                <Route exact path="*" element={<NotFoundPage></NotFoundPage>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
