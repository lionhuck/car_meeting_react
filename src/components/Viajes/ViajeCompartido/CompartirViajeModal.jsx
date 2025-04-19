import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";

const CompartirViajeModal = ({ visible, onHide, viaje, toast }) => {
  const [mensajeCompartir, setMensajeCompartir] = useState("");
  const [compartirUrl, setCompartirUrl] = useState("");

  // Función para formatear fecha en el formato deseado
  const formatDateForMessage = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }

      // Opciones para formatear
      const weekdayOptions = { weekday: 'long' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
      
      // Formatear día de la semana (capitalizado)
      const dayName = date.toLocaleDateString('es-ES', weekdayOptions);
      const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      // Formatear hora
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

  // Función para formatear el precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR').format(price);
  };

  useEffect(() => {
    if (viaje) {
      const shareUrl = `${window.location.origin}/viaje-compartido/${viaje.id}`;
      setCompartirUrl(shareUrl);
      
      // Obtener información de fecha formateada
      const fechaInfo = viaje.fecha_salida ? formatDateForMessage(viaje.fecha_salida) : {
        dayName: '',
        day: '',
        time: ''
      };
      
      // Crear mensaje predeterminado con el formato deseado
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
          detail: "Texto copiado al portapapeles", 
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

  const compartirPorWhatsApp = () => {
    try {
      // Primero preparamos el texto manteniendo los emojis
      const textoParaWhatsApp = `${mensajeCompartir}\n\n${compartirUrl}`;
      
      // Codificamos el texto completo para URL
      const textoCodificado = encodeURIComponent(textoParaWhatsApp)
        .replace(/%0A/g, '%0a') // Asegurar saltos de línea en minúscula
        .replace(/\n/g, '%0a'); // Convertir saltos de línea restantes
      
      // Usamos la URL de WhatsApp Web para mejor compatibilidad
      const whatsappUrl = `https://web.whatsapp.com/send?text=${textoCodificado}`;
      
      // Abrimos en una nueva pestaña
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error('Error al compartir por WhatsApp:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo abrir WhatsApp',
        life: 3000
      });
      
      // Fallback: copiar al portapapeles
      copyToClipboard();
    }
  };

  const compartirGenerico = () => {
    if (navigator.share) {
      navigator.share({
        title: `Viaje de ${viaje?.origen?.nombre || ""} a ${viaje?.destino?.nombre || ""}`,
        text: mensajeCompartir,
        url: compartirUrl
      })
      .catch(error => {
        console.error('Error compartiendo:', error);
        copyToClipboard();
      });
    } else {
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
          <h4>Compartir mediante:</h4>
          
          <div className="flex flex-wrap gap-2 justify-content-center mt-3">
            <Button
              label="WhatsApp"
              icon="pi pi-whatsapp" 
              className="p-button-success"
              onClick={compartirPorWhatsApp}
              style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
            />
            
            <Button
              label="Copiar"
              icon="pi pi-copy"
              className="p-button-secondary"
              onClick={copyToClipboard}
            />
            
            <Button
              label="Compartir"
              icon="pi pi-share-alt"
              className="p-button-info"
              onClick={compartirGenerico}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CompartirViajeModal;