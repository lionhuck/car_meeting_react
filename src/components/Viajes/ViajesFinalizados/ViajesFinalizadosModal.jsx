import { Dialog } from "primereact/dialog";
import EstrellasCalificacion from "../../Calificacion/EstrellasCalificacion";

const ViajesFinalizadosModal = ({
  visible,
  onHide,
  tripDetails,
  formatDate,
  tipoViaje,
}) => {
  if (!tripDetails) return null;

  return (
    <Dialog
      header={`Detalles del viaje a ${
        tripDetails.destino?.nombre || "Destino no disponible"
      }`}
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
    >
      <div className="trip-details-modal">
        <div className="detail-item">
          <i className="pi pi-map-marker"></i>
          <span>
            <strong>Origen:</strong>{" "}
            {tripDetails.origen?.nombre || "No disponible"}
          </span>
        </div>

        <div className="detail-item">
          <i className="pi pi-flag"></i>
          <span>
            <strong>Destino:</strong>{" "}
            {tripDetails.destino?.nombre || "No disponible"}
          </span>
        </div>

        <div className="detail-item">
          <i className="pi pi-calendar"></i>
          <span>
            <strong>Inicio:</strong> {formatDate(tripDetails.hora_inicio_real)}
          </span>
        </div>

        <div className="detail-item">
          <i className="pi pi-clock"></i>
          <span>
            <strong>Fin:</strong>{" "}
            {formatDate(tripDetails.hora_fin_real) || "No disponible"}
          </span>
        </div>
        <div className="detail-item">
          <i className="pi pi-user" style={{ color: "black" }}></i>
          <span>
            <strong>
              {tipoViaje === "conductor"
                ? "Usted fue el conductor"
                : "Conductor:"}
            </strong>
            {tipoViaje === "pasajero" &&
              ` ${tripDetails.conductor?.nombre} ${tripDetails.conductor?.apellido}`}
          </span>
        </div>

        <div className="detail-item">
          <i className="pi pi-star" style={{ color: "gold" }}></i>
          <span>
            <strong>Calificación:</strong>
          </span>
          <EstrellasCalificacion
            usuarioId={tripDetails.conductor?.id}
            token={JSON.parse(localStorage.getItem("token"))}
            tipo="conductor"
          />
        </div>
        <div className="detail-item">
          <i className="pi pi-dollar" style={{ color: "green" }}></i>
          <span>
            <strong>Precio:</strong> $
            {tripDetails.precio?.toFixed(2) || "No disponible"}
          </span>
        </div>


        {tripDetails.observaciones && (
          <div className="detail-item">
            <i className="pi pi-info-circle" style={{ color: "orange" }}></i>
            <div className="observaciones-full">
              <strong>Observaciones:</strong> {tripDetails.observaciones}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ViajesFinalizadosModal;
