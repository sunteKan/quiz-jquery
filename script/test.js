'use strict';

//quiz[]配列を読み込んだ上で処理を施す。

$(function () {
    //上限やスコアなどの変数定数
    let score = 0;
    let quizCount = 0; //クイズが出題された総数
    let quizIndex = 1; //クイズを出題する数
    let quizLength = quiz.length;

    //絞り込み行程で使われる変数定数
    let radioCount = 0;
    let pullCount = 0;
    let categoryCount = 0;
    const quizSort = [];
    const quizRadio = [];

    //クイズが出題される行程で使われる変数定数
    const newQuiz = [];
    let timer = null;
    let commentaryTime = null;
    let startTime = null;

    start();

    /*--- ラジオボタンの作成 ---*/
    //クイズ配列からすべてのcategoryを摘出する。
    while (pullCount < quizLength) {
        quizRadio.push(quiz[pullCount].category);
        pullCount++;
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
            //絞り込みボタンの読み込み
            const radioVal = $("input[name='category']:checked").val();
            console.log(radioVal);
            //ラジオボタンの選択によって処理を変動する。
            while (categoryCount < quizLength) {
                //絞り込み通りのクイズのみをピックアップ
                if (radioVal === quiz[categoryCount].category) {
                    quizSort.push(quiz[categoryCount]);
                }
                //絞り込みが選択されていない場合(そのまま処理)
                else if (radioVal === undefined || radioVal === null) {
                    quizSort.push(quiz[categoryCount]);
                }
                categoryCount++;
            };
            //初期画面からクイズ画面へ表示切替を行う。
            $('#backWindow, #startWindow').fadeOut();
            //それぞれのコース内容。
            const modeSelect = $(this).val();
            console.log(modeSelect);
            //初級コースが選ばれた場合。
            if ('easy' === modeSelect) {
                //3問出題にしたいので先に3を代入する。
                quizIndex = 3;
                quizRandom();
            }
            //普通コースが選ばれた場合。
            if ('basic' === modeSelect) {
                quizRandom();
            }
        });
    };

    /*--- 2.絞り込まれた問題をランダムにする。---*/
    function quizRandom() {
        let randomCount = 0;
        let sortLength = quizSort.length;
        //クイズ配列の問題すべてに処理を施す。
        while (randomCount < sortLength) {
            let sortLength = quizSort.length;
            //クイズの表示順をランダムに選定する。
            let quizSelectNo = Math.floor(Math.random() * sortLength);
            //ランダムに選定されたクイズを順に格納していく。
            newQuiz.push(quizSort[quizSelectNo]);
            //クイズが重複しないように選定されたクイズを削除する。
            quizSort.splice(quizSelectNo, 1);
            randomCount++;
        };
        //時間の計測開始
        startTime = Date.now();
        //すべてランダムに順序を入れ替えたのちにクイズを出題していく。
        quizMaker();
    }

    /*--- 3.クイズを出題する関数。---*/
    function quizMaker() {
        //クイズの種類を表示する。
        $('#quizCategory').append(
            $(`<h1>クイズの種類：「${newQuiz[quizCount].category}」からの出題。</h1>)`)
        );
        //クイズの問題文章を表示する。
        $('#quizArea').text(newQuiz[quizCount].text);
        //問題の選択肢を表示する。
        choiceMaker();
        //制限時間の可視化(タイマー起動)。
        $('#timeRimain').animate({ marginRight: '100%' }, 5000);

        //選択肢ボタンをクリックした時の処理。
        $('.choice').on('click', function () {
            //制限時間タイマーのストップ
            $('#timeRimain').stop();
            clearTimeout(timer);
            //クリックされたボタンの内容を読み取る。
            const choiceSelect = $(this).val();
            //正解だった時の処理。
            if (newQuiz[quizCount].answer === choiceSelect) {
                $('#correctWindow').append(
                    $(`<p class="correct">正解です！<br>おめでとうございます！！</p>`)
                );
                $('#backWindow,#correctWindow').fadeIn();
                score++;
            }
            //不正解だった時の処理。
            else {
                $('#incorrectWindow').append(
                    $(`<p class="correct">正解は「${newQuiz[quizCount].answer}」です。</p>`)
                );
                $('#backWindow,#incorrectWindow').fadeIn();
            }
            //ボタンの処理を終え次のステップを行う。
            clearTimeout(commentaryTime);
            commentaryTime = setTimeout(quizEnd, 2000);
        });

        //制限時間までに答えを選択できなかったときの処理。
        clearTimeout(timer);
        timer = setTimeout(function () {
            $('#incorrectWindow').append(
                $(`<p class="correct">正解は「<strong>${newQuiz[quizCount].answer}</strong>」です。</p>`)
            );
            $('#backWindow,#incorrectWindow').fadeIn();
            setTimeout(function () {
                quizEnd();
            }, 2000);
        }, 5000);
    };

    /*---任意問題の選択肢を表示する関数。---*/
    function choiceMaker() {
        let choiceCount = 0;
        let choiceLength = newQuiz[quizCount].choice.length;
        //問題の選択肢をすべて表示する。
        while (choiceCount < choiceLength) {
            //ボタンの表示順をランダムに選定する。
            let choiceLength = newQuiz[quizCount].choice.length;
            let choiceSlectNo = Math.floor(Math.random() * choiceLength);
            //選択肢を順にボタン格納していく。
            $('#choiceArea').append(
                $(`<button class="choice" value="${newQuiz[quizCount].choice[choiceSlectNo]}">
                    ${newQuiz[quizCount].choice[choiceSlectNo]}
                </button>`)
            );
            //選択肢が重複しないよう、ランダムに選定された任意の選択肢をchoice[]配列から削除する。
            newQuiz[quizCount].choice.splice(choiceSlectNo, 1);
            choiceCount++;
        };
    }

    /*--- 4.問題が終わり、次の処理を行う関数。---*/
    function quizEnd() {
        //正誤の結果を表示する画面を削除
        clearTimeout(commentaryTime);
        $('#backWindow,#correctWindow,#incorrectWindow').fadeOut();
        //終了した問題文の削除
        $('#quizArea,#quizCategory').empty();
        //問題選択肢と不正解時の解答を削除
        $('.choice,.correct').remove();
        //タイマー残り時間の復活
        clearTimeout(timer);
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

    /*--- 5.結果発表処理を行う関数。---*/
    function result() {
        //時間計測の終了。
        const endTime = Date.now();
        //問題スタートから経過した時間。
        const timeScore = endTime - startTime - 2000 * quizCount;
        //結果スコアの表示。
        $('#backWindow, #resultWindow').fadeIn();
        $('.result').append(
            `<p>お疲れさまでした。</p>
        <p>あなたの正解数は<strong>${score}</strong>問です。</p>
        <p>正当率は<strong>${Math.floor((score / quizCount) * 100)}%</strong>です。</p>
        <p>かかったタイムは
        <strong>
        ${Math.floor(timeScore / 60000)}分
        ${Math.floor(timeScore / 1000)}秒.
        ${Math.floor(timeScore / 100)}
        </strong>です。</p>`
        );
        //閉じるボタンの処理。
        $('.close').click(function () {
            //ページの再読み込みさせ処理したものをリセットさせる。
            window.location.reload();
        });
    };
});