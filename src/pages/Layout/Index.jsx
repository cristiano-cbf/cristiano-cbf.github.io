import Cursos from "../Cursos/Index";
import Escolas from "../Escolas/Index";
import Alunos from "../Alunos/Index";
import Cabecalho1 from "../../components/Cabecalho1";
import Home from "../HomePage/Index";
import Pagina404 from "../404/Index";
import Rodape from "../../components/Rodape";

// PÁGINAS

function PageAlunos(props) {
  return (
    <>
      <Cabecalho1 />
      <Alunos />
      <Rodape />
    </>
  );
}

function PageEscolas(props) {
  return (
    <>
      <Cabecalho1 />
      <Escolas />
      <Rodape />
    </>
  );
}

function PageCursos(props) {
  return (
    <>
      <Cabecalho1 />
      <Cursos />
      <Rodape />
    </>
  );
}


// TELAS

function HomePage(props) {
  return (
    <>
      <Cabecalho1 />
      <Home />
      <Rodape />
    </>
  );
}

function Page404(props) {
  return (
    <>
      <Cabecalho1 />
      <Pagina404 />
      <Rodape />
    </>
  );
}

export {
  PageAlunos,
  PageEscolas,
  PageCursos,
  HomePage,
  Page404,
};
