import * as THREE from 'three';
import * as CONSTANTS from '../Constants.js';

export class TileSelector {
    constructor(x = 0, y = 0, z = 0) {
        this.position = { x: x, y: y, z: z }
        this.selectorGeometry = new THREE.BoxGeometry(CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        this.selectorWireframe = new THREE.WireframeGeometry(this.selectorGeometry);
        this.selectorMesh = new THREE.Mesh(this.selectorWireframe, new THREE.MeshBasicMaterial());
    }
    
    getX() { return this.position.x; }
    getY() { return this.position.y; }
    getZ() { return this.position.z; }

    getPosition() {
        return this.position;
    }

    getSelectorMesh() {
        return this.selectorMesh;
    }
    
}
export class MapEditor {
    constructor(currentRegion) {
        this.selector = new TileSelector(0, 0, 0);
        this.currentRegion = null;
    }

    moveSelectorRelative(x = 0, y = 0) {
        this.selector = { x: this.selector.x + x, y: this.selector.y + y, z: this.selector.z };
    }

    moveSelectorTo(x, y) {
        this.selector = {x: x, y: y, z: z };
    }

    getSelector() {
        return this.selector;
    }

    
}