import { useSyncExternalStore } from "react";
import { isProgramId, type ProgramId } from "./programs";
let selected: ProgramId = "bis";
try { const saved = localStorage.getItem("kimep-program-v1"); if (saved && isProgramId(saved)) selected = saved; } catch {}
const listeners = new Set<() => void>();
export function setSelectedProgram(id: string) {
  if (!isProgramId(id) || id === selected) return;
  selected = id;
  try { localStorage.setItem("kimep-program-v1", id); } catch {}
  listeners.forEach(fn => fn());
}
export function useSelectedProgram() {
  return useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => selected, () => "bis" as ProgramId);
}
