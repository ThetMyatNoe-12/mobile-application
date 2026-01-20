"use strict";

let flag = 'A';
let counter = 0;
let gameOver = false;
let computerTurn = false;  // コンピュータのターンフラグを追加

const a_1 = 'a_1';
const a_2 = 'a_2';
const a_3 = 'a_3';
const b_1 = 'b_1';
const b_2 = 'b_2';
const b_3 = 'b_3';
const c_1 = 'c_1';
const c_2 = 'c_2';
const c_3 = 'c_3';

// A-1. newgamebtn_display を取得
const newgamebtn_display = document.getElementById("newgame-btn");

// B-1. newgamebtn を取得
const newgamebtn = document.getElementById("btn90");

// ゲームサウンド配列
const gameSound = [
    new Audio('sound/click_sound1.mp3'),   // gameSound[0] - ペンギンターン
    new Audio('sound/click_sound2.mp3'),  // gameSound[1] - シロクマターン
    new Audio('sound/penwin_sound.mp3'), // gameSound[2] - ペンギン勝利
    new Audio('sound/bearwin_sound.mp3'), // gameSound[3] - シロクマ勝利
    new Audio('sound/draw_sound.mp3')        // gameSound[4] - ドロー
];

const line1 = JudgeLine([a_1, a_2, a_3]);
const line2 = JudgeLine([b_1, b_2, b_3]);
const line3 = JudgeLine([c_1, c_2, c_3]);
const line4 = JudgeLine([a_1, b_1, c_1]);
const line5 = JudgeLine([a_2, b_2, c_2]);
const line6 = JudgeLine([a_3, b_3, c_3]);
const line7 = JudgeLine([a_1, b_2, c_3]);
const line8 = JudgeLine([a_3, b_2, c_1]);

const lineArray = [line1, line2, line3, line4, line5, line6, line7, line8];

let winningLine = null;

const msgtext1 = '<p class="image"><img src="img/penguins.jpg" width="61px" height="61px"/></p><p class="text">Penguins Attack!(your turn)</p>';
const msgtext2 = '<p class="image"><img src="img/whitebear.jpg" width="61px" height="61px"/></p><p class="text">WhiteBear Attack!(computer turn)</p>';
const msgtext3 = '<p class="image animate__animated animate__bounce"><img src="img/penguins.jpg" width="61px" height="61px"/></p><p class="text animate__animated animate__lightSpeedInRight">Penguins Win!</p>';
const msgtext4 = '<p class="image animate__animated animate__bounce"><img src="img/whitebear.jpg" width="61px" height="61px"/></p><p class="text animate__animated animate__lightSpeedInLeft">WhiteBear Win!</p>';
const msgtext5 = '<p class="image animate__animated animate__bounce"><img src="img/penguins.jpg" width="61px" height="61px"/><img src="img/whitebear.jpg" width="61px" height="61px"/></p><p class="text animate__bounceIn">Draw!</p>';

window.addEventListener("DOMContentLoaded", function() {
    setMessage("pen-turn");
}, false);

$('.square').on('click', function() {
    // コンピュータのターン中はクリック無効
    if (computerTurn) {
        return;
    }
    isSelect(this);
});

// B ... New Game ボタンのイベントリスナー設定
newgamebtn.addEventListener("click", function() {
    // クリックした時に実行する処理
    // 2-1. flagを初期化する...ペンギンのターンから始める。
    flag = 'A';
    
    // 2-2. ターン数カウンター(counter)を初期化(0) にする。
    counter = 0;
    
    // 2-3. winningLineを初期化(null)する。
    winningLine = null;
    
    // 2-4. 9のマスの目を初期化する。
    // ★ ここから：squareがクリック可能かを判断するクラスを追加
    // 配列.forEachと要素.classList.add("クラス名")を使う
    const squaresArray = document.querySelectorAll('.square');
    squaresArray.forEach(function(square) {
        square.classList.remove("js-pen-checked");
        square.classList.remove("js-bear-checked");
        square.classList.remove("js-unclickable");
        square.classList.remove("js-pen_highlight");
        square.classList.remove("js-bear_hightlight");
    });
    // ★ ここまで
    
    // ゲーム終了フラグを解除
    gameOver = false;
    
    // 2-5. メッセージのセット。
    setMessage("pen-turn");
    
    // 2-6. [NewGame]のボタンエリアを非表示にする。
    newgamebtn_display.classList.add("js-hidden");
    
    // 2-7. snowfall(jQuery plugin)をストップする。
    $(document).snowfall("clear");
});

function JudgeLine(squareArray) {
    return squareArray.map(function(squareId) {
        return document.getElementById(squareId);
    });
}

