w = 900;
h = 800;

let fontFilesName = `
2017/04/23  16:29           213,512 1-SourceCodePro-ExtraLight-5.otf
2017/04/23  16:30           174,764 10-SourceCodePro-SemiboldIt-14.otf
2017/04/23  16:29           211,716 11-SourceCodePro-Bold-3.otf
2017/04/23  16:29           174,372 12-SourceCodePro-BoldIt-4.otf
2017/04/23  16:29           211,460 13-SourceCodePro-Black-1.otf
2017/04/23  16:29           174,208 14-SourceCodePro-BlackIt-2.otf
2017/04/23  16:29           176,076 2-SourceCodePro-ExtraLightIt-6.otf
2017/04/23  16:30           213,252 3-SourceCodePro-Light-8.otf
2017/04/23  16:30           176,124 4-SourceCodePro-LightIt-9.otf
2017/04/23  16:30           212,880 5-SourceCodePro-Regular-12.otf
2017/04/23  16:29           180,472 6-SourceCodePro-It-7.otf
2017/04/23  16:30           212,160 7-SourceCodePro-Medium-10.otf
2017/04/23  16:30           175,308 8-SourceCodePro-MediumIt-11.otf
2017/04/23  16:30           212,048 9-SourceCodePro-Semibold-13.otf
`;


let fileNames = {};
f = fontFilesName.split('\n').filter(t => t.length > 0).map(t => {
    t = t.match(/\S+$/);
    return t.length > 0 ? t[0] : null;
}).filter(Boolean).filter(t => {
    console.log(t);
    let n = t.match(/\d{1,}/g);

    n = n.length > 0 ? n[0] * 1 : '';
    n = n % 2 == 1 ? n : '';
    console.log(n);
    if (n != '') {
        fileNames[n] = t;
    }
});
console.log(fileNames);


let fontNamesObj = {};
Object.keys(fileNames).map((i, idx, arr) => {
    let avg = eval(arr.join("+")) / arr.length;
    let temp, closestIdx;
    arr.map((a, index) => {
        closestIdx = typeof temp != 'undefined' && typeof closestIdx != 'undefined' ? (((a - avg) < temp) ? index : closestIdx) : index;
        temp = a - avg;
    })
    let newK = (idx - closestIdx) * 100 + 500;
    fontNamesObj[newK] = fileNames[i];
});

var fontObj = {};
let play = true;
let mouseIn = true;

