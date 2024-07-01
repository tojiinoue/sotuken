import { Contracts_MetaMask } from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Wait_Modal from "../../contract/wait_Modal";

function Show_correct({ cont, answer }) {
    return cont ? <a>答えは{answer}</a> : <></>;
}

function Answer_type1({ quiz, answer, setAnswer }) {
    return (
        <>
            <a><br />選択式</a>
            <table className="table">
                <tbody>
                    {quiz.answer_data.map((cont) => (
                        <tr key={cont}>
                            <th scope="col">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={cont}
                                    onChange={() => setAnswer(cont)}
                                    checked={answer === cont}
                                />
                            </th>
                            <th scope="col" className="left">{cont}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function Answer_type2({ quiz, answer, setAnswer }) {
    const [errorCollect, setErrorCollect] = useState(true);

    useEffect(() => {
        console.log(quiz);
    }, []);

    const handleTestPattern = (event) => {
        const value = event.target.value;
        const pattern = new RegExp(quiz.answer_data[0]);
        setErrorCollect(!pattern.test(value));
        setAnswer(value);
    };

    return (
        <>
            <a>入力形式</a>
            <div className="row">
                <div className="col-10">
                    正解を入力<br />
                    <p>例: {quiz.answer_data[1]}</p>
                    <input
                        type="text"
                        className="form-control"
                        value={answer}
                        onChange={handleTestPattern}
                    />
                    {errorCollect ? "エラー" : "OK"}
                </div>
            </div>
        </>
    );
}

function Answer_quiz() {
    const [answers, setAnswers] = useState([]);
    const [now, setNow] = useState(null);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    const [isCorrectShow, setIsCorrectShow] = useState(false);

    const Contract = new Contracts_MetaMask();
    const { id } = useParams();

    const [quizzes, setQuizzes] = useState([]);
    const [simpleQuiz, setSimpleQuiz] = useState(null);

    const getQuizzes = async () => {
        const quizList = await Contract.get_quizzes(id);
        setQuizzes(quizList);
        setSimpleQuiz(await Contract.get_quiz_simple(id));
    };

    const convertFullWidthNumbersToHalf = (() => {
        const diff = "０".charCodeAt(0) - "0".charCodeAt(0);
        return (text) => text.replace(/[０-９]/g, m => String.fromCharCode(m.charCodeAt(0) - diff));
    })();

    const createAnswer = async (quizIndex) => {
        const quiz = quizzes[quizIndex];
        if (quiz.correct === true) {
            setIsCorrectShow(true);
            return;
        }
        if (parseInt(quiz.reply_startline) <= now) {
            const res = Contract.create_answer(id, quizIndex, convertFullWidthNumbersToHalf(answers[quizIndex]), setShow, setContent);
        } else {
            alert("まだ回答開始時間になっていません");
        }
    };

    useEffect(() => {
        getQuizzes();
        setNow(Math.floor(new Date().getTime() / 1000));
    }, []);

    if (quizzes.length > 0 && simpleQuiz) {
        return (
            <>
                <h3 style={{ margin: "50px" }}>
                    {Number(simpleQuiz.state) === 0 ? "初回の回答です。正解するとトークンがもらえます" : 
                     Number(simpleQuiz.state) === 1 ? "初回の回答で間違えています。正解してもトークンはもらえません" : 
                     Number(simpleQuiz.state) === 2 ? "正解しています" : ""}
                </h3>
                <div className="container" style={{ textAlign: "left", marginBottom: "50px" }}>
                    {quizzes.map((quiz, index) => (
                        <div key={index}>
                            <h2>{quiz.title}</h2>
                            <a style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1" }}>
                                <br />
                                {quiz.explanation}
                            </a>
                            <br /><br />
                            <a>出題者: {quiz.author}</a>
                            <br /><br />
                            <div data-color-mode="light" className="left" style={{ textAlign: "left" }}>
                                <MDEditor.Markdown source={quiz.content} />
                            </div>
                            {quiz.answer_type === 0 && (
                                <Answer_type1 
                                    quiz={quiz} 
                                    answer={answers[index]} 
                                    setAnswer={(answer) => {
                                        const newAnswers = [...answers];
                                        newAnswers[index] = answer;
                                        setAnswers(newAnswers);
                                    }} 
                                />
                            )}
                            {quiz.answer_type === 1 && (
                                <Answer_type2 
                                    quiz={quiz} 
                                    answer={answers[index]} 
                                    setAnswer={(answer) => {
                                        const newAnswers = [...answers];
                                        newAnswers[index] = answer;
                                        setAnswers(newAnswers);
                                    }} 
                                />
                            )}
                            <div className="d-flex justify-content-end">
                                <Button variant="primary" onClick={() => createAnswer(index)}>
                                    回答
                                </Button>
                            </div>
                            <Show_correct cont={isCorrectShow} answer={quiz.correct_answer} />
                        </div>
                    ))}
                </div>
                <Wait_Modal showFlag={show} content={content} />
            </>
        );
    } else {
        return <></>;
    }
}

export default Answer_quiz;
