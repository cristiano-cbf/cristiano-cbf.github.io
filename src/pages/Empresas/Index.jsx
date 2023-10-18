import { useEffect, useState } from "react";
import Form from "./Form";
import List from "./List";
import { urlBase } from "../../utils/definicoes";
import axios from "../../lib/api";
import { toast } from "react-toastify";

export default function TelaCadastroEmpresas(props) {
  const [exibeTabela, setExibeTabela] = useState(true);
  const [onEdit, setOnEdit] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [filtro, setFiltro] = useState("");

  const getEmpresas = async () => {
    try {
      const res = await axios.get(urlBase + "/empresas");
      if (Array.isArray(res.data)) {
        setEmpresas(res.data);
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter empresas: ${response.data.message}`);
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
    getEmpresas();
    getEscolas();
  }, [setEmpresas]);

  return exibeTabela ? (
    <List
      empresas={empresas}
      setEmpresas={setEmpresas}
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
      empresas={empresas}
      setEmpresas={setEmpresas}
      setExibeTabela={setExibeTabela}
    />
  );
}
