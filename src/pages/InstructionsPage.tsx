import { Link } from 'react-router-dom';

export function InstructionsPage() {
  return <>
    <div className="page-heading">
      <p className="eyebrow">Ayuda</p>
      <h1>Instrucciones de uso</h1>
      <p>Todo lo necesario para aprovechar Rally O Trainer durante el entrenamiento.</p>
    </div>

    <section className="card card--accent instructions-intro">
      <h2>Qué puedes hacer</h2>
      <p>Seleccionar señales, entrenarlas individualmente o en circuito, registrar resultados, consultar tu progreso y repasar el reglamento mediante fichas y exámenes.</p>
      <p>La aplicación funciona sin registro y guarda los datos en este dispositivo.</p>
    </section>

    <section className="card instruction-block">
      <span className="instruction-number" aria-hidden="true">1</span>
      <div><h2>Configura el entrenamiento</h2><p>Desde Inicio, pulsa <strong>Configurar entrenamiento</strong>. Selecciona una o varias señales, elige el lado cuando corresponda y continúa.</p></div>
    </section>
    <section className="card instruction-block">
      <span className="instruction-number" aria-hidden="true">2</span>
      <div><h2>Elige la modalidad</h2><p><strong>Entrenamiento individual</strong> completa diez intentos de una señal antes de pasar a la siguiente. <strong>Modo circuito</strong> recorre todas las señales seleccionadas y repite el conjunto.</p></div>
    </section>
    <section className="card instruction-block">
      <span className="instruction-number" aria-hidden="true">3</span>
      <div><h2>Registra cada intento</h2><p>Marca únicamente <strong>Correcta</strong> o <strong>Incorrecta</strong>. Puedes deshacer el último resultado, añadir impresiones rápidas y terminar antes si el perro necesita parar.</p></div>
    </section>
    <section className="card instruction-block">
      <span className="instruction-number" aria-hidden="true">4</span>
      <div><h2>Comprueba la evolución</h2><p>En <strong>Progreso</strong> verás el estado de cada señal y lado. Una señal se considera aprendida al lograr al menos 7 aciertos de 10 en dos días diferentes.</p></div>
    </section>

    <section className="card">
      <h2>Otras capacidades</h2>
      <ul className="capability-list">
        <li><strong>Señales:</strong> imagen oficial, descripción reglamentaria, explicación sencilla y consejo de entrenamiento.</li>
        <li><strong>Examen:</strong> practica el reconocimiento de señales sin alterar el progreso del perro.</li>
        <li><strong>Constructor de pistas:</strong> prepara y ordena recorridos para practicarlos.</li>
        <li><strong>Varios perros:</strong> progreso y recomendaciones independientes para cada perro.</li>
        <li><strong>Copias de seguridad:</strong> exporta y restaura todos tus datos desde Perros y configuración.</li>
      </ul>
    </section>

    <section className="card responsible-use">
      <h2>Entrenamiento responsable</h2>
      <p>Trabaja siempre con refuerzo positivo, en una superficie segura y adaptando la sesión al estado del perro. Detén el entrenamiento si observas dolor, miedo, fatiga o frustración creciente.</p>
      <p>Rally O Trainer es una ayuda basada en fuentes oficiales, pero no sustituye al reglamento vigente ni el criterio de un profesional.</p>
    </section>

    <div className="instruction-actions">
      <Link className="button button--primary" to="/train">Configurar entrenamiento</Link>
      <Link className="button button--ghost" to="/">Volver al inicio</Link>
    </div>
  </>;
}
