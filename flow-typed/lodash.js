/* @flow */

type TransformCallback = (accumulator: any, value: any, key: number | string,
  collection: any[] | Object) => any
type Callback = (value: any, key: number | string,
  collection: any[] | Object) => any
type Iteratee = Callback | Object | any[] | string
type IterableCollection = any[] | Object | string
type Path = string | string[]
type TemplateOptions = {
  escape?: RegExp;
  evaluate?: RegExp;
  imports?: Object;
  interpolate?: RegExp;
  sourceURL?: string;
  variable?: string;
}

declare module "lodash/memoize" {
  declare module.exports: (func: Function, resolver?: Function) => Function
}
declare module "lodash/template" {
  declare module.exports: (value?: string,
    options?: TemplateOptions) => Function
}
declare module "lodash/reduce" {
  declare module.exports: (collection: IterableCollection,
    iteratee?: TransformCallback, accumulator?: any) => any
}
declare module "lodash/kebabCase" {
  declare module.exports: (str?: ?string) => string
}
declare module "lodash/get" {
  declare module.exports: (object: Object, path: Path,
    defaultValue?: any) => any
}
declare module "lodash/cloneDeep" {
  declare module.exports: <T: any>(value: T) => T
}
declare module "lodash/set" {
  declare module.exports: (object: Object, path: Path, value: any) => Object
}
declare module "lodash/has" {
  declare module.exports: (object: Object, path: Path) => boolean
}
declare module "lodash/isArray" {
  declare module.exports: (value: any) => boolean
}
declare module "lodash/map" {
  declare module.exports: (collection: IterableCollection,
    iteratee?: Iteratee) => any[]
}
declare module "lodash/reject" {
  declare module.exports: (collection: IterableCollection,
    iteratee?: Iteratee) => any[]
}
declare module "lodash/concat" {
  declare module.exports: (collection: any[], ...args: any[]) => any[]
}
declare module "lodash/includes" {
  declare module.exports: (collection: IterableCollection, value: any,
    fromIndex?: number) => boolean
}
declare module "lodash/toPath" {
  declare module.exports: (value: any) => string[]
}
declare module "lodash/forEach" {
  declare module.exports: (collection: IterableCollection,
    iteratee?: Iteratee) => IterableCollection
}
declare module "lodash/merge" {
  declare module.exports: (object: Object, ...sources: Object[]) => Object
}
declare module "lodash/tail" {
  declare module.exports: (collection: any[]) => any[]
}
