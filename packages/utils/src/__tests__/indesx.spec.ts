import { expect, it } from 'vitest';
import { generateId } from '../index';

it('generateId', () => {
  expect(generateId()).toMatch(/^.{8}$/);
});
