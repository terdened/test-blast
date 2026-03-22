import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec2 } from 'cc';
import { GridModel } from '../models/GridModel';
import { TileViewComponent } from '../views/TileViewComponent';
import { TileModel } from '../models/TileModel';
import { TileColor } from '../common/enums/TileColor';
import { GridViewComponent } from '../views/GridViewComponent';
const { ccclass, property } = _decorator;

@ccclass('GridSystemComponent')
export class GridSystemComponent extends Component {
    @property({type: Node})
    background: Node;

    @property({type: Prefab})
    tilePrefab: Prefab;

    model: GridModel;

    _viewMap: Map<TileModel, Node> = new Map<TileModel, Node>();

    start() {
        this.init(4, 6);
    }

    init(width: number, height: number) {
        this.model = new GridModel({
            width: width,
            height: height,
            tiles: []
        });

        this.createTiles();
        this.createBackground();
    }

    createTiles() {
        for (var y = 0; y < this.model.height; y++)
        {
            let row: TileModel[] = [];
            
            for (var x = 0; x < this.model.width; x++)
            {
                const tile = this.createTile(x, y);
                row.push(tile);
            }

            this.model.tiles.push(row);
        }
    }

    createTile(x: number, y: number): TileModel {
        const tile = new TileModel({
            position: new Vec2(x, y),
            color: randomRangeInt(0, 5) as TileColor
        });

        const tileNode = instantiate(this.tilePrefab);
        this.background.addChild(tileNode);
        
        let viewComponent = tileNode.getComponent(TileViewComponent);
        viewComponent.init(tile);

        viewComponent.events.on('click', this.handleClick, this);

        this._viewMap.set(tile, tileNode);
        return tile;
    }

    handleClick(model: TileModel) {
        const group = this.findConnected(model);

        if (group.length >= 2) {
            for (const tile of group) {
                this.removeTile(tile);
            }

            this.applyGravity();
            this.spawnNewTiles();
        }
    }

    applyGravity() {
        for (let x = 0; x < this.model.width; x++) {
            let emptyY = 0;

            for (let y = 0; y < this.model.height; y++) {
                const tile = this.model.tiles[y][x];

                if (tile !== undefined) {
                    if (y !== emptyY) {
                        this.moveTile(tile, x, emptyY);
                    }

                    emptyY++;
                }
            }
        }
    }

    moveTile(tile: TileModel, x: number, y: number) {
        this.model.tiles[y][x] = tile;
        this.model.tiles[tile.position.y][tile.position.x] = undefined;

        tile.position.x = x;
        tile.position.y = y;
    }

    removeTileAtPosition(x: number, y: number) {
        const tile = this.model.tiles[y][x];
        this.removeTile(tile);
    }

    removeTile(tile: TileModel) {
        if(tile === undefined) {
            return;
        }

        const tileView = this._viewMap.get(tile);
        tileView.destroy();

        this._viewMap.delete(tile);
        this.model.tiles[tile.position.y][tile.position.x] = undefined;
    }

    spawnNewTiles() {
        for (let x = 0; x < this.model.width; x++) {
            for (let y = 0; y < this.model.height; y++) {
                if (this.model.tiles[y][x] == null) {
                    const tileModel = this.createTile(x, y);
                    this.model.tiles[y][x] = tileModel;
                }
            }
        }
    }

    createBackground() {
        let viewComponent = this.background.getComponent(GridViewComponent);
        viewComponent.init(this.model);
    }


    getNeighbors(tile: TileModel): TileModel[] {
        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
        ];

        const result: TileModel[] = [];

        for (const d of dirs) {
            const nx = tile.position.x + d.x;
            const ny = tile.position.y + d.y;

            if (this.model.tiles[ny] && this.model.tiles[ny][nx]) {
                result.push(this.model.tiles[ny][nx]);
            }
        }

        return result;
    }

    findConnected(startTile: TileModel): TileModel[] {
        const stack: TileModel[] = [startTile];
        const visited = new Set<string>();
        const result: TileModel[] = [];

        const targetColor = startTile.color;

        while (stack.length > 0) {
            const tile = stack.pop()!;
            const key = `${tile.position.x}_${tile.position.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (tile.color !== targetColor) continue;

            result.push(tile);

            const neighbors = this.getNeighbors(tile);
            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }
}


