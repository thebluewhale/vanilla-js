import { Visual } from './visual.js';
import { setColor } from './utils.js';
import { Text } from './text.js';

class App {
    constructor() {
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        this.thumbs = [];

        WebFont.load({
            google: {
                families: ['Hind:700']
            },
            fontactive: () => {
                const ul = document.getElementsByTagName("ul")[0];
                const lis = ul.getElementsByTagName("li");
                for (let i = 0; i < lis.length; ++i) {
                    const item = lis[i];
                    const img = item.getElementsByTagName("img")[0];
                    item.addEventListener("click", () => {
                        this.show(i);
                    }, false);

                    this.thumbs[i] = {
                        item,
                        img: img.src
                    };
                }

                this.text = new Text();

                window.addEventListener("resize", this.resize.bind(this));
                this.resize();

                window.requestAnimationFrame(this.animate.bind(this));
            }
        });
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.pos = this.text.setText("A", 6, this.stageWidth, this.stageHeight);
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        if (this.visual) {
            this.visual.animate(this.ctx);
        }
    }

    async show(index) {
        for (let i = 0; i < this.thumbs.length; ++i) {
            const item = this.thumbs[i].item;
            if (i == index) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        }
        const img = this.thumbs[index].img;

        await setColor(img).then((obj) => {
            this.visual = new Visual(this.pos, obj.colorCtx, obj.width, obj.height);
        });
    }

}

window.onload = () => {
    new App();
}