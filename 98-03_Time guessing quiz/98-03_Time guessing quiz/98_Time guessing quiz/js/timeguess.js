"use strict";


const timer = document.getElementById("timer");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const body = document.body; // 背景切り替え用

let startTime;       // Startボタンクリック時の時刻
let timeoutid;       // ID
let stopTime = 0;    // Stopまでの経過時間

// 音声ファイルの準備
const soundStart = new Audio("sound/start.mp3");
const soundStop1 = new Audio("sound/stop1.mp3");
const soundStop2 = new Audio("sound/stop2.mp3");
const soundReset = new Audio("sound/reset.mp3");

// 全ての音を止める関数
function stopAllSounds() {
  soundStart.pause();
  soundStart.currentTime = 0;
  soundStop1.pause();
  soundStop1.currentTime = 0;
  soundStop2.pause();
  soundStop2.currentTime = 0;
  soundReset.pause();
  soundReset.currentTime = 0;
} 

// ボタンを"初期"状態とする
setButtonStateInitial();
body.classList.add("pink-bg");

////////////////////////
// Startボタンクリック
////////////////////////
start.addEventListener("click",
  function () {
    // ボタンをタイマー"動作中"状態とする
    soundStart.play();
    setButtonStateRunning()
    startTime = Date.now();
    countUp();
  }, false
);

////////////////////////
// Stopボタンクリック
////////////////////////
// Stopボタンクリック時
stop.addEventListener("click",
  function () {
    setButtonStateStopped();
    clearTimeout(timeoutid);
    stopTime = Date.now() - startTime;

    const timeText = timer.textContent;
    const timeSub = timeText.substring(0, 5).trim(); // 例 "00:10"

    if (timeSub < "00:10") {
      soundStop1.play();
      }

    // 10秒台（00:10～00:19）でストップできたら花火
    if (timeSub >= "00:10" && timeSub < "00:11") {
      soundStop2.play();
      body.classList.remove("pink-bg");
      body.classList.add("fireworks");
    }

    // 10秒以上ならリセット
    if (timeSub >= "00:11") {
      soundReset.play();
      setButtonStateInitial();
      timer.textContent = "00:00.000";
      stopTime = 0;
      body.classList.remove("fireworks");
      body.classList.add("pink-bg");
    }
  }, false
);
////////////////////////
// Resetボタンクリック
////////////////////////
reset.addEventListener("click",
  function () {
    // ボタンを"初期"状態とする
    soundReset.play();
    setButtonStateInitial()
    timer.textContent = "00:00.000";
    stopTime = 0;

    body.classList.remove("fireworks");
    body.classList.add("pink-bg");
  }
);


function countUp() {
  const d = new Date(Date.now() - startTime + stopTime);
  /* padStart()で２桁固定表示とする */
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  /* 描画 */
  timer.textContent = `${m}:${s}.${ms}`;

  timeoutid = setTimeout(() => {
    //再帰呼び出し
    countUp();
  }, 10);
}

// 初期 または Reset後
function setButtonStateInitial() {
  start.classList.remove("js-inactive");
  stop.classList.add("js-inactive");
  reset.classList.add("js-inactive");
  start.classList.remove("js-unclickable");
  stop.classList.add("js-unclickable");
  reset.classList.add("js-unclickable");
}

// 状態:タイマー動作中
function setButtonStateRunning() {
  timer.classList.add("timer-fontColor_hidden"); //時間を見えなくする
  start.classList.add("js-inactive");   // 非活性
  stop.classList.remove("js-inactive");  // 活性
  reset.classList.add("js-inactive");   // 非活性
  start.classList.add("js-unclickable");
  stop.classList.remove("js-unclickable");
  reset.classList.add("js-unclickable");
}

// 状態:タイマー停止中
function setButtonStateStopped() {
  timer.classList.remove("timer-fontColor_hidden"); //時間を見えるようにする
  timer.classList.add("timer_appear"); //時間をゆっくり表示
  start.classList.add("js-inactive"); // 活性
  stop.classList.add("js-inactive");    // 非活性
  reset.classList.remove("js-inactive"); // 活性
  start.classList.add("js-unclickable");
  stop.classList.add("js-unclickable");
  reset.classList.remove("js-unclickable")
};

// ページロード時に初期ピンク背景をセット
window.addEventListener("load", () => {
  body.classList.add("pink-bg");
});