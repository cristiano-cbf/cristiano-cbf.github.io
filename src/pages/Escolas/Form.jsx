import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { useRef, useEffect, useState } from "react";
import Cabecalho2 from "../../components/Cabecalho2";
import { urlBase } from "../../utils/definicoes";
import { toast } from "react-toastify";
import axios from "../../lib/api";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../../components/Form/form-field";
import FormTextAreaField from "../../components/Form/form-textarea";

const schema = Yup.object().shape({
  nome: Yup.string().required("Nome é obrigatório"),
  descricao: Yup.string().required("Descrição é obrigatório"),
});

const initialValues = {
  codigo: "",
  nome: "",
  descricao: "",
};

const options = {
  headers: { "content-type": "application/json" },
};

export default function FormEscola({
  onEdit,
  setExibeTabela,
  setOnEdit,
  escolas,
  setEscolas,
}) {
  const formRef = useRef();
  const formikRef = useRef();
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  useEffect(() => {
    if (onEdit) {
      for (const key in onEdit) {
        // Set this condition only if the form has possibly nullable fields
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

  const handleSubmit = async (values, actions) => {
    const updatedEscolas = escolas;

    if (onEdit) {
      axios
        .put(`${urlBase}/escolas/`, JSON.stringify(values), options)
        .then((response) => {
          const index = updatedEscolas.findIndex(
            (i) => i.codigo === onEdit.codigo
          );
          updatedEscolas[index] = values;
          setEscolas(updatedEscolas);
          toast.success(response.data.message);
        })
        .catch(({ response }) => {
          toast.error(response.data.message);
        });
    } else {
      axios
        .post(`${urlBase}/escolas/`, JSON.stringify(values), options)
        .then((response) => {
          formikRef.current.setFieldValue("codigo", response.data.id);
          values.codigo = response.data.id;
          updatedEscolas.push(values);
          setEscolas(updatedEscolas);
          toast.success(response.data.message);
        })
        .catch(({ response }) => {
          toast.error(response.data.message);
        });
    }
    setShowSaveConfirmation(true);
  };

  const handleClearForm = () => {
    formikRef.current.resetForm();
    setShowClearConfirmation(false);
  };

  const handleSaveConfirmation = () => {
    handleSubmit(formikRef.current.values);
    setShowSaveConfirmation(false);
  };

  const handleClearConfirmation = () => {
    setShowClearConfirmation(true);
  };

  return (
    <div>
      <Cabecalho2 texto1={"Cadastro"} texto2={"Escola"} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{ maxHeight: "75vh" }}
      >
        <Formik
          innerRef={formikRef}
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          enableReinitialize={true}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            isValid,
            isSubmitting,
            dirty,
          }) => (
            <Form noValidate ref={formRef}>
              <Row>
                <Col sm={2} md={2} lg={2} className="mb-3">
                  <FormTextField
                    controlId="formEscola.codigo"
                    label="Código"
                    name="codigo"
                    value={values.codigo}
                    isDisabled={true}
                  />
                </Col>
              </Row>

              <Row>
                <Col className="mb-3">
                  <FormTextField
                    controlId="formEscola.nome"
                    label="Nome"
                    name="nome"
                    placeholder="Informe o nome do escola"
                    value={values.nome}
                    required
                  />
                </Col>
                </Row>
                <Row>
                <Col className="mb-3">
                  <FormTextAreaField
                    controlId="formEscola.descricao"
                    label="Descrição"
                    name="descricao"
                    placeholder="Informe a descrição do escola"
                    value={values.descricao}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col className="d-flex mt-2 mb-4">
                  <Button
                    as="input"
                    size="md"
                    type="button"
                    value="Salvar"
                    className="me-2"
                    onClick={() => setShowSaveConfirmation(true)}
                  />
                  <Button
                    variant="outline-secondary"
                    as="input"
                    size="md"
                    type="button"
                    value="Limpar"
                    className="me-2"
                    onClick={handleClearConfirmation}
                  />
                  <Button
                    variant="outline-secondary"
                    as="input"
                    size="md"
                    type="button"
                    value="Voltar"
                    onClick={handleBackButton}
                  />
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
                  <Button variant="primary" onClick={handleSaveConfirmation}>
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
