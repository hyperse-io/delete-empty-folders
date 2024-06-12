import { pathStartsWith } from '../src/pathStartsWith.js';

describe('pathStartsWith error handling', () => {
  it('should throw an error when invalid args are passed', () => {
    expect(() => (pathStartsWith as any)()).toThrowError();
    expect(() => (pathStartsWith as any)({})).toThrowError();
    expect(() => (pathStartsWith as any)([])).toThrowError();
    expect(() => (pathStartsWith as any)(null)).toThrowError();
  });
});

it('should be false when the value is an empty string', () => {
  expect(pathStartsWith('foo', '')).toBe(false);
});

describe('pathStartsWith options', () => {
  describe('.nocase', () => {
    it('should be case sensitive by default', () => {
      expect(pathStartsWith('foo', 'FOO')).toBe(false);
      expect(pathStartsWith('FOO', 'foo')).toBe(false);
      expect(pathStartsWith('foo/bar', 'FOO/bar')).toBe(false);
      expect(pathStartsWith('FOO/bar', 'foo/bar')).toBe(false);
    });

    it('should not be case sensitive when options.nocase is true', () => {
      expect(pathStartsWith('foo', 'FOO', { nocase: true })).toBe(true);
      expect(pathStartsWith('FOO', 'foo', { nocase: true })).toBe(true);
      expect(pathStartsWith('foo/bar', 'FOO/bar', { nocase: true })).toBe(true);
      expect(pathStartsWith('FOO/bar', 'foo/bar', { nocase: true })).toBe(true);
    });
  });

  describe('.partialMatch', () => {
    it('should return false for partial matches by default', () => {
      expect(pathStartsWith('foo', 'f')).toBe(false);
      expect(pathStartsWith('foo', 'fo')).toBe(false);
      expect(pathStartsWith('foobar', 'foo')).toBe(false);
      expect(pathStartsWith('foooo', 'foo')).toBe(false);
      expect(pathStartsWith('foo.bar', 'foo')).toBe(false);
      expect(pathStartsWith('foo/bar', 'foobar')).toBe(false);
      expect(pathStartsWith('foo/bar.baz', 'foo/bar')).toBe(false);
      expect(pathStartsWith('foo/bar.baz/qux', 'foo/bar')).toBe(false);
      expect(pathStartsWith('foo/bar/bazqux', 'foo/ba')).toBe(false);
      expect(pathStartsWith('foo/bar/baz.md', 'foo/bar/baz')).toBe(false);
      expect(pathStartsWith('foo/bar/baz.md', 'foo/bar/baz.')).toBe(false);
      expect(pathStartsWith('foo/bar/baz.md', 'foo/bar/baz.m')).toBe(false);

      // windows paths
      expect(pathStartsWith('foo\\bar.baz', 'foo\\bar')).toBe(false);
      expect(pathStartsWith('foo\\bar.baz\\qux', 'foo\\bar')).toBe(false);
      expect(pathStartsWith('foo\\bar\\bazqux', 'foo\\ba')).toBe(false);
      expect(pathStartsWith('foo\\bar\\baz.md', 'foo\\bar\\baz')).toBe(false);
      expect(pathStartsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.')).toBe(false);
      expect(pathStartsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.m')).toBe(false);
    });

    it('should allow partial matches when partialMatch is true', () => {
      const opts = { partialMatch: true };
      expect(pathStartsWith('foo', 'f', opts)).toBe(true);
      expect(pathStartsWith('foo', 'fo', opts)).toBe(true);
      expect(pathStartsWith('foobar', 'foo', opts)).toBe(true);
      expect(pathStartsWith('foooo', 'foo', opts)).toBe(true);
      expect(pathStartsWith('foo.bar', 'foo', opts)).toBe(true);
      expect(pathStartsWith('foo/bar.baz', 'foo/bar', opts)).toBe(true);
      expect(pathStartsWith('foo/bar.baz/qux', 'foo/bar', opts)).toBe(true);
      expect(pathStartsWith('foo/bar/bazqux', 'foo/ba', opts)).toBe(true);
      expect(pathStartsWith('foo/bar/baz.md', 'foo/bar/baz', opts)).toBe(true);
      expect(pathStartsWith('foo/bar/baz.md', 'foo/bar/baz.', opts)).toBe(true);
      expect(pathStartsWith('foo/bar/baz.md', 'foo/bar/baz.m', opts)).toBe(
        true
      );

      // windows paths
      expect(pathStartsWith('foo\\bar.baz', 'foo\\bar', opts)).toBe(true);
      expect(pathStartsWith('foo\\bar.baz\\qux', 'foo\\bar', opts)).toBe(true);
      expect(pathStartsWith('foo\\bar\\bazqux', 'foo\\ba', opts)).toBe(true);
      expect(pathStartsWith('foo\\bar\\baz.md', 'foo\\bar\\baz', opts)).toBe(
        true
      );
      expect(pathStartsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.', opts)).toBe(
        true
      );
      expect(pathStartsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.m', opts)).toBe(
        true
      );
    });
  });
});

describe('starts with', () => {
  it('should be true when path starts with substring', () => {
    expect(pathStartsWith('.foo', 'foo')).toBe(false);
    expect(pathStartsWith('foo', '.foo')).toBe(false);
    expect(pathStartsWith('foo', 'foo.md')).toBe(false);
    expect(pathStartsWith('foo.md', 'baz.md')).toBe(false);
    expect(pathStartsWith('foo.md', 'foo')).toBe(false);
    expect(pathStartsWith('foo/bar', 'bar')).toBe(false);
    expect(pathStartsWith('foo/bar', 'bar.md')).toBe(false);
    expect(pathStartsWith('foo', 'foo/')).toBe(false);
    expect(pathStartsWith('foo', 'foo')).toBe(true);
    expect(pathStartsWith('foo/', 'foo/')).toBe(true);
    expect(pathStartsWith('foo/', 'foo')).toBe(true);
    expect(pathStartsWith('foo/bar/baz', 'foo')).toBe(true);
    expect(pathStartsWith('foo/bar/baz', 'foo/bar')).toBe(true);
    expect(pathStartsWith('foo/bar/baz', 'foo/bar/baz')).toBe(true);

    // windows paths
    expect(pathStartsWith('foo', 'foo\\')).toBe(false);
    expect(pathStartsWith('foo/', 'foo\\')).toBe(true);
    expect(pathStartsWith('foo/bar/baz', 'foo\\bar')).toBe(true);
    expect(pathStartsWith('foo/bar/baz', 'foo\\bar\\baz')).toBe(true);

    expect(pathStartsWith('foo\\bar', 'bar')).toBe(false);
    expect(pathStartsWith('foo\\bar', 'bar.md')).toBe(false);
    expect(pathStartsWith('foo\\', 'foo/')).toBe(true);
    expect(pathStartsWith('foo\\', 'foo')).toBe(true);
    expect(pathStartsWith('foo\\bar/baz', 'foo')).toBe(true);
    expect(pathStartsWith('foo\\bar/baz', 'foo/bar')).toBe(true);
    expect(pathStartsWith('foo\\bar/baz', 'foo/bar/baz')).toBe(true);

    expect(pathStartsWith('foo\\bar', 'bar')).toBe(false);
    expect(pathStartsWith('foo\\bar', 'bar.md')).toBe(false);
    expect(pathStartsWith('foo', 'foo\\')).toBe(false);
    expect(pathStartsWith('foo', 'foo')).toBe(true);
    expect(pathStartsWith('foo\\', 'foo\\')).toBe(true);
    expect(pathStartsWith('foo\\', 'foo')).toBe(true);
    expect(pathStartsWith('foo\\bar\\baz', 'foo')).toBe(true);
    expect(pathStartsWith('foo\\bar\\baz', 'foo\\bar')).toBe(true);
    expect(pathStartsWith('foo\\bar\\baz', 'foo\\bar\\baz')).toBe(true);
  });
});

describe('negation', () => {
  it('should be false when path starts with negated substring', () => {
    expect(pathStartsWith('.foo', '!foo')).toBe(true);
    expect(pathStartsWith('foo', '!.foo')).toBe(true);
    expect(pathStartsWith('foo', '!foo.md')).toBe(true);
    expect(pathStartsWith('foo.md', '!baz.md')).toBe(true);
    expect(pathStartsWith('foo.md', '!foo')).toBe(true);
    expect(pathStartsWith('foo/bar', '!bar')).toBe(true);
    expect(pathStartsWith('foo/bar', '!bar.md')).toBe(true);
    expect(pathStartsWith('foo', '!foo/')).toBe(true);
    expect(pathStartsWith('foo', '!foo')).toBe(false);
    expect(pathStartsWith('foo/', '!foo/')).toBe(false);
    expect(pathStartsWith('foo/', '!foo')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', '!foo')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', '!foo/bar')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', '!foo/bar/baz')).toBe(false);

    // windows paths
    expect(pathStartsWith('foo', '!foo\\')).toBe(true);
    expect(pathStartsWith('foo/', '!foo\\')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', '!foo\\bar')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', '!foo\\bar\\baz')).toBe(false);

    expect(pathStartsWith('foo\\bar', '!bar')).toBe(true);
    expect(pathStartsWith('foo\\bar', '!bar.md')).toBe(true);
    expect(pathStartsWith('foo\\', '!foo/')).toBe(false);
    expect(pathStartsWith('foo\\', '!foo')).toBe(false);
    expect(pathStartsWith('foo\\bar/baz', '!foo')).toBe(false);
    expect(pathStartsWith('foo\\bar/baz', '!foo/bar')).toBe(false);
    expect(pathStartsWith('foo\\bar/baz', '!foo/bar/baz')).toBe(false);

    expect(pathStartsWith('foo\\bar', '!bar')).toBe(true);
    expect(pathStartsWith('foo\\bar', '!bar.md')).toBe(true);
    expect(pathStartsWith('foo', '!foo\\')).toBe(true);
    expect(pathStartsWith('foo', '!foo')).toBe(false);
    expect(pathStartsWith('foo\\', '!foo\\')).toBe(false);
    expect(pathStartsWith('foo\\', '!foo')).toBe(false);
    expect(pathStartsWith('foo\\bar\\baz', '!foo')).toBe(false);
    expect(pathStartsWith('foo\\bar\\baz', '!foo\\bar')).toBe(false);
    expect(pathStartsWith('foo\\bar\\baz', '!foo\\bar\\baz')).toBe(false);
  });
});

describe('path begins with string', () => {
  it('should strip leading "./" from path', () => {
    expect(pathStartsWith('./foo/bar/baz', './bar')).toBe(false);
    expect(pathStartsWith('./foo/bar/baz', 'bar')).toBe(false);
    expect(pathStartsWith('./foo/bar/baz', './foo')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', './foo/bar')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', 'foo/bar')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', 'foo')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', 'foo/bar')).toBe(true);

    // windows paths
    expect(pathStartsWith('./foo/bar/baz', '.\\bar')).toBe(false);
    expect(pathStartsWith('./foo/bar/baz', 'bar')).toBe(false);
    expect(pathStartsWith('./foo/bar/baz', '.\\foo')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', '.\\foo\\bar')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', 'foo\\bar')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', 'foo\\bar')).toBe(true);

    expect(pathStartsWith('.\\foo\\bar\\baz', './bar')).toBe(false);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'bar')).toBe(false);
    assert(pathStartsWith('.\\foo\\bar\\baz', './foo'));
    expect(pathStartsWith('.\\foo\\bar\\baz', './foo/bar')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'foo/bar')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'foo')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'foo/bar')).toBe(true);

    expect(pathStartsWith('.\\foo\\bar\\baz', '.\\bar')).toBe(false);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'bar')).toBe(false);
    expect(pathStartsWith('.\\foo\\bar\\baz', '.\\foo')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', '.\\foo\\bar')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'foo\\bar')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'foo')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', 'foo\\bar')).toBe(true);
  });

  it('should strip leading "./" from substring', () => {
    expect(pathStartsWith('./foo/bar/baz', './bar')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', './bar')).toBe(false);
    expect(pathStartsWith('./.foo', './foo')).toBe(false);
    expect(pathStartsWith('./foo', './.foo')).toBe(false);
    expect(pathStartsWith('./foo', './foo')).toBe(true);
    expect(pathStartsWith('./.foo', './.foo')).toBe(true);
    expect(pathStartsWith('./foo/bar', './foo')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', './foo')).toBe(true);
    expect(pathStartsWith('./foo/bar/baz', './foo')).toBe(true);

    // windows paths
    expect(pathStartsWith('.\\foo\\bar\\baz', '.\\bar')).toBe(false);
    expect(pathStartsWith('foo\\bar\\baz', '.\\bar')).toBe(false);
    expect(pathStartsWith('.\\.foo', '.\\foo')).toBe(false);
    expect(pathStartsWith('.\\foo', '.\\.foo')).toBe(false);
    expect(pathStartsWith('.\\foo', '.\\foo')).toBe(true);
    expect(pathStartsWith('.\\.foo', '.\\.foo')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar', '.\\foo')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', '.\\foo')).toBe(true);
    expect(pathStartsWith('.\\foo\\bar\\baz', '.\\foo')).toBe(true);
  });
});

