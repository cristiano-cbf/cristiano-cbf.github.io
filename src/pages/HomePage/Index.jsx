import { Row, Container, Col } from "react-bootstrap";
import Logo from "../../img/aprata.png";
import Freq from "../../img/freq.png";
import Matricula from "../../img/matricula.png";
import Aluno from "../../img/aluno.png";
import Turmas from "../../img/defturmas.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container className="mt-3">
      <Row className="mt-3 justify-content-center align-center">
        <Col className="p-2 col-md-2 col-sm-6">

          <Link to="/cadastro/alunos">
            <div className="card">
              <div className="inner">

                <img src={Matricula} width="80%" height="200px" />

              </div>
              <p className="title">ALUNOS</p>
            </div>
          </Link>
          <p /><p />

          <Link to="/cadastro/escolas">
            <div className="card">
              <div className="inner">

                <img src={Freq} width="80%" height="200px" />

              </div>
              <p className="title">ESCOLAS</p>
            </div>
          </Link>
        </Col>

        <Col>
          <div className="d-flex justify-content-center align-center">
            <img src={Logo} alt="logo" className="img-fluid" />
          </div>
        </Col>
        <Col className="p-2 col-md-2 col-sm-6">

          <Link to="/cadastro/cursos">
            <div className="card">
              <div className="inner">

                <img src={Aluno} width="80%" height="200px" />

              </div>
              <p className="title">CURSOS</p>
            </div>
          </Link>
          <p /><p />

          <Link to="/vincular/alunos-turmas">
            <div className="card">

              <div className="inner">

                <img src={Turmas} width="80%" height="200px" />

              </div>
              <p className="title">DEFINIR TURMAS </p>
            </div>
          </Link>
        </Col>
      </Row>


    </Container>
  );
};

export default Home;
