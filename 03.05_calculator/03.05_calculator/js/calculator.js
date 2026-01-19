'use strict';

// 状態管理変数
let wkFirst = "1";  // 初回入力フラグ ("1": 初回, "0": それ以外)
let wkTotal = 0;    // 合計値
let wkCalc = "+";   // 演算子
let wkBefore = "1"; // 1つ前の入力 ("0": 数値, "1": 演算子)

// DOM要素取得
const resultArea = document.getElementById("result");
const logArea = document.getElementById("calcLog");

const numButtons = {
  0: document.getElementById("num0"),
  1: document.getElementById("num1"),
  2: document.getElementById("num2"),
  3: document.getElementById("num3"),
  4: document.getElementById("num4"),
  5: document.getElementById("num5"),
  6: document.getElementById("num6"),
  7: document.getElementById("num7"),
  8: document.getElementById("num8"),
  9: document.getElementById("num9"),
};

const elementAdd = document.getElementById("add");
const elementSub = document.getElementById("sub");
const elementMult = document.getElementById("mult");
const elementDiv = document.getElementById("div");
const elementEqual = document.getElementById("equal");
const elementCancel = document.getElementById("cancel");

// --- イベント設定 ---

// 数字ボタン
for (let i = 0; i <= 9; i++) {
  numButtons[i].addEventListener("click", () => edit(i));
}

// 演算子ボタン
elementAdd.addEventListener("click", () => update("+"));
elementSub.addEventListener("click", () => update("-"));
elementMult.addEventListener("click", () => update("*"));
elementDiv.addEventListener("click", () => update("/"));

// イコール
elementEqual.addEventListener("click", dspResult);

// クリア
elementCancel.addEventListener("click", clear);

// --- 関数定義 ---

// 数字入力処理
function edit(num) {
  if (wkBefore === "0") {
    resultArea.innerHTML = Number(resultArea.innerHTML + num);
  } else {
    resultArea.innerHTML = num;
  }

  wkFirst = "0";
  wkBefore = "0";
}

// 演算子入力処理
function update(calcType) {
  if (wkBefore === "0") {
    logArea.innerHTML = logArea.innerHTML + Number(resultArea.innerHTML) + calcType;
    calculator();
  } else {
    if (wkFirst === "1") {
      logArea.innerHTML = "0" + calcType;
    } else {
      let lastChar = logArea.innerHTML.slice(-1);
      if (["+", "-", "*", "/"].includes(lastChar)) {
        logArea.innerHTML = logArea.innerHTML.slice(0, -1) + calcType;
      }
    }
  }

  wkCalc = calcType;
  wkBefore = "1";
}

// = ボタン処理
function dspResult() {
  if (wkFirst === "0" && wkBefore === "0") {
    let currentLog = logArea.innerHTML;
    let currentResult = Number(resultArea.innerHTML);
    logArea.innerHTML = currentLog + currentResult;

    calculator();

    wkCalc = "=";
    wkBefore = "1";
  }
}

// 計算処理
function calculator() {
  let currentValue = Number(resultArea.innerHTML);

  switch (wkCalc) {
    case "+":
      wkTotal = wkTotal + currentValue;
      break;
    case "-":
      wkTotal = wkTotal - currentValue;
      break;
    case "*":
      wkTotal = wkTotal * currentValue;
      break;
    case "/":
      wkTotal = currentValue !== 0 ? wkTotal / currentValue : 0;
      break;
    default:
      wkTotal = currentValue;
      break;
  }

  resultArea.innerHTML = wkTotal;
}

// クリア処理
function clear() {
  wkFirst = "1";
  wkBefore = "1";
  wkCalc = "+";
  wkTotal = 0;

  resultArea.innerHTML = "0";
  logArea.innerHTML = "";
}