function preload() {
    let prePath = './font/Source-Code-Pro-AL/';
    Object.keys(fontNamesObj).map((key, idx, arr) => {
        console.log(fontNamesObj[key]);
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
    if (mouseX < w && mouseY < h) {
        mouseIn = true;
    } else {
        mouseIn = false;
    }

    if (play) {
        background(220);

        for (let i = 0; i < 25; i++) {
            b[i].main();
        }

        // stroke(255); //TODO
        // strokeWeight(2);
        // fill(0);
        // text(frameCount, 20, 20);
    }
}

function keyPressed() {
    if (keyCode === 32) {
        play = !play;
    }
    // return false; // prevent any default behavior
}

function Block(row, column, width, height, idx) {

    let consoleIdx = [0, 5, 10, 15];
    let that = this;
    that.showInfoBoo = true;

    let c1 = 255,
        c2 = 0;

    that.premoveA = function () {
        translate(that.textX, that.textY);
        that.premove = that.premoveB;
    };
    that.premoveB = function () {
        translate(-that.textX, -that.textY);
        that.premove = that.premoveA;
    };

    that.premove = that.premoveA;


    that.init = function () {

        //noise
        that.offset = Math.floor(10000 * Math.random());
        that.noise = 0; //init

        //position
        [that.x, that.y] = centerArr(row, column)[idx];
        that.placeDirection = 'row';
        that.playDirection = 'column';
        that.direction = {
            'row': {
                'num': row,
                'width': row * width
            },
            'column': {
                'num': column,
                'width': column * height
            }
        };

        // that.idxX = (idx % that.direction[that.playDirection].num);
        // that.idxY = (idx - idx % that.direction[that.playDirection].num) / that.direction[that.playDirection].num;

        [that.idxX, that.idxY] = [(idx % that.direction[that.playDirection].num), (idx - idx % that.direction[that.playDirection].num) / that.direction[that.playDirection].num];

        that.pos = [that.x * width + w / 2, that.y * height + h / 2];
        that.textX = that.pos[0];
        that.textY = that.pos[1];


        that.refleshBoo = true;

        // mouse 
        that.mouseDistance = 0; //init
        that.mouseEffect = true;
        that.mouseK = 1;
        that.mouseDefaultK = 1;

        //text 
        that.text = that.idxX % 2 == 1 ? 'A' : 'L';
        that.rotateK = [0, 1][0];

        //frame
        that.frameInterval = 3; //setting
        that.maxDuraFrame = 90; //setting
        that.minDuraFrame = 30;
        that.startFrame = 0; //init
        that.endFrame = 0; //init
        that.frameRand = 0.5; //init
        that.processStartFrame = that.startFrame; //init
        that.processEndFrame = that.processStartFrame; //init
        that.processBoo = true; //init
        that.process = 0;

        that.processIdx = column - this.idxY;


        //font
        that.font = fontObj['500'];

        //fill
        that.textSourceFill = idx % 2 == 1 ? c1 : c2;
        that.rectSourceFill = idx % 2 == 1 ? c2 : c1;

        that.textFill = that.textSourceFill;
        that.rectFill = that.rectSourceFill;

        //rotate
        that.textRotate = 0;

        //weight
        that.fontWeight = 500;

        that.init = () => { };
    };


    that.update = function () {



        if (frameCount >= that.processEndFrame) {
            that.frameRand = noise((that.idxX + 1) * frameCount);
            let nextDuraFrames = Math.floor(that.frameRand * that.maxDuraFrame);
            that.processStartFrame = frameCount;
            that.processEndFrame = that.processStartFrame + nextDuraFrames + that.minDuraFrame;

        }

        if (frameCount >= that.endFrame) {

            that.startFrame = that.processStartFrame + that.processIdx * that.frameInterval;
            that.endFrame = that.processEndFrame + that.processIdx * that.frameInterval;;

            that.refleshBoo = true;
        }




        that.process = map(frameCount, that.startFrame, that.endFrame, 0, 1);
        // console.log(frameCount, that.processStartFrame, that.idxX, that.frameRand, that.processEndFrame, that.process);

        let consoleArr = [idx, that.idxX, that.idxY,
            that.process.toFixed(5), that.frameRand.toFixed(4),
            that.processStartFrame, that.processEndFrame,
            that.startFrame, frameCount, that.endFrame,
            that.endFrame - that.startFrame
        ];

        // consoleIdx.indexOf(idx) != -1 && console.log(consoleArr.join(' | '));



        that.noise = noise(frameCount / 300 + that.offset);

        that.initBoo = false;
        that.processBoo = false;

    }

    that.refleshMouseEvent = function () {
        let maxDistance = Math.pow(Math.pow(row * width, 2) + Math.pow(column * height, 2), 0.5);
        [that.mouseDistanceX, that.mouseDistanceY] = [(mouseX - that.textX), (mouseY - that.textY)];
        that.mouseDistance = Math.pow(Math.pow(that.mouseDistanceX, 2) + Math.pow(that.mouseDistanceY, 2), 0.5);

        that.mouseK = mouseIn && that.mouseEffect ? map(that.mouseDistance, 0, maxDistance, 1, 0) : that.mouseDefaultK;

        let consoleArr = [that.mouseDistance, that.mouseK]
        // idx == 0 && console.log(consoleArr.join(' | '))
    }

    that.refleshText = () => {
        let letters = 'AL'.split('');
        if (that.refleshBoo) {
            that.text = letters[(letters.indexOf(that.text) + 1) % letters.length];
            that.refleshBoo = false;
        };
    };

    that.refleshFontFill = function () {
        let k = Math.abs((1 - that.mouseK) + (that.process));

        // idx == 0 && console.log(`k:${k}`);

        that.textFill = map(k, 0, 1, that.rectSourceFill, that.textSourceFill);
    }

    let weightList = [...Object.keys(fontObj).map(k => Number(k))];
    let maxWeight = Math.max(...weightList);
    let minWeight = Math.min(...weightList);

    that.refleshFontWeight = function () {

        // idx == 0 && console.log(that.mouseK, that.process, mouseIn);
        let k = Math.abs((1 - that.mouseK) + (that.process));
        let weight = map(k, 1, 0, minWeight, maxWeight);

        weight = Math.floor(weight / 100) * 100;
        weight = Math.max(Math.min(weight, maxWeight), minWeight);


        that.font = fontObj[weight];
    }



    that.rotateText = function () {
        that.textRotate = -(Math.atan2(that.mouseDistanceX, that.mouseDistanceY) + Math.PI) * that.rotateK;
    }

    that.drawText = function () {

        rotate(that.textRotate);

        strokeWeight(0);
        textSize(128);
        textFont(that.font);
        textAlign(CENTER, CENTER);
        textStyle(NORMAL);
        fill(that.textFill);
        text(that.text, 0, -20);

        rotate(-that.textRotate);

    };

    that.drawRect = function () {
        rectMode(CENTER);
        fill(that.rectFill);
        stroke(0);
        rect(0, 0, width, height);

    };



    that.showInfo = function () {
        if (that.showInfoBoo == false) {
            return void 0;
        }
        textSize(12);
        stroke(0); //TODO
        strokeWeight(2);
        fill(255);
        text(`${that.startFrame} | ${that.endFrame}`, 0, height / 2 - 20);
    }
    that.display = function () {

        that.premove();

        that.drawRect();

        that.refleshMouseEvent();
        that.refleshText();
        that.refleshFontWeight();
        that.refleshFontFill();
        that.rotateText();
        that.drawText();

        //that.showInfo();

        that.premove();
    };
    that.main = function () {
        that.init();
        that.update();
        that.display();


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