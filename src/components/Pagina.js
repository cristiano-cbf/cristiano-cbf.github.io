import Cabecalho1 from "./Cabecalho1";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Pagina(props) {
  return (
    <>
      <Cabecalho1 />
      <div>{props.children}</div>
      <ToastContainer
        autoClose={3000}
        position={toast.POSITION.TOP_CENTER}
        theme="colored"
      />
    </>
  );
}
