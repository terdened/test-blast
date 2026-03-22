import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseViewComponent')
export abstract  class BaseViewComponent<T> extends Component {
    model: T;

    init(model: T) {
        this.model = model;
        this.dirty();
    }

    abstract dirty();
}