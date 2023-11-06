import { createUnplugin } from 'unplugin'
import {
  type BaseOptions,
  type MarkRequired,
  createFilter,
  detectVueVersion,
} from '@vue-macros/common'

export type Options = BaseOptions
export type OptionsResolved = MarkRequired<Options, 'include' | 'version'>

function resolveOption(options: Options): OptionsResolved {
  const version = options.version || detectVueVersion()
  return {
    include: [],
    version,
    ...options,
  }
}

export default createUnplugin<BaseOptions | undefined, false>(
  (userOptions = {}) => {
    const options = resolveOption(userOptions)
    const filter = createFilter(options)
    const name = 'unplugin-dynamic-import'
    return {
      name,
      enforce: 'post',

      transformInclude(id) {
        return filter(id)
      },

      transform(code, id) {
        // eslint-disable-next-line no-console
        console.log(code, id)
        return undefined
      },
    }
  }
)
