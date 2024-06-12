import fs from 'fs';
import { rimrafSync } from 'rimraf';
import readdir from '@folder/readdir';
import { deleteEmpty, deleteEmptySync } from '../src/index.js';
import { getDirname } from './getDirname.js';
import { copy } from './support/copy.js';

const fixtures = (fragment: string) =>
  getDirname(import.meta.url, 'fixtures', fragment);

const expected = [
  fixtures('temp/a/aa/aaa'),
  fixtures('temp/a/aa/aaa/aaaa'),
  fixtures('temp/b'),
  fixtures('temp/c'),
];

const noNested = (files: string[]) =>
  files.filter((file) => !/nested/.test(file));

const filter = (file: any) => file.isDirectory();

let folders: string[] = [];

describe('deleteEmpty', () => {
  afterEach(() => {
    rimrafSync(fixtures('temp'));
  });

  beforeEach(async () => {
    await copy(fixtures('paths'), fixtures('temp'));
    folders = readdir.sync(fixtures('temp/nested'), {
      filter,
      recursive: true,
      absolute: true,
    });
    folders.sort();
  });

  describe('promise', () => {
    it('should delete the given cwd if empty', async () => {
      await deleteEmpty(fixtures('temp/b'));
      expect(fs.existsSync(fixtures('temp/b'))).toBe(false);
    });

    it('should delete nested directories', async () => {
      await deleteEmpty(fixtures('temp'));
      expect(fs.existsSync(fixtures('temp/a/aa/aaa'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/b'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/c'))).toBe(false);
    });

    it('should return the array of deleted directories', async () => {
      const deleted = await deleteEmpty(fixtures('temp'));
      expect(noNested(deleted || []).sort()).toEqual(expected.sort());
    });
  });

  describe('promise - options.dryRun', () => {
    it('should not delete the given cwd if empty', async () => {
      await deleteEmpty(fixtures('temp/b'), { dryRun: true });
      expect(fs.existsSync(fixtures('temp/b'))).toBe(true);
    });

    it('should not delete nested directories', async () => {
      await deleteEmpty(fixtures('temp'), { dryRun: true });
      expect(fs.existsSync(fixtures('temp/a/aa/aaa'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/b'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/c'))).toBe(true);
    });

    it('should delete deeply nested directories', async () => {
      const deleted = await deleteEmpty(fixtures('temp/nested'));
      expect(deleted?.length).greaterThan(folders?.length);
    });

    it('should return the array of empty directories', async () => {
      const deleted = await deleteEmpty(fixtures('temp'));
      expect(noNested(deleted || []).sort()).toEqual(expected.sort());
    });

    it('should not delete directories when options.dryRun is true', async () => {
      await deleteEmpty(fixtures('temp'), { dryRun: true });
      for (const folder of folders) {
        expect(fs.existsSync(folder)).toBe(true);
      }
    });
  });

  describe('async', () => {
    it('should delete the given cwd if empty', async () => {
      await deleteEmpty(fixtures('temp/b'));
      expect(fs.existsSync(fixtures('temp/b'))).toBe(false);
    });

    it('should delete nested directories', async () => {
      await deleteEmpty(fixtures('temp'));
      expect(fs.existsSync(fixtures('temp/a/aa/aaa'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/b'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/c'))).toBe(false);
    });

    it('should return the array of deleted directories', async () => {
      const deleted = await deleteEmpty(fixtures('temp'));
      expect(noNested(deleted || []).sort()).toEqual(expected.sort());
    });
  });

  describe('async - options.dryRun', () => {
    it('should not delete the given cwd if empty', async () => {
      await deleteEmpty(fixtures('temp/b'), { dryRun: true });
      expect(fs.existsSync(fixtures('temp/b'))).toBe(true);
    });

    it('should not delete nested directories', async () => {
      await deleteEmpty(fixtures('temp'), { dryRun: true });
      expect(fs.existsSync(fixtures('temp/a/aa/aaa'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/b'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/c'))).toBe(true);
    });

    it('should return the array of empty directories', async () => {
      const deleted = await deleteEmpty(fixtures('temp'), { dryRun: true });
      expect(noNested(deleted || []).sort()).toEqual(expected.sort());
    });
  });

  describe('sync', () => {
    it('should delete the given cwd if empty', () => {
      deleteEmptySync(fixtures('temp/b'));
      expect(fs.existsSync(fixtures('temp/b'))).toBe(false);
    });

    it('should delete nested directories', () => {
      deleteEmptySync(fixtures('temp'));
      expect(fs.existsSync(fixtures('temp/a/aa/aaa/aaaa'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/a/aa/aaa'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/b'))).toBe(false);
      expect(fs.existsSync(fixtures('temp/c'))).toBe(false);
    });

    it('should return the array of deleted directories', () => {
      const deleted = deleteEmptySync(fixtures('temp'));
      expect(noNested(deleted).sort()).toEqual(expected.sort());
    });
  });

  describe('sync - options.dryRun', () => {
    it('should not delete the given cwd if empty', () => {
      deleteEmptySync(fixtures('temp/b'), { dryRun: true });
      expect(fs.existsSync(fixtures('temp/b'))).toBe(true);
    });

    it('should not delete nested directories', () => {
      deleteEmptySync(fixtures('temp'), { dryRun: true });
      expect(fs.existsSync(fixtures('temp/a/aa/aaa/aaaa'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/a/aa/aaa'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/b'))).toBe(true);
      expect(fs.existsSync(fixtures('temp/c'))).toBe(true);
    });

    it('should return the array of empty directories', () => {
      const deleted = deleteEmptySync(fixtures('temp'), { dryRun: true });
      expect(noNested(deleted).sort()).toEqual(expected.sort());
    });
  });
});
