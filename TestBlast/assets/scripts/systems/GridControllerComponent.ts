import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { TileViewComponent } from '../views/TileViewComponent';
import { TileModel } from '../models/TileModel';
import { GridViewComponent } from '../views/GridViewComponent';
import { GridService } from './GridService';
const { ccclass, property } = _decorator;

@ccclass('GridControllerComponent')
export class GridControllerComponent extends Component {
    @property({type: Node})
    background: Node;

    @property({type: Prefab})
    tilePrefab: Prefab;

    _viewMap: Map<TileModel, Node> = new Map<TileModel, Node>();

    _gridService: GridService;

    start() {
        this.createGridService();
        this.init(4, 6);
    }

    createGridService() {
        this._gridService = new GridService();
        this._gridService.eventTarget.on('TileCreated', this.onTileCreated, this);
        this._gridService.eventTarget.on('TileUpdated', this.onTileUpdated, this);
        this._gridService.eventTarget.on('TileRemoved', this.onTileRemoved, this);
    }

    init(width: number, height: number) {
        this._gridService.init(width, height);
        this.createBackground();
    }

    onTileCreated(tile: TileModel) {
        const tileNode = instantiate(this.tilePrefab);
        this.background.addChild(tileNode);
        
        let viewComponent = tileNode.getComponent(TileViewComponent);
        viewComponent.init(tile);

        viewComponent.events.on('click', this.onTileClicked, this);

        this._viewMap.set(tile, tileNode);
    }

    onTileClicked(model: TileModel) {
        this._gridService.handleClick(model);
    }

    onTileUpdated(tile: TileModel) {
        const tileNode = this._viewMap.get(tile);

        if(tile === undefined) {
            return;
        }
        const tileView = tileNode.getComponent(TileViewComponent);
        tileView.dirty();
    }

    onTileRemoved(tile: TileModel) {
        const tileNode = this._viewMap.get(tile);

        if(tile === undefined) {
            return;
        }

        tileNode.destroy();
        this._viewMap.delete(tile);
    }

    createBackground() {
        let viewComponent = this.background.getComponent(GridViewComponent);
        viewComponent.init(this._gridService.grid);
    }
}


