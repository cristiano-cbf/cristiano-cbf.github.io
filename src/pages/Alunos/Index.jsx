import { useState, useEffect } from "react";
import Form from "./Form";
import List from "./List";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TelaCadastroAlunos(props) {
  const [exibeTabela, setExibeTabela] = useState(true);
  const [onEdit, setOnEdit] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [filtro, setFiltro] = useState("");

  const getAlunos = async () => {
    try {
      const res = await axios.get(urlBase + "/alunos");
      if (Array.isArray(res.data)) {
        setAlunos(res.data);
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter alunos: ${response.data.message}`);
    }
  };

  
  const getEscolas = async () => {
    try {
      const res = await axios.get(urlBase + "/escolas");
      if (Array.isArray(res.data)) {
        setEscolas(res.data);
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter escolas: ${response.data.message}`);
    }
  };

  useEffect(() => {
    getAlunos();
    getEscolas();
  }, [setAlunos]);

  return exibeTabela ? (
    <List
      alunos={alunos}
      setAlunos={setAlunos}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
    escolas={escolas}
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      alunos={alunos}
      setAlunos={setAlunos}
      setExibeTabela={setExibeTabela}
    />
  );
}
