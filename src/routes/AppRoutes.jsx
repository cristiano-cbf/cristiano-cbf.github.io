
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import {
  PageAlunos,
  PageEscolas,
  PageCursos,
  HomePage,
  Page404,
} from "../pages/Layout/Index";

const AppRoutes = () => {
  return (
    <Router>
        <Routes>          
          <Route
            exact
            path=""
            element={
              
                <HomePage />
              
            }
          />
          <Route path="/cadastro">
            <Route
              path="/cadastro/alunos"
              element={
                
                  <PageAlunos />
                
              }
            />
            <Route
              path="/cadastro/escolas"
              element={
                  <PageEscolas />
              }
            />
            <Route
              path="/cadastro/cursos"
              element={
                  <PageCursos />
              }
            />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
    </Router>
  );
};

export default AppRoutes;
