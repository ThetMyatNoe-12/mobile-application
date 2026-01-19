"use strict";

// A: DOMContentLoadedイベントリスナーを追加
document.addEventListener("DOMContentLoaded", function () {

    // 1.localStorageが使えるか確認
    if (typeof localStorage === "undefined") {
        Swal.fire({
            title: "Memo app",
            html: "このブラウザはlocalStorage機能が実装されていません",
            type: "error",
            allowOutsideClick: false
        });
        return;
    } else {
        // B: localStorage への表示
        viewStorage();
        saveLocalStorage();
        delLocalStorage();
        allClearLocalStorage();
        selectTable();
    }

}, false);

// D: 保存処理の関数
function saveLocalStorage() {
    document.getElementById("save").addEventListener("click", function (e) {
        e.preventDefault();

        const key = document.getElementById("textKey").value;
        const value = document.getElementById("textMemo").value;

        if (key == "" || value == "") {
            Swal.fire({
                title: "Memo app",
                html: "Key, Valueに値がはいっていません。",
                type: "error",
                allowOutsideClick: false
            });
            return;
        } else {
            let w_msg = "localStorageに\n [" + key + "・" + value + "] \nを保存（save）しますか?";
            Swal.fire({
                title: "Memo app",
                html: w_msg,
                type: "question",
                showCancelButton: true
            }).then(function (result) {
                if (result.value === true) {
                    localStorage.setItem(key, value);
                    let w_msg = "localStorageに" + key + "・" + value + " を保存（ほぞん）しました.";
                    Swal.fire({
                        title: "Memo app",
                        html: w_msg,
                        type: "success",
                        allowOutsideClick: false
                    });
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                    viewStorage();
                }
            });
        }
    }, false);
}

function delLocalStorage() {
    document.getElementById("del").addEventListener("click", function (e) {
        e.preventDefault();

        let w_cnt = selectCheckBox("delete");

        if (w_cnt >= 1) {
            const chkbox1 = document.getElementsByName("chkbox1");
            const table1 = document.getElementById("table1");

            let firstCheckedKey = "";
            let firstCheckedValue = "";

            for (let i = 0; i < chkbox1.length; i++) {
                if (chkbox1[i].checked) {
                    firstCheckedKey = table1.rows[i + 1].cells[1].textContent;
                    firstCheckedValue = localStorage.getItem(firstCheckedKey);
                    break;
                }
            }

            let confirmMessage = "";
            if (w_cnt === 1) {
                confirmMessage = "localStorageから選択されている \n" + firstCheckedKey + ": " + firstCheckedValue + "\nを削除(delete)してもよろしいですか？";
            } else {
                confirmMessage = "LocalStorageから選択されている" + w_cnt + "件を削除(delete)してもよろしいですか？";
            }

            Swal.fire({
                title: "Memo app",
                html: confirmMessage.replace(/\n/g, '<br>'),
                type: "warning",
                showCancelButton: true
            }).then(function (result) {
                if (result.value === true) {
                    for (let i = 0; i < chkbox1.length; i++) {
                        if (chkbox1[i].checked) {
                            let w_key = table1.rows[i + 1].cells[1].textContent;
                            localStorage.removeItem(w_key);
                        }
                    }

                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                    viewStorage();

                    Swal.fire({
                        title: "Memo app",
                        html: "LocalStorageから選択されている" + w_cnt + "件を削除(delete)しました。",
                        type: "success",
                        allowOutsideClick: false
                    });
                }
            });
        }
    }, false);
}

function viewStorage() {
    const list = document.querySelector('#list');

    if (!list) {
        console.error("Table element not found");
        return;
    }

    while (list.rows[0]) {
        list.deleteRow(0);
    }

    for (let i = 0; i < localStorage.length; i++) {
        let w_key = localStorage.key(i);

        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");

        list.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "chkbox_" + i;
        checkbox.name = "chkbox1";
        checkbox.value = w_key;
        checkbox.setAttribute("aria-label", "select memo");

        td1.appendChild(checkbox);
        td2.textContent = w_key;
        td3.textContent = localStorage.getItem(w_key);
    }

    if (typeof $.fn.tablesorter !== 'undefined') {
        $("#table1").tablesorter({
            sortList: [[1, 0]]
        });
        $("#table1").trigger("update");
    }
}

function selectTable() {
    const select = document.getElementById("select");

    if (!select) {
        console.error("Select button not found");
        return;
    }

    select.addEventListener("click",
        function (e) {
            e.preventDefault();
            selectCheckBox("select");
        }, false
    );
}

function allClearLocalStorage() {
    let allClear = document.getElementById("allClear");

    allClear.addEventListener("click",
        function (e) {
            e.preventDefault();

            Swal.fire({
                title: "Memo app",
                html: "LocalStorageのデータをすべて削除(all Clear)します。<br>よろしいですか?",
                type: "warning",
                showCancelButton: true
            }).then(function (result) {
                if (result.value === true) {
                    localStorage.clear();
                    viewStorage();

                    Swal.fire({
                        title: "Memo app",
                        html: "LocalStorageのデータをすべて削除しました",
                        type: "success",
                        allowOutsideClick: false
                    });

                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                }
            });
        }, false
    );
}

function selectCheckBox(mode) {
    let w_cnt = 0;
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");
    let w_textKey = "";
    let w_textMemo = "";

    for (let i = 0; i < chkbox1.length; i++) {
        if (chkbox1[i].checked) {
            if (w_cnt === 0) {
                w_textKey = table1.rows[i + 1].cells[1].textContent;
                w_textMemo = localStorage.getItem(w_textKey);
            }
            w_cnt++;
        }
    }

    document.getElementById("textKey").value = w_textKey;
    document.getElementById("textMemo").value = w_textMemo;

    if (mode === "select") {
        if (w_cnt === 0) {
            Swal.fire({
                title: "Memo app",
                html: "1つ選択（select）してください。",
                type: "warning",
                allowOutsideClick: false
            });
            return w_cnt;
        } else if (w_cnt === 1) {
            return w_cnt;
        } else {
            Swal.fire({
                title: "Memo app",
                html: "1つ選択（select）してください。",
                type: "warning",
                allowOutsideClick: false
            });
            return w_cnt;
        }
    }

    if (mode === "delete") {
        if (w_cnt === 0) {
            Swal.fire({
                title: "Memo app",
                html: "1つ以上選択（select）してください。",
                type: "warning",
                allowOutsideClick: false
            });
            return w_cnt;
        }
        return w_cnt;
    }

    return w_cnt;
}