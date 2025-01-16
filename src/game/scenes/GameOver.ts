import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        // Lấy camera chính
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        // Thêm hình nền và đặt vị trí giữa màn hình
        this.background = this.add.image(0, 0, "background");
        this.background.setAlpha(0);
        this.background.setPosition(
            this.camera.width / 2,
            this.camera.height / 2
        );

        // Thêm văn bản "Game Over" vào giữa màn hình
        this.gameOverText = this.add.text(0, 0, "Game Over", {
            fontFamily: "Arial Black",
            fontSize: "64px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
        });

        // Căn chỉnh vị trí của văn bản chính giữa
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setPosition(
            this.camera.width / 2,
            this.camera.height / 2
        );

        // Đặt độ sâu nếu cần (để hiển thị phía trên các đối tượng khác)
        this.gameOverText.setDepth(100);

        // Đăng sự kiện để nhận thông báo khi cảnh hiện đã sẵn sàng
        EventBus.emit("current-scene-ready", this);

        // Đặt thời gian chờ 5 giây để tự động chuyển về MainMenu
        this.time.delayedCall(5000, this.changeScene, [], this);

        // Lắng nghe sự kiện nhấn phím SPACE để chuyển cảnh

        this.input.keyboard?.once("keydown-SPACE", () => {
            this.changeScene();
        });
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}

