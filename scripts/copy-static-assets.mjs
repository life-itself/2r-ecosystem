import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const copies = [
  ['assets', 'dist/assets'],
  ['assets/img', 'dist/img'],
];

for (const [source, target] of copies) {
  if (!existsSync(source)) {
    continue;
  }

  await rm(target, { force: true, recursive: true });
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });
}
