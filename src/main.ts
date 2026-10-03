import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    Mesh,
} from "@babylonjs/core";

import { Tetrahedron } from "./tetrahedron";

class App {
    constructor() {
        // Canvas
        const canvas = document.createElement("canvas");
        canvas.id = "tetrahedronCanvas";
        document.body.appendChild(canvas);

        // Engine + scene
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI, 200, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        const base = import.meta.env.BASE_URL;
        const T: Mesh = new Tetrahedron(50, [0, 0, 0], [
            `${base}image.png`, // base
            `${base}image.png`, // side
            `${base}image.png`, // side
            `${base}image.png`, // side
        ]).getMesh("tetrahedron", scene);

        window.addEventListener("keydown", (ev) => {
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && (ev.key === "I" || ev.key === "i")) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });
        // Render loop
        var a:number = 0;
        var b:number = 0;
        var g:number = 0;
        engine.runRenderLoop(() => {
          scene.render();
          T.rotation = new Vector3(((a++)%360)*(Math.PI/180), b, g);
        });
    }
}

new App();
