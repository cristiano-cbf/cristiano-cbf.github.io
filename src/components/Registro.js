export default function Registro(props) {
  return (
    <>
      {props.registros.map((registro, i) => {
        return (
          <div key={i} className="w-75 p-3 mb-4 border border-radius">
            <p style={{ textAlign: "justify" }}>{registro.descricao}</p>
            <div className="d-flex justify-content-between">
              <div className="text-muted">Enviado em {registro.dataRegistro}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
