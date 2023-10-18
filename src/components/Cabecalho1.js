
import Menu from "./Menu";
import { Container, Row, Col } from "react-bootstrap";

export default function Cabecalho1(props) {

  return (
    <nav
      className="d-flex text-white p-2 justify-content-between align-items-center"
      style={{ backgroundColor: "#00adee", height: "60px" }}
    >
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={6} md={4} className="d-flex align-items-center">
            <Menu />
            <div
              className="p-0 m-0 text-center"
              style={{ fontWeight: "bold", fontSize: "2vh" }}
            >
              SGi | GERENCIAMENTO DE SERVIÇOS
            </div>
          </Col>
          <Col
            xs={6}
            md={8}
            className="d-flex justify-content-end align-items-center"
          >
          </Col>
        </Row>
      </Container>
    </nav>
  );
}
