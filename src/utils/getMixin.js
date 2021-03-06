import fs from 'fs'
import stateDoc from './stateDoc'
import parseModule from './parseModule'
import evalComponentCode from './evalComponentCode'

module.exports = function getMixin(listRequire) {
  const output = []
  listRequire.forEach(filePath => {
    const pathRequire = filePath + '.js'
    if (fs.existsSync(pathRequire)) {
      const source = fs.readFileSync(pathRequire, {
        encoding: 'utf-8',
      })
      const doc = stateDoc.getDocFile(source, pathRequire)
      stateDoc.saveMixin(doc, pathRequire)
      if (stateDoc.isMixin()) {
        const parsedSource = parseModule(source, stateDoc.jscodeLang)
        const mixin = evalComponentCode(parsedSource)
        if (Object.keys(mixin.exports).length === 0) {
          mixin.exports.default = mixin.module.exports
        }
        if (mixin.exports.default) {
          output.push(mixin.exports.default)
        }
      }
    }
  });
  return output
}