function isSelect(selectSquare) {
    // ゲーム終了の場合はリターン
    if (gameOver) {
        return;
    }
    
    // コンピュータのターン中で、ユーザーがクリックした場合はリターン（computerTurnがtrueで、selectSquareがクリックされた場合）
    // 注：computerTurnがtrueでもisSelect()内で呼ばれることがある（bearTurn()から）ので、
    // ここでは単純にcomputerTurnだけでは判定できない
    
    if ($(selectSquare).hasClass("js-pen-checked") || $(selectSquare).hasClass("js-bear-checked")) {
        return;
    }
    
    if (flag === 'A') {
        $(selectSquare).addClass("js-pen-checked");
        $(selectSquare).addClass("js-unclickable");
        gameSound[0].currentTime = 0;
        gameSound[0].play(); // ペンギン音声
        flag = 'B';
    } else {
        $(selectSquare).addClass("js-bear-checked");
        $(selectSquare).addClass("js-unclickable");
        gameSound[1].currentTime = 0;
        gameSound[1].play(); // シロクマ音声
        flag = 'A';
    }
    
    counter++;
    
    const winner = isWinner();
    if (winner === "penguin") {
        gameOver = true;
        highlightWinningLine("js-pen_highlight");
        setMessage("penguin-win");
        gameover("penguin");
        $(document).snowfall({
            minSize: 10,
            maxSize: 20,
            round: true,
            color: "#FFB6C1"  // Pink color for penguin
        });
        // ボタン表示
        newgamebtn_display.classList.remove("js-hidden");
        return;
    }
    
    if (winner === "bear") {
        gameOver = true;
        highlightWinningLine("js-bear_hightlight");
        setMessage("bear-win");
        gameover("bear");
        $(document).snowfall({
            minSize: 10,
            maxSize: 20,
            round: true,
            color: "#87CEEB"  // Sky blue color for bear
        });
        // ボタン表示
        newgamebtn_display.classList.remove("js-hidden");
        return;
    }
    
    if (counter === 9) {
        gameOver = true;
        setMessage("draw");
        gameover("draw");
        $(document).snowfall({
            minSize: 10,
            maxSize: 20,
            round: true
        });
        // ボタン表示
        newgamebtn_display.classList.remove("js-hidden");
        return;
    }
    
    if (flag === 'A') {
        setMessage("pen-flag");
        computerTurn = false;  // ユーザーのターン（クリック可能）
    } else {
        setMessage("bear-flag");
        // Computer (bear) takes turn after 500ms
        computerTurn = true;  // コンピュータのターン開始（クリック不可）
        setTimeout(function() {
            bearTurn();
            computerTurn = false;  // コンピュータのターン終了（クリック可能）
        }, 500);  // 500ms（0.5秒）に短縮
    }
}

function isWinner() {
    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];
        
        const penguinWin = line.every(function(square) {
            return square && square.classList.contains("js-pen-checked");
        });
        
        if (penguinWin) {
            winningLine = line;
            return "penguin";
        }
        
        const bearWin = line.every(function(square) {
            return square && square.classList.contains("js-bear-checked");
        });
        
        if (bearWin) {
            winningLine = line;
            return "bear";
        }
    }
    
    return null;
}

function highlightWinningLine(className) {
    if (winningLine) {
        for (let i = 0; i < winningLine.length; i++) {
            $(winningLine[i]).addClass(className);
        }
    }
}

function setMessage(id) {
    switch(id) {
        case "pen-turn":
            $('#msgtext').html(msgtext1);
            break;
        case "pen-flag":
            $('#msgtext').html(msgtext1);
            break;
        case "bear-flag":
            $('#msgtext').html(msgtext2);
            break;
        case "penguin-win":
            $('#msgtext').html(msgtext3);
            break;
        case "bear-win":
            $('#msgtext').html(msgtext4);
            break;
        case "draw":
            $('#msgtext').html(msgtext5);
            break;
    }
}

function gameover(status) {
    let w_sound; // ゲーム終了音
    switch (status) {
        case "penguin":
            w_sound = gameSound[2];
            break;
        case "bear":
            w_sound = gameSound[3];
            break;
        case "draw":
            w_sound = gameSound[4];
            break;
    }
    
    w_sound.currentTime = 0;
    w_sound.play(); // 再生
}

// H...クマのターン（コンピュータ）のロジックを書こう！
function bearTurn() {
    // ゲーム終了した場合はリターン
    if (gameOver) {
        return;
    }
    
    console.log("bearTurn started, flag:", flag);
    
    // 1. リーチがある場合、勝つ処理をする
    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];
        
        let bearCheckCnt = 0;
        let penCheckCnt = 0;
        let emptySquare = null;
        
        line.forEach(function(square) {
            if (square && square.classList.contains("js-bear-checked")) {
                bearCheckCnt++;
            }
            if (square && square.classList.contains("js-pen-checked")) {
                penCheckCnt++;
            }
            if (square && !square.classList.contains("js-pen-checked") && !square.classList.contains("js-bear-checked")) {
                emptySquare = square;
            }
        });
        
        // シロクマが2個で、ペンギンが0個の場合、勝つ
        if (bearCheckCnt === 2 && penCheckCnt === 0 && emptySquare) {
            console.log("Bear attacking!");
            isSelect(emptySquare);
            return;
        }
    }
    
    // 2. ペンギンがリーチの場合、防ぐ処理をする
    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];
        
        let bearCheckCnt = 0;
        let penCheckCnt = 0;
        let emptySquare = null;
        
        line.forEach(function(square) {
            if (square && square.classList.contains("js-bear-checked")) {
                bearCheckCnt++;
            }
            if (square && square.classList.contains("js-pen-checked")) {
                penCheckCnt++;
            }
            if (square && !square.classList.contains("js-pen-checked") && !square.classList.contains("js-bear-checked")) {
                emptySquare = square;
            }
        });
        
        // ペンギンが2個で、シロクマが0個の場合、防ぐ
        if (penCheckCnt === 2 && bearCheckCnt === 0 && emptySquare) {
            console.log("Bear defending!");
            isSelect(emptySquare);
            return;
        }
    }
    
    // 3. クリックできるマス目の中から、1つをランダムに選ぶ。
    const bearSquare = Array.from(document.querySelectorAll(".square:not(.js-unclickable)"));
    
    console.log("Available squares:", bearSquare.length);
    
    if (bearSquare.length === 0) {
        return;
    }
    
    const n = Math.floor(Math.random() * bearSquare.length);
    console.log("Bear random move index:", n);
    isSelect(bearSquare[n]);
}
