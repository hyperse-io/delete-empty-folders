import { statSync } from 'fs';
import { join } from 'path';
import { rimraf, rimrafSync } from 'rimraf';
import { pathStartsWith } from './pathStartsWith.js';
import { Options } from './types.js';
/**
 * Helpers
 */
const GARBAGE_REGEX = /(?:Thumbs\.db|\.DS_Store)$/i;

const isGarbageFile = (file: string, regex: RegExp = GARBAGE_REGEX) =>
  regex.test(file);

const filterGarbage: Options['filter'] = (file: string, regex?: RegExp) =>
  !isGarbageFile(file, regex);

/**
 * Returns true if the given filepath exists and is a directory
 */
const isDirectory = (dir: string) => {
  try {
    return statSync(dir).isDirectory();
  } catch {
    /* do nothing */
  }
  return false;
};

/**
 * Return true if the given `files` array has zero length or only
 * includes unwanted files.
 */
export const isEmpty = (
  dir: string,
  files: string[],
  empty: string[],
  options: Options = {}
) => {
  const filter = options.filter || filterGarbage;
  const regex = options.junkRegex;

  for (const basename of files) {
    const filepath = join(dir, basename);

    if (
      !(options.dryRun && empty.includes(filepath)) &&
      filter(filepath, regex) === true
    ) {
      return false;
    }
  }
  return true;
};

export const isValidDir = (cwd: string, dir: string, empty: string[]) => {
  return !empty.includes(dir) && pathStartsWith(dir, cwd) && isDirectory(dir);
};

export const deleteDir = async (dirname: string, options: Options = {}) => {
  if (options.dryRun !== true) {
    return rimraf(dirname, {
      glob: false,
    });
  }
};

export const deleteDirSync = (dirname: string, options: Options = {}) => {
  if (options.dryRun !== true) {
    return rimrafSync(dirname, { glob: false });
  }
};
