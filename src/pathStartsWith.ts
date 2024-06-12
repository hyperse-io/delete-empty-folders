const toPosixSlashes = (str: string) => str.replace(/\\/g, '/');
const isPathSeparator = (code: number) => code === 47 || code === 92;
const isDot = (code: number) => code === 46;

const removeDotSlash = (str: string) => {
  if (isDot(str.charCodeAt(0)) && isPathSeparator(str.charCodeAt(1))) {
    return str.slice(2);
  }
  return str;
};

const countLeadingSlashes = (str: string) => {
  let i = 0;
  for (; i < str.length; i++) {
    if (!isPathSeparator(str.charCodeAt(i))) {
      break;
    }
  }
  return i;
};

type PathStartsWithOptions = {
  /**
   * Disable case sensitivity.
   * @default false
   */
  nocase?: boolean;
  /**
   * Allow partial matches:
   * @default false
   */
  partialMatch?: boolean;
  /**
   * Disable negation support.
   * @default false
   */
  nonegate?: boolean;
};

/**
 * Returns true if a filepath starts with the given string. Works with windows and posix/unix paths.
 * @param filepath - The filepath to check.
 * @param substr - The substring to check for. also support Prefix the substring with ! to return true when the path does not start with the substring.
 * @param options - Options to modify the behavior.
 * @returns
 */
export const pathStartsWith = (
  filepath: string,
  substr: string,
  options?: PathStartsWithOptions
): boolean => {
  if (typeof filepath !== 'string') {
    throw new TypeError('expected filepath to be a string');
  }

  if (typeof substr !== 'string') {
    throw new TypeError('expected substring to be a string');
  }

  filepath = removeDotSlash(filepath);
  substr = removeDotSlash(substr);

  if (filepath === substr) return true;

  if (substr === '' || filepath === '') {
    return false;
  }

  if (options && options.nocase !== false) {
    substr = substr.toLowerCase();
    filepath = filepath.toLowerCase();
  }

  // return true if the lowercased strings are an exact match
  if (filepath === substr) return true;

  if (substr.charAt(0) === '!' && (!options || !options.nonegate)) {
    return !pathStartsWith(filepath, substr.slice(1), options);
  }

  // normalize slashes in substring and filepath
  const fp = toPosixSlashes(filepath);
  const str = toPosixSlashes(substr);

  // now that slashes are normalized, check for an exact match again
  if (fp === str) return true;
  if (!fp.startsWith(str)) return false;

  // if partialMatch is enabled, we have a match
  if (options && options.partialMatch === true) {
    return true;
  }

  const substrSlashesLen = countLeadingSlashes(substr);
  const filepathSlashesLen = countLeadingSlashes(filepath);

  // if substring consists of only slashes, the
  // filepath must begin with the same number of slashes
  if (substrSlashesLen === substr.length) {
    return filepathSlashesLen === substrSlashesLen;
  }

  // handle "C:/foo" matching "C:/"
  if (str.endsWith('/') && /^[A-Z]:\//.test(fp)) {
    return true;
  }

  return fp[str.length] === '/';
};
