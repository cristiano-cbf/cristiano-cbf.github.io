import React, { useState } from "react";
import { Table, Form, Button, InputGroup, Col, Row, Modal } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BotaoNovo } from "../../components/Botoes";
import Cabecalho2 from "../../components/Cabecalho2";
import { Container } from "react-bootstrap";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TabelaCadastroFuncionarios({
  funcionarios,
  setFuncionarios,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [funcionarioToDelete, setFuncionarioToDelete] = useState(null);
  const [funcionarioToEdit, setFuncionarioToEdit] = useState(null);

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/funcionarios/${codigo}`)
      .then((response) => {
        const newArray = funcionarios.filter((funcionario) => funcionario.codigo !== codigo);
        setFuncionarios(newArray);
        toast.success(response.data.message);
      })
      .catch(({ response }) => toast.error(response.data.message));

    setOnEdit(null);
  };

  const handleEdit = (funcionario) => {
    setOnEdit(funcionario);
    setExibeTabela(false);
  };

  const confirmOnDelete = (codigo) => {
    const funcionario = funcionarios.find((funcionario) => funcionario.codigo === codigo);
    setFuncionarioToDelete(funcionario);
    setShowDeleteModal(true);
  };

  const confirmOnEdit = (codigo) => {
    const funcionario = funcionarios.find((funcionario) => funcionario.codigo === codigo);
    setFuncionarioToEdit(funcionario);
    setShowEditModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (funcionarioToDelete) {
      handleDelete(funcionarioToDelete.codigo);
      setShowDeleteModal(false);
      setFuncionarioToDelete(null);
    }
  };

  const handleEditConfirmation = () => {
    if (funcionarioToEdit) {
      handleEdit(funcionarioToEdit);
      setShowEditModal(false);
      setFuncionarioToEdit(null);
    }
  };

  const linhas = [];

  funcionarios.forEach((funcionario, i) => {
    if (funcionario.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return;
    }
    linhas.push(
      <LinhaFuncionario
        funcionario={funcionario}
        key={i}
        handleEdit={confirmOnEdit}
        handleConfirm={confirmOnDelete}
      />
    );
  });

  return (
    <div>
      <Cabecalho2 texto1={"Consulta"} texto2={"Funcionarios"} />
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
              {/* <th>Usuário</th> */}
              <th>Cargo</th>
              {/* <th>Telefone</th> */}
              <th>Status</th>
              {/* <th>E-mail</th> */}
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
          Tem certeza que deseja excluir o funcionário {funcionarioToDelete?.nome}?
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
          Tem certeza que deseja editar o funcionário {funcionarioToEdit?.nome}?
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

function LinhaFuncionario({ funcionario, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td>{funcionario.codigo}</td>
      <td>{funcionario.nome}</td>
      <td>{funcionario.cpf}</td>
      {/* <td>{funcionario.nomeUsuario}</td> */}
      <td>{funcionario.cargo.nome}</td>
      {/* <td>{funcionario.telefone}</td> */}
      <td>{funcionario.status}</td>
      {/* <td>{funcionario.email}</td> */}
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(funcionario.codigo)}
          className="me-2"
          title="Editar"
        >
          <AiOutlineEdit size={20} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleConfirm(funcionario.codigo)}
          title="Excluir"
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
}
