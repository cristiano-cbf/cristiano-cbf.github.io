import { useState, useEffect } from "react";
import Form from "./Form";
import List from "./List";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TelaCadastroEscolas(props) {
  const [exibeTabela, setExibeTabela] = useState(true);
  const [onEdit, setOnEdit] = useState(null);
  const [escolas, setEscolas] = useState([]);
  const [filtro, setFiltro] = useState("");

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
    getEscolas();
  }, [setEscolas]);

  return exibeTabela ? (
    <List
      escolas={escolas}
      setEscolas={setEscolas}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      escolas={escolas}
      setEscolas={setEscolas}
      setExibeTabela={setExibeTabela}
    />
  );
}
