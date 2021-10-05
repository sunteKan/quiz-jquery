'use strict';

//用意された問題を配列にし、それぞれの問題1つ1つのオブジェクトとして扱っている。

/*---それぞれのオブジェクトは
    {
        text:問題文章
        choice:問題の選択肢
        answer:問題の答え
        category:問題の種類
    }
のような構成となっている。------------*/

const quiz = [
    //国語の問題
    {
        text: "江戸時代から使われていた言葉は？",
        choice: ["うざい", "むかつく", "えもい", "ばえ"],
        answer: "むかつく",
        category: "国語",
    },
    {
        text: "次の読みは？「海豚」",
        choice: ["シャチ", "イルカ", "ワニ", "カッパ"],
        answer: "イルカ",
        category: "国語",
    },
    {
        text: "「贈賄」の読みは？",
        choice: ["しょくわい", "ぞうわい", "わいろ", "そうずい"],
        answer: "ぞうわい",
        category: "国語",
    },
    {
        text: "「繁殖」の読みは？",
        choice: ["はんもう", "はんじ", "はんしょく", "さえか"],
        answer: "はんしょく",
        category: "国語",
    },
    {
        text: "源氏物語を書いた人は？",
        choice: ["与謝野晶子", "松尾芭蕉", "紫式部", "清少納言"],
        answer: "紫式部",
        category: "国語",
    },
    //数学の問題
    {
        text: "10の3乗は？",
        choice: ["30", "100", "1000", "300"],
        answer: "1000",
        category: "数学",
    },
    {
        text: "次の式を因数分解せよ！「x*2+5x+6」",
        choice: ["(x+1)(x+5)", "(x+2)(x+3)", "x(x+5)+6", "x(x+2)+3"],
        answer: "(x+2)(x+3)",
        category: "数学",
    },
    {
        text: "10+20×30は？",
        choice: ["60", "70", "80", "90"],
        answer: "70",
        category: "数学",
    },
    {
        text: "円周率の続きとして正しいものは？3.14...？",
        choice: ["1592", "1564", "3798", "2259"],
        answer: "1592",
        category: "数学",
    },
    {
        text: "(2+1)×20+30は？",
        choice: ["70", "90", "120", "180"],
        answer: "90",
        category: "数学",
    },
    //社会の問題
    {
        text: "海に接していない都道府県は？",
        choice: ["大阪", "栃木", "神奈川", "福井"],
        answer: "栃木",
        category: "社会",
    },
    {
        text: "次の中から1920年代末に中国で起こった出来事は？",
        choice: ["紅巾の乱", "洋務運動", "五・三０事件", "大躍進政策"],
        answer: "五・三０事件",
        category: "社会",
    },
    {
        text: "イラク戦争が起こった年は？",
        choice: ["1997年", "1999年", "2001年", "2003年"],
        answer: "2003年",
        category: "社会",
    },
    {
        text: "千葉県の特産物は次のうちどれか？(＊2021年データ参照)",
        choice: ["小松菜", "牛乳", "落花生", "キャベツ"],
        answer: "落花生",
        category: "社会",
    },
    {
        text: "日本の46代総理は？",
        choice: ["伊藤博文", "片山哲", "吉田茂", "鳩山一郎"],
        answer: "片山哲",
        category: "社会",
    },
    //理科の問題
    {
        text: "ネコ科は？",
        choice: ["フィジー", "イルカ", "シマウマ", "ライオン"],
        answer: "ライオン",
        category: "理科",
    },
    {
        text: "次の元素記号が表すものは？「Sr」",
        choice: ["スロック", "スラック", "ストロング", "ストロンチウム"],
        answer: "ストロンチウム",
        category: "理科",
    },
    {
        text: "次の天気記号が表すのは？「◎」",
        choice: ["快晴", "晴れ", "曇り", "雨"],
        answer: "曇り",
        category: "理科",
    },
    {
        text: "次の元素記号が表すものは？「Ca」",
        choice: ["カリウム", "カルシウム", "カトイン", "カーリー"],
        answer: "カルシウム",
        category: "理科",
    },
    {
        text: "次の元素記号が表すものは？「Cl」",
        choice: ["コバルト", "カルシウム", "塩素", "炭素"],
        answer: "塩素",
        category: "理科",
    },
    //英語の問題
    {
        text: "普通の意味をもつ英単語は？",
        choice: ["always", "usually", "free", "radio"],
        answer: "usually",
        category: "英語",
    },
    {
        text: "She の Be動詞は？",
        choice: ["am", "are", "is", "her"],
        answer: "is",
        category: "英語",
    },
    {
        text: "切手の意味を持つ英単語は？",
        choice: ["mail", "internet", "letter", "stamp"],
        answer: "stamp",
        category: "英語",
    },
    {
        text: "自然の意味を持つ英単語は？",
        choice: ["planet", "nature", "iron", "ocean"],
        answer: "nature",
        category: "英語",
    },
    {
        text: "気体の意味を持つ英単語は？",
        choice: ["rock", "fire", "gas", "ground"],
        answer: "gas",
        category: "英語",
    },
];