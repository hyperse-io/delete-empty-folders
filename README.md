# @hyperse/delete-empty-folders

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/delete-empty-folders/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/delete-empty-folders/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/delete-empty-folders">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fdelete-empty-folders?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/delete-empty-folders/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/delete-empty-folders?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/delete-empty-folders/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/ts-node-paths?style=flat-quare&labelColor=000000" />
  </a>
</p>

> Recursively delete all empty folders in a directory and child directories.

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [async-await (promise)](#async-await-promise)
  - [async callback](#async-callback)
  - [sync](#sync)
- [examples](#examples)

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save @hyperse/delete-empty-folders
```

## Usage

```ts
import { deleteEmpty, deleteEmptySync } from '@hyperse/delete-empty-folders';
```

## API

Given the following directory structure, the **highlighted directories** would be deleted.

```diff
foo/
└─┬ a/
- ├── aa/
  ├── bb/
  │ └─┬ bbb/
  │ │ ├── one.txt
  │ │ └── two.txt
- ├── cc/
- ├ b/
- └ c/
```

### async-await (promise)

If no callback is passed, a promise is returned. Returns the array of deleted directories.

```ts
(async () => {
  let deleted = await deleteEmpty('foo');
  console.log(deleted); //=> ['foo/aa/', 'foo/a/cc/', 'foo/b/', 'foo/c/']
})();

// or
deleteEmpty('foo/')
  .then((deleted) => console.log(deleted)) //=> ['foo/aa/', 'foo/a/cc/', 'foo/b/', 'foo/c/']
  .catch(console.error);
```

### sync

Returns the array of deleted directories.

```js
console.log(deleteEmptySync('foo/')); //=> ['foo/aa/', 'foo/a/cc/', 'foo/b/', 'foo/c/']
```
