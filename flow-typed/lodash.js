/* @flow */

declare module "lodash/memoize" {
  declare module.exports: <F: Function>(func: F) => F
}
declare module "lodash/template" {
  declare module.exports: (str?: ?string) => ((data: Object) => string)
}
declare module "lodash/reduce" {
  declare module.exports: <A: any>(
    data: any[] | Object,
    iteratee: (
      result: A,
      value: any,
      key: string,
      collection: any[] | Object
    ) => A,
    accumulator: A
  ) => A
}
declare module "lodash/kebabCase" {
  declare module.exports: (str?: ?string) => string
}
declare module "lodash/get" {
  declare module.exports: (obj: any, path: string) => any
}
