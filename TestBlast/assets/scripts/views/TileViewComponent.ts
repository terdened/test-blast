import { _decorator, Color, EventMouse, Input, SpriteComponent, SpriteFrame, Vec3 } from 'cc';
import { TileModel } from '../models/TileModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
const { ccclass, property } = _decorator;

@ccclass('TileViewComponent')
export class TileViewComponent extends BaseViewComponent<TileModel> {
    @property([SpriteFrame])
    frames: SpriteFrame[] = [];

    start() {
        this.node.on(Input.EventType.MOUSE_ENTER, this.onEnter, this);
        this.node.on(Input.EventType.MOUSE_LEAVE, this.onLeave, this);
    }

    onEnter(event: EventMouse) {
        let spriteComponent = this.node.getComponent(SpriteComponent);
        spriteComponent.color = new Color(128, 128, 0);
    }

    onLeave(event: EventMouse) {
        let spriteComponent = this.node.getComponent(SpriteComponent);
        spriteComponent.color = new Color(256, 256, 256);
    }

    render() {
        this.node.setPosition(new Vec3(this.model.position.x * 100, this.model.position.y * 100, 0));
        
        let spriteComponent = this.getComponent(SpriteComponent);
        spriteComponent.spriteFrame = this.frames[this.model.color];
    }
}


