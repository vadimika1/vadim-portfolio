// Цели Яндекс Метрики. Номер счётчика — VITE_METRIKA_ID при сборке; без него цели молча не отправляются.
type Ym = (id: number, method: 'reachGoal', goal: string, params?: Record<string, string>) => void;

export type Goal = 'login' | 'case_open' | 'site_click' | 'icq_sent' | 'classic_open' | 'resume_pdf';

export const METRIKA_ID = Number(import.meta.env.VITE_METRIKA_ID ?? 0);

export function goal(name: Goal, params?: Record<string, string>): void {
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (METRIKA_ID && ym) ym(METRIKA_ID, 'reachGoal', name, params);
}
