import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { useEffect, useRef, React, useState } from "react";
import Cabecalho2 from "../../components/Cabecalho2";
import axios from "../../lib/api";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../../components/Form/form-field";
import FormSelectField from "../../components/Form/form-select-field";
import { emailRegex } from "../../utils/expressions";
import { urlBase } from "../../utils/definicoes";
import MaskedFormTextField from "../../components/Form/masked-form-field";

const schema = Yup.object().shape({
  cnpj: Yup.string().required("CNPJ é obrigatório"),
  ie: Yup.string().required("Inscrição estadual é obrigatório"),
  razaoSocial: Yup.string().required("Razão social é obrigatório"),
  telefone: Yup.string().required("Telefone é obrigatório"),
  // Regex to validate email format, need to break this expression in multilines
  email: Yup.string()
    .required("E-mail é obrigatório")
    .matches(emailRegex, "Endereço de email inválido"),
  proprietario: Yup.string().required("Proprietário é obrigatório"),
  endereco: Yup.string().required("Endereço é obrigatório"),
  bairro: Yup.string().required("Bairro é obrigatório"),
  cidade: Yup.string().required("Cidade é obrigatório"),
  cep: Yup.string().required("CEP é obrigatório"),
  uf: Yup.string().required("UF é obrigatório"),
});

const initialValues = {
  codigo: "",
  cnpj: "",
  ie: "",
  razaoSocial: "",
  telefone: "",
  email: "",
  proprietario: "",
  endereco: "",
  bairro: "",
  cidade: "",
  cep: "",
  uf: "",
};

const options = {
  headers: { "content-type": "application/json" },
};

export default function FormEmpresa({
  onEdit,
  setExibeTabela,
  setOnEdit,
  empresas,
  setEmpresas,
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

  // Submissão dos dados
  const handleSubmit = async (values, actions) => {
    const updatedEmpresas = empresas;

    if (onEdit) {
      axios
        .put(`${urlBase}/empresas/`, JSON.stringify(values), options)
        .then((response) => {
          // Get index of item on edition
          const index = updatedEmpresas.findIndex(
            (i) => i.codigo === onEdit.codigo
          );
          // Replace old values
          updatedEmpresas[index] = values;
          // Set new list
          setEmpresas(updatedEmpresas);
          toast.success(response.data.message);
        })
        .catch(({ response }) => {
          toast.error(response.data.message);
        });
    } else {
      axios
        .post(`${urlBase}/empresas/`, JSON.stringify(values), options)
        .then((response) => {
          formikRef.current.setFieldValue("codigo", response.data.id);
          values.codigo = response.data.id;
          updatedEmpresas.push(values);
          setEmpresas(updatedEmpresas);
          toast.success(response.data.message);
          // After pushing new item to list, it goes to the end of it
          // It must be treated on list
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
      <Cabecalho2 texto1={"Cadastro"} texto2={"Empresa"} />
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
                    controlId="formEmpresa.codigo"
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
                    controlId="formEmpresa.razaoSocial"
                    label="Razão Social"
                    name="razaoSocial"
                    placeholder="Informe a Razão Social da empresa"
                    value={values.razaoSocial}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formEmpresa.cnpj"
                    label="CNPJ"
                    name="cnpj"
                    format="##.###.###/####-##"
                    mask="_"
                    placeholder="Informe o CPNJ da empresa"
                    value={values.cnpj}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formEmpresa.ie"
                    label="Inscrição Estadual"
                    name="ie"
                    placeholder="Informe a Inscrição Estadual da empresa"
                    value={values.ie}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formEmpresa.proprietario"
                    label="Proprietário"
                    name="proprietario"
                    placeholder="Informe a Proprietário da empresa"
                    value={values.proprietario}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formEmpresa.cep"
                    label="CEP"
                    name="cep"
                    format="######-###"
                    mask="_"
                    placeholder="Informe a CEP da empresa"
                    value={values.cep}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formEmpresa.endereco"
                    label="Endereço"
                    name="endereco"
                    placeholder="Informe a Endereço da empresa"
                    value={values.endereco}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formEmpresa.bairro"
                    label="Bairro"
                    name="bairro"
                    placeholder="Informe a Bairro da empresa"
                    value={values.bairro}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formEmpresa.cidade"
                    label="Cidade"
                    name="cidade"
                    placeholder="Informe a cidade da empresa"
                    value={values.cidade}
                    required
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <FormSelectField
                    controlId="formEmpresa.uf"
                    label="UF"
                    name="uf"
                    className="mb-3"
                    value={values.uf}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                    <option value="EX">Estrangeiro</option>
                  </FormSelectField>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formEmpresa.telefone"
                    label="Telefone"
                    name="telefone"
                    format="(##) #####-####"
                    mask="_"
                    placeholder="Informe a telefone da empresa"
                    value={values.telefone}
                    required
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formEmpresa.email"
                    label="E-mail"
                    name="email"
                    type="email"
                    placeholder="Informe a e-mail da empresa"
                    value={values.email}
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
                  <Button
                    variant="primary"
                    onClick={handleSaveConfirmation}
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