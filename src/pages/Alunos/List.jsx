import React, { useState } from "react";
import { Table, Form, Button, InputGroup, Col, Row, Modal } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BotaoNovo } from "../../components/Botoes";
import Cabecalho2 from "../../components/Cabecalho2";
import { Container } from "react-bootstrap";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TabelaCadastroAlunos({
  alunos,
  setAlunos,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState(null);
  const [alunoToEdit, setAlunoToEdit] = useState(null);

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/alunos/${codigo}`)
      .then((response) => {
        const newArray = alunos.filter((aluno) => aluno.codigo !== codigo);
        setAlunos(newArray);
        toast.success(response.data.message);
      })
      .catch(({ response }) => toast.error(response.data.message));

    setOnEdit(null);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    setExibeTabela(false);
  };

  const confirmOnDelete = (codigo) => {
    const aluno = alunos.find((aluno) => aluno.codigo === codigo)
    setAlunoToDelete(aluno);
    setShowDeleteModal(true);
  };

  const confirmOnEdit = (codigo) => {
    const aluno = alunos.find((aluno) => aluno.codigo === codigo)
    setAlunoToEdit(aluno);
    setShowEditModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (alunoToDelete) {
      handleDelete(alunoToDelete.codigo);
      setShowDeleteModal(false);
      setAlunoToDelete(null);
    }
  };

  const handleEditConfirmation = () => {
    if (alunoToEdit) {
      handleEdit(alunoToEdit);
      setShowEditModal(false);
      setAlunoToEdit(null);
    }
  };

  const linhas = [];

  alunos.forEach((aluno, i) => {
    if (aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return;
    }
    linhas.push(
      <LinhaAluno
        aluno={aluno}
        key={i}
        handleEdit={confirmOnEdit}
        handleConfirm={confirmOnDelete}
      />
    );
  });

  return (
    <div>
      <Cabecalho2 texto1={"Consulta"} texto2={"Alunos"} />
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
              <th>CPF</th>
              <th>Serie</th>
              <th>Periodo</th>
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
          Tem certeza que deseja excluir o aluno {alunoToDelete?.nome}?
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
          Tem certeza que deseja editar o aluno {alunoToEdit?.nome}?
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

function LinhaAluno({ aluno, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td>{aluno.codigo}</td>
      <td>{aluno.nome}</td>
      <td>{aluno.cpf}</td>
      <td>{aluno.serie}</td>
      <td>{aluno.periodo}</td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(aluno.codigo)}
          className="me-2"
          title="Editar"
        >
          <AiOutlineEdit size={20} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleConfirm(aluno.codigo)}
          title="Excluir"
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
}
