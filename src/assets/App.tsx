import GuiaCompleta from "./Guia";

import logo from "./logo.png";
//importamos
function App() {
  return (
    <>
      {" "}
      <img
        src={logo}
        alt="Logo de la empresa"
        className="company-logo position-fixed top-0 start-0"
      />
      <GuiaCompleta />
    </>
  );
}

export default App;
