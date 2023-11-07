import type { Config as OptimizeOptions } from 'svgo'

export interface Options {
  // 存放图标文件夹位置
  iconDir: string | string[]

  // 给每个svg name加上前缀
  prefix?: string

  // 是否声明d.ts文件
  dts?: boolean

  // d.ts文件位置
  dtsDir?: string

  // 自定义生成的svg元素的id
  svgSpriteDomId?: string

  // 生成的组件名称
  componentName?: string

  // 通常, 插件会把svg标签内的fill, stroke属性替换成currentColor, 
  // 此属性会对每个svg路径进行正则匹配, 匹配成功的svg则不会替换currentColor, 而是保留原有的颜色.
  preserveColor?: string | RegExp

  // 组件的行内样式
  componentStyle?: string

  // 可以通过这个参数来设置symbolId的格式
  symbolIdFormatter?: (name: string, prefix: string) => string

  // svgo的优化参数
  optimizeOptions?: OptimizeOptions

  // 项目类型, 默认会自动检测
  projectType?: 'vue' | 'react' | 'auto'

  // Vue 版本, 默认会自动检测
  vueVersion?: VueVersion

  // 是否开启tree-shaking
  treeShaking?: boolean

  // 用于 tree-shaking 的模式匹配路径
  scanGlob?: string[]

  // 用于 tree-shaking 的模式匹配策略, 未匹配成功则不会打包到最终的产物中去, 
  // text选项表示按图标名称匹配, 所以你应该保证你图标名称的唯一性(可以考虑用symbolIdFormatter选项定制)，
  // 以此避免错误的tree-shaking, 而默认值component表示的是按组件这一
  // 此外你也可以通过传递函数的方式来实现 tree-shaking 策略, 函数的返回值表示用到的 svg 图标合集。
  scanStrategy?: 'text' | 'component' | ((code: string[], options: Options) => string[])
}

export type VueVersion = 2 | 3 | 'auto'
