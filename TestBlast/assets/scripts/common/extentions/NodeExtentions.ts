import { _decorator, Node, Component } from 'cc';

export const getView = <T extends Component>(
  node: Node,
  type: new (...args: any[]) => T
) => node.getComponent(type);