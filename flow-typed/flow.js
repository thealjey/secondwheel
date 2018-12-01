declare module "lodash/memoize" {
  declare module.exports: <F: Function>(func: F) => F
}
declare module "lodash/template" {
  declare module.exports: (string?: ?string) => ((data: Object) => string)
}
