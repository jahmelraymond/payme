// import logo from './logo.svg';
import './App.css';
import Home from './Components/Home'
import ContextProvider from './Provider/contextProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoggedIn from './Components/Loggedin';
import LoginSignUp from './Components/LoginSignUp';
import Admin from './Components/Admin'

function App() {
  return (
    <ContextProvider>
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<LoginSignUp />} />
          <Route path='/profile/:id' element={<LoggedIn />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>

      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
