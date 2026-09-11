// Единственный источник правды доступа на Szeged. Клиент и сервер.
export const SZEGED_LOGIN = 'МТТ';
function isMtt(login: string | null | undefined): boolean { return login === SZEGED_LOGIN; }
export function canSee(login: string | null | undefined): boolean { return isMtt(login); }
export function canCreate(login: string | null | undefined): boolean { return isMtt(login); }
export function canJoin(login: string | null | undefined): boolean { return isMtt(login); }
export function visibleInList(login: string | null | undefined): boolean { return isMtt(login); }
