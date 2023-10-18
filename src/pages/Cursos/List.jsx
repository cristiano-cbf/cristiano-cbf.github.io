import React, { useState } from "react";
import { Table, Form, Button, InputGroup, Col, Row, Modal, Container } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BotaoNovo } from "../../components/Botoes";
import Cabecalho2 from "../../components/Cabecalho2";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TabelaCadastroCursos({
  cursos,
  setCursos,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState(null);
  const [cursoToEdit, setCursoToEdit] = useState(null);

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/cursos/${codigo}`)
      .then((response) => {
        const newArray = cursos.filter((curso) => curso.codigo !== codigo);
        setCursos(newArray);
        toast.success(response.data.message);
      })
      .catch(({ response }) => toast.error(response.data.message));

    setOnEdit(null);
  };

  const handleEdit = (curso) => {
    setOnEdit(curso);
    setExibeTabela(false);
  };

  const confirmOnDelete = (codigo) => {
    const curso = cursos.find((curso => curso.codigo === codigo))
    setCursoToDelete(curso);
    setShowDeleteModal(true);
  };

  const confirmOnEdit = (codigo) => {
    const curso = cursos.find((curso => curso.codigo === codigo))
    setCursoToEdit(curso);
    setShowEditModal(true);
  };


  const handleDeleteConfirmation = () => {
    if (cursoToDelete) {
      handleDelete(cursoToDelete.codigo);
      setShowDeleteModal(false);
      setCursoToDelete(null);
    }
  };

  const handleEditConfirmation = () => {
    if (cursoToEdit) {
      handleEdit(cursoToEdit);
      setShowEditModal(false);
      setCursoToEdit(null);
    }
  };

  const linhas = [];

  cursos.forEach((curso, i) => {
    if (curso.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return;
    }
    linhas.push(
      <LinhaCurso
        curso={curso}
        key={i}
        handleEdit={confirmOnEdit}
        handleConfirm={confirmOnDelete}
      />
    );
  });

  return (
    <div>
      <Cabecalho2 texto1={"Consulta"} texto2={"Cursos"} />
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
          Tem certeza que deseja excluir o curso {cursoToDelete?.nome}?
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
          Tem certeza que deseja editar o curso {cursoToEdit?.nome}?
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

function LinhaCurso({ curso, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td>{curso.codigo}</td>
      <td>{curso.nome}</td>
      <td>{curso.descricao}</td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(curso.codigo)}
          className="me-2"
          title="Editar"
        >
          <AiOutlineEdit size={20} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleConfirm(curso.codigo)}
          title="Excluir"
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
}
