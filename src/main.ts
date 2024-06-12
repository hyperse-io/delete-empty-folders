import fs from 'fs';
import { readdir } from 'fs/promises';
import { dirname, join, relative, resolve } from 'path';
import colors from 'picocolors';
import { Options } from './types.js';
import { deleteDir, deleteDirSync, isEmpty, isValidDir } from './utils.js';

/**
 * Expose deleteEmpty
 * @param cwd
 * @param options
 * @param cb
 * @returns
 */
export const deleteEmpty = (cwd: string, options: Options = {}) => {
  if (typeof cwd !== 'string') {
    return Promise.reject(
      new TypeError('expected the first argument to be a string')
    );
  }

  const opts = options || {};
  const onDirectory = opts.onDirectory || (() => {});
  const empty: string[] = [];

  const remove = async (filepath: string) => {
    const dir = resolve(filepath);

    if (!isValidDir(cwd, dir, empty)) {
      return;
    }

    onDirectory(dir);

    const files = await readdir(dir);

    if (isEmpty(dir, files, empty, opts)) {
      empty.push(dir);

      await deleteDir(dir, opts);

      if (opts.verbose === true) {
        console.log(colors.red('Deleted:'), relative(cwd, dir));
      }

      if (typeof opts.onDelete === 'function') {
        await opts.onDelete(dir);
      }

      return remove(dirname(dir));
    }

    for (const file of files) {
      await remove(join(dir, file));
    }

    return empty;
  };

  return remove(resolve(cwd));
};

export const deleteEmptySync = (cwd: string, options: Options = {}) => {
  if (typeof cwd !== 'string') {
    throw new TypeError('expected the first argument to be a string');
  }

  const opts = options || {};
  const empty: string[] = [];

  const remove = (filepath: string) => {
    const dir = resolve(filepath);

    if (!isValidDir(cwd, dir, empty)) {
      return empty;
    }

    const files = fs.readdirSync(dir);

    if (isEmpty(dir, files, empty, opts)) {
      empty.push(dir);

      deleteDirSync(dir, opts);

      if (opts.verbose === true) {
        console.log(colors.red('Deleted:'), relative(cwd, dir));
      }

      if (typeof opts.onDelete === 'function') {
        opts.onDelete(dir);
      }

      return remove(dirname(dir));
    }

    for (const filepath of files) {
      remove(join(dir, filepath));
    }
    return empty;
  };

  remove(resolve(cwd));

  return empty;
};
