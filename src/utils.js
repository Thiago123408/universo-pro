// Conversões e utilidades
export const G = 6.67430e-11;         // Constante gravitacional real (SI)
export const SOFTENING = 1e9;         // Suavização para evitar explosões numéricas em encontros muito próximos
export const MAX_DT = 1/60;           // passo máximo de simulação (segundos simulados por frame base)
export const TRAIL_LEN = 180;         // quantidade de pontos no traçado

export function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
export function lerp(a,b,t){ return a+(b-a)*t; }

export function fmt(v) {
  if (Math.abs(v) >= 1e9 || Math.abs(v) < 1e-3) return v.toExponential(2);
  return v.toFixed(2);
}

export function nowStr(){
  const d=new Date();
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
}
