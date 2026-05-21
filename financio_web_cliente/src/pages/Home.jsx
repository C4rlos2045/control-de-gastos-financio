import {Link} from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/home.css';

function Home() {

  return (

    <>

      <Navbar />

      <main className="home">

        {/* HERO */}

        <section className="hero">

          <div className="hero__content">

            <h1>
              Controla tus finanzas
              de manera inteligente
            </h1>

            <p>

              Administra ingresos,
              gastos y estadísticas
              financieras en tiempo real
              con una experiencia moderna.

            </p>

          </div>

        </section>

        {/* CARACTERISTICAS */}

        <section className="features">

          <h2>
            Funcionalidades
          </h2>

          <div className="features__grid">

            <article className="card">

              <h3>
                Dashboard dinámico
              </h3>

              <p>
                Visualiza tus gastos
                mediante gráficas
                interactivas.
              </p>

            </article>

            <article className="card">

              <h3>
                Control financiero
              </h3>

              <p>
                Gestiona ingresos y
                gastos organizados
                por categorías.
              </p>

            </article>

            <article className="card">

              <h3>
                Estadísticas
              </h3>

              <p>
                Analiza hábitos financieros
                mediante filtros dinámicos.
              </p>

            </article>

          </div>

        </section>

        {/* CTA */}

        <section className="cta">

          <h2>
            Comienza ahora
          </h2>

          <p>
            Lleva el control total
            de tus finanzas personales.
          </p>

          <Link
            to="/register"
            className="btn-primary"
          >
            Crear cuenta
          </Link>

        </section>

      </main>

      <Footer />

    </>
  );
}

export default Home;