/* @flow */

declare module "marksy" {
  declare export default (options: {createElement: Function}) =>
    ((tpl: string) => {tree: any[]})
}
