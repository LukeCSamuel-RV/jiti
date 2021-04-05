import * as ts from 'typescript'
import { TransformOptions, TRANSFORM_RESULT } from './types'

export default function transform (opts: TransformOptions): TRANSFORM_RESULT | null {
  if (!opts.ts) {
    return null
  }

  try {
    const tsConfig: ts.TranspileOptions = {
      ...opts.tsConfig,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        experimentalDecorators: true
      }
    }
    const result = ts.transpileModule(opts.source, tsConfig)
    return {
      code: result.outputText
    }
  } catch (err) {
    return {
      error: err,
      code: 'exports.__JITI_ERROR__ = ' + JSON.stringify({
        filename: opts.filename,
        // --- Not sure about these
        line: err.loc?.line || 0,
        column: err.loc?.column || 0,
        code: err.code,
        // ---
        message: err.message
      })
    }
  }
}
