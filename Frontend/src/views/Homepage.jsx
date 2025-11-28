import "../styles/Views/Homepage.css";

function Homepage() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>
          “Gestiona, cumple y crece: <br /> contabilidad fácil para MiPyMEs.”
        </h1>
      </section>


      <section className="welcome-section">
        <div className="welcome-text">
          <h2>
            Bienvenido a <span>SysPyME</span>
          </h2>
          <p>
            Digitaliza y gestiona tu contabilidad en una plataforma segura y
            sencilla. Cumple la normativa, integra facturación electrónica y
            optimiza tu MiPyME para crecer y enfocarte en tu negocio.
          </p>
        </div>
      </section>

          <section className="steps-section">
        <h2>¿Cómo empezar con <span>SysPyME</span>?</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Registra tu empresa</h3>
            <p>Crea tu cuenta en pocos minutos. Solo necesitas tu información básica y correo electrónico, en la parte
              superior izquierda de la página verás Registra tu empresa 
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Configura tu empresa</h3>
            <p>Ingresa los datos de tu MiPyme que serán para tu inicio de sesión.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Comienza a gestionar</h3>
            <p>Emite facturas, gestiona inventario y lleva el control de tu contabilidad de forma sencilla.</p>
          </div>
        </div>
      </section>

      <section className="info-section">

        <div className="section-block">
          <div className="section-image">
            <img src="/Organiza inventario.jpg" alt="Gestión inteligente" />
          </div>
          <div className="section-text">
            <h3>Gestión inteligente</h3>
            <p>
            SyspyME es la herramienta que transforma la manera en que las pymes administran su negocio. Centraliza tus procesos, automatiza tareas y te brinda información clara para tomar decisiones rápidas y acertadas.
Con una interfaz moderna y fácil de usar, Syspyme te permite gestionar tu empresa desde cualquier navegador, optimizando tiempos, reduciendo errores y potenciando tu productividad.
Es más que un software: es tu aliado para crecer, organizarte y llevar tu negocio al siguiente nivel.
            </p>
          </div>
        </div>

        <div className="section-block reverse">
          <div className="section-image">
            <img src="/Facturación Electronica.jpg" alt="Facturación electrónica" />
          </div>
          <div className="section-text">
            <h3>Facturación electrónica</h3>
            <p>
            Con SyspyME, la facturación electrónica se vuelve simple, rápida y completamente automatizada. Genera facturas válidas ante la DIAN en segundos, sin procesos complicados ni herramientas externas.
  El sistema centraliza tus clientes, productos y comprobantes, permitiéndote emitir, enviar y consultar facturas desde cualquier navegador. Además, Syspyme mantiene todos tus documentos organizados, seguros y siempre disponibles.
  Ahorra tiempo, reduce errores y garantiza el cumplimiento legal con una solución diseñada para que tu negocio facture sin estrés.
            </p>
          </div>
        </div>

        <div className="section-block">
          <div className="section-image">
            <img src="/Crece con Syspyme.jpg" alt="Crece con SysPyME" />
          </div>
          <div className="section-text">
            <h3>Crece con SysPyME</h3>
            <p>
            SyspyME evoluciona contigo. A medida que tu empresa amplía sus servicios, clientes o alcance, la plataforma se adapta para seguirte el ritmo. Nuestro enfoque está en brindarte estabilidad, soporte continuo y herramientas que fortalecen tus operaciones a medida que avanzas.
Ya sea que estés iniciando o expandiéndote, SyspyME te ofrece una base sólida para que crezcas seguro, con una solución que escala sin complicaciones y que siempre está lista para dar el siguiente paso contigo.
            </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-card">
          <img src="/Mario.jpeg" alt="Mario A. Pinto" className="team-photo" />
          <h3>Mario A. Pinto</h3>
          <p>Ingeniero de requerimientos</p>
        </div>

        <div className="team-card">
          <img src="/Esteban.jpeg" alt="Esteban Guzmán" className="team-photo" />
          <h3>Esteban Guzmán</h3>
          <p>Ingeniero de bases de datos</p>
        </div>

        <div className="team-card">
          <img src="/Fabian.jpeg" alt="Fabian A. Barón" className="team-photo" />
          <h3>Fabian A. Barón</h3>
          <p>Ingeniero de Backend</p>
        </div>

        <div className="team-card">
          <img src="/Santiago.jpeg" alt="Santiago Ramírez" className="team-photo" />
          <h3>Santiago Ramírez</h3>
          <p>Ingeniero de Frontend</p>
        </div>
      </section>
    </div>
  );
}

export default Homepage;

