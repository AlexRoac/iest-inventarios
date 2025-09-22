import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import ServiciosGenerales from './pages/serviciosGenerales';
import Cafeteria from './pages/cafeteria';
import Medicina from './pages/medicina';
import Gastronomia from './pages/gastronomia';
import Register from './pages/register'
import RutaProtegida from './components/rutaProtegida.js'
import RutaAdmin from './components/rutaAdmin.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/home' 
          element={<Home />} 
        />
        <Route 
          path='/login' 
          element={<Login />} 
        />
        <Route 
          path='/serviciosGenerales' 
          element={
            <RutaProtegida>
              <ServiciosGenerales />
            </RutaProtegida>
          }
        />
        <Route 
          path='/cafeteria' 
          element={
            <RutaProtegida>
              <Cafeteria />
            </RutaProtegida>
          } 
        />
        <Route 
          path='/medicina' 
          element={
            <RutaProtegida>
              <Medicina />
            </RutaProtegida>
          } 
        />
        <Route 
          path='/gastronomia' 
          element={
            <RutaProtegida>
              <Gastronomia />
            </RutaProtegida>
          } 
        />
        <Route 
          path='/register' 
          element={<Register />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
