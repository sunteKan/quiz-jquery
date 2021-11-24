'use strict';

/*quiz[{
        text:問題文章
        choice:問題の選択肢
        answer:問題の答え
        category:問題の種類
        }]配列を読み込んだ上で処理を施す。*/

$(function () {
    /*--- 上限やスコアなどの変数定数 ---*/
    let score = 0;
    let quizCount = 0;          //クイズが出題された総数
    let quizIndex = 1;          //クイズを出題する数
    let quizLength = quiz.length;

    /*--- 絞り込み行程で使われる変数定数 ---*/
    let radioCount = 0;
    let categoryCount = 0;
    const quizRadio = [];       //絞り込みの種類を格納する配列
    const quizSort = [];        //絞り込み処理後に格納する配列

    /*--- 制限時間やタイムスコアに利用するタイマーの変数 ---*/
    let startTimer = null;      //開始から終了まで掛かった時間を計測するタイマー
    let timeLimit = null;       //1問の制限時間
    let answerTimer = null;     //不正解時の解説タイマー

    //初期画面の表示させる関数を呼び出す。
    start();

    /*--- ラジオボタンの作成 ---*/
    //クイズ配列からすべてのcategoryを摘出する。
    for (let i = 0; i < quizLength; i++) {
        quizRadio.push(quiz[i].category);
    }
    //摘出したcategoryの重複を取り除く。
    let radio = [...new Set(quizRadio)];
    //最後に残ったcategoryをradioボタンに納めていく。
    let radioLength = radio.length;
    while (radioCount < radioLength) {
        $('#choiceCategory').append(
            $(`<label>
            <input type="radio" name="category" value="${radio[radioCount]}" >
            ${radio[radioCount]}
            </label>`)
        );
        radioCount++;
    };

    /*--- 絞り込みボタンの設定 ---*/
    //html上のinputの読み込み
    const inputs = $('input');
    //チェックが入っているのか否かの確認
    let checked = inputs.filter(':checked').val();
    //絞り込みボタンを押した時。
    $("input[name='category']").on('click', function () {
        //絞り込みボタンがonならばoffにする
        if ($(this).val() === checked) {
            $(this).prop('checked', false);
            checked = '';
        }
        //絞り込みボタンがoffならばonにする
        else {
            $(this).prop('checked', true);
            checked = $(this).val();
        }
    });

    /*--- 1.初期画面の表示。---*/
    function start() {
        //絞り込み、モード選択などの初期画面を表示。
        $('#startWindow').fadeIn();
        //難易度選択をされたときに行う。
        $('.modeEazy,.modeBasic').click(function () {
            startTimer = Date.now();
            //絞り込みボタンの読み込み
            const radioValue = $("input[name='category']:checked").val();
            //ラジオボタンの選択によって処理を変動する。
            while (categoryCount < quizLength) {
                //絞り込み通りのクイズのみをピックアップ
                if (radioValue === quiz[categoryCount].category) {
                    quizSort.push(quiz[categoryCount]);
                }
                //絞り込みが選択されていない場合(そのまま処理)
                else if (radioValue === undefined || radioValue === null) {
                    quizSort.push(quiz[categoryCount]);
                }
                categoryCount++;
            };

            //問題の表示順をランダムにしたいのでshuffle関数で処理する。
            shuffle(quizSort);

            //初期画面からクイズ画面へ表示切替を行う。
            $('#backWindow, #startWindow').fadeOut();
            //それぞれのコース内容。
            const modeSelect = $(this).val();
            //初級コースが選ばれた場合。
            if ('easy' === modeSelect) {
                //3問出題にしたいので先に3を代入する。
                quizIndex = 3;
                quizMaker();
            }
            //普通コースが選ばれた場合。
            if ('basic' === modeSelect) {
                quizMaker();
            }
        });
    };

    /*--- 2.クイズを出題する関数。---*/
    function quizMaker() {
        //クイズの種類を表示する。
        $('#quizCategory').append(
            $(`<h1>クイズの種類：「${quizSort[quizCount].category}」からの出題。</h1>)`)
        );
        //クイズの問題文章を表示する。
        $('#quizArea').text(quizSort[quizCount].text);
        //問題の選択肢の表示をランダムにしたいのでshuffle関数で処理する。
        shuffle(quizSort[quizCount].choice);
        //選択肢をすべてボタンに格納して表示させる。
        let choiceLength = quizSort[quizCount].choice.length;
        for (let i = 0; i < choiceLength; i++) {
            $('#choiceArea').append(
                $(`<button class="choice" value="${quizSort[quizCount].choice[i]}">
            ${quizSort[quizCount].choice[i]}
        </button>`)
            );
        };
        //制限時間の可視化(タイマー起動)。
        $('#timeRimain').animate({ marginRight: '100%' }, 10000);

        //選択肢ボタンをクリックした時の処理。
        $('.choice').on('click', function () {
            //制限時間タイマーのストップ
            $('#timeRimain').stop();
            clearTimeout(timeLimit);
            //クリックされたボタンの内容を読み取る。
            const choiceSelect = $(this).val();
            //正解だった時の処理。
            if (quizSort[quizCount].answer === choiceSelect) {
                $('#correctWindow').append(
                    $(`<p class="correct">正解です！<br>おめでとうございます！！</p>`)
                );
                $('#backWindow,#correctWindow').fadeIn();
                score++;
            }
            //不正解だった時の処理。
            else {
                $('#incorrectWindow').append(
                    $(`<p class="correct">正解は「${quizSort[quizCount].answer}」です。</p>`)
                );
                $('#backWindow,#incorrectWindow').fadeIn();
            }
            //ボタンの処理を終え次のステップを行う。
            clearTimeout(answerTimer);
            answerTimer = setTimeout(quizEnd, 3000);
        });

        //制限時間までに答えを選択できなかったときの処理。
        clearTimeout(timeLimit);
        timeLimit = setTimeout(function () {
            //不正解時と同じように答えを画面に表示する。
            $('#incorrectWindow').append(
                $(`<p class="correct">正解は「<strong>${quiz[quizCount].answer}</strong>」です。</p>`)
            );
            //表示から3秒後に取り除かれる。
            $('#backWindow,#incorrectWindow').fadeIn();
            setTimeout(function () {
                quizEnd();
            }, 3000);
        }, 10000);
    };

    /*--- 3.問題が終わり、次の処理を行う関数。---*/
    function quizEnd() {
        //正誤の結果を表示する画面を削除
        clearTimeout(answerTimer);
        $('#backWindow,#correctWindow,#incorrectWindow').fadeOut();
        //終了した問題文の削除
        $('#quizArea,#quizCategory').empty();
        //問題選択肢と不正解時の解答を削除
        $('.choice,.correct').remove();
        //タイマー残り時間の復活
        clearTimeout(timeLimit);
        $('#timeRimain').css('margin-right', '0');
        //終了工程、最後の分岐
        quizCount++;
        if (quizIndex < 5) {
            //重複しないように次の問題を出題する。
            quizIndex++;
            quizMaker();
        } else {
            //指定の問題数が終わると結果表示する。
            result();
        }
    }

    /*--- 4.結果発表処理を行う関数。---*/
    function result() {
        //時間計測の終了。
        const endTime = Date.now();
        //問題スタートから経過した時間。
        const timeScore = endTime - startTimer - 3000 * quizCount;
        //結果スコアの表示。
        $('#backWindow, #resultWindow').fadeIn();
        $('.result').append(
            `<p>お疲れさまでした。</p>
            <p>あなたの正解数は<strong>${score}</strong>問</p>
            <p>正当率：<strong>${Math.floor((score / quizCount) * 100)}%</strong></p>
            <p>かかったタイムは
            <strong>
            ${Math.floor(timeScore / 60000)}分
            ${Math.floor(timeScore / 1000)}.
            ${Math.floor(timeScore / 100)}秒
            </strong>です。</p>`
        );
        //閉じるボタンの処理。
        $('.close').click(function () {
            //ページの再読み込みさせ処理したものをリセットさせる。
            window.location.reload();
        });
    };
});

/*--- 配列をランダムにするコールバック関数 ---*/
function shuffle(array) {
    //引数に与えられた配列の長さを読み込む。
    let arrayLength = array.length;
    //空の配列を用意する。
    let newArray = [];
    //引数に与えられた配列すべてに処理を施す。
    for (let i = 0; i < arrayLength; i++) {
        let arrayLength = array.length;
        //配列の数を超えないランダムな数
        let randomSelect = Math.floor(Math.random() * arrayLength);
        //ランダムに選定されたrandomSelect番目の配列値を空の配列に入れる。
        newArray.push(array[randomSelect]);
        //重複しないように元配列から削除する。
        array.splice(randomSelect, 1);
    };
    //元の変数名のまま使えるように配列の値を戻す。
    let newArrayLength = newArray.length;
    for (let i = 0; i < newArrayLength; i++) {
        array.push(newArray[i]);
    }
    //引数を変数名だけ変えずに返す。
    return array;
};