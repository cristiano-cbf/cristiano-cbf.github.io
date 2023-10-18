import React, { useRef, useState, useEffect } from "react";
import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../../components/Form/form-field";
import FormTextAreaField from "../../components/Form/form-textarea";
import { urlBase } from "../../utils/definicoes";
import axios from "axios";
import { toast } from "react-toastify";
import Cabecalho2 from "../../components/Cabecalho2";

const schema = Yup.object().shape({
  nome: Yup.string().required("Nome do curso é obrigatório"),
  descricao: Yup.string().required("Descrição do curso é obrigatória"),
});

const initialValues = {
  codigo: "",
  nome: "",
  descricao: "",
  listaAlunos: [], // Modifiquei a estrutura dos dados aqui
};

const options = {
  headers: { "content-type": "application/json" },
};

export default function FormCurso({
  onEdit,
  setExibeTabela,
  setOnEdit,
  cursos,
  setCursos,
}) {
  const formRef = useRef();
  const formikRef = useRef();
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [alunosVinculados, setAlunosVinculados] = useState([]);
  const [codigoDoCurso, setCodigoDoCurso] = useState(null);

  useEffect(() => {
    if (onEdit) {
      setCodigoDoCurso(onEdit.codigo); // Define o código do curso quando estiver em modo de edição
      for (const key in onEdit) {
        if (onEdit[key] !== null) {
          formikRef.current.setFieldValue(key, onEdit[key]);
        }
      }
    }
  }, [onEdit]);

  const handleBackButton = () => {
    if (onEdit) setOnEdit(null);
    setExibeTabela(true);
  };

  useEffect(() => {
    // Função para obter os alunos vinculados ao curso
    const fetchAlunosVinculados = async (codigoCurso) => {
      try {
        const response = await axios.get(`${urlBase}/curso/${codigoCurso}`);
        const listaAlunos = response.data.map((aluno) => ({
          codigo: aluno.codigo_aluno,
        }));
        setAlunosVinculados(listaAlunos);
      } catch (error) {
        console.error("Erro ao obter alunos vinculados ao curso:", error);
      }
    };

    // Chamar a função para buscar os alunos vinculados ao curso, usando codigoDoCurso
    if (codigoDoCurso !== null) {
      fetchAlunosVinculados(codigoDoCurso);
    }
  }, [codigoDoCurso]);

  const handleSubmit = async (values, actions) => {
    try {
      // Mapeando a lista de alunos para incluir apenas os códigos dos alunos como números inteiros
      const listaAlunos = alunosVinculados.map((aluno) => ({
        codigo: parseInt(aluno.codigo, 10),
      }));

      // Modificando a estrutura dos dados do curso
      const cursoData = {
        codigo: values.codigo, // Incluindo o ID do curso no corpo da requisição
        nome: values.nome,
        descricao: values.descricao,
        listaAlunos: listaAlunos,
      };

      // Mostrando no console como os dados estão sendo enviados no PUT ou POST
      console.log("Dados enviados no PUT ou POST:", cursoData);

      const response = onEdit
        ? await axios.put(`${urlBase}/cursos/`, cursoData, options)
        : await axios.post(`${urlBase}/cursos/`, cursoData, options);

      // Atualizando a lista de cursos no estado com a resposta do servidor
      const updatedCursos = onEdit
        ? cursos.map((curso) => (curso.codigo === onEdit.codigo ? response.data : curso))
        : [...cursos, response.data];

      setCursos(updatedCursos);
      toast.success(response.data.message);
      setShowSaveConfirmation(true);
    } catch (error) {
      toast.error(error.response?.data.message || "Erro ao salvar o curso.");
    }
  };

  const handleClearForm = () => {
    formikRef.current.resetForm();
    setShowClearConfirmation(false);
  };

  const handleClearConfirmation = () => {
    setShowClearConfirmation(true);
  };

  return (
    <div>
      <Cabecalho2 texto1={"Cadastro"} texto2={"Curso"} />
      <Container className="my-4 p-3 overflow-auto" style={{ maxHeight: "75vh" }}>
        <Formik
          innerRef={formikRef}
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          enableReinitialize={true}
        >
          {(formikProps) => (
            <Form noValidate ref={formRef} onSubmit={formikProps.handleSubmit}>
              <Row>
                <Col sm={2} md={2} lg={2} className="mb-3">
                  <FormTextField
                    controlId="formCurso.codigo"
                    label="Código"
                    name="codigo"
                    value={formikProps.values.codigo}
                    isDisabled={true}
                  />
                </Col>
              </Row>

              <Row>
                <Col className="mb-3">
                  <FormTextField
                    controlId="formCurso.nome"
                    label="Nome"
                    name="nome"
                    placeholder="Informe o nome do curso"
                    value={formikProps.values.nome}
                    onChange={formikProps.handleChange}
                    isInvalid={formikProps.errors.nome && formikProps.touched.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.nome}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row>
                <Col className="mb-3">
                  <FormTextAreaField
                    controlId="formCurso.descricao"
                    label="Descrição"
                    name="descricao"
                    placeholder="Informe a descrição do curso"
                    value={formikProps.values.descricao}
                    onChange={formikProps.handleChange}
                    isInvalid={formikProps.errors.descricao && formikProps.touched.descricao}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikProps.errors.descricao}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row>
                <Col className="mb-3">
                  <h2>Alunos Vinculados ao Curso</h2>
                  <ul>
                    {alunosVinculados.map((aluno, index) => (
                      <li key={index}>{aluno}</li>
                    ))}
                  </ul>
                </Col>
              </Row>

              <Row>
                <Col className="d-flex mt-2 mb-4">
                  <Button
                    type="button"
                    size="md"
                    onClick={() => setShowSaveConfirmation(true)}
                    disabled={!formikProps.isValid || !formikProps.dirty}
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    type="button"
                    size="md"
                    onClick={handleClearConfirmation}
                  >
                    Limpar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    type="button"
                    size="md"
                    onClick={handleBackButton}
                  >
                    Voltar
                  </Button>
                </Col>
              </Row>

              {/* Modal de confirmação de salvar */}
              <Modal
                show={showSaveConfirmation}
                onHide={() => setShowSaveConfirmation(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirmação de Salvar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Tem certeza que deseja salvar as informações?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowSaveConfirmation(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowSaveConfirmation(false);
                      formikProps.handleSubmit();
                    }}
                  >
                    Confirmar
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Modal de confirmação de limpar */}
              <Modal
                show={showClearConfirmation}
                onHide={() => setShowClearConfirmation(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirmação de Limpar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Tem certeza que deseja limpar o formulário?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowClearConfirmation(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={handleClearForm}>
                    Confirmar
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}
