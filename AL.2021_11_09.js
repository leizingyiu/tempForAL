w = 900;
h = 800;

let fontFilesName = `
2017/04/23  16:29           213,512 1-SourceCodePro-ExtraLight-5.ttf
2017/04/23  16:30           174,764 10-SourceCodePro-SemiboldIt-14.ttf
2017/04/23  16:29           211,716 11-SourceCodePro-Bold-3.ttf
2017/04/23  16:29           174,372 12-SourceCodePro-BoldIt-4.ttf
2017/04/23  16:29           211,460 13-SourceCodePro-Black-1.ttf
2017/04/23  16:29           174,208 14-SourceCodePro-BlackIt-2.ttf
2017/04/23  16:29           176,076 2-SourceCodePro-ExtraLightIt-6.ttf
2017/04/23  16:30           213,252 3-SourceCodePro-Light-8.ttf
2017/04/23  16:30           176,124 4-SourceCodePro-LightIt-9.ttf
2017/04/23  16:30           212,880 5-SourceCodePro-Regular-12.ttf
2017/04/23  16:29           180,472 6-SourceCodePro-It-7.ttf
2017/04/23  16:30           212,160 7-SourceCodePro-Medium-10.ttf
2017/04/23  16:30           175,308 8-SourceCodePro-MediumIt-11.ttf
2017/04/23  16:30           212,048 9-SourceCodePro-Semibold-13.ttf
`;
let o = {};
f = fontFilesName.split('\n').filter(t => t.length > 0).map(t => {
    t = t.match(/\S+$/);
    return t.length > 0 ? t[0] : null;
}).filter(Boolean).filter(t => {
    console.log(t);
    let n = t.match(/\d{1,}/g);

    n = n.length > 0 ? n[0] * 1 : '';
    n = n % 2 == 1 ? n : '';
    console.log(n);
    if (n != '') { o[n] = t; }
});
console.log(o);

let fontNamesObj = {};
Object.keys(o).map((i, idx, arr) => {
    let avg = eval(arr.join("+")) / arr.length;
    let closest = arr.filter(ele => { return ele - Math.min(...arr.map(a => Math.abs(a - avg))) == avg });
    let closestIdx = arr.indexOf(closest.toString());
    let newK = (idx - closestIdx) * 100 + 500;
    fontNamesObj[newK] = o[i];
});

console.log(fontNamesObj);




var myFont, fontObj = {};
function preload() {
    myFont = loadFont('../font/Source-Code-Pro/3-SourceCodePro-Light-8.ttf');
    let prePath = '../font/Source-Code-Pro/';
    Object.keys(fontNamesObj).map((key, idx, arr) => {
        console.log(fontNamesObj[key]);
        fontObj[key] = '';
        fontObj[key] = loadFont(prePath + fontNamesObj[key]);
    })
}





function setup() {
    createCanvas(w, h);

    b = [];
    for (let i = 0; i < 25; i++) {
        b[i] = new Block(5, 5, 100, 100, i);
    }
}
function draw() {
    background(220);

    for (let i = 0; i < 25; i++) {
        b[i].display();
    }
}

function Block(row, column, width, height, idx) {
    let c1 = 255, c2 = 0;
    let c3 = idx % 2 == 1 ? c1 : c2, c4 = idx % 2 == 1 ? c2 : c1;

    this.offset = Math.floor(10000 * Math.random());
    [this.x, this.y] = centerArr(row, column)[idx];
    this.pos = [this.x * width + w / 2, this.y * height + h / 2];
    this.idx = idx;
    this.textX = this.pos[0];
    this.textY = this.pos[1];

    this.text = idx % 2 == 1 ? 'L' : 'A';
    this.text = idx == 0 ? 'A' : this.text;
    this.refleshBoo = true;
    this.rotateK = [0, 1][1];




    this.mouseDistance = 0;
    this.update = function () {
        [this.mouseDistanceX, this.mouseDistanceY] = [(mouseX - this.textX), (mouseY - this.textY)];
        this.mouseDistance = Math.pow(this.mouseDistanceX * this.mouseDistanceX + this.mouseDistanceY * this.mouseDistanceY, 0.5);
    }


    this.n = () => noise(frameCount / 300 + this.offset);
    this.refleshText = () => {
        let letters = 'AL'.split('');
        if (this.refleshBoo && this.n() > 0.5) {
            this.text = letters[(letters.indexOf(this.text) + frameCount + this.idx) % letters.length];
            this.refleshBoo = false;
        }
        if (this.refleshBoo == false && this.n() < 0.5) {
            this.refleshBoo = true;
        }
    };



    this.font = myFont;
    this.refleshFontWeight = function () {
        let maxDistance = Math.pow(Math.pow(row * width, 2) + Math.pow(column * height, 2), 0.5);
        let weightList = [...Object.keys(fontObj).map(k => Number(k))];
        let maxWeight = Math.max(...weightList);
        let minWeight = Math.min(...weightList);

        let weight = map(this.mouseDistance, maxDistance, 0, minWeight, maxWeight);
        weight = Math.floor(weight / 100) * 100;
        weight = Math.max(Math.min(weight, maxWeight), minWeight);
        console.log([maxDistance, weightList, maxWeight, minWeight, weight].join(' | '))
        this.font = fontObj[weight];
    }

    this.textRotate = 0;

    this.rotateText = function () {
        this.textRotate = -(Math.atan2(this.mouseDistanceX, this.mouseDistanceY) + Math.PI) * this.rotateK;
    }

    this.drawText = function () {
        translate(this.textX, this.textY);
        rotate(this.textRotate);
        strokeWeight(0);
        textSize(128);
        textFont(this.font);
        textAlign(CENTER, CENTER);
        textStyle(NORMAL);
        fill(color(c4, map(Math.pow(Math.abs(this.n() - 0.5) * 2, 0.3), 0, 0.5, 0, 100)));
        text(this.text, 0, -20);
        rotate(-this.textRotate);
        translate(-this.textX, -this.textY);
    };

    this.drawRect = function () {
        rectMode(CENTER);
        fill(c3);
        stroke(0);
        rect(...this.pos, width, height);

    };
    this.display = function () {
        this.drawRect();

        this.update();
        this.refleshText();
        this.refleshFontWeight();
        this.rotateText();
        this.drawText();
    }
}

function centerArr(row, column) {
    let result = [];
    for (let i = 0; i < row * column; i++) {
        let rowPosition = (i % row - (row - 1) / 2);
        let columnPosition = Math.floor(i / row) - (column - 1) / 2;
        result[i] = [rowPosition, columnPosition];
    }
    return result;
}

// function mul() {
//     let arg = [...arguments];
//     let max = Math.max(...arg.map(a => a instanceof Array ? a.length : 0))
//     let result;
//     for (let i = 0; i < max; i++) {
//         result[i] = eval(arg.map(a => a[i] != undefined ? (a[i] instanceof Number ? a[i] : 1) : 1).join('*'));
//     };
//     return result;
// }