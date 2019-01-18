/* @flow */

import type { Node } from 'react'

declare module "react-test-renderer/shallow" {
  declare class ShallowRenderer {
    render(node: Node): void;
    getRenderOutput(): Node;
  }
  declare module.exports: typeof ShallowRenderer
}
