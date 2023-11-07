import cors from 'cors'
import genEtag from 'etag'
import { createUnplugin } from 'unplugin'
import watchIconDir from './core/watcher'
import { MODULE_NAME, PLUGIN_NAME, USED_SVG_NAMES_FLAG } from './core/constants'
import { Options } from './core/types'
import { resolveOptions } from './core/utils'
import scanUsedSvgNames from './core/scan'
import { genCode } from './core/generator'

let isBuild = false
let usedSvgNames: string[] | string = []
let code = ''
let transformPluginContext: any
let svgSpriteDomStr = ''

export default createUnplugin<Options>(
  (userOptions) => {
    const options = resolveOptions(userOptions)
    const name = PLUGIN_NAME
    return {
      name,

      async buildStart() {
        if (isBuild && options.treeShaking)
          usedSvgNames = await scanUsedSvgNames(options)
        else
          usedSvgNames = USED_SVG_NAMES_FLAG

        const res = await genCode(options, usedSvgNames, false)
        code = res.code
        svgSpriteDomStr = res.svgSpriteDomStr
      },

      resolveId(id: string) {
        if (id === MODULE_NAME)
          return id
      },
      loadInclude(id) {
        return id === MODULE_NAME
      },
      async load() {
        return code
      },
      webpack(compiler) {
        isBuild = compiler.options.mode === 'production'
        compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation: { assets: any }, callback: () => void) => {
          const assets = compilation.assets as any
          const originHtml = assets['index.html']._value
          const transformedHtml = originHtml.replace(/<\/body>/, `${svgSpriteDomStr}</body>`)
          assets['index.html'] = {
            source() {
              return transformedHtml
            },
            size() {
              return transformedHtml.length
            },
          }
          callback()
        })
      },
      vite: {
        async configResolved(config) {
          isBuild = config.command === 'build'
        },
        transform(this) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          transformPluginContext = this
        },
        configureServer(server) {
          server.middlewares.use(cors({ origin: '*' }))
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.endsWith(`/@id/${MODULE_NAME}`)) {
              const { code, symbols, symbolCache, symbolIds } = await genCode(options, usedSvgNames, true)
              watchIconDir(options, server, symbols, symbolIds, symbolCache)

              const importAnalysisTransform = server.config.plugins.find(
                plugin => plugin.name === 'vite:import-analysis',
              )?.transform as any

              const transformResult = await importAnalysisTransform.apply(
                transformPluginContext, [code, MODULE_NAME, { ssr: false }],
              )

              const etag = genEtag(transformResult.code, { weak: true })
              const noneMatch = req.headers['if-none-match'] || req.headers['If-None-Match']

              if (noneMatch === etag || noneMatch === `W/${etag}` || `W/${noneMatch}` === etag) {
                res.statusCode = 304
                res.end()
              }
              else {
                res.setHeader('ETag', etag)
                res.setHeader('Content-Type', 'application/javascript')
                res.setHeader('Cache-Control', 'no-cache')
                res.statusCode = 200
                res.end(transformResult.code)
              }
            }
            else {
              next()
            }
          })
        },
        async transformIndexHtml(html) {
          const { svgSpriteDomStr } = await genCode(options, usedSvgNames, false)
          if (html.includes(options.svgSpriteDomId!))
            return html
          return html.replace(/<\/body>/, `${svgSpriteDomStr}</body>`)
        },
      },
    }
  }
)