describe('prefixed with "/"', () => {
  it('should match leading slashes', () => {
    expect(pathStartsWith('./bar/baz/qux', '/bar')).toBe(false);
    expect(pathStartsWith('./foo/bar/baz', '/foo/bar')).toBe(false);
    expect(pathStartsWith('/bar/baz/qux', './bar')).toBe(false);
    expect(pathStartsWith('/foo/bar/baz', './bar')).toBe(false);
    expect(pathStartsWith('/foo/bar/baz', '/foo/')).toBe(false);
    expect(pathStartsWith('/foo/bar/baz', 'foo/bar')).toBe(false);
    expect(pathStartsWith('bar/baz/qux', '/bar')).toBe(false);
    expect(pathStartsWith('foo/bar/baz', '/baz')).toBe(false);

    expect(pathStartsWith('/', '/')).toBe(true);
    expect(pathStartsWith('//', '//')).toBe(true);
    expect(pathStartsWith('//foo', '//')).toBe(true);
    expect(pathStartsWith('//foo', '//foo')).toBe(true);
    expect(pathStartsWith('//foo/bar', '//foo/bar')).toBe(true);
    expect(pathStartsWith('/bar/baz/qux', '/bar')).toBe(true);
    expect(pathStartsWith('/foo/', '/')).toBe(true);
    expect(pathStartsWith('/foo/bar/baz', '/foo')).toBe(true);
    expect(pathStartsWith('/foo/bar/baz', '/foo/bar')).toBe(true);

    // windows paths
    expect(pathStartsWith('.\\bar\\baz\\qux', '\\bar')).toBe(false);
    expect(pathStartsWith('.\\foo\\bar\\baz', '\\foo\\bar')).toBe(false);
    expect(pathStartsWith('\\bar\\baz\\qux', '.\\bar')).toBe(false);
    expect(pathStartsWith('\\foo\\bar\\baz', '.\\bar')).toBe(false);
    expect(pathStartsWith('\\foo\\bar\\baz', '\\foo\\')).toBe(false);
    expect(pathStartsWith('\\foo\\bar\\baz', 'foo\\bar')).toBe(false);
    expect(pathStartsWith('bar\\baz\\qux', '\\bar')).toBe(false);
    expect(pathStartsWith('foo\\bar\\baz', '\\baz')).toBe(false);

    expect(pathStartsWith('/', '\\')).toBe(true);
    expect(pathStartsWith('//', '\\\\')).toBe(true);
    expect(pathStartsWith('//foo', '\\\\')).toBe(true);
    expect(pathStartsWith('//foo', '\\\\foo')).toBe(true);
    expect(pathStartsWith('//foo/bar', '\\\\foo/bar')).toBe(true);
    expect(pathStartsWith('/bar/baz/qux', '\\bar')).toBe(true);
    expect(pathStartsWith('/foo/', '\\')).toBe(true);
    expect(pathStartsWith('/foo/bar/baz', '\\foo')).toBe(true);
    expect(pathStartsWith('/foo/bar/baz', '\\foo/bar')).toBe(true);

    expect(pathStartsWith('\\', '/')).toBe(true);
    expect(pathStartsWith('\\\\', '//')).toBe(true);
    expect(pathStartsWith('\\\\foo', '//')).toBe(true);
    expect(pathStartsWith('\\\\foo', '//foo')).toBe(true);
    expect(pathStartsWith('\\\\foo\\bar', '//foo/bar')).toBe(true);
    expect(pathStartsWith('\\bar\\baz\\qux', '/bar')).toBe(true);
    expect(pathStartsWith('\\foo\\', '/')).toBe(true);
    expect(pathStartsWith('\\foo\\bar\\baz', '/foo')).toBe(true);
    expect(pathStartsWith('\\foo\\bar\\baz', '/foo/bar')).toBe(true);

    expect(pathStartsWith('\\', '\\')).toBe(true);
    expect(pathStartsWith('\\\\', '\\\\')).toBe(true);
    expect(pathStartsWith('\\\\foo', '\\\\')).toBe(true);
    expect(pathStartsWith('\\\\foo', '\\\\foo')).toBe(true);
    expect(pathStartsWith('\\\\foo\\bar', '\\\\foo\\bar')).toBe(true);
    expect(pathStartsWith('\\bar\\baz\\qux', '\\bar')).toBe(true);
    expect(pathStartsWith('\\foo\\', '\\')).toBe(true);
    expect(pathStartsWith('\\foo\\bar\\baz', '\\foo')).toBe(true);
    expect(pathStartsWith('\\foo\\bar\\baz', '\\foo\\bar')).toBe(true);
  });

  it('should not match when fewer leading slashes than expected', () => {
    expect(pathStartsWith('//foo', '////foo')).toBe(false);
    expect(pathStartsWith('/foo', '//')).toBe(false);
    expect(pathStartsWith('/foo/', '//')).toBe(false);
    expect(pathStartsWith('/foo/', '///')).toBe(false);

    // windows paths
    expect(pathStartsWith('//foo', '\\\\\\\\foo')).toBe(false);
    expect(pathStartsWith('/foo', '\\\\')).toBe(false);
    expect(pathStartsWith('/foo/', '\\\\')).toBe(false);
    expect(pathStartsWith('/foo/', '\\\\\\')).toBe(false);

    expect(pathStartsWith('\\\\foo', '////foo')).toBe(false);
    expect(pathStartsWith('\\foo', '//')).toBe(false);
    expect(pathStartsWith('\\foo/', '//')).toBe(false);
    expect(pathStartsWith('\\foo/', '///')).toBe(false);

    expect(pathStartsWith('\\\\foo', '\\\\\\\\foo')).toBe(false);
    expect(pathStartsWith('\\foo', '\\\\')).toBe(false);
    expect(pathStartsWith('\\foo\\', '\\\\')).toBe(false);
    expect(pathStartsWith('\\foo\\', '\\\\\\')).toBe(false);
  });

  it('should not match when more leading slashes than expected', () => {
    expect(pathStartsWith('//foo', '/')).toBe(false);
    expect(pathStartsWith('//foo', '/foo')).toBe(false);
    expect(pathStartsWith('///foo', '/foo')).toBe(false);
    expect(pathStartsWith('////foo', '//foo')).toBe(false);

    // windows paths
    expect(pathStartsWith('//foo', '\\')).toBe(false);
    expect(pathStartsWith('//foo', '\\foo')).toBe(false);
    expect(pathStartsWith('///foo', '\\foo')).toBe(false);
    expect(pathStartsWith('////foo', '\\\\foo')).toBe(false);

    expect(pathStartsWith('\\\\foo', '/')).toBe(false);
    expect(pathStartsWith('\\\\foo', '/foo')).toBe(false);
    expect(pathStartsWith('\\\\\\foo', '/foo')).toBe(false);
    expect(pathStartsWith('\\\\\\\\foo', '//foo')).toBe(false);

    expect(pathStartsWith('\\\\foo', '\\')).toBe(false);
    expect(pathStartsWith('\\\\foo', '\\foo')).toBe(false);
    expect(pathStartsWith('\\\\\\foo', '\\foo')).toBe(false);
    expect(pathStartsWith('\\\\\\\\foo', '\\\\foo')).toBe(false);
  });

  it('should be false for partial matches', () => {
    expect(pathStartsWith('//foobar', '//f')).toBe(false);
    expect(pathStartsWith('//foobar', '//fo')).toBe(false);
    expect(pathStartsWith('//foobar', '//foo')).toBe(false);
    expect(pathStartsWith('//foo.bar', '//foo')).toBe(false);
    expect(pathStartsWith('//foo', '//foobar')).toBe(false);

    // windows paths
    expect(pathStartsWith('//foobar', '\\\\f')).toBe(false);
    expect(pathStartsWith('//foobar', '\\\\fo')).toBe(false);
    expect(pathStartsWith('//foobar', '\\\\foo')).toBe(false);
    expect(pathStartsWith('//foo.bar', '\\\\foo')).toBe(false);
    expect(pathStartsWith('//foo', '\\\\foobar')).toBe(false);

    expect(pathStartsWith('\\\\foobar', '//f')).toBe(false);
    expect(pathStartsWith('\\\\foobar', '//fo')).toBe(false);
    expect(pathStartsWith('\\\\foobar', '//foo')).toBe(false);
    expect(pathStartsWith('\\\\foo.bar', '//foo')).toBe(false);
    expect(pathStartsWith('\\\\foo', '//foobar')).toBe(false);

    expect(pathStartsWith('\\\\foobar', '\\\\f')).toBe(false);
    expect(pathStartsWith('\\\\foobar', '\\\\fo')).toBe(false);
    expect(pathStartsWith('\\\\foobar', '\\\\foo')).toBe(false);
    expect(pathStartsWith('\\\\foo.bar', '\\\\foo')).toBe(false);
    expect(pathStartsWith('\\\\foo', '\\\\foobar')).toBe(false);
  });
});

