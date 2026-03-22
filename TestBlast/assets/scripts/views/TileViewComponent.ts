import { _decorator, Color, EventMouse, NodeEventType, randomRange, SpriteComponent, SpriteFrame, Vec3, EventTarget } from 'cc';
import { TileModel } from '../models/TileModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
const { ccclass, property } = _decorator;

@ccclass('TileViewComponent')
export class TileViewComponent extends BaseViewComponent<TileModel> {
    public events = new EventTarget();

    @property([SpriteFrame])
    frames: SpriteFrame[] = [];

    private _movementFinished: boolean = true;
    private _targetPosition: Vec3;
    private _moveTime: number = 0;
    private _moveDuration: number = 2;
    private _tileSize: number = 100;

    protected onEnable(): void {
        this._registerNodeEvent();
    }

    protected onDisable(): void {
        this._unregisterNodeEvent();
    }

    protected start(): void {
        let newPosition = new Vec3();
        Vec3.add(newPosition, this._targetPosition, new Vec3(0, this._tileSize * 2, 0));
        this.node.setPosition(newPosition);
    }

    protected update(dt: number): void {
        this.handlePosition(dt);
    }

    protected _registerNodeEvent(): void {
        this.node.on(NodeEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(NodeEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        this.node.on(NodeEventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    protected _unregisterNodeEvent(): void {
        this.node.off(NodeEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.off(NodeEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        this.node.off(NodeEventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    protected _onMouseMoveIn (event?: EventMouse): void {
        let spriteComponent = this.getComponent(SpriteComponent);
        spriteComponent.color = new Color(128, 128, 128);
    }

    protected _onMouseMoveOut (event?: EventMouse): void {
        let spriteComponent = this.getComponent(SpriteComponent);
        spriteComponent.color = new Color(256, 256, 256);
    }

    protected _onMouseDown (event?: EventMouse): void {
        this.events.emit('click', this.model);
    }

    public dirty(): void {
        this._targetPosition = this.calculateTargetPosition();
        this._movementFinished = false;
        this._moveTime = 0;
        this._moveDuration = randomRange(1.5, 2);

        let spriteComponent = this.getComponent(SpriteComponent);
        spriteComponent.spriteFrame = this.frames[this.model.color];
    }

    private calculateTargetPosition(): Vec3 {
        return new Vec3(this.model.position.x * this._tileSize, this.model.position.y * this._tileSize, 0);
    }

    private handlePosition(dt: number): void {
        if (this._movementFinished) {
            return;
        }

        this._moveTime += dt;
        let ratio = 1.0;
        if (this._moveDuration > 0) {
            ratio = this._moveTime / this._moveDuration;
        }

        if (ratio >= 1) {
            ratio = 1;
        }

        let newPosition = new Vec3();
        Vec3.lerp(newPosition, this.node.getPosition(), this._targetPosition, ratio);
        
        if (Vec3.distance(newPosition, this._targetPosition) < 1) {
            newPosition = this._targetPosition;
            this._movementFinished = true;
        }

        this.node.setPosition(newPosition);
    }
}


