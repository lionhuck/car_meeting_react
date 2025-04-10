import { useState, useEffect } from "react"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Toast } from "primereact/toast"

const PasajerosModal = ({ visible, onHide, viajeId, token, toast }) => {
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (visible && viajeId) {
      fetchParticipantes()
    }
  }, [visible, viajeId])

  const fetchParticipantes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/viajes/${viajeId}/participantes`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        // Obtener detalles de equipaje para cada pasajero
        const participantesConEquipaje = await Promise.all(
          data.map(async (participante) => {
            if (!participante.esConductor) {
              // Solo para pasajeros, no para el conductor
              const equipajeResponse = await fetch(`${API_URL}/viajes/${viajeId}/pasajeros/${participante.id}/equipaje`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              })
              
              if (equipajeResponse.ok) {
                const equipajeData = await equipajeResponse.json()
                return { ...participante, equipaje: equipajeData.categoria }
              }
            }
            return participante
          })
        )
        setParticipantes(participantesConEquipaje)
      } else {
        toast.current.show({ 
          severity: "error", 
          summary: "Error", 
          detail: "No se pudieron cargar los participantes", 
          life: 3000 
        })
      }
    } catch (error) {
      toast.current.show({ 
        severity: "error", 
        summary: "Error", 
        detail: error.message, 
        life: 3000 
      })
    } finally {
      setLoading(false)
    }
  }

  const eliminarPasajero = async (pasajeroId) => {
    try {
      const response = await fetch(`${API_URL}/viajes/${viajeId}/pasajeros/${pasajeroId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.current.show({ 
          severity: "success", 
          summary: "Éxito", 
          detail: "Pasajero eliminado correctamente", 
          life: 3000 
        })
        // Actualizar la lista de participantes
        fetchParticipantes()
      } else {
        const errorData = await response.json()
        toast.current.show({ 
          severity: "error", 
          summary: "Error", 
          detail: errorData.error || "No se pudo eliminar al pasajero", 
          life: 3000 
        })
      }
    } catch (error) {
      toast.current.show({ 
        severity: "error", 
        summary: "Error", 
        detail: error.message, 
        life: 3000 
      })
    }
  }

  const confirmarEliminacion = (pasajero) => {
    confirmDialog({
      message: (
        <div>
          ¿Estás seguro de que deseas eliminar a <strong>{pasajero.nombre} {pasajero.apellido}</strong> del viaje?
        </div>
      ),
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => eliminarPasajero(pasajero.id),
    })
  }

  const actionBodyTemplate = (rowData) => {
    if (rowData.esConductor) {
      return <span className="font-italic text-gray-500">Conductor</span>
    }
    
    return (
      <Button 
        icon="pi pi-trash" 
        className="p-button-rounded p-button-danger" 
        onClick={() => confirmarEliminacion(rowData)}
        tooltip="Eliminar pasajero"
      />
    )
  }

  const equipajeBodyTemplate = (rowData) => {
    if (rowData.esConductor) {
      return <span>-</span>
    }
    
    return <span>{rowData.equipaje || "No especificado"}</span>
  }

  const tipoBodyTemplate = (rowData) => {
    return <span>{rowData.esConductor ? "Conductor" : "Pasajero"}</span>
  }

  const nombreCompletoTemplate = (rowData) => {
    return <span><strong>{`${rowData.nombre} ${rowData.apellido}`}</strong></span>
  }

  return (
    <>
      <Dialog
        header="Participantes del Viaje"
        visible={visible}
        onHide={onHide}
        style={{ width: '80vw', maxWidth: '950px' }}
        maximizable
        modal
      >
        <DataTable
          value={participantes}
          loading={loading}
          rows={11}
          emptyMessage="No hay participantes en este viaje"
          className="p-datatable-sm"
        >
          <Column field="tipo" header="Tipo" body={tipoBodyTemplate} />
          <Column header="Nombre" body={nombreCompletoTemplate} />
          <Column header="Equipaje" body={equipajeBodyTemplate} />
          <Column header="Acciones" body={actionBodyTemplate} style={{ width: '8rem' }} />
        </DataTable>
      </Dialog>
      <ConfirmDialog />
    </>
  )
}

export default PasajerosModal