// Единственный источник правды доступа на Szeged. Клиент и сервер.
// Ключ 1: логин 'МТТ'. Ключ 2: DEV-владелец (кто забрал промокод LXX42P2ILX).
export const SZEGED_LOGIN = 'МТТ';
function isMtt(login: string | null | undefined): boolean { return login === SZEGED_LOGIN; }
export function canSee(login: string | null | undefined, isDev = false): boolean { return isMtt(login) || isDev; }
export function canCreate(login: string | null | undefined, isDev = false): boolean { return isMtt(login) || isDev; }
export function canJoin(login: string | null | undefined, isDev = false): boolean { return isMtt(login) || isDev; }
export function visibleInList(login: string | null | undefined, isDev = false): boolean { return isMtt(login) || isDev; }
