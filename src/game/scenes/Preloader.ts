import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        // this.load.setPath("assets");

        // this.load.image("logo", "logo.png");
        // this.load.image("star", "star.png");
        this.load.image("sky", "/assets/sky.png");
        this.load.image("ground", "/assets/platform.png");
        this.load.image("star", "/assets/star.png");
        this.load.image("bomb", "/assets/bomb.png");
        this.load.spritesheet("dude", "/assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });

        const progressBar = this.add.graphics();
        this.load.on("progress", (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(240, 270, 320 * value, 30);
        });

        this.load.on("complete", () => {
            progressBar.destroy();
        });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("MainMenu");
    }
}

