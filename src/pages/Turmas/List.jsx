import React, { useState } from "react";
import { Table, Form, Button, InputGroup, Col, Row, Modal } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BotaoNovo } from "../../components/Botoes";
import Cabecalho2 from "../../components/Cabecalho2";
import { Container } from "react-bootstrap";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TabelaCadastroTurmas({
  turmas,
  setTurmas,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [turmaToDelete, setTurmaToDelete] = useState(null);
  const [turmaToEdit, setTurmaToEdit] = useState(null);

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/turmas/${codigo}`)
      .then((response) => {
        const newArray = turmas.filter((turma) => turma.codigo !== codigo);
        setTurmas(newArray);
        toast.success(response.data.message);
      })
      .catch(({ response }) => toast.error(response.data.message));

    setOnEdit(null);
  };

  const handleEdit = (turma) => {
    setOnEdit(turma);
    setExibeTabela(false);
  };

  const confirmOnDelete = (codigo) => {
    const turma = turmas.find((turma) => turma.codigo === codigo);
    setTurmaToDelete(turma);
    setShowDeleteModal(true);
  };

  const confirmOnEdit = (codigo) => {
    const turma = turmas.find((turma) => turma.codigo === codigo);
    setTurmaToEdit(turma);
    setShowEditModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (turmaToDelete) {
      handleDelete(turmaToDelete.codigo);
      setShowDeleteModal(false);
      setTurmaToDelete(null);
    }
  };

  const handleEditConfirmation = () => {
    if (turmaToEdit) {
      handleEdit(turmaToEdit);
      setShowEditModal(false);
      setTurmaToEdit(null);
    }
  };

  const linhas = [];

  turmas.forEach((turma, i) => {
    if (turma.curso.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return;
    }
    linhas.push(
      <LinhaTurma
        turma={turma}
        key={i}
        handleEdit={confirmOnEdit}
        handleConfirm={confirmOnDelete}
      />
    );
  });

  return (
    <div>
      <Cabecalho2 texto1={"Consulta"} texto2={"Turmas"} />
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
                  placeholder="Pesquisar por curso..."
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
              <th>Período</th>
              <th>Ano Letivo</th>
              <th>Cursos</th>
              <th>Professor</th>
              {/* <th>Início</th>
              <th>Status</th>
              <th>Vagas</th> */}
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
          Tem certeza que deseja excluir a turma {turmaToDelete?.curso.codigo}?
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
          Tem certeza que deseja editar a turma {turmaToEdit?.curso.codigo}?
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

function LinhaTurma({ turma, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td>{turma.codigo}</td>
      <td>{turma.periodo}</td>
      <td>{turma.anoLetivo}</td>
      <td>{turma.curso.nome}</td>
      <td>{turma.funcionario.nome}</td>
      {/* <td>{turma.dataInicio}</td>
      <td>{turma.status}</td>
      <td>{turma.vagas}</td> */}
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(turma.codigo)}
          className="me-2"
          title="Editar"
        >
          <AiOutlineEdit size={20} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleConfirm(turma.codigo)}
          title="Excluir"
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
}
