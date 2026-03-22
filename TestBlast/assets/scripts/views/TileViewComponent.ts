import { _decorator, ButtonComponent, Color, EventMouse, Input, lerp, NodeEventType, randomRange, SpriteComponent, SpriteFrame, Vec3, EventTarget } from 'cc';
import { TileModel } from '../models/TileModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
const { ccclass, property } = _decorator;

@ccclass('TileViewComponent')
export class TileViewComponent extends BaseViewComponent<TileModel> {
    public events = new EventTarget();

    @property([SpriteFrame])
    frames: SpriteFrame[] = [];

    private _transitionFinished: boolean = true;
    private _targetPosition: Vec3;
    private _moveTime: number;
    private _moveDuration: number = 2;

    protected start(): void {
    }

    protected onEnable(): void {
        this.node.on(NodeEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(NodeEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        this.node.on(NodeEventType.MOUSE_DOWN, this._onMouseDown, this);
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

    override init(model: TileModel): void {
        super.init(model);

        let newPosition = new Vec3();
        Vec3.add(newPosition, this._targetPosition, new Vec3(0, 200, 0));
        this.node.setPosition(newPosition);
    }

    render() {
        this.dirty();

        this._transitionFinished = false;
        this._moveTime = 0;
        this._moveDuration = randomRange(1.5, 2);

        let spriteComponent = this.getComponent(SpriteComponent);
        spriteComponent.spriteFrame = this.frames[this.model.color];
    }

    protected update(dt: number): void {
        this.handlePosition(dt);
    }

    dirty() {
        this._targetPosition = this.calculateTargetPosition();
        this._transitionFinished = false;
        this._moveTime = 0;
        this._moveDuration = randomRange(1.5, 2);
    }

    calculateTargetPosition(): Vec3 {
        return new Vec3(this.model.position.x * 100, this.model.position.y * 100, 0);
    }

    private handlePosition(dt: number): void {
        if (this._transitionFinished) {
            if(this._targetPosition != this.calculateTargetPosition()) {
                this.dirty();
            }

            return;
        }

        let newPosition = new Vec3();

        this._moveTime += dt;
        let ratio = 1.0;
        if (this._moveDuration > 0) {
            ratio = this._moveTime / this._moveDuration;
        }

        if (ratio >= 1) {
            ratio = 1;
        }

        Vec3.lerp(newPosition, this.node.getPosition(), this._targetPosition, ratio);
        
        if (Vec3.distance(newPosition, this._targetPosition) < 1) {
            newPosition = this._targetPosition;
            this._transitionFinished = true;
        }

        this.node.setPosition(newPosition);
    }
}


