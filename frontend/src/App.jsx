import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarContrasena
  from './pages/RecuperarContrasena';

import Inicio
  from './pages/Inicio';

import CrearPublicacion
  from './pages/CrearPublicacion';


import DetallePublicacion
  from './pages/DetallePublicacion';


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/recuperar-contrasena"
          element={
            <RecuperarContrasena />
          }
        />

        <Route
          path="/inicio"
          element={<Inicio />}
        />

        <Route
          path="/publicaciones/crear"
          element={<CrearPublicacion />}
        />

        <Route
          path="/publicaciones/:id"
          element={<DetallePublicacion />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;