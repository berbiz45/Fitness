import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dumbbell, Activity, Zap, Bike, Mountain, Waves, X, Plus, ChevronLeft,
  ChevronRight, TrendingUp, Calendar as CalendarIcon, Trash2, Save, ArrowLeft,
  BarChart3, Loader2, Footprints, LogOut, User
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { supabase } from './supabaseClient.js';
import Auth from './Auth.jsx';

// ============================================================
// CONFIGURACION DE DEPORTES
// ============================================================
const SPORTS = {
  gimnasio: {
    label: 'Gimnasio', short: 'GYM', color: '#C8FF4D', Icon: Dumbbell, type: 'sets',
    setFields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number' },
      { key: 'reps', label: 'Reps', unit: '', type: 'number' },
      { key: 'rpe', label: 'RPE', unit: '/10', type: 'number' },
      { key: 'tempo', label: 'Tempo', unit: '', type: 'text', placeholder: '3-1-1-0' },
      { key: 'descanso', label: 'Descanso', unit: 's', type: 'number' },
    ],
    sessionFields: [
      { key: 'duracion', label: 'Duracion total', unit: 'min', type: 'number' },
      { key: 'bodyweight', label: 'Peso corporal', unit: 'kg', type: 'number' },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  funcional: {
    label: 'Funcional', short: 'FUNC', color: '#FF6B35', Icon: Activity, type: 'sets',
    setFields: [
      { key: 'peso', label: 'Peso/Carga', unit: 'kg', type: 'number' },
      { key: 'reps', label: 'Reps', unit: '', type: 'number' },
      { key: 'tiempo', label: 'Tiempo', unit: 's', type: 'number' },
      { key: 'rpe', label: 'RPE', unit: '/10', type: 'number' },
      { key: 'descanso', label: 'Descanso', unit: 's', type: 'number' },
    ],
    sessionFields: [
      { key: 'duracion', label: 'Duracion total', unit: 'min', type: 'number' },
      { key: 'tipo_wod', label: 'Tipo de WOD', unit: '', type: 'select', options: ['AMRAP', 'EMOM', 'For Time', 'Tabata', 'Circuito', 'Otro'] },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'fc_max', label: 'FC maxima', unit: 'bpm', type: 'number' },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  pliometria: {
    label: 'Pliometria', short: 'PLIO', color: '#4DD8FF', Icon: Zap, type: 'sets',
    setFields: [
      { key: 'reps', label: 'Reps/Saltos', unit: '', type: 'number' },
      { key: 'altura', label: 'Altura/Distancia', unit: 'cm', type: 'number' },
      { key: 'rsi', label: 'RSI estimado', unit: '', type: 'number' },
      { key: 'descanso', label: 'Descanso', unit: 's', type: 'number' },
    ],
    sessionFields: [
      { key: 'duracion', label: 'Duracion total', unit: 'min', type: 'number' },
      { key: 'superficie', label: 'Superficie', unit: '', type: 'select', options: ['Tartan', 'Hierba', 'Pista cubierta', 'Arena', 'Otro'] },
      { key: 'cmj', label: 'CMJ test (si aplica)', unit: 'cm', type: 'number' },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  ciclismo: {
    label: 'Ciclismo', short: 'BICI', color: '#FFB84D', Icon: Bike, type: 'cardio',
    sessionFields: [
      { key: 'distancia', label: 'Distancia', unit: 'km', type: 'number' },
      { key: 'duracion', label: 'Duracion', unit: 'min', type: 'number' },
      { key: 'desnivel', label: 'Desnivel positivo', unit: 'm', type: 'number' },
      { key: 'potencia_media', label: 'Potencia media', unit: 'W', type: 'number' },
      { key: 'potencia_norm', label: 'Potencia normalizada', unit: 'W', type: 'number' },
      { key: 'ftp', label: 'FTP actual', unit: 'W', type: 'number' },
      { key: 'cadencia_media', label: 'Cadencia media', unit: 'rpm', type: 'number' },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'fc_max', label: 'FC maxima', unit: 'bpm', type: 'number' },
      { key: 'tss', label: 'TSS', unit: '', type: 'number' },
      { key: 'velocidad_media', label: 'Velocidad media', unit: 'km/h', type: 'number' },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  ciclismo_indoor: {
    label: 'Ciclismo Indoor', short: 'INDOOR', color: '#FFB84D', Icon: Bike, type: 'cardio',
    sessionFields: [
      { key: 'duracion', label: 'Duracion', unit: 'min', type: 'number' },
      { key: 'potencia_media', label: 'Potencia media', unit: 'W', type: 'number' },
      { key: 'potencia_norm', label: 'Potencia normalizada', unit: 'W', type: 'number' },
      { key: 'ftp', label: 'FTP actual', unit: 'W', type: 'number' },
      { key: 'cadencia_media', label: 'Cadencia media', unit: 'rpm', type: 'number' },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'fc_max', label: 'FC maxima', unit: 'bpm', type: 'number' },
      { key: 'tss', label: 'TSS', unit: '', type: 'number' },
      { key: 'tipo_sesion', label: 'Tipo de sesion', unit: '', type: 'select', options: ['Series', 'Z2 continuo', 'FTP test', 'Recuperacion', 'Otro'] },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  carrera: {
    label: 'Carrera al aire libre', short: 'RUN', color: '#FF4D6D', Icon: Footprints, type: 'cardio',
    sessionFields: [
      { key: 'distancia', label: 'Distancia', unit: 'km', type: 'number' },
      { key: 'duracion', label: 'Duracion', unit: 'min', type: 'number' },
      { key: 'ritmo_medio', label: 'Ritmo medio', unit: 'min/km', type: 'text', placeholder: '4:35' },
      { key: 'desnivel', label: 'Desnivel positivo', unit: 'm', type: 'number' },
      { key: 'cadencia_media', label: 'Cadencia', unit: 'spm', type: 'number' },
      { key: 'potencia_media', label: 'Potencia media', unit: 'W', type: 'number' },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'fc_max', label: 'FC maxima', unit: 'bpm', type: 'number' },
      { key: 'tss', label: 'TSS / Carga', unit: '', type: 'number' },
      { key: 'tipo_sesion', label: 'Tipo de sesion', unit: '', type: 'select', options: ['Rodaje suave', 'Series', 'Tempo', 'Fartlek', 'Largo', 'Competicion', 'Otro'] },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  trail: {
    label: 'Trail', short: 'TRAIL', color: '#7ED957', Icon: Mountain, type: 'cardio',
    sessionFields: [
      { key: 'distancia', label: 'Distancia', unit: 'km', type: 'number' },
      { key: 'duracion', label: 'Duracion', unit: 'min', type: 'number' },
      { key: 'desnivel_pos', label: 'Desnivel positivo', unit: 'm', type: 'number' },
      { key: 'desnivel_neg', label: 'Desnivel negativo', unit: 'm', type: 'number' },
      { key: 'ritmo_medio', label: 'Ritmo medio', unit: 'min/km', type: 'text', placeholder: '6:10' },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'fc_max', label: 'FC maxima', unit: 'bpm', type: 'number' },
      { key: 'tss', label: 'TSS / Carga', unit: '', type: 'number' },
      { key: 'terreno', label: 'Tipo de terreno', unit: '', type: 'select', options: ['Tecnico', 'Mixto', 'Rodante', 'Montana alta'] },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  montanismo: {
    label: 'Montanismo', short: 'MONT', color: '#9B8AFB', Icon: Mountain, type: 'cardio',
    sessionFields: [
      { key: 'distancia', label: 'Distancia', unit: 'km', type: 'number' },
      { key: 'duracion', label: 'Duracion', unit: 'min', type: 'number' },
      { key: 'desnivel_pos', label: 'Desnivel positivo', unit: 'm', type: 'number' },
      { key: 'desnivel_neg', label: 'Desnivel negativo', unit: 'm', type: 'number' },
      { key: 'altitud_max', label: 'Altitud maxima', unit: 'm', type: 'number' },
      { key: 'peso_mochila', label: 'Peso mochila', unit: 'kg', type: 'number' },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'fc_max', label: 'FC maxima', unit: 'bpm', type: 'number' },
      { key: 'dificultad', label: 'Dificultad tecnica', unit: '', type: 'select', options: ['F', 'PD', 'AD', 'D', 'TD', 'ED'] },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
  natacion: {
    label: 'Natacion', short: 'SWIM', color: '#4DCFFF', Icon: Waves, type: 'cardio',
    sessionFields: [
      { key: 'distancia', label: 'Distancia total', unit: 'm', type: 'number' },
      { key: 'duracion', label: 'Duracion', unit: 'min', type: 'number' },
      { key: 'ritmo_100', label: 'Ritmo medio /100m', unit: 'min:s', type: 'text', placeholder: '1:45' },
      { key: 'swolf', label: 'SWOLF medio', unit: '', type: 'number' },
      { key: 'brazadas_min', label: 'Brazadas/min', unit: '', type: 'number' },
      { key: 'estilo', label: 'Estilo principal', unit: '', type: 'select', options: ['Crol', 'Espalda', 'Braza', 'Mariposa', 'Combinado'] },
      { key: 'fc_media', label: 'FC media', unit: 'bpm', type: 'number' },
      { key: 'piscina', label: 'Piscina', unit: 'm', type: 'select', options: ['25', '50', 'Aguas abiertas'] },
      { key: 'sensacion', label: 'Sensacion general', unit: '/10', type: 'number' },
    ],
  },
};
const SPORT_KEYS = Object.keys(SPORTS);

// ============================================================
// UTILIDADES
// ============================================================
const pad = (n) => String(n).padStart(2, '0');
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_SHORT = ['L','M','X','J','V','S','D'];
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function startOfMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekday);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return cells;
}

// ============================================================
// STORAGE HOOK (Supabase, por usuario autenticado)
// ============================================================
function rowToTraining(row) {
  return {
    id: row.id,
    sport: row.sport,
    dateKey: row.date_key,
    time: row.time,
    notes: row.notes || '',
    session: row.session || {},
    exercises: row.exercises || [],
    createdAt: row.created_at,
  };
}

function trainingToRow(training, userId) {
  return {
    id: training.id,
    user_id: userId,
    sport: training.sport,
    date_key: training.dateKey,
    time: training.time,
    notes: training.notes || '',
    session: training.session || {},
    exercises: training.exercises || [],
  };
}

function useTrainings(userId) {
  const [trainings, setTrainings] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoaded(false);
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', userId)
        .order('date_key', { ascending: true });
      if (!cancelled) {
        if (!error && data) {
          const map = {};
          data.forEach((row) => { map[row.id] = rowToTraining(row); });
          setTrainings(map);
        }
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const saveTraining = useCallback(async (training) => {
    setSaving(true);
    const isNew = !trainings[training.id];
    try {
      if (isNew) {
        const row = trainingToRow(training, userId);
        delete row.id; // dejar que Postgres genere el UUID
        const { data, error } = await supabase.from('trainings').insert(row).select().single();
        if (error) throw error;
        const saved = rowToTraining(data);
        setTrainings((prev) => {
          const next = { ...prev };
          delete next[training.id]; // por si había un id temporal
          next[saved.id] = saved;
          return next;
        });
      } else {
        const row = trainingToRow(training, userId);
        const { error } = await supabase.from('trainings').update(row).eq('id', training.id);
        if (error) throw error;
        setTrainings((prev) => ({ ...prev, [training.id]: training }));
      }
    } catch (e) {
      console.error('Error guardando entreno', e);
      alert('No se pudo guardar el entreno. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }, [trainings, userId]);

  const deleteTraining = useCallback(async (id) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('trainings').delete().eq('id', id);
      if (error) throw error;
      setTrainings((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      console.error('Error borrando entreno', e);
      alert('No se pudo borrar el entreno. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }, []);

  return { trainings, loaded, saving, saveTraining, deleteTraining };
}

// ============================================================
// COMPONENTES PEQUENOS
// ============================================================
function Field({ field, value, onChange }) {
  const v = value === undefined || value === null ? '' : value;
  if (field.type === 'select') {
    return (
      <label className="field">
        <span className="field-label">{field.label}</span>
        <select value={v} onChange={(e) => onChange(e.target.value)}>
          <option value="">-</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
    );
  }
  return (
    <label className="field">
      <span className="field-label">{field.label}{field.unit ? <em> ({field.unit})</em> : null}</span>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        inputMode={field.type === 'number' ? 'decimal' : 'text'}
        placeholder={field.placeholder || ''}
        value={v}
        onChange={(e) => onChange(e.target.value)}
        step="any"
      />
    </label>
  );
}

function SportBadge({ sportKey, size = 'md' }) {
  const sport = SPORTS[sportKey];
  if (!sport) return null;
  const { Icon, color, short } = sport;
  return (
    <span className={`sport-badge sport-badge--${size}`} style={{ '--sc': color }}>
      <Icon size={size === 'sm' ? 12 : 14} strokeWidth={2.4} />
      {size !== 'dot' && <span>{short}</span>}
    </span>
  );
}

// ============================================================
// EJERCICIO (bloque de series)
// ============================================================
function ExerciseBlock({ exercise, sportDef, onUpdate, onRemove }) {
  const addSet = () => {
    const newSet = { id: uid() };
    onUpdate({ ...exercise, sets: [...exercise.sets, newSet] });
  };
  const updateSet = (setId, key, value) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.map((s) => (s.id === setId ? { ...s, [key]: value } : s)),
    });
  };
  const removeSet = (setId) => {
    onUpdate({ ...exercise, sets: exercise.sets.filter((s) => s.id !== setId) });
  };

  return (
    <div className="exercise-block">
      <div className="exercise-head">
        <input
          className="exercise-name"
          placeholder="Nombre del ejercicio (ej. Sentadilla trasera)"
          value={exercise.name}
          onChange={(e) => onUpdate({ ...exercise, name: e.target.value })}
        />
        <button className="icon-btn icon-btn--ghost" onClick={onRemove} aria-label="Eliminar ejercicio">
          <Trash2 size={15} />
        </button>
      </div>

      {exercise.sets.length > 0 && (
        <div className="set-table">
          <div className="set-table-header">
            <span>#</span>
            {sportDef.setFields.map((f) => <span key={f.key}>{f.label}{f.unit ? ` (${f.unit})` : ''}</span>)}
            <span></span>
          </div>
          {exercise.sets.map((s, idx) => (
            <div className="set-table-row" key={s.id}>
              <span className="set-num">{idx + 1}</span>
              {sportDef.setFields.map((f) => (
                <input
                  key={f.key}
                  type={f.type === 'number' ? 'number' : 'text'}
                  inputMode={f.type === 'number' ? 'decimal' : 'text'}
                  placeholder={f.placeholder || ''}
                  value={s[f.key] ?? ''}
                  onChange={(e) => updateSet(s.id, f.key, e.target.value)}
                  step="any"
                />
              ))}
              <button className="icon-btn icon-btn--ghost icon-btn--xs" onClick={() => removeSet(s.id)} aria-label="Eliminar serie">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn--add-set" onClick={addSet}>
        <Plus size={14} /> Anadir serie
      </button>
    </div>
  );
}

// ============================================================
// FORMULARIO DE ENTRENO
// ============================================================
function TrainingForm({ initial, onSave, onCancel, onDelete }) {
  const [sportKey, setSportKey] = useState(initial?.sport || null);
  const [time, setTime] = useState(initial?.time || '18:00');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [session, setSession] = useState(initial?.session || {});
  const [exercises, setExercises] = useState(initial?.exercises || []);

  const sportDef = sportKey ? SPORTS[sportKey] : null;

  const addExercise = () => {
    setExercises((prev) => [...prev, { id: uid(), name: '', sets: [{ id: uid() }] }]);
  };
  const updateExercise = (id, updated) => {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? updated : ex)));
  };
  const removeExercise = (id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSave = () => {
    if (!sportKey) return;
    const training = {
      id: initial?.id || uid(),
      sport: sportKey,
      dateKey: initial.dateKey,
      time,
      notes,
      session,
      exercises: sportDef.type === 'sets' ? exercises : [],
      createdAt: initial?.createdAt || new Date().toISOString(),
    };
    onSave(training);
  };

  if (!sportKey) {
    return (
      <div className="sheet-body">
        <h3 className="sheet-subtitle">¿Que entrenaste?</h3>
        <div className="sport-grid">
          {SPORT_KEYS.map((key) => {
            const s = SPORTS[key];
            const { Icon } = s;
            return (
              <button key={key} className="sport-tile" style={{ '--sc': s.color }} onClick={() => setSportKey(key)}>
                <Icon size={22} strokeWidth={1.8} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-body">
      <div className="sheet-toprow">
        <button className="link-back" onClick={() => setSportKey(null)}>
          <ArrowLeft size={14} /> Cambiar deporte
        </button>
        <SportBadge sportKey={sportKey} />
      </div>

      <div className="field-row">
        <label className="field">
          <span className="field-label">Hora</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>

      <h4 className="section-title">Datos de la sesion</h4>
      <div className="field-grid">
        {sportDef.sessionFields.map((f) => (
          <Field
            key={f.key}
            field={f}
            value={session[f.key]}
            onChange={(val) => setSession((prev) => ({ ...prev, [f.key]: val }))}
          />
        ))}
      </div>

      {sportDef.type === 'sets' && (
        <>
          <h4 className="section-title">Ejercicios</h4>
          {exercises.map((ex) => (
            <ExerciseBlock
              key={ex.id}
              exercise={ex}
              sportDef={sportDef}
              onUpdate={(upd) => updateExercise(ex.id, upd)}
              onRemove={() => removeExercise(ex.id)}
            />
          ))}
          <button className="btn btn--add-exercise" onClick={addExercise}>
            <Plus size={15} /> Anadir ejercicio
          </button>
        </>
      )}

      <h4 className="section-title">Notas</h4>
      <textarea
        className="notes-area"
        placeholder="Como te sentiste, condiciones, observaciones tecnicas..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <div className="sheet-actions">
        {initial?.id && onDelete && (
          <button className="btn btn--danger" onClick={() => onDelete(initial.id)}>
            <Trash2 size={15} /> Eliminar
          </button>
        )}
        <div className="sheet-actions-right">
          <button className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn--primary" onClick={handleSave}>
            <Save size={15} /> Guardar entreno
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETALLE DE ENTRENO
// ============================================================
function TrainingDetail({ training, onEdit, onDelete, onClose }) {
  const sportDef = SPORTS[training.sport];
  const { Icon, color } = sportDef;
  const d = new Date(training.dateKey + 'T00:00:00');

  return (
    <div className="sheet-body">
      <div className="detail-header" style={{ '--sc': color }}>
        <div className="detail-header-icon"><Icon size={26} strokeWidth={1.8} /></div>
        <div>
          <div className="detail-header-sport">{sportDef.label}</div>
          <div className="detail-header-date">
            {d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} - {training.time}
          </div>
        </div>
      </div>

      {Object.keys(training.session || {}).some((k) => training.session[k] !== '' && training.session[k] != null) && (
        <>
          <h4 className="section-title">Datos de la sesion</h4>
          <div className="stat-grid">
            {sportDef.sessionFields.map((f) => {
              const val = training.session[f.key];
              if (val === undefined || val === null || val === '') return null;
              return (
                <div className="stat-chip" key={f.key}>
                  <span className="stat-chip-label">{f.label}</span>
                  <span className="stat-chip-value">{val}<small>{f.unit}</small></span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {sportDef.type === 'sets' && training.exercises?.length > 0 && (
        <>
          <h4 className="section-title">Ejercicios</h4>
          {training.exercises.map((ex) => (
            <div className="exercise-readonly" key={ex.id}>
              <div className="exercise-readonly-name">{ex.name || 'Ejercicio sin nombre'}</div>
              {ex.sets?.length > 0 && (
                <div className="set-table set-table--readonly">
                  <div className="set-table-header">
                    <span>#</span>
                    {sportDef.setFields.map((f) => <span key={f.key}>{f.label}</span>)}
                  </div>
                  {ex.sets.map((s, idx) => (
                    <div className="set-table-row set-table-row--readonly" key={s.id}>
                      <span className="set-num">{idx + 1}</span>
                      {sportDef.setFields.map((f) => (
                        <span key={f.key}>{s[f.key] || '-'}</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {training.notes && (
        <>
          <h4 className="section-title">Notas</h4>
          <p className="notes-readonly">{training.notes}</p>
        </>
      )}

      <div className="sheet-actions">
        <button className="btn btn--danger" onClick={() => onDelete(training.id)}>
          <Trash2 size={15} /> Eliminar
        </button>
        <div className="sheet-actions-right">
          <button className="btn btn--ghost" onClick={onClose}>Cerrar</button>
          <button className="btn btn--primary" onClick={onEdit}>Editar</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CALENDARIO
// ============================================================
function CalendarView({ trainings, sportFilter, onDayClick, onTrainingClick }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = useMemo(() => startOfMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const trainingsByDay = useMemo(() => {
    const map = {};
    Object.values(trainings).forEach((t) => {
      if (sportFilter && t.sport !== sportFilter) return;
      if (!map[t.dateKey]) map[t.dateKey] = [];
      map[t.dateKey].push(t);
    });
    Object.values(map).forEach((list) => list.sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    return map;
  }, [trainings, sportFilter]);

  const todayKey = dateKey(today);

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className="icon-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
          <ChevronLeft size={18} />
        </button>
        <span className="calendar-month">{MONTHS[cursor.getMonth()]} <em>{cursor.getFullYear()}</em></span>
        <button className="icon-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {DAYS_SHORT.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="calendar-grid">
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const k = dateKey(d);
          const dayTrainings = trainingsByDay[k] || [];
          const isToday = k === todayKey;
          return (
            <div
              key={i}
              className={`calendar-cell ${inMonth ? '' : 'calendar-cell--out'} ${isToday ? 'calendar-cell--today' : ''}`}
              onClick={() => onDayClick(k)}
            >
              <span className="calendar-cell-num">{d.getDate()}</span>
              <div className="calendar-cell-events">
                {dayTrainings.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    className="calendar-event"
                    style={{ '--sc': SPORTS[t.sport].color }}
                    onClick={(e) => { e.stopPropagation(); onTrainingClick(t); }}
                    title={`${SPORTS[t.sport].label} - ${t.time}`}
                  >
                    {SPORTS[t.sport].short}
                  </button>
                ))}
                {dayTrainings.length > 3 && (
                  <span className="calendar-event-more">+{dayTrainings.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// PROGRESO / GRAFICAS por deporte
// ============================================================
const METRIC_PRESETS = {
  ciclismo: ['potencia_media', 'fc_media', 'distancia', 'tss', 'velocidad_media'],
  ciclismo_indoor: ['potencia_media', 'fc_media', 'tss'],
  carrera: ['distancia', 'fc_media', 'tss'],
  trail: ['distancia', 'desnivel_pos', 'fc_media'],
  montanismo: ['distancia', 'desnivel_pos', 'altitud_max'],
  natacion: ['distancia', 'swolf', 'fc_media'],
  gimnasio: null,
  funcional: ['duracion', 'fc_media'],
  pliometria: ['cmj'],
};

function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function ProgressView({ trainings, sportKey, onTrainingClick }) {
  const sportDef = SPORTS[sportKey];
  const list = useMemo(() => {
    return Object.values(trainings)
      .filter((t) => t.sport === sportKey)
      .sort((a, b) => (a.dateKey + a.time).localeCompare(b.dateKey + b.time));
  }, [trainings, sportKey]);

  const [calOpen, setCalOpen] = useState(true);

  const exerciseNames = useMemo(() => {
    if (sportDef.type !== 'sets') return [];
    const set = new Set();
    list.forEach((t) => t.exercises?.forEach((ex) => { if (ex.name?.trim()) set.add(ex.name.trim()); }));
    return Array.from(set);
  }, [list, sportDef.type]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  useEffect(() => {
    if (exerciseNames.length > 0 && !selectedExercise) setSelectedExercise(exerciseNames[0]);
  }, [exerciseNames, selectedExercise]);

  let chartData = [];
  let chartLines = [];

  if (sportDef.type === 'sets') {
    if (selectedExercise) {
      chartData = list
        .map((t) => {
          const ex = t.exercises?.find((e) => e.name?.trim() === selectedExercise);
          if (!ex || !ex.sets?.length) return null;
          const maxPeso = Math.max(...ex.sets.map((s) => num(s.peso) || 0));
          const volume = ex.sets.reduce((sum, s) => sum + (num(s.peso) || 0) * (num(s.reps) || 0), 0);
          return {
            date: t.dateKey.slice(5),
            'Peso max (kg)': maxPeso || null,
            'Volumen (kg)': volume || null,
            _training: t,
          };
        })
        .filter(Boolean);
      chartLines = ['Peso max (kg)', 'Volumen (kg)'];
    }
  } else {
    const metrics = METRIC_PRESETS[sportKey] || [];
    chartData = list.map((t) => {
      const row = { date: t.dateKey.slice(5), _training: t };
      metrics.forEach((m) => {
        const field = sportDef.sessionFields.find((f) => f.key === m);
        if (field) row[field.label] = num(t.session[m]);
      });
      return row;
    });
    chartLines = metrics.map((m) => sportDef.sessionFields.find((f) => f.key === m)?.label).filter(Boolean);
  }

  const lineColors = ['#C8FF4D', '#FF6B35', '#4DD8FF', '#FF4D6D', '#9B8AFB'];

  return (
    <div className="progress-view">
      <div className="progress-summary">
        <div className="progress-summary-stat">
          <span className="progress-summary-num">{list.length}</span>
          <span className="progress-summary-label">sesiones registradas</span>
        </div>
      </div>

      {sportDef.type === 'sets' && exerciseNames.length > 0 && (
        <div className="exercise-picker">
          {exerciseNames.map((name) => (
            <button
              key={name}
              className={`exercise-pill ${selectedExercise === name ? 'exercise-pill--active' : ''}`}
              style={{ '--sc': sportDef.color }}
              onClick={() => setSelectedExercise(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {chartData.length > 1 ? (
        <div className="chart-card">
          <h4 className="section-title section-title--chart"><TrendingUp size={15} /> Evolucion</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="#2A2F35" vertical={false} />
              <XAxis dataKey="date" stroke="#7A8088" fontSize={11} tickLine={false} axisLine={{ stroke: '#2A2F35' }} />
              <YAxis stroke="#7A8088" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1C2024', border: '1px solid #2A2F35', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#E8E6E0' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9aa0a8' }} />
              {chartLines.map((line, i) => (
                <Line
                  key={line}
                  type="monotone"
                  dataKey={line}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: lineColors[i % lineColors.length] }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-chart">
          <BarChart3 size={26} strokeWidth={1.5} />
          <p>Registra al menos 2 sesiones de {sportDef.label.toLowerCase()} para ver tu evolucion aqui.</p>
        </div>
      )}

      <div className="progress-calendar-toggle" onClick={() => setCalOpen((v) => !v)}>
        <CalendarIcon size={14} /> Calendario de {sportDef.label.toLowerCase()}
      </div>
      {calOpen && (
        <CalendarView
          trainings={trainings}
          sportFilter={sportKey}
          onDayClick={() => {}}
          onTrainingClick={onTrainingClick}
        />
      )}

      <h4 className="section-title">Historial</h4>
      <div className="history-list">
        {list.slice().reverse().map((t) => (
          <button key={t.id} className="history-row" onClick={() => onTrainingClick(t)}>
            <span className="history-row-date">
              {new Date(t.dateKey + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
            <span className="history-row-time">{t.time}</span>
            <span className="history-row-arrow">{'\u203a'}</span>
          </button>
        ))}
        {list.length === 0 && <p className="empty-hint">Aun no hay sesiones de {sportDef.label.toLowerCase()}.</p>}
      </div>
    </div>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
function TrainingApp({ session }) {
  const userId = session.user.id;
  const { trainings, loaded, saving, saveTraining, deleteTraining } = useTrainings(userId);
  const [view, setView] = useState('calendar');
  const [activeSportProgress, setActiveSportProgress] = useState('gimnasio');
  const [showMenu, setShowMenu] = useState(false);

  const [sheet, setSheet] = useState(null);

  const openCreate = (dKey) => setSheet({ mode: 'create', dateKey: dKey });
  const openDetail = (training) => setSheet({ mode: 'detail', training });
  const openEdit = (training) => setSheet({ mode: 'edit', training });
  const closeSheet = () => setSheet(null);

  const handleSave = (training) => {
    saveTraining(training);
    closeSheet();
  };
  const handleDelete = (id) => {
    deleteTraining(id);
    closeSheet();
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!loaded) {
    return (
      <div className="app-loading">
        <style>{CSS}</style>
        <Loader2 className="spin" size={28} />
      </div>
    );
  }

  return (
    <div className="app">
      <style>{CSS}</style>

      <header className="app-header">
        <div className="app-header-brand">
          <div className="brand-mark">PR</div>
          <div>
            <div className="brand-title">PERF<em>LOG</em></div>
            <div className="brand-sub">Cuaderno de rendimiento</div>
          </div>
        </div>
        <div className="app-header-right">
          {saving && <Loader2 className="spin" size={15} style={{ opacity: 0.5 }} />}
          <button className="icon-btn icon-btn--user" onClick={() => setShowMenu((v) => !v)}>
            <User size={16} />
          </button>
          {showMenu && (
            <div className="user-menu">
              <span className="user-menu-email">{session.user.email}</span>
              <button className="user-menu-logout" onClick={handleLogout}>
                <LogOut size={13} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <nav className="tabbar">
        <button className={`tab ${view === 'calendar' ? 'tab--active' : ''}`} onClick={() => setView('calendar')}>
          <CalendarIcon size={15} /> Calendario
        </button>
        <button className={`tab ${view === 'progress' ? 'tab--active' : ''}`} onClick={() => setView('progress')}>
          <TrendingUp size={15} /> Progreso
        </button>
      </nav>

      <main className="app-main">
        {view === 'calendar' && (
          <>
            <CalendarView
              trainings={trainings}
              sportFilter={null}
              onDayClick={openCreate}
              onTrainingClick={openDetail}
            />
            <button className="fab" onClick={() => openCreate(dateKey(new Date()))} aria-label="Anadir entreno">
              <Plus size={22} strokeWidth={2.4} />
            </button>
          </>
        )}

        {view === 'progress' && (
          <>
            <div className="sport-tabs">
              {SPORT_KEYS.map((key) => {
                const s = SPORTS[key];
                const { Icon } = s;
                return (
                  <button
                    key={key}
                    className={`sport-tab ${activeSportProgress === key ? 'sport-tab--active' : ''}`}
                    style={{ '--sc': s.color }}
                    onClick={() => setActiveSportProgress(key)}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{s.short}</span>
                  </button>
                );
              })}
            </div>
            <ProgressView
              trainings={trainings}
              sportKey={activeSportProgress}
              onTrainingClick={openDetail}
            />
          </>
        )}
      </main>

      {sheet && (
        <div className="sheet-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}>
          <div className="sheet">
            <div className="sheet-handle" />
            <div className="sheet-header">
              <span className="sheet-title">
                {sheet.mode === 'create' && 'Nuevo entreno'}
                {sheet.mode === 'edit' && 'Editar entreno'}
                {sheet.mode === 'detail' && (sheet.training?.dateKey ? new Date(sheet.training.dateKey + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '')}
              </span>
              <button className="icon-btn" onClick={closeSheet}><X size={18} /></button>
            </div>

            {sheet.mode === 'create' && (
              <TrainingForm
                initial={{ dateKey: sheet.dateKey }}
                onSave={handleSave}
                onCancel={closeSheet}
              />
            )}
            {sheet.mode === 'edit' && (
              <TrainingForm
                initial={sheet.training}
                onSave={handleSave}
                onCancel={() => openDetail(sheet.training)}
                onDelete={handleDelete}
              />
            )}
            {sheet.mode === 'detail' && (
              <TrainingDetail
                training={sheet.training}
                onEdit={() => openEdit(sheet.training)}
                onDelete={handleDelete}
                onClose={closeSheet}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = cargando, null = sin sesión

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="app-loading">
        <style>{CSS}</style>
        <Loader2 className="spin" size={28} color="#C8FF4D" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <TrainingApp session={session} />;
}

// ============================================================
// ESTILOS
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

* { box-sizing: border-box; }

.app {
  --bg: #14171A;
  --bg-card: #1C2024;
  --bg-card-2: #20252A;
  --border: #2A2F35;
  --text: #E8E6E0;
  --text-dim: #9aa0a8;
  --text-faint: #5e6469;
  --accent: #C8FF4D;
  font-family: 'Oswald', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 24px;
}

.app-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #14171A;
  color: #C8FF4D;
}
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 14px;
}
.app-header-brand { display: flex; align-items: center; gap: 11px; }
.app-header-right { display: flex; align-items: center; gap: 10px; position: relative; }
.icon-btn--user { border-radius: 50%; }
.user-menu {
  position: absolute;
  top: 40px; right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex; flex-direction: column; gap: 8px;
  min-width: 180px;
  z-index: 30;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
}
.user-menu-email { font-size: 11px; color: var(--text-faint); word-break: break-all; }
.user-menu-logout {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: none;
  color: #FF8A8A; font-family: 'Oswald'; font-size: 12.5px;
  cursor: pointer; padding: 0;
}
.brand-mark {
  width: 34px; height: 34px;
  background: var(--accent);
  color: #14171A;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 7px;
  letter-spacing: 0.5px;
}
.brand-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 19px;
  letter-spacing: 1.5px;
  line-height: 1;
}
.brand-title em { color: var(--accent); font-style: normal; }
.brand-sub { font-size: 10.5px; color: var(--text-faint); letter-spacing: 0.4px; margin-top: 2px; text-transform: uppercase; }

.tabbar {
  display: flex;
  gap: 6px;
  padding: 0 18px 14px;
}
.tab {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-dim);
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab--active {
  background: var(--accent);
  border-color: var(--accent);
  color: #14171A;
  font-weight: 600;
}

.app-main { padding: 0 14px; position: relative; }

.calendar { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 14px; }
.calendar-nav { display: flex; align-items: center; justify-content: space-between; padding: 2px 4px 12px; }
.calendar-month { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; }
.calendar-month em { color: var(--accent); font-style: normal; font-weight: 400; margin-left: 4px; }
.calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px; }
.calendar-weekdays span { text-align: center; font-size: 10.5px; color: var(--text-faint); letter-spacing: 0.5px; padding-bottom: 6px; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.calendar-cell {
  aspect-ratio: 1;
  border-radius: 8px;
  background: var(--bg-card-2);
  padding: 4px 4px 3px;
  display: flex; flex-direction: column;
  cursor: pointer;
  border: 1px solid transparent;
  min-height: 44px;
  transition: border-color 0.15s ease;
}
.calendar-cell:hover { border-color: var(--border); }
.calendar-cell--out { opacity: 0.28; }
.calendar-cell--today { border-color: var(--accent); }
.calendar-cell-num { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
.calendar-cell--today .calendar-cell-num { color: var(--accent); font-weight: 600; }
.calendar-cell-events { display: flex; flex-wrap: wrap; gap: 2px; margin-top: auto; }
.calendar-event {
  font-size: 7.5px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  background: color-mix(in srgb, var(--sc) 22%, transparent);
  color: var(--sc);
  border: none;
  border-radius: 4px;
  padding: 2px 3px;
  cursor: pointer;
  line-height: 1.3;
}
.calendar-event-more { font-size: 7.5px; color: var(--text-faint); align-self: center; }

.fab {
  position: fixed;
  bottom: 26px; right: 50%;
  transform: translateX(214px);
  width: 54px; height: 54px;
  border-radius: 50%;
  background: var(--accent);
  color: #14171A;
  border: none;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(200,255,77,0.3);
  cursor: pointer;
  z-index: 20;
}
@media (max-width: 560px) {
  .fab { right: 22px; transform: none; }
}

.sheet-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: flex-end;
  z-index: 50;
}
.sheet {
  background: var(--bg);
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  max-height: 90vh;
  border-radius: 20px 20px 0 0;
  overflow-y: auto;
  border-top: 1px solid var(--border);
  animation: sheetUp 0.22s ease-out;
}
@keyframes sheetUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.sheet-handle { width: 36px; height: 4px; background: var(--border); border-radius: 2px; margin: 10px auto 0; }
.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px;
  position: sticky; top: 0;
  background: var(--bg);
  z-index: 2;
}
.sheet-title { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 0.6px; text-transform: capitalize; }
.sheet-body { padding: 4px 18px 28px; }
.sheet-toprow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.link-back { background: none; border: none; color: var(--text-dim); font-size: 12.5px; display: flex; align-items: center; gap: 5px; cursor: pointer; font-family: 'Oswald'; }

.sheet-subtitle { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.5px; margin: 6px 0 16px; }

.sport-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
.sport-tile {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 16px 6px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text);
  cursor: pointer;
  font-family: 'Oswald'; font-size: 11px; font-weight: 500;
  text-align: center;
  line-height: 1.2;
}
.sport-tile:hover { border-color: var(--sc); color: var(--sc); }
.sport-tile svg { color: var(--sc); }

.sport-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: color-mix(in srgb, var(--sc) 18%, transparent);
  color: var(--sc);
  border-radius: 6px;
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.3px;
}

.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 14px;
  letter-spacing: 0.8px;
  color: var(--text-dim);
  text-transform: uppercase;
  margin: 20px 0 10px;
  display: flex; align-items: center; gap: 6px;
}
.field-row { display: flex; gap: 10px; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 11px; color: var(--text-faint); letter-spacing: 0.2px; }
.field-label em { font-style: normal; opacity: 0.7; }
.field input, .field select {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 10px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  width: 100%;
}
.field select { font-family: 'Oswald'; }
.field input:focus, .field select:focus { outline: none; border-color: var(--accent); }

.exercise-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
}
.exercise-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.exercise-name {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 4px 2px 7px;
  color: var(--text);
  font-family: 'Oswald'; font-size: 14.5px; font-weight: 500;
}
.exercise-name:focus { outline: none; border-color: var(--accent); }
.exercise-name::placeholder { color: var(--text-faint); font-weight: 400; }

.set-table { display: flex; flex-direction: column; gap: 5px; }
.set-table-header, .set-table-row {
  display: grid;
  grid-template-columns: 18px repeat(5, 1fr) 18px;
  gap: 5px;
  align-items: center;
}
.set-table-header span {
  font-size: 8.5px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.3px;
  text-align: center;
}
.set-table-row input {
  background: var(--bg-card-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 3px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  text-align: center;
  width: 100%;
  min-width: 0;
}
.set-table-row input:focus { outline: none; border-color: var(--accent); }
.set-num { font-size: 11px; color: var(--text-faint); text-align: center; font-family: 'JetBrains Mono', monospace; }

.set-table--readonly .set-table-row { grid-template-columns: 18px repeat(5, 1fr); }
.set-table-row--readonly span { font-size: 11.5px; text-align: center; font-family: 'JetBrains Mono', monospace; color: var(--text); }

.icon-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-dim);
  border-radius: 8px;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.icon-btn--ghost { background: transparent; border-color: transparent; }
.icon-btn--xs { width: 22px; height: 22px; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  border-radius: 9px;
  padding: 10px 16px;
  font-family: 'Oswald'; font-size: 13px; font-weight: 500; letter-spacing: 0.3px;
  cursor: pointer;
  border: 1px solid transparent;
}
.btn--add-set {
  background: transparent;
  border: 1px dashed var(--border);
  color: var(--text-dim);
  width: 100%;
  font-size: 12px;
  padding: 7px;
  margin-top: 4px;
}
.btn--add-exercise {
  background: var(--bg-card);
  border: 1px dashed var(--border);
  color: var(--accent);
  width: 100%;
  margin-bottom: 8px;
}
.btn--primary { background: var(--accent); color: #14171A; font-weight: 600; }
.btn--ghost { background: transparent; color: var(--text-dim); border-color: var(--border); }
.btn--danger { background: transparent; color: #FF6B6B; border-color: rgba(255,107,107,0.3); }

.notes-area {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--text);
  font-family: 'Oswald'; font-size: 13px;
  resize: vertical;
}
.notes-area:focus { outline: none; border-color: var(--accent); }
.notes-readonly { font-size: 13.5px; color: var(--text-dim); line-height: 1.5; }

.sheet-actions {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.sheet-actions-right { display: flex; gap: 8px; }

.detail-header {
  display: flex; align-items: center; gap: 12px;
  background: color-mix(in srgb, var(--sc) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--sc) 30%, transparent);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 6px;
}
.detail-header-icon { color: var(--sc); }
.detail-header-sport { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.5px; }
.detail-header-date { font-size: 11.5px; color: var(--text-dim); text-transform: capitalize; }

.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.stat-chip {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 9px 8px;
  display: flex; flex-direction: column; gap: 3px;
}
.stat-chip-label { font-size: 9px; color: var(--text-faint); letter-spacing: 0.2px; line-height: 1.2; }
.stat-chip-value { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; color: var(--accent); }
.stat-chip-value small { font-size: 9px; color: var(--text-faint); font-weight: 400; margin-left: 2px; }

.exercise-readonly { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin-bottom: 8px; }
.exercise-readonly-name { font-family: 'Oswald'; font-size: 14px; font-weight: 600; margin-bottom: 8px; }

.sport-tabs {
  display: flex; gap: 6px; overflow-x: auto;
  padding-bottom: 4px; margin-bottom: 12px;
  scrollbar-width: none;
}
.sport-tabs::-webkit-scrollbar { display: none; }
.sport-tab {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-dim);
  border-radius: 9px;
  padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  font-weight: 600;
  cursor: pointer;
}
.sport-tab svg { color: var(--sc); }
.sport-tab--active { border-color: var(--sc); color: var(--sc); background: color-mix(in srgb, var(--sc) 10%, transparent); }

.progress-summary { display: flex; margin-bottom: 14px; }
.progress-summary-stat { display: flex; flex-direction: column; }
.progress-summary-num { font-family: 'Bebas Neue', sans-serif; font-size: 36px; color: var(--accent); line-height: 1; }
.progress-summary-label { font-size: 11px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.4px; margin-top: 2px; }

.exercise-picker { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 12px; scrollbar-width: none; }
.exercise-picker::-webkit-scrollbar { display: none; }
.exercise-pill {
  flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-dim);
  border-radius: 20px;
  padding: 7px 13px;
  font-size: 12px;
  font-family: 'Oswald';
  cursor: pointer;
  white-space: nowrap;
}
.exercise-pill--active { border-color: var(--sc); color: var(--sc); background: color-mix(in srgb, var(--sc) 12%, transparent); }

.chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 14px 6px 8px; margin-bottom: 16px; }
.section-title--chart { padding-left: 8px; margin-top: 0; }

.empty-chart {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  background: var(--bg-card); border: 1px dashed var(--border); border-radius: 14px;
  padding: 28px 20px; text-align: center; color: var(--text-faint);
  margin-bottom: 16px;
}
.empty-chart p { font-size: 12.5px; line-height: 1.5; margin: 0; }

.progress-calendar-toggle {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 14px; letter-spacing: 0.6px; text-transform: uppercase;
  color: var(--text-dim);
  cursor: pointer;
  margin-bottom: 10px;
}

.history-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.history-row {
  display: flex; align-items: center; gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 10px 12px;
  cursor: pointer;
  color: var(--text);
  font-family: 'Oswald';
}
.history-row-date { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; text-transform: capitalize; }
.history-row-time { font-size: 11.5px; color: var(--text-faint); margin-left: auto; }
.history-row-arrow { color: var(--text-faint); }
.empty-hint { font-size: 12.5px; color: var(--text-faint); text-align: center; padding: 16px 0; }

@media (prefers-reduced-motion: reduce) {
  .sheet, .spin { animation: none !important; }
}
`;
