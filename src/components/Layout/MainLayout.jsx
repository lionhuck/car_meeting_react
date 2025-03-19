import { Sidebar } from "primereact/sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import "../Common/MainLayout.css"
import Footer from "../Footer/Footer.jsx"

const MainLayout = ({ children, title = "CAR MEETING" }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [location.pathname])

  const authenticatedItems = [
    { label: "Viajes", icon: "pi pi-car", url: "/viajes" },
    { label: "Crear Viaje", icon: "pi pi-warehouse", url: "/cargar-viaje" },
    { label: "Viajes Aceptados", icon: "pi pi-bookmark", url: "/viajes-aceptados" },
    { label: "Viajes Propuestos", icon: "pi pi-check", url: "/viajes-propuestos" },
    { label: "Viajes en Curso CONDUCTOR", icon: "pi pi-spinner", url: "/viajes-en-curso" },
    { label: "Viajes Finalizados", icon: "pi pi-check-circle", url: "/viajes-finalizados" },
    { label: "Editar Perfil", icon: "pi pi-user-edit", url: "/editar-perfil"}
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setVisible(false)
    navigate("/inicio-sesion")
  }

  const handleNavigation = (url) => {
    navigate(url)
    if (isMobile) {
      setVisible(false)
    }
  }

  if (!isAuthenticated) {
    return <div>{children}</div>
  }

  return (
    <div className="layout">
      {/* Sidebar for mobile view */}
      <Sidebar visible={visible} onHide={() => setVisible(false)} className="p-sidebar-sm mobile-sidebar">
        <h2 className="sidebar-title">Menú</h2>
        {authenticatedItems.map((item, index) => (
          <Button
            key={index}
            label={item.label}
            icon={item.icon}
            className="p-button-text w-full sidebar-button"
            onClick={() => handleNavigation(item.url)}
          />
        ))}
        <Button
          label="Cerrar Sesión"
          icon="pi pi-sign-out"
          className="p-button-danger w-full mt-3"
          onClick={handleLogout}
        />
      </Sidebar>

      {/* Desktop header */}
      <header className="desktop-header">
        <div className="header-logo">
          <h1>{title}</h1>
        </div>
        <nav className="desktop-nav">
          {!isMobile && (
            <div className="nav-buttons">
              {authenticatedItems.map((item, index) => (
                <Button
                  key={index}
                  label={item.label}
                  icon={item.icon}
                  className={`p-button-text nav-button ${location.pathname === item.url ? "active" : ""}`}
                  onClick={() => handleNavigation(item.url)}
                />
              ))}
              <Button
                label="Cerrar Sesión"
                icon="pi pi-sign-out"
                className="p-button-danger logout-button"
                onClick={handleLogout}
              />
            </div>
          )}
        </nav>
      </header>

      {/* Mobile header */}
      <header className="mobile-header">
        <Button icon="pi pi-bars" className="p-button-text menu-button" onClick={() => setVisible(true)} />
        <div className="mobile-nav">
          <Button
            icon="pi pi-car"
            label="Viajes"
            className={`p-button-text ${location.pathname === "/viajes" ? "active" : ""}`}
            onClick={() => handleNavigation("/viajes")}
          />
          <Button icon="pi pi-user" className="p-button-text user-button" onClick={() => handleNavigation("/editar-perfil")} />
        </div>
      </header>

      <div className="main-content">
        <div className="content">{children}</div>
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout

