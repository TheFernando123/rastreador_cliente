import React, { useState } from "react";

// Para representar los datos del envío
type Envio = {
  id: string;
  Folio: number;
  OficinaOrigen: string;
  OficinaDestino: string;
  Remitente: string;
  Receptor: string;
  Seguro: number;
  Total: number;
};

// Para representar los movimientos de un envío
type Movimiento = {
  id: string;
  Fecha: string;
  Movimientos: string;
  Observaciones: string;
};

const GuiaCompleta: React.FC = () => {
  const [folio, setFolio] = useState("");
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [error, setError] = useState<string | null>(null);

  const buscarPorFolio = async () => {
    setError(null);
    setEnvio(null);
    setMovimientos([]);

    if (!folio.trim()) {
      setError("Por favor, ingresa un número de folio válido.");
      return;
    }

    try {
      const res = await fetch(
        "https://688986164c55d5c73952954d.mockapi.io/api/envios"
      );
      const data: Envio[] = await res.json();

      const encontrado = data.find((e) => e.Folio.toString() === folio);

      if (!encontrado) {
        setError("No se encontró un envío con ese folio.");
        return;
      }

      setEnvio(encontrado);

      const movRes = await fetch(
        `https://688986164c55d5c73952954d.mockapi.io/api/envios/${encontrado.id}/mov`
      );
      const movs: Movimiento[] = await movRes.json();

      movs.sort(
        (a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
      );

      setMovimientos(movs);
    } catch (err) {
      setError("Ocurrió un error al consultar la API.");
    }
  };

  const limpiarBusqueda = () => {
    setFolio("");
    setEnvio(null);
    setMovimientos([]);
    setError(null);
  };

  const estadoActual = movimientos.length > 0 ? movimientos[0] : null;

  return (
    <div className="container mt-5 mb-5" style={{ paddingTop: "50px" }}>
      <h3
        className="text-center mb-4"
        style={{ color: "var(--color-black-custom)" }}
      >
        Rastreador de Envíos 📦
      </h3>

      <div className="mb-4 d-flex gap-2">
        <input
          type="text"
          value={folio}
          onChange={(e) => setFolio(e.target.value)}
          placeholder="Ingresa el folio"
          className="form-control"
        />

        <button onClick={buscarPorFolio} className="btn btn-primary-custom">
          Buscar
        </button>

        <button onClick={limpiarBusqueda} className="btn btn-outline-secondary">
          Limpiar
        </button>
      </div>

      {error && (
        <div
          className="alert"
          style={{
            backgroundColor: "var(--color-danger)",
            color: "white",
            borderColor: "var(--color-danger)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {estadoActual && (
        <div
          className="card mb-4 shadow-sm border-start border-5"
          style={{
            borderColor: estadoActual.Movimientos.includes("Entregado")
              ? "var(--color-green)"
              : "var(--color-primary-opaco)",
            transition: "border-color 0.3s",
            animation: "fadeInUp 0.6s ease-out 0.1s",
            animationFillMode: "both",
            opacity: 0,
          }}
        >
          <div className="card-body">
            <h6
              className="text-uppercase mb-2"
              style={{
                color: "var(--color-primary)",
                fontWeight: "bold",
              }}
            >
              Estado Actual
            </h6>
            <p
              className="lead fw-bold mb-0"
              style={{ color: "var(--color-black-custom)" }}
            >
              {estadoActual.Movimientos}
            </p>
            <small className="text-muted">
              {new Date(estadoActual.Fecha).toLocaleString()} -{" "}
              {estadoActual.Observaciones}
            </small>
          </div>
        </div>
      )}

      {envio && (
        <div
          className="card mb-4 shadow-lg border-0"
          style={{
            animation: "fadeInUp 0.6s ease-out 0.2s",
            animationFillMode: "both",
            opacity: 0,
            borderRadius: "0.5rem",
          }}
        >
          <div
            className="card-header border-bottom-0"
            style={{
              backgroundColor: "var(--color-primary-opaco)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Datos del Envío
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 border-end">
                <p className="mb-2">
                  <strong style={{ color: "var(--color-primary)" }}>
                    Folio:
                  </strong>{" "}
                  {envio.Folio}
                </p>
                <p className="mb-2">
                  <strong className="text-muted">Remitente:</strong>{" "}
                  {envio.Remitente}
                </p>
                <p className="mb-2">
                  <strong className="text-muted">Origen:</strong>{" "}
                  {envio.OficinaOrigen}
                </p>
              </div>
              {/* Columna Derecha - Detalles de Destino y Costos */}
              <div className="col-md-6">
                <p className="mb-2">
                  <strong className="text-muted">Receptor:</strong>{" "}
                  {envio.Receptor}
                </p>
                <p className="mb-2">
                  <strong className="text-muted">Destino:</strong>{" "}
                  {envio.OficinaDestino}
                </p>
                {/* Solicitud de separación de Total y Seguro */}
                <p className="mb-2">
                  <strong style={{ color: "var(--color-black-custom)" }}>
                    Total :
                  </strong>{" "}
                  ${envio.Total}
                </p>
                <p className="mb-2">
                  <strong style={{ color: "var(--color-green)" }}>
                    Seguro :
                  </strong>{" "}
                  ${envio.Seguro}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de movimientos (Tabla con encabezado negro) */}
      {movimientos.length > 0 && (
        <div className="card shadow-md border-0">
          <div
            className="card-header"
            style={{
              backgroundColor: "var(--color-black-custom)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderRadius: "0.5rem 0.5rem 0 0",
            }}
          >
            Historial de Movimientos
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Movimiento</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov, index) => (
                  <tr
                    key={mov.id}
                    style={{
                      animation: `scaleIn 0.3s ease-out ${index * 0.15}s`,
                      animationFillMode: "both",
                      opacity: 0,
                      backgroundColor:
                        index % 2 === 1 ? "var(--color-row-bg)" : "transparent",
                    }}
                  >
                    <td className="text-muted small">
                      {new Date(mov.Fecha).toLocaleString()}
                    </td>
                    <td
                      className="fw-bold"
                      style={{ color: "var(--color-primary-opaco)" }}
                    >
                      {mov.Movimientos}
                    </td>
                    <td>{mov.Observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiaCompleta;
