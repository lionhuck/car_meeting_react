import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"

const LuggageDialog = ({ 
  visible, 
  onHide, 
  onConfirm, 
  luggageTypes, 
  selectedLuggage, 
  setSelectedLuggage 
}) => {
  const isMobile = window.innerWidth <= 768
  
  const dialogFooter = (
    <div className="luggage-dialog-footer">
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button
        label="Confirmar"
        icon="pi pi-check"
        onClick={onConfirm}
        autoFocus
        severity="success"
        style={{
          backgroundColor: "#22c55e",
          border: "none",
          color: "white",
        }}
      />
    </div>
  )

  return (
    <Dialog
      visible={visible}
      style={{ width: isMobile ? "90%" : "450px" }}
      header="Seleccionar Equipaje"
      modal
      className="p-fluid responsive-dialog"
      footer={dialogFooter}
      onHide={onHide}
      breakpoints={{ "960px": "75vw", "640px": "90vw" }}
    >
      <div className="field">
        <label htmlFor="luggage" className="font-bold">
          Tipo de Equipaje
        </label>
        <Dropdown
          id="luggage"
          value={selectedLuggage}
          options={luggageTypes}
          onChange={(e) => setSelectedLuggage(e.value)}
          placeholder="Seleccione un tipo de equipaje"
          className="w-full"
        />
      </div>
    </Dialog>
  )
}

export default LuggageDialog