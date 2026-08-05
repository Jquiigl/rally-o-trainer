import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { signals } from '../content/signals';
import { buildExamQuestions } from '../domain/exam';
import { OfficialSignalSign } from '../components/OfficialSignalSign';

export function ExamPage() {
  const [variant, setVariant] = useState(0);
  const questions = useMemo(() => buildExamQuestions(signals, `${new Date().toISOString().slice(0, 10)}:${variant}`), [variant]);
  const [index, setIndex] = useState(0); const [score, setScore] = useState(0); const [answered, setAnswered] = useState<string | null>(null);
  const question = questions[index];
  if (!question) return <section className="center-card"><p className="eyebrow">Resultado</p><h1>{score} de {questions.length}</h1><p>{score >= 8 ? 'Buen reconocimiento de las señales.' : 'Repasa las fichas y vuelve a intentarlo cuando quieras.'}</p><button className="button button--primary" onClick={() => { setVariant((value) => value + 1); setIndex(0); setScore(0); setAnswered(null); }}>Nuevo examen</button><Link className="button button--ghost" to="/signals">Repasar señales</Link></section>;
  const correct = answered === question.signalId;
  const correctSignal = getSignalSafe(question.signalId);
  function answer(signalId: string) { if (answered) return; setAnswered(signalId); if (signalId === question.signalId) setScore((value) => value + 1); }
  return <>
    <Link className="back-link" to="/">‹ Inicio</Link>
    <div className="exam-progress"><span>Pregunta {index + 1} de {questions.length}</span><progress value={index + (answered ? 1 : 0)} max={questions.length} /></div>
    <section className="card exam-card"><p className="eyebrow">¿Qué señal describe?</p><h1>{question.prompt}</h1><div className="answer-list">{question.options.map((signalId) => { const signal = getSignalSafe(signalId); const state = answered ? signalId === question.signalId ? 'correct' : signalId === answered ? 'wrong' : '' : ''; return <button key={signalId} className={state} disabled={Boolean(answered)} onClick={() => answer(signalId)}><OfficialSignalSign signal={signal} compact /><span><strong>{signal.officialNumber}</strong>{signal.name}</span></button>; })}</div>{answered && <div className={`feedback ${correct ? 'correct' : 'wrong'}`} role="status"><strong>{correct ? 'Correcto' : 'La respuesta correcta es otra.'}</strong><OfficialSignalSign signal={correctSignal} compact /><p>{correctSignal.regulatoryDescription}</p><button className="button button--primary" onClick={() => { setAnswered(null); setIndex((value) => value + 1); }}>{index === questions.length - 1 ? 'Ver resultado' : 'Siguiente'}</button></div>}</section>
  </>;
}

function getSignalSafe(id: string) { return signals.find((signal) => signal.id === id)!; }
