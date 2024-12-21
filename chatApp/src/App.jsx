import "./index.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Chat from './pages/chat';
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";



const App = () => {

  return (
    <>
     <Router>      
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/Not found' element ={<NotFound/>}/>
        <Route path = '/ForgetPassword' element={<ForgetPassword/>}/>
        <Route path = '/ResetPassword' element={<ResetPassword/>}/>
       </Routes>
    
     </Router>
     

   
      </>
    );
};

export default App;

