import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { useEffect, useRef, useState, React } from "react";
import Cabecalho2 from "../../components/Cabecalho2";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar/Index";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../../components/Form/form-field";
import FormSelectField from "../../components/Form/form-select-field";
import MaskedFormTextField from "../../components/Form/masked-form-field";
import { emailRegex } from "../../utils/expressions";

const schema = Yup.object().shape({
  nome: Yup.string().required("Nome é obrigatório"),
  cpf: Yup.string().required("CPF é obrigatório"),
  dataNascimento: Yup.string().required("Data de nascimento é obrigatório"),
  dataAdmissao: Yup.string().required("Data de admissão é obrigatório"),
  // dataDemissao: Yup.string(),
  status: Yup.string().required("Status é obrigatório"),
  nomeUsuario: Yup.string().required("Usuário é obrigatório"),
  senhaUsuario: Yup.string().required("Senha é obrigatório"),
  cargo: Yup.object().required("Cargo é obrigatório"),
  telefone: Yup.string().required("Telefone é obrigatório"),
  email: Yup.string()
    .required("E-mail é obrigatório")
    .matches(emailRegex, "Endereço de email inválido"),
  endereco: Yup.string().required("Endereço é obrigatório"),
  bairro: Yup.string().required("Bairro é obrigatório"),
  cidade: Yup.string().required("Cidade é obrigatório"),
  cep: Yup.string().required("CEP é obrigatório"),
  uf: Yup.string().required("UF é obrigatório"),
});

const initialValues = {
  codigo: "",
  nome: "",
  cpf: "",
  dataNascimento: "",
  dataAdmissao: "",
  dataDemissao: "",
  status: "",
  nomeUsuario: "",
  senhaUsuario: "",
  cargo: "",
  telefone: "",
  email: "",
  endereco: "",
  bairro: "",
  cidade: "",
  cep: "",
  uf: "",
};

const options = {
  headers: { "content-type": "application/json" },
};

export default function FormFuncionario({
  cargos,
  onEdit,
  setExibeTabela,
  setOnEdit,
  funcionarios,
  setFuncionarios,
}) {
  const [selectedCargo, setSelectedCargo] = useState();
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

      setSelectedCargo({
        codigo: onEdit.cargo.codigo,
        nome: onEdit.cargo.nome,
      });
    }
  }, [onEdit]);

  const handleBackButton = () => {
    if (onEdit) setOnEdit(null);
    setExibeTabela(true);
  };

  const handleSubmit = async (values, actions) => {
    const updatedFuncionarios = funcionarios;

    if (onEdit) {
      axios
        .put(`${urlBase}/funcionarios/`, JSON.stringify(values), options)
        .then((response) => {
          // Get index of item on edition
          const index = updatedFuncionarios.findIndex(
            (i) => i.codigo === onEdit.codigo
          );
          // Replace old values
          updatedFuncionarios[index] = values;
          // Set new list
          setFuncionarios(updatedFuncionarios);
          toast.success(response.data.message);
        })
        .catch(({ response }) => {
          toast.error(response.data.message);
        });
    } else {
      axios
        .post(`${urlBase}/funcionarios/`, JSON.stringify(values), options)
        .then((response) => {
          formikRef.current.setFieldValue("codigo", response.data.id);
          values.codigo = response.data.id;
          updatedFuncionarios.push(values);
          setFuncionarios(updatedFuncionarios);
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
      <Cabecalho2 texto1={"Cadastro"} texto2={"Funcionario"} />
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
                    controlId="formFuncionario.codigo"
                    label="Código"
                    name="codigo"
                    value={values.codigo}
                    isDisabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.nome"
                    label="Nome"
                    name="nome"
                    placeholder="Informe o nome do funcionário"
                    value={values.nome}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formFuncionario.cpf"
                    label="CPF"
                    name="cpf"
                    placeholder="Informe o CPF do funcionário"
                    format="###.###.###-##"
                    mask="_"
                    value={values.cpf}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.dataNascimento"
                    label="Data de Nascimento"
                    name="dataNascimento"
                    type="date"
                    value={values.dataNascimento}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.dataAdmissao"
                    label="Data de Admissão"
                    name="dataAdmissao"
                    type="date"
                    value={values.dataAdmissao}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.dataDemissao"
                    label="Data de Demissão"
                    name="dataDemissao"
                    type="date"
                    value={values.dataDemissao}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormSelectField
                    controlId="formFuncionario.status"
                    label="Status"
                    name="status"
                    className="mb-3"
                    value={values.status}
                    required
                  >
                    <option value="">Selecione o status do funcionário</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </FormSelectField>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <SearchBar
                    controlId="formFuncionario.cargo"
                    label="Cargo"
                    name="cargo"
                    placeholder="Informe o cargo"
                    data={cargos}
                    keyField="codigo"
                    searchField="nome"
                    select={setSelectedCargo}
                    selected={selectedCargo}
                    value={values.cargo}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.endereco"
                    label="Endereço"
                    name="endereco"
                    placeholder="Informe o endereço do funcionário"
                    value={values.endereco}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.bairro"
                    label="Bairro"
                    name="bairro"
                    placeholder="Informe o bairro do funcionário"
                    value={values.bairro}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.cidade"
                    label="Cidade"
                    name="cidade"
                    placeholder="Informe o cidade do funcionário"
                    value={values.cidade}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <FormSelectField
                    controlId="formFuncionario.uf"
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

                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formFuncionario.cep"
                    label="CEP"
                    name="cep"
                    placeholder="Informe a CEP do funcionário"
                    value={values.cep}
                    format="#####-###"
                    mask="_"
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formFuncionario.telefone"
                    label="Telefone"
                    name="telefone"
                    placeholder="Informe o telefone do funcionário"
                    value={values.telefone}
                    format="(##) #####-####"
                    mask="_"
                    required
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.email"
                    label="E-mail"
                    name="email"
                    placeholder="Informe o e-mail do funcionário"
                    value={values.email}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.nomeUsuario"
                    label="Usuário"
                    name="nomeUsuario"
                    placeholder="Informe um nome de usuário ao funcionário"
                    value={values.nomeUsuario}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formFuncionario.senhaUsuario"
                    label="Senha"
                    name="senhaUsuario"
                    type="password"
                    placeholder="Informe uma senha de usuário ao funcionário"
                    value={values.senhaUsuario}
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