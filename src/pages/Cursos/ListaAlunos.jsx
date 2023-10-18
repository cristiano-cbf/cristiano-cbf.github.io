import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlBase } from "../../utils/definicoes";

export default function ListaAlunos({ codigo_curso }) {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${urlBase}/ac/curso/${codigo_curso}`);
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchData();
  }, [codigo_curso]);

  const handleDeleteAluno = async (codigo_aluno) => {
    try {
      await axios.delete(`${urlBase}/ac/curso/${codigo_curso}/aluno/${codigo_aluno}`);
      // Atualiza a lista de alunos após a exclusão
      setAlunos(alunos.filter(aluno => aluno.codigo_aluno !== codigo_aluno));
      alert(`Aluno excluído do curso com sucesso.`);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      alert(`Erro ao excluir aluno.`);
    }
  };

  return (
    <div>
      <h2>Alunos Vinculados ao Curso</h2>
      <ul>
        {alunos.map((aluno, index) => (
          <li key={index}>
            Aluno ID: {aluno.codigo_aluno}
            <button onClick={() => handleDeleteAluno(aluno.codigo_aluno)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
