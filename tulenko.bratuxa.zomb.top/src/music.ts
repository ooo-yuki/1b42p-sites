import { SONG_DAY, SONG_NIGHT, SONG_ALARM, SONG_CPM } from "./songs.js";
type Kind = "day" | "night" | "alarm";
let ready = false;
let current: Kind | "" = "";
function engine(): { boot(): Promise<unknown>; play(code: string): void; stop(): void } | null {
  try {
    const w = window as unknown as { TulenkoMusic?: { boot(): Promise<unknown>; play(code: string): void; stop(): void } };
    return w.TulenkoMusic ?? null;
  } catch {
    return null;
  }
}
export function bootMusic(): void {
  try {
    const e = engine();
    if (!e) return;
    void e.boot().then(() => { ready = true; if (current) music(current as Kind); }).catch(() => {});
  } catch {
    // без звука — молча дальше
  }
}
export function music(kind: Kind): void {
  current = kind;
  try {
    const e = engine();
    if (!e || !ready) return;
    e.stop();
    const code = kind === "day" ? SONG_DAY : kind === "night" ? SONG_NIGHT : SONG_ALARM;
    e.play("setcpm(" + (kind === "day" ? SONG_CPM.day : kind === "night" ? SONG_CPM.night : SONG_CPM.alarm) + ");" + code);
  } catch {
    // без звука — молча дальше
  }
}
