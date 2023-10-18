import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import { useRef, useEffect, useState } from "react";
import Cabecalho2 from "../../components/Cabecalho2";
import { urlBase } from "../../utils/definicoes";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar/Index";
import axios from "../../lib/api";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../../components/Form/form-field";
import { emailRegex } from "../../utils/expressions";
import FormSelectField from "../../components/Form/form-select-field";
import MaskedFormTextField from "../../components/Form/masked-form-field";

const schema = Yup.object().shape({
  rg: Yup.string().required("RG é obrigatório"),
  cpf: Yup.string().required("CPF é obrigatório"),
  nome_mae: Yup.string().required("Nome da mãe é obrigatório"),
  dt_nasc: Yup.string().required("Data de nascimento é obrigatório"),
  escola: Yup.object().required("Escola é obrigatório"),
  serie: Yup.string().required("Série é obrigatório"),
  periodo: Yup.string().required("Período é obrigatório"),
  nome: Yup.string().required("Nome é obrigatório"),
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
  rg: "",
  cpf: "",
  nome_mae: "",
  dt_nasc: "",
  escola: "",
  serie: "",
  periodo: "",
  nome: "",
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

export default function FormAluno({
  escolas,
  onEdit,
  setExibeTabela,
  setOnEdit,
  alunos,
  setAlunos,
}) {

  const [selectedEscola, setSelectedEscola] = useState();
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

      setSelectedEscola({
        codigo: onEdit.escola.codigo,
        nome: onEdit.escola.nome,
      });
    }
  }, [onEdit]);

  const handleBackButton = () => {
    if (onEdit) setOnEdit(null);
    setExibeTabela(true);
  };

  const handleSubmit = async (values, actions) => {
    console.log("Dados antes de enviar:", values);
    const updatedAlunos = alunos;

    if (onEdit) {
      axios
        .put(`${urlBase}/alunos/`, JSON.stringify(values), options)
        .then((response) => {
          console.log("Resposta do servidor:", response);
          const index = updatedAlunos.findIndex(
            (i) => i.codigo === onEdit.codigo
          );
          updatedAlunos[index] = values;
          setAlunos(updatedAlunos);
          toast.success(response.data.message);
        })
        .catch(({ response }) => {
          console.error("Erro do servidor:", response);
          toast.error(response.data.message);
        });
    } else {
      axios
        .post(`${urlBase}/alunos/`, JSON.stringify(values), options)
        .then((response) => {
          formikRef.current.setFieldValue("codigo", response.data.id);
          values.codigo = response.data.id;
          updatedAlunos.push(values);
          setAlunos(updatedAlunos);
          console.log("Alunos atualizados:", updatedAlunos);
          toast.success(response.data.message);
        })
        .catch(({ response }) => {
          console.error("Erro do servidor:", response);
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
      <Cabecalho2 texto1={"Cadastro"} texto2={"Aluno"} />
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
                    controlId="formAluno.codigo"
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
                    controlId="formAluno.nome"
                    label="Nome"
                    name="nome"
                    placeholder="Informe o nome do aluno"
                    value={values.nome}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.nome_mae"
                    label="Nome da Mãe"
                    name="nome_mae"
                    placeholder="Informe o nome da mãe do aluno"
                    value={values.nome_mae}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.dt_nasc"
                    label="Data de Nascimento"
                    name="dt_nasc"
                    type="date"
                    value={values.dt_nasc}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formAluno.rg"
                    label="RG"
                    name="rg"
                    format="##.###.###-#"
                    mask="_"
                    placeholder="Informe o RG do aluno"
                    value={values.rg}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formAluno.cpf"
                    label="CPF"
                    name="cpf"
                    format="###.###.###-##"
                    mask="_"
                    placeholder="Informe o CPF do aluno"
                    value={values.cpf}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.endereco"
                    label="Endereço"
                    name="endereco"
                    placeholder="Informe o endereço do aluno"
                    value={values.endereco}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.bairro"
                    label="Bairro"
                    name="bairro"
                    placeholder="Informe o bairro do aluno"
                    value={values.bairro}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.cidade"
                    label="Cidade"
                    name="cidade"
                    placeholder="Informe o cidade do aluno"
                    value={values.cidade}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormSelectField
                    controlId="formAluno.uf"
                    label="UF"
                    name="uf"
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
                    controlId="formAluno.cep"
                    label="CEP"
                    name="cep"
                    format="#####-###"
                    mask="_"
                    placeholder="Informe a CEP do aluno"
                    value={values.cep}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <MaskedFormTextField
                    controlId="formAluno.telefone"
                    label="Telefone"
                    name="telefone"
                    format="(##) #####-####"
                    mask="_"
                    placeholder="Informe o telefone do aluno"
                    value={values.telefone}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.email"
                    label="E-mail"
                    name="email"
                    placeholder="Informe o e-mail do aluno"
                    value={values.email}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <SearchBar
                    controlId="formAlunos.escola"
                    label="Escola"
                    name="escola"
                    placeholder="Informe a escola"
                    data={escolas}
                    keyField="codigo"
                    searchField="nome"
                    select={setSelectedEscola}
                    selected={selectedEscola}
                    value={values.escola}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <FormTextField
                    controlId="formAluno.serie"
                    label="Série"
                    name="serie"
                    placeholder="Informe a série do aluno"
                    value={values.serie}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <FormSelectField
                    controlId="formAluno.periodo"
                    label="Período"
                    name="periodo"
                    className="mb-3"
                    value={values.periodo}
                    required
                  >
                    <option value="">Selecione um período</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                  </FormSelectField>
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
