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

import InicioTemporal
  from './pages/InicioTemporal';

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
          element={<InicioTemporal />}
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