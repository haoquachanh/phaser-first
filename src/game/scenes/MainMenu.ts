import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        document.addEventListener("DOMContentLoaded", () => {
            const audioContext = new AudioContext();
            const button = document.querySelector("button");

            if (button) {
                button.addEventListener("click", () => {
                    if (audioContext.state === "suspended") {
                        audioContext.resume().then(() => {
                            console.log("AudioContext resumed");
                        });
                    }
                });
            } else {
                console.error("Button element not found");
            }
        });

        const title = this.add.text(400, 200, "Phaser Game", {
            fontSize: "48px",
            color: "#ffffff",
        });
        title.setOrigin(0.5);

        const startText = this.add.text(400, 300, "Press SPACE to Start", {
            fontSize: "32px",
            color: "#ffffff",
        });
        startText.setOrigin(0.5);

        if (this.input.keyboard)
            this.input.keyboard.once("keydown-SPACE", () => {
                this.scene.start("Game");
            });
        EventBus.emit("current-scene-ready", this);
    }
}

