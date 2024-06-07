import MainPage from "./pages/MainPage";
import Login from "./pages/Login"
import Register from "./pages/Register"
import PrivateRoute from "./components/Routes/Private";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route exact path="/" element={<Login></Login>} />
                <Route exact path="/register" element={<Register></Register>}></Route>
                <Route exact path="/user" element={<PrivateRoute></PrivateRoute>}>
                    <Route exact path="" element={<MainPage></MainPage>}></Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
