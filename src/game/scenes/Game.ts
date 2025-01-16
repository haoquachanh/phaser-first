import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private stars!: Phaser.Physics.Arcade.Group;
    private bombs!: Phaser.Physics.Arcade.Group;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private score = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private gameOver = false;

    constructor() {
        super("Game");
    }
    init() {
        this.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Graphics) {
                child.clear();
            }
        });
    }

    create() {
        this.gameOver = false;
        this.add.image(400, 300, "sky");

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        this.player = this.physics.add.sprite(50, 450, "dude");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.boot();

        if (!this.anims.exists("left"))
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("dude", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 10,
                repeat: -1,
            });

        if (!this.anims.exists("turn"))
            this.anims.create({
                key: "turn",
                frames: [{ key: "dude", frame: 4 }],
                frameRate: 20,
            });

        if (!this.anims.exists("right"))
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("dude", {
                    start: 5,
                    end: 8,
                }),
                frameRate: 10,
                repeat: -1,
            });

        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
            const star = child as Phaser.Physics.Arcade.Image;
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return null;
        });

        this.bombs = this.physics.add.group();
        const bomb = this.bombs.create(50, 300, "bomb");
        bomb.setBounce(1.1);
        bomb.setCollideWorldBounds(true);
        // bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            backgroundColor: "#000",
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            undefined,
            this
        );
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.hitBomb,
            undefined,
            this
        );

        if (this.input.keyboard)
            this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time: number, delta: number): void {
        if (this.gameOver) {
            return;
        }

        if (this.cursors?.left?.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors?.right?.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (
            this.cursors?.up?.isDown &&
            this.player.body &&
            this.player.body.touching.down
        ) {
            this.player.setVelocityY(-330);
        }
    }

    private collectStar = (_player: any, star: any): void => {
        const collectedStar = star as unknown as Phaser.Physics.Arcade.Image;
        collectedStar.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child) => {
                if (child) {
                    const star = child as Phaser.Physics.Arcade.Image;
                    star.enableBody(true, star.x, 0, true, true);
                }
                return null;
            });

            const x =
                this.player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    };

    private hitBomb = (player: any): void => {
        this.physics.pause();
        const hitPlayer = player as Phaser.Physics.Arcade.Sprite;
        hitPlayer.setTint(0xff0000);
        hitPlayer.anims.play("turn");
        this.gameOver = true;
        this.time.delayedCall(1000, () => {
            this.changeScene();
        });
    };

    changeScene() {
        this.scene.start("GameOver");
    }
}

