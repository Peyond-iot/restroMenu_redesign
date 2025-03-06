import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "../login/login";
import Menu from '../menu/menu';

function Home(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/menu" element={<Menu/>} />
            </Routes>
        </Router>
    )
}

export default Home;