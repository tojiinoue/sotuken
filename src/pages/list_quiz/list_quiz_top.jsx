import { Contracts_MetaMask } from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useRef } from "react";
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import { resolvePath, useParams } from "react-router-dom";
import Simple_quiz from "./components/quiz_simple";
import Quiz_list from "./components/quiz_list";
import { Link } from "react-router-dom";

function List_quiz_top(props) {
    //クイズのコントラクト
    let cont = new Contracts_MetaMask();

    //現在表示している個数を保持するref
    const now_numRef = useRef(0); //保存
    //クイズの総数
    const [quiz_sum, Set_quiz_sum] = useState(null); //保存

    //表示するクイズのリスト
    const [quiz_list, Set_quiz_list] = useState([]); //保存
    //１回の更新で追加で表示する個数
    const [add_num, Set_add_num] = useState(7);
    // コンテナのrefを作成
    const containerRef = useRef(null);

    // ステータスフィルタリング用のステート  26~32追加した
    const [statusFilter, setStatusFilter] = useState(undefined);

    useEffect(() => {
        cont.get_quiz_lenght().then((data) => {
            let now = parseInt(Number(data));
            Set_quiz_sum(now);
            now_numRef.current = now;
        });
    }, []);

    /* const callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // ターゲットの<div>が画面に表示された場合に実行される関数
                console.log("Target div is visible on the screen!");
                // ここに実行したい関数を記述

                // console.log("///////",now_num);
            }
        });
    }; */ //井上コメントアウトしたダメなら戻す


    useEffect(() => {
        // クイズリストを取得し、フィルタリングを適用
        cont.get_quiz_list().then((data) => {
            const filteredData = applyFilter(data);
            Set_quiz_list(filteredData);
        });
    }, [statusFilter]);

    // フィルタリングのロジック
    const applyFilter = (quizzes) => {
        if (statusFilter === undefined) {
            return quizzes;
        }
        return quizzes.filter(quiz => Number(quiz[10]) === statusFilter);
    };

    // フィルターボタンのクリック時にフィルタリングを変更
    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
    };

    const targetRef = useRef(null); // ターゲット要素のrefを作成

    if (quiz_sum != null) {
        return (
            <>
                {/* フィルタリングボタンを追加 井上変更点*/}
                <div>
                    <button onClick={() => setStatusFilter(undefined)}>すべて</button>
                    <button onClick={() => setStatusFilter(0)}>未回答</button>
                    <button onClick={() => setStatusFilter(1)}>不正解</button>
                    <button onClick={() => setStatusFilter(2)}>正解</button>
                </div>
                {/* スクロールを監視するコンポーネント */}
                <Quiz_list
                    cont={cont}
                    add_num={add_num}
                    Set_add_num={Set_add_num}
                    quiz_sum={quiz_sum}
                    Set_quiz_sum={Set_quiz_sum}
                    quiz_list={quiz_list}
                    Set_quiz_list={Set_quiz_list}
                    targetRef={targetRef}
                    now_numRef={now_numRef}
                    statusFilter={statusFilter} // ここでフィルタリング用のステートを渡す井上変更点
                />

                {/* */}
                {quiz_list.map((quiz, index) => {
                    if (index !== quiz_list.length - add_num) {
                        return <>{quiz_list[index]}</>;
                    }
                })}
                <div ref={targetRef}>
                    {/* ターゲット要素aの内容 */}
                    now_loading
                </div>
            </>
        );
    } else {
        return <></>;
    }
}
export default List_quiz_top;