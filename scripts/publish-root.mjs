// Copia o site gerado (dist/) para a raiz do projeto.
// Motivo: a implantação por Git da Hostinger publica a raiz do repositório e não
// deixa escolher a pasta de saída. Os arquivos copiados estão no .gitignore, e o
// .htaccess gerado bloqueia o acesso ao código-fonte (src/, scripts/, package.json…).
import { readdirSync, cpSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const source = new Set(['src', 'scripts', 'tokens', 'public', 'node_modules', 'dist', 'preview', 'package.json', 'package-lock.json', 'build.mjs', 'serve.mjs', 'README.md', 'DESIGN.md', '.gitignore', '.git']);
const ignored = existsSync(join(root, '.gitignore')) ? readFileSync(join(root, '.gitignore'), 'utf8') : '';

for (const name of readdirSync(dist)) {
  if (source.has(name)) throw new Error(`dist/${name} colide com um arquivo do código-fonte`);
  cpSync(join(dist, name), join(root, name), { recursive: true, force: true });
  if (!ignored.split('\n').some((l) => l.trim().replace(/\/$/, '') === '/' + name)) console.warn(`aviso: /${name} não está no .gitignore`);
}
console.log('site copiado para a raiz');
