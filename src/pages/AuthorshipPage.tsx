import { Link } from 'react-router-dom';
import { APP_VERSION } from '../config/app';

export function AuthorshipPage() {
  return <>
    <Link className="back-link" to="/dogs">‹ Perros y ajustes</Link>
    <div className="page-heading">
      <p className="eyebrow">Información legal</p>
      <h1>Autoría y propiedad intelectual</h1>
    </div>

    <section className="card authorship-intro">
      <p>Esta aplicación ha sido concebida, diseñada y desarrollada por José María Quirós Iglesias como herramienta de apoyo al entrenamiento de Rally Obedience.</p>
      <p>© 2026 José María Quirós Iglesias. Todos los derechos reservados sobre el código fuente, la arquitectura funcional, la interfaz, la documentación original, la organización de los entrenamientos, la base de datos propia y los contenidos creados específicamente para esta aplicación.</p>
      <p>Las señales oficiales de Rally Obedience, sus denominaciones, descripciones reglamentarias y cualquier otro material perteneciente a la Real Sociedad Canina de España (RSCE), la Fédération Cynologique Internationale (FCI) u otros titulares se incluyen únicamente como material de referencia para el entrenamiento y continúan siendo propiedad de sus respectivos titulares. La presente aplicación no reivindica ningún derecho de propiedad intelectual sobre dichos contenidos.</p>
      <p>Esta aplicación es un desarrollo independiente y no constituye un producto oficial de la RSCE ni de la FCI, salvo autorización expresa de dichas entidades.</p>
    </section>

    <section className="card legal-block">
      <h2>Autoría del desarrollo</h2>
      <dl>
        <div><dt>Autor</dt><dd>José María Quirós Iglesias</dd></div>
        <div><dt>Año</dt><dd>2026</dd></div>
        <div><dt>Tipo de proyecto</dt><dd>Herramienta independiente de entrenamiento</dd></div>
        <div><dt>Versión actual</dt><dd>{APP_VERSION}</dd></div>
      </dl>
    </section>

    <section className="card legal-block">
      <h2>Elementos propios de la aplicación</h2>
      <p>La autoría comprende:</p>
      <ul>
        <li>código fuente;</li><li>arquitectura funcional;</li><li>interfaz original;</li>
        <li>documentación;</li><li>organización de las sesiones;</li><li>lógica de entrenamiento;</li>
        <li>base de datos propia;</li><li>textos originales creados específicamente para la aplicación.</li>
      </ul>
    </section>

    <section className="card legal-block">
      <h2>Materiales de terceros</h2>
      <p>No se reivindica la propiedad sobre:</p>
      <ul>
        <li>señales oficiales;</li><li>numeración oficial;</li><li>denominaciones reglamentarias;</li>
        <li>descripciones oficiales;</li><li>reglamentos;</li><li>logotipos de entidades;</li>
        <li>otros contenidos pertenecientes a RSCE, FCI o terceros.</li>
      </ul>
      <p>Estos materiales continúan siendo propiedad de sus respectivos titulares y su inclusión no implica afiliación, patrocinio ni reconocimiento oficial.</p>
    </section>
  </>;
}
