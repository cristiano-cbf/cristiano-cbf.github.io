import React, { useState } from "react";
import {
  Table,
  Form,
  Button,
  InputGroup,
  Col,
  Row,
  Modal,
} from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BotaoNovo } from "../../components/Botoes";
import Cabecalho2 from "../../components/Cabecalho2";
import { Container } from "react-bootstrap";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TabelaCadastroEscolas({
  escolas,
  setEscolas,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [escolaToDelete, setEscolaToDelete] = useState(null);
  const [escolaToEdit, setEscolaToEdit] = useState(null);

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/escolas/${codigo}`)
      .then((response) => {
        const newArray = escolas.filter((escola) => escola.codigo !== codigo);

        setEscolas(newArray);
        toast.success(response.data.message);
      })
      .catch(({ response }) => toast.error(response.data.message));

    setOnEdit(null);
  };

  const handleEdit = (escola) => {
    setOnEdit(escola);
    setExibeTabela(false);
  };

  const confirmOnDelete = (codigo) => {
    const escola = escolas.find((escola) => escola.codigo === codigo);
    setEscolaToDelete(escola);
    setShowDeleteModal(true);
  };

  const confirmOnEdit = (codigo) => {
    const escola = escolas.find((escola) => escola.codigo === codigo);
    setEscolaToEdit(escola);
    setShowEditModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (escolaToDelete) {
      handleDelete(escolaToDelete.codigo);
      setShowDeleteModal(false);
      setEscolaToDelete(null);
    }
  };

  const handleEditConfirmation = () => {
    if (escolaToEdit) {
      handleEdit(escolaToEdit);
      setShowEditModal(false);
      setEscolaToEdit(null);
    }
  };

  const linhas = [];

  escolas.forEach((escola, i) => {
    if (escola.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return;
    }
    linhas.push(
      <LinhaEscola
        escola={escola}
        key={i}
        handleEdit={confirmOnEdit}
        handleConfirm={confirmOnDelete}
      />
    );
  });

  return (
    <div>
      <Cabecalho2 texto1={"Consulta"} texto2={"Escolas"} />
      <Container className="mt-3">
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <BotaoNovo acaoBtnNovo={() => setExibeTabela(false)} />
          </Col>
          <Col xs={12} md={6}>
            <Form>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={filtro}
                  placeholder="Pesquisar por nome..."
                  onChange={(e) => aoMudarFiltro(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => aoMudarFiltro("")}
                >
                  Limpar
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
      </Container>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir o escola {escolaToDelete?.nome}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmation}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmação de edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Edição</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja editar o escola {escolaToEdit?.nome}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditConfirmation}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function LinhaEscola({ escola, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td>{escola.codigo}</td>
      <td>{escola.nome}</td>
      <td>{escola.descricao}</td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(escola.codigo)}
          className="me-2"
          title="Editar"
        >
          <AiOutlineEdit size={20} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleConfirm(escola.codigo)}
          title="Excluir"
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
}
