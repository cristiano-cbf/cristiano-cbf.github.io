import React from "react";
import { Button, Container } from "react-bootstrap";
import error from "../../img/error.jpg";
import { Link } from "react-router-dom";
import "../../components/styles/404.css";

function Pagina404(props) {
  return (
    <Container className="text-center">
      <img src={error} alt="Erro 404" className="error-image" />
      <h1 className="error-heading">Página Não Encontrada</h1>
      <h2 className="error-text">
        A página que você está procurando não pôde ser encontrada
      </h2>
      <Button className="mt-4">
        <Link to="/">Voltar a página inicial</Link>
      </Button>
    </Container>
  );
}

export default Pagina404;