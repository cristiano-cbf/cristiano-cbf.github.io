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

export default function TabelaCadastroEmpresas({
  empresas,
  setEmpresas,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);
  const [empresaToEdit, setEmpresaToEdit] = useState(null);

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/empresas/${codigo}`)
      .then((response) => {
        const newArray = empresas.filter(
          (empresa) => empresa.codigo !== codigo
        );

        setEmpresas(newArray);
        toast.success(response.data.message);
      })
      .catch(({ response }) => toast.error(response.data.message));

    setOnEdit(null);
  };

  const handleEdit = (empresa) => {
    setOnEdit(empresa);
    setExibeTabela(false);
  };

  const confirmOnDelete = (codigo) => {
    const empresa = empresas.find((empresa) => empresa.codigo === codigo);
    setEmpresaToDelete(empresa);
    setShowDeleteModal(true);
  };

  const confirmOnEdit = (codigo) => {
    const empresa = empresas.find((empresa) => empresa.codigo === codigo);
    setEmpresaToEdit(empresa);
    setShowEditModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (empresaToDelete) {
      handleDelete(empresaToDelete.codigo);
      setShowDeleteModal(false);
      setEmpresaToDelete(null);
    }
  };

  const handleEditConfirmation = () => {
    if (empresaToEdit) {
      handleEdit(empresaToEdit);
      setShowEditModal(false);
      setEmpresaToEdit(null);
    }
  };

  const linhas = [];

  empresas.forEach((empresa, i) => {
    if (
      empresa.razaoSocial.toLowerCase().indexOf(filtro.toLowerCase()) === -1
    ) {
      return;
    }
    linhas.push(
      <LinhaEmpresa
        empresa={empresa}
        key={i}
        handleEdit={confirmOnEdit}
        handleConfirm={confirmOnDelete}
      />
    );
  });

  return (
    <div>
      <Cabecalho2 texto1={"Consulta"} texto2={"Empresas"} />
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
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              {/* <th>E-mail</th> */}
              <th>Proprietário</th>
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
          Tem certeza que deseja excluir a empresa{" "}
          {empresaToDelete?.razaoSocial}?
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
          Tem certeza que deseja editar a empresa {empresaToEdit?.razaoSocial}?
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

function LinhaEmpresa({ empresa, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td>{empresa.codigo}</td>
      <td>{empresa.razaoSocial}</td>
      <td>{empresa.cnpj}</td>
      <td>{empresa.telefone}</td>
      {/* <td>{empresa.email}</td> */}
      <td>{empresa.proprietario}</td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(empresa.codigo)}
          className="me-2"
          title="Editar"
        >
          <AiOutlineEdit size={20} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleConfirm(empresa.codigo)}
          title="Excluir"
        >
          <AiOutlineDelete size={20} />
        </Button>
      </td>
    </tr>
  );
}
