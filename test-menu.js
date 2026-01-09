import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import readline from 'readline';

const testsDir = './tests';
const scriptsDir = './scripts';

function scanDirectory(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(file => file.endsWith(extension))
    .map(file => ({
      name: file,
      path: path.resolve(path.join(dir, file)),
      type: extension === '.js' ? 'test' : 'script'
    }));
}

const testFiles = scanDirectory(testsDir, '.js');
const scriptFiles = scanDirectory(scriptsDir, '.sh');

const choices = [
  ...testFiles.map(f => ({ ...f, display: `Test: ${f.name} (${testsDir})` })),
  ...scriptFiles.map(f => ({ ...f, display: `Script: ${f.name} (${scriptsDir})` }))
];

if (choices.length === 0) {
  console.log('No se encontraron archivos de test o script.');
  process.exit(0);
}

console.log('Selecciona un archivo para ejecutar:');
choices.forEach((choice, index) => {
  console.log(`${index + 1}. ${choice.display}`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Ingresa el número de la opción: ', (answer) => {
  const index = parseInt(answer) - 1;
  if (index < 0 || index >= choices.length) {
    console.log('Opción inválida.');
    rl.close();
    return;
  }
  const selected = choices[index];
  console.log(`Ejecutando: ${selected.type === 'test' ? 'node' : 'sh'} ${path.relative(process.cwd(), selected.path)}`);
  
  if (selected.type === 'test') {
    exec(`node "${selected.path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        rl.close();
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Salida: ${stdout}`);
      rl.close();
    });
  } else {
    const child = spawn('sh', [path.relative(process.cwd(), selected.path).replace(/\\/g, '/')], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });
    child.on('close', (code) => {
      console.log(`Script terminó con código ${code}`);
      rl.close();
    });
  }
});