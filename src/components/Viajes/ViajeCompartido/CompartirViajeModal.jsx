import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";

const CompartirViajeModal = ({ visible, onHide, viaje, toast }) => {
  const [mensajeCompartir, setMensajeCompartir] = useState("");
  const [compartirUrl, setCompartirUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil al montar el componente
  useEffect(() => {
    const checkIfMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkIfMobile());
  }, []);

  // Función para formatear fecha en el formato deseado
  const formatDateForMessage = (dateString) => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }

      const weekdayOptions = { weekday: 'long' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
      
      const dayName = date.toLocaleDateString('es-ES', weekdayOptions);
      const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      const time = date.toLocaleTimeString('es-ES', timeOptions);
      
      return {
        dayName: capitalizedDayName,
        day: date.getDate(),
        time: time
      };
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return {
        dayName: 'Fecha inválida',
        day: '--',
        time: '--:--'
      };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR').format(price);
  };

  useEffect(() => {
    if (viaje) {
      const shareUrl = `${window.location.origin}/viaje-compartido/${viaje.id}`;
      setCompartirUrl(shareUrl);
      
      const fechaInfo = viaje.fecha_salida ? formatDateForMessage(viaje.fecha_salida) : {
        dayName: '',
        day: '',
        time: ''
      };
      
      const mensajePredeterminado = `🚗 OFREZCO VIAJE CarMeeting
➡ De ${viaje.origen?.nombre || "Origen desconocido"} a ${viaje.destino?.nombre || "Destino desconocido"}
📆 ${fechaInfo.dayName} ${fechaInfo.day}
⏰ ${fechaInfo.time}
💰 $${viaje.precio ? formatPrice(viaje.precio) : "--"}`;
      
      setMensajeCompartir(mensajePredeterminado);
    }
  }, [viaje]);

  const copyToClipboard = () => {
    const textoCompleto = `${mensajeCompartir}\n\n${compartirUrl}`;
    
    navigator.clipboard.writeText(textoCompleto)
      .then(() => {
        toast.current.show({ 
          severity: "success", 
          summary: "Copiado", 
          detail: "El mensaje y enlace se copiaron al portapapeles", 
          life: 3000 
        });
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        toast.current.show({ 
          severity: "error", 
          summary: "Error", 
          detail: "No se pudo copiar el texto", 
          life: 3000 
        });
      });
  };

  const compartirViaNativo = () => {
    if (navigator.share) {
      navigator.share({
        title: `Viaje de ${viaje?.origen?.nombre || ""} a ${viaje?.destino?.nombre || ""}`,
        text: mensajeCompartir,
        url: compartirUrl
      })
      .catch(error => {
        console.error('Error al compartir:', error);
        // Fallback a copiar si falla el compartir nativo
        copyToClipboard();
      });
    } else {
      // Esto no debería ocurrir ya que el botón solo se muestra en móviles con soporte
      copyToClipboard();
    }
  };

  return (
    <Dialog
      header="Compartir Viaje"
      visible={visible}
      onHide={onHide}
      style={{ width: "90%", maxWidth: "500px" }}
      breakpoints={{ "960px": "80vw", "640px": "90vw" }}
    >
      <div className="compartir-modal-content">
        <h3>Personaliza tu mensaje</h3>
        <InputTextarea
          value={mensajeCompartir}
          onChange={(e) => setMensajeCompartir(e.target.value)}
          rows={5}
          autoResize
          className="w-full mb-3"
        />
        
        <Divider />
        
        <div className="compartir-options">
          <h4>Opciones para compartir:</h4>
          
          <div className="flex flex-wrap gap-2 justify-content-center mt-3">
            <Button
              label="Copiar mensaje"
              icon="pi pi-copy"
              className="p-button-secondary"
              onClick={copyToClipboard}
              tooltip="Copia el mensaje y enlace para pegarlo donde prefieras"
              tooltipOptions={{ position: 'top' }}
            />
            
            {isMobile && navigator.share && (
              <Button
                label="Compartir directamente"
                icon="pi pi-share-alt"
                className="p-button-info"
                onClick={compartirViaNativo}
                tooltip="Abre el menú de compartir de tu dispositivo"
                tooltipOptions={{ position: 'top' }}
              />
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CompartirViajeModal;