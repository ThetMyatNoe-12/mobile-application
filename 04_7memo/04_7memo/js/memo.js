"use strict";

// A: DOMContentLoadedイベントリスナーを追加
document.addEventListener("DOMContentLoaded", function () {

    // 1.localStorageが使えるか確認
    if (typeof localStorage === "undefined") {
        window.alert("このブラウザはlocalStorage機能が実装されていません");
        return;
    } else {
        // B: localStorage への表示
        viewStorage();
        saveLocalStorage();  // Set up save button listener
        delLocalStorage();  // Set up delete button listener
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

        if (key === "" || value === "") {
            window.alert("Key、Memoはいずれも必須です。");
            return;
        } else {
            let confirmed = confirm("localStorageに \n" + key + ": " + value + "\nを保存(save)してもよろしいですか？");
            
            if (confirmed) {
                localStorage.setItem(key, value);
                viewStorage();
                let w_msg = "LocalStorageに\n「" + key + "」「" + value + "」\nを保存（ほぞん）しました。";
                window.alert(w_msg);
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
            }
        }
    }, false);
}

// Delete function - using checkboxes
function delLocalStorage() {
    document.getElementById("del").addEventListener("click", function (e) {
        e.preventDefault();

        let w_sel = selectCheckBox();

        if (w_sel === "1") {
            const chkbox1 = document.getElementsByName("chkbox1");

            for (let i = 0; i < chkbox1.length; i++) {
                if (chkbox1[i].checked) {
                    let w_key = chkbox1[i].value;
                    let w_value = localStorage.getItem(w_key);

                    let confirmed = confirm("localStorageから \n" + w_key + ": " + w_value + "\nを削除(delete)してもよろしいですか？");
                    
                    if (confirmed) {
                        localStorage.removeItem(w_key);
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";
                        viewStorage();
                        window.alert("LocalStorageから\n「" + w_key + "」「" + w_value + "」\nを削除(delete)しました。");
                    }
                }
            }
        }
    }, false);
}

// View localStorage function - displays all localStorage data in a table
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

        td1.innerHTML = '<input name="chkbox1" type="checkbox" value="' + w_key + '" />';
        td2.textContent = w_key;
        td3.textContent = localStorage.getItem(w_key);
    }

    if (typeof $.fn.tablesorter !== 'undefined') {
        $("#table1").tablesorter({
            sortList: [[1,0]]
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
            selectCheckBox();
        }, false
    )
}

function allClearLocalStorage() {
    let allClear = document.getElementById("allClear");

    allClear.addEventListener("click",
        function (e) {
            e.preventDefault();
            let w_confirm = confirm("LocalStorageのデータをすべて削除(all Clear)します。\nよろしいですか?");

            if (w_confirm === true) {
                localStorage.clear();
                viewStorage();

                let w_msg = "LocalStorageのデータをすべて削除しました";
                window.alert(w_msg);
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
            }
        }, false
    );
}

function selectCheckBox() {
    let w_sel = "0";
    let w_cnt = 0;
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");
    let w_textKey = "";
    let w_textMemo = "";

    for(let i = 0; i < chkbox1.length; i++){
        if(chkbox1[i].checked){
            if(w_cnt === 0){
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;
                
                document.getElementById("textKey").value = w_textKey;
                document.getElementById("textMemo").value = w_textMemo;
            }
            w_cnt++;
        }
    }

    if(w_cnt === 1){
        w_sel = "1";
    } else {
        window.alert("1つ選択 (select) してください");
    }

    return w_sel;
}