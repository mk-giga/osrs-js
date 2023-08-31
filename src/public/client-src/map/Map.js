import * as THREE from 'three';
import * as CONSTANTS from '../Constants.js';

const vertexTileShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentTileShader = `
    varying vec3 vNormal;
    void main() {
        vec3 lightDirection = normalize(vec3(0.5, 0.5, 1.0)); // Adjust the light direction as needed
        float intensity = dot(vNormal, lightDirection);
        gl_FragColor = vec4(vec3(intensity), 1.0);
    }
`;

export class HeightVector {
    x;
    y;
    h;
    s;
    r;
    constructor(x, y, h, s, r) {
        [this.x, this.y, this.h, this.s, this.r] = [x, y, h, s, r]
    }
}

export class TileNode {
    x; // x coordinate
    y; // y coordinate
    z; // z coordinate
    children;

    constructor(x, y, z, children) {
        [this.x, this.y, this.z] = [x, y, z];
        this.children = children;

    }

    getX() { return this.x; }
    getY() { return this.y; }
    getZ() { return this.z; }
    getChildren() { return this.children; }

}
export class TileGradientNode extends TileNode {
    r; // radius
    s; // strength relative to radius. ex: 8 radius 8 strength would make a 3x3 fully non-gradient circle. 
    //8 radius 1 strength will have a fully opaque center that fades out gradually to very little alpha at tile 8.
    children;
    constructor(x, y, z, r, s, children = []) {
        super(x, y, z, children)
        this.r = r;
        this.s = s;
    }
    getStrength() { return this.s; }
    getRadius() { return this.r; }
}

export class TileColorGradientNode extends TileGradientNode {
    color;
    constructor(x, y, r, s, color, children = []) {
        super(x, y, r, s, children);
        this.color = color;
    }
    getColor() { return this.color; }
}

export class TileTextureNode extends TileGradientNode {
    texture;
    constructor(x, y, r, s, children = []) {
        super(x, y, r, s, children);
        this.children = children;
    }
    getTexture() { return this.texture; }
}

export class TileWallNode extends TileNode {
    model;
    constructor(x, y, z, model, children = []) {
        super(x, y, z, children);
        this.model = model;
    }
    getModel() { return this.model; }
}

export class Tilemap {
    constructor(width, height, depth = 32) {

        this.width = width;
        this.height = height;
        this.depth = depth;

        // tile data
        this.heights = [
            new HeightVector(3, 3, 1, 1, 1)
        ]; 
        
        // array of elevation vectors (x,y,z = tile height, r = radius, s = strength)
        this.colorNodes = [];
        this.tileTextureNodes = [];
        this.wallNodes = [];

        // three js data
        this.geometry = new THREE.PlaneGeometry(this.width * 100, this.height * 100, this.width, this.height);

        // Create a basic material for the flat color
        const basicMaterial = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.lawngreen }); // Change the color as needed

        // Create a shader material for shading based on vertex normals
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexTileShader,
            fragmentShader: fragmentTileShader
        });

        // Create a MultiMaterial by combining both materials
        const multiMaterial = [basicMaterial, shaderMaterial];

        // Create your mesh
        this.mesh = new THREE.Mesh(this.geometry, multiMaterial);
        
        this.mesh.receiveShadow = true;
        
        // Rotate the mesh as needed
        this.mesh.rotation.x = -Math.PI / 2;

        // Apply the heights to the mesh vertices
        this.#applyHeightVectorsToMesh();

        // Compute vertex normals for shading
        this.geometry.computeVertexNormals();

    }

    #applyHeightVectorsToMesh() {
        let planeGeometry = this.geometry;

        const positions = planeGeometry.attributes.position.array;
        const widthSegments = planeGeometry.parameters.widthSegments;
        const heightSegments = planeGeometry.parameters.heightSegments;

        for (const vec of this.heights) {
            const x = vec.x;
            const y = vec.y;
            const h = vec.h * CONSTANTS.TILE_SIZE;
            const r = vec.r;

            // Calculate the index of the vertices for the tile at (x, y)
            const vertex1 = (y * (widthSegments + 1) + x) * 3; // Vertex 1 of the tile (top left)
            const vertex2 = vertex1 + 3; // Vertex 2 (top right)
            const vertex3 = vertex1 + (widthSegments + 1) * 3; // Vertex 3 (bottom left)
            const vertex4 = vertex3 + 3; // Vertex 4 (bottom right)

            // Adjust the heights of the vertices
            positions[vertex1 + 2] = h;
            positions[vertex2 + 2] = h;
            positions[vertex3 + 2] = h;
            positions[vertex4 + 2] = h;

            // Apply height adjustments to the surrounding vertices within the radius
            for (let dx = -r; dx <= r; dx++) {
                for (let dy = -r; dy <= r; dy++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    // Check if the neighboring tile is within bounds
                    if (nx >= 0 && nx <= widthSegments && ny >= 0 && ny <= heightSegments) {
                        // Calculate the indices of the vertices for the neighboring tile
                        const neighborVertex1 = (ny * (widthSegments + 1) + nx) * 3;
                        const neighborVertex2 = neighborVertex1 + 3;
                        const neighborVertex3 = neighborVertex1 + (widthSegments + 1) * 3;
                        const neighborVertex4 = neighborVertex3 + 3;

                        // Calculate influence based on distance and strength
                        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
                        const influence = (1 - distanceToCenter / r) * vec.s;

                        // Update the heights of the neighboring vertices
                        positions[neighborVertex1 + 2] += influence;
                        positions[neighborVertex2 + 2] += influence;
                        positions[neighborVertex3 + 2] += influence;
                        positions[neighborVertex4 + 2] += influence;
                    }
                }
            }
        }
        
        // Mark the position attribute as needing an update
        planeGeometry.attributes.position.needsUpdate = true;
    }


    #initMeshTransform() {
        this.mesh.rotation.x = -Math.PI / 2;
    }

    getMesh() {
        return this.mesh;
    }

    setHeightAt(x, y, val = 0) {
        this.heightMapArray.buffer[x][y] = val;
    }

    render() {
        let scene = this.parentScene;
    }
}



/**
 * A subregion within a larger map.
 * @author sourcemile
 *
 * @export
 * @class Region
 * @typedef {Region}
 */
export class Region {
    constructor(parentMap = new Map(), mapXCoords, mapYCoords, mapZC) {
        this.mapCoords = { x: mapXCoords, y: mapYCoords, z: mapZCoords }
        this.parentMap = parentMap;
        this.size = CONSTANTS.REGION_SIZE;
        this.tilemapModel = new Tilemap(CONSTANTS.REGION_SIZE, CONSTANTS.REGION_SIZE);
    }

    setHeight(x, y) {
        if (x >= this.size || y >= this.size) {
            throw `RegionOverflowException`;
        }
    }
}

export class Map {
    constructor() {
        this.regions = [];
    }
}