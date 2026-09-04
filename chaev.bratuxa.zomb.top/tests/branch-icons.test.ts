import { describe, it, expect } from 'vitest';
import { TREE } from '../src/game/zapoi/index';
import { BRANCH_ICON, branchIcon } from '../src/components/zapoi/UpgradeTree';

describe('иконки веток от Дениса: каждая ветка с картинкой', () => {
  it('у всех веток TREE есть иконка', () => {
    const headers = [...new Set(TREE.map((b) => b.br))];
    expect(headers.length).toBeGreaterThan(0);
    for (const h of headers) expect(branchIcon(h)).not.toBe('');
  });
  it('все иконки лежат в public/tree/', () => {
    for (const img of Object.values(BRANCH_ICON)) expect(img.startsWith('tree/')).toBe(true);
  });
  it('неизвестная ветка — пусто, а не падение', () => {
    expect(branchIcon('???')).toBe('');
  });
});
