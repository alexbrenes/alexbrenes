import {
    Mesh,
    Scene,
    VertexData,
    SubMesh,
    MultiMaterial,
    StandardMaterial,
    Texture,
} from "@babylonjs/core";

export class Tetrahedron {
    length: number;
    centroid: [number, number, number];
    textureUrls: [string, string, string, string];

    constructor(
        length: number,
        centroid: [number, number, number],
        textureUrls: [string, string, string, string],
    ) {
        this.length = length;
        this.centroid = centroid;
        this.textureUrls = textureUrls;
    }

    getMesh(name: string, scene: Scene): Mesh {
        const L = this.length;
        const [cx, cy, cz] = this.centroid;

        const h = L * Math.sqrt(2 / 3);
        const R = L / Math.sqrt(3);

        const baseY = cy - h / 4;
        const apexY = cy + (3 * h) / 4;

        const A: [number, number, number] = [cx,         baseY, cz + R];
        const B: [number, number, number] = [cx - L / 2, baseY, cz - R / 2];
        const C: [number, number, number] = [cx + L / 2, baseY, cz - R / 2];
        const D: [number, number, number] = [cx,         apexY, cz]; // apex

        const faces: [number, number, number][][] = [
            [A, B, C], // base
            [B, A, D], // side
            [C, B, D], // side
            [A, C, D], // side
        ];

        const positions: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];

        faces.forEach((face, f) => {
            const faceUvs = [0, 0, 1, 0, 0.5, 1];
            face.forEach((vertex, v) => {
                positions.push(...vertex);
                uvs.push(faceUvs[v * 2], faceUvs[v * 2 + 1]);
            });
            const base = f * 3;
            indices.push(base, base + 1, base + 2);
        });

        const mesh = new Mesh(name, scene);
        const vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.uvs = uvs;

        const normals: number[] = [];
        VertexData.ComputeNormals(positions, indices, normals);
        vertexData.normals = normals;

        vertexData.applyToMesh(mesh);

        const multiMat = new MultiMaterial(`${name}_mat`, scene);
        this.textureUrls.forEach((url, f) => {
            const faceMat = new StandardMaterial(`${name}_mat_${f}`, scene);
            const texture = new Texture(url, scene);
            faceMat.emissiveTexture = texture;
            faceMat.disableLighting = true;
            faceMat.backFaceCulling = false;
            multiMat.subMaterials.push(faceMat);
        });
        mesh.material = multiMat;

        mesh.subMeshes = [];
        faces.forEach((_face, f) => {
            new SubMesh(
                f,
                f * 3,
                3,
                f * 3,
                3,
                mesh,
            );
        });

        return mesh;
    }
}
