import { type FilterPattern } from '@rollup/pluginutils'

export interface userOptions {
  include?: FilterPattern
  exclude?: FilterPattern
  treeShaking?: boolean
  enforce?: 'pre' | 'post' | undefined
}

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type OptionsResolved = Overwrite<
  Required<userOptions>,
  Pick<userOptions, 'enforce'>
>

export function resolveOption(options: userOptions): OptionsResolved {
  return {
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/],
    treeShaking: false,
    enforce: 'enforce' in options ? options.enforce : 'pre',
  }
}
