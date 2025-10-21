import "../styles/Homepage.css";

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

      <section className="info-section">

        <div className="section-block">
          <div className="section-image">
            <img src="/Logo SyspyME completo.png" alt="Gestión inteligente" />
          </div>
          <div className="section-text">
            <h3>Gestión inteligente</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="section-block reverse">
          <div className="section-image">
            <img src="/Logo SyspyME completo.png" alt="Facturación electrónica" />
          </div>
          <div className="section-text">
            <h3>Facturación electrónica</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="section-block">
          <div className="section-image">
            <img src="/Logo SyspyME completo.png" alt="Crece con SysPyME" />
          </div>
          <div className="section-text">
            <h3>Crece con SysPyME</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-card">
          <img src="/Logo SyspyME completo.png" alt="Mario A. Pinto" className="team-photo" />
          <h3>Mario A. Pinto</h3>
          <p>Ingeniero de requerimientos</p>
        </div>

        <div className="team-card">
          <img src="/Logo SyspyME completo.png" alt="Esteban Guzmán" className="team-photo" />
          <h3>Esteban Guzmán</h3>
          <p>Ingeniero de bases de datos</p>
        </div>

        <div className="team-card">
          <img src="/Logo SyspyME completo.png" alt="Fabian A. Barón" className="team-photo" />
          <h3>Fabian A. Barón</h3>
          <p>Ingeniero de Backend</p>
        </div>

        <div className="team-card">
          <img src="/Logo SyspyME completo.png" alt="Santiago Ramírez" className="team-photo" />
          <h3>Santiago Ramírez</h3>
          <p>Ingeniero de Frontend</p>
        </div>
      </section>
    </div>
  );
}

export default Homepage;