describe('windows drive letters', () => {
  it('should match paths that start with windows drive letters', () => {
    expect(pathStartsWith('C:', 'C:')).toBe(true);
    expect(pathStartsWith('C:/', 'C:/')).toBe(true);
    expect(pathStartsWith('C:/foo', 'C:')).toBe(true);
    expect(pathStartsWith('C:/foo', 'C:/')).toBe(true);
    expect(pathStartsWith('C:/foo', 'C:/foo')).toBe(true);
    expect(pathStartsWith('C:/foo', 'A:/')).toBe(false);
    expect(pathStartsWith('C:/foo/bar', 'C:/foo')).toBe(true);
    expect(pathStartsWith('C:/foo/bar', 'C:/bar')).toBe(false);
    expect(pathStartsWith('C:/foo/bar', 'foo/bar')).toBe(false);

    expect(pathStartsWith('C:/', 'C:\\')).toBe(true);
    expect(pathStartsWith('C:/foo', 'C:\\')).toBe(true);
    expect(pathStartsWith('C:/foo', 'C:\\foo')).toBe(true);
    expect(pathStartsWith('C:/foo/bar', 'C:\\foo')).toBe(true);
    expect(pathStartsWith('C:/foo/bar', 'C:\\bar')).toBe(false);
    expect(pathStartsWith('C:/foo/bar', 'foo\\bar')).toBe(false);

    expect(pathStartsWith('C:', 'C:')).toBe(true);
    expect(pathStartsWith('C:\\', 'C:/')).toBe(true);
    expect(pathStartsWith('C:\\foo', 'C:')).toBe(true);
    expect(pathStartsWith('C:\\foo', 'C:/')).toBe(true);
    expect(pathStartsWith('C:\\foo', 'C:/foo')).toBe(true);
    expect(pathStartsWith('C:\\foo\\bar', 'C:/foo')).toBe(true);
    expect(pathStartsWith('C:\\foo\\bar', 'C:/bar')).toBe(false);
    expect(pathStartsWith('C:\\foo\\bar', 'foo/bar')).toBe(false);

    expect(pathStartsWith('C:', 'C:')).toBe(true);
    expect(pathStartsWith('C:\\', 'C:\\')).toBe(true);
    expect(pathStartsWith('C:\\foo', 'C:')).toBe(true);
    expect(pathStartsWith('C:\\foo', 'C:\\')).toBe(true);
    expect(pathStartsWith('C:\\foo', 'C:\\foo')).toBe(true);
    expect(pathStartsWith('C:\\foo\\bar', 'C:\\foo')).toBe(true);
    expect(pathStartsWith('C:\\foo\\bar', 'C:\\bar')).toBe(false);
    expect(pathStartsWith('C:\\foo\\bar', 'foo\\bar')).toBe(false);
  });

  it('should be false for partial matches', () => {
    expect(pathStartsWith('C:/foobar', 'C:/f')).toBe(false);
    expect(pathStartsWith('C:/foobar', 'C:/fo')).toBe(false);
    expect(pathStartsWith('C:/foobar', 'C:/foo')).toBe(false);
    expect(pathStartsWith('C:/foo.bar', 'C:/foo')).toBe(false);
    expect(pathStartsWith('C:/foo', 'C:/foobar')).toBe(false);

    expect(pathStartsWith('C:\\foobar', 'C:\\f')).toBe(false);
    expect(pathStartsWith('C:\\foobar', 'C:\\fo')).toBe(false);
    expect(pathStartsWith('C:\\foobar', 'C:\\foo')).toBe(false);
    expect(pathStartsWith('C:\\foo.bar', 'C:\\foo')).toBe(false);
    expect(pathStartsWith('C:\\foo', 'C:\\foobar')).toBe(false);
    expect(pathStartsWith('C:\\foo', 'CC:\\foo')).toBe(false);
  });
});
