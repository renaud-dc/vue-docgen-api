import path from 'path'
import { rollup } from 'rollup';
import vue from 'rollup-plugin-vue2';
import localResolve from 'rollup-plugin-local-resolve';
import deasync from 'deasync';

// Build single JS file including dependencies with Rollup
function bundleAsync (inputOptions, outputOptions, callback) {
  rollup(inputOptions).then( bundle => {
    return bundle.generate(outputOptions);
  }).then (result =>{
    callback (null, result)
  }).catch(err => {
    callback(err)
  })
}
const bundleSync = deasync(bundleAsync);

function getScriptWithDependencies(file) {
  let plugins;
  const fileExt = path.parse(file).ext;
  if (fileExt === '.js') {
    plugins = [localResolve()];
  } else if (fileExt === '.vue') {
    plugins = [vue(), localResolve()];
  }
  const inOptions = {
    input: file,
    plugins,
  };
  const outOptions = {
		format: 'es',
  };
  return bundleSync(inOptions, outOptions).code;
}

export default function getComponentModuleJSCode(parts, source, file) {
	if (!parts.script) {
		return source
		// No script code;
	} else if (parts.script.src) {
		const jsFilePath = path.join(path.dirname(file), parts.script.src)
		return getScriptWithDependencies(jsFilePath)
	} else {
    return getScriptWithDependencies(file);
	}
}
