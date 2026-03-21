import { _decorator, UITransform } from 'cc';
import { GridModel } from '../models/GridModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
const { ccclass, property } = _decorator;

@ccclass('GridViewComponent')
export class GridViewComponent extends BaseViewComponent<GridModel> {
    tileSize: number = 100;

    start() {

    }

    render() {
        const xPos = -this.model.width * this.tileSize / 2;
        const yPos = -this.model.height * this.tileSize / 2;

        this.node.position.set(xPos, yPos);

        let uiTransform = this.getComponent(UITransform);

        const width = this.model.width * this.tileSize + this.tileSize;
        const height = this.model.height * this.tileSize + this.tileSize;
        uiTransform.contentSize.set(width, height);

        const anchorPointX = 1 / ((this.model.width + 1) * 2);
        const anchorPointY = 1 / ((this.model.height + 1) * 2);
        uiTransform.anchorPoint.set(anchorPointX, anchorPointY);
    }
}


