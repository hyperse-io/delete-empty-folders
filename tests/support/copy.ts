import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import readdir from '@folder/readdir';

export const copy = async (cwd: string, destDir: string) => {
  const filter = (file: any) => file.name !== '.gitkeep';
  const files = await readdir(cwd, {
    recursive: true,
    objects: true,
    absolute: true,
    filter,
  });

  for (const file of files) {
    const destPath = path.resolve(destDir, path.relative(cwd, file.path));
    if (existsSync(destPath)) continue;

    if (file.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
    } else {
      writeFileSync(destPath, readFileSync(file.path));
    }
  }

  return files;
};
