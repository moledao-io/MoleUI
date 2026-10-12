import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, `file://${root}/`), 'utf8'));
}

function fail(message) {
  throw new Error(`[AI docs] ${message}`);
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} is out of sync.\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

const manifest = await readJson('docs/ai/component-manifest.json');
const packageJson = await readJson('packages/ui/package.json');
const publicApi = await readFile(new URL('packages/ui/src/index.ts', `file://${root}/`), 'utf8');
const iconSource = await readFile(new URL('packages/ui/src/icon/names.ts', `file://${root}/`), 'utf8');
const animatedRegistry = await readFile(new URL('packages/ui/src/animated-icon/registry.ts', `file://${root}/`), 'utf8');
const llmsText = await readFile(new URL('llms.txt', `file://${root}/`), 'utf8');

assertEqual(manifest.package.name, packageJson.name, 'package name');
assertEqual(manifest.package.version, packageJson.version, 'package version');
assertEqual(manifest.package.peerDependencies, packageJson.peerDependencies, 'peer dependencies');

const publicValueExports = [...publicApi.matchAll(/export \{([^}]+)\} from/g)]
  .flatMap((match) => match[1].split(',').map((name) => name.trim()))
  .filter(Boolean);
const publicComponents = publicValueExports.filter((name) => /^[A-Z][a-z]/.test(name));
assertEqual(Object.keys(manifest.components).sort(), [...publicComponents].sort(), 'public component list');

for (const [name, component] of Object.entries(manifest.components)) {
  if (!component.summary || !component.source || !component.example) fail(`${name} is missing summary, source, or example`);
  if (!Array.isArray(component.importPaths) || component.importPaths[0] !== packageJson.name) {
    fail(`${name}.importPaths must begin with ${packageJson.name}`);
  }
  for (const importPath of component.importPaths.slice(1)) {
    const exportKey = `./${importPath.slice(`${packageJson.name}/`.length)}`;
    if (!(exportKey in packageJson.exports)) fail(`${name} references missing package export ${importPath}`);
  }
}

const iconArray = iconSource.match(/export const ICON_NAMES = \[([\s\S]*?)\] as const;/)?.[1];
if (!iconArray) fail('Could not read ICON_NAMES from source');
const iconNames = [...iconArray.matchAll(/'([^']+)'/g)].map((match) => match[1]);
assertEqual(manifest.constants.ICON_NAMES, iconNames, 'ICON_NAMES');

const animatedObject = animatedRegistry.match(/export const ANIMATED_ICONS = \{([\s\S]*?)\}\s+satisfies/)?.[1];
if (!animatedObject) fail('Could not read ANIMATED_ICONS from source');
const animatedNames = [...animatedObject.matchAll(/^\s*([a-z][a-zA-Z0-9_-]*):/gm)].map((match) => match[1]);
assertEqual(manifest.constants.ANIMATED_ICON_NAMES, animatedNames, 'ANIMATED_ICON_NAMES');

if (!llmsText.includes('docs/ai/component-manifest.json')) fail('llms.txt does not link the component manifest');
if (!packageJson.exports['./styles.css']) fail('The documented stylesheet export is missing');

process.stdout.write(`AI docs valid: ${Object.keys(manifest.components).length} components, ${iconNames.length} icons, ${animatedNames.length} animated icon.\n`);
