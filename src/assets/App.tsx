import GuiaCompleta from "./Guia";

const LOGO_URL = "/rastreador_cliente/logo.png";
//importamos
function App() {
  return (
    <>
      <img
        src={LOGO_URL}
        alt="Logo de la empresa"
        className="company-logo position-fixed top-0 start-0"
      />
      <GuiaCompleta />
    </>
  );
}

export default App;
