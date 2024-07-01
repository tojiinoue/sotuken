import { Contracts_MetaMask } from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import Answer_select from "./components/answer_select";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import Wait_Modal from "../../contract/wait_Modal";

const { ethereum } = window;
const mkdStr = "";

function Create_quiz() {
    const [quizzes, setQuizzes] = useState([
        {
            title: "",
            explanation: "",
            thumbnail_url: "",
            content: "",
            answer_type: 0,
            answer_data: [],
            correct: "",
            reply_startline: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }).replace(/[/]/g, "-").replace(/\s(\d):/, " 0$1:"),
            reply_deadline: getLocalizedDateTimeString(addDays(new Date(), 1)),
            reward: 0,
            correct_limit: null,
        }
    ]);
    const [state, setState] = useState("Null");
    const [now, setnow] = useState(null);
    const [show, setShow] = useState(false);

    let Contract = new Contracts_MetaMask();

    const convertFullWidthNumbersToHalf = (() => {
        const diff = "０".charCodeAt(0) - "0".charCodeAt(0);
        return text => text.replace(
            /[０-９]/g,
            m => String.fromCharCode(m.charCodeAt(0) - diff)
        );
    })();

    const create_quiz = async () => {
        for (const quiz of quizzes) {
            if (quiz.correct !== "") {
                Contract.create_quiz(
                    quiz.title,
                    quiz.explanation,
                    quiz.thumbnail_url,
                    quiz.content,
                    quiz.answer_type,
                    quiz.answer_data,
                    convertFullWidthNumbersToHalf(quiz.correct),
                    quiz.reply_startline,
                    quiz.reply_deadline,
                    quiz.reward,
                    quiz.correct_limit,
                    setShow
                );
            } else {
                alert("正解を入力してください");
            }
        }
    };

    function getLocalizedDateTimeString(now = new Date()) {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const formatter = new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const localizedDateTimeString = formatter
            .format(now)
            .replace(/\u200E|\u200F/g, "")
            .replace(/\//g, "-")
            .replace(/ /, "T");

        return localizedDateTimeString;
    }

    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }

    const addQuiz = () => {
        setQuizzes([...quizzes, {
            title: "",
            explanation: "",
            thumbnail_url: "",
            content: "",
            answer_type: 0,
            answer_data: [],
            correct: "",
            reply_startline: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }).replace(/[/]/g, "-").replace(/\s(\d):/, " 0$1:"),
            reply_deadline: getLocalizedDateTimeString(addDays(new Date(), 1)),
            reward: 0,
            correct_limit: null,
        }]);
    };

    const removeQuiz = (index) => {
        setQuizzes(quizzes.filter((quiz, i) => i !== index));
    };

    const handleQuizChange = (index, field, value) => {
        const newQuizzes = quizzes.map((quiz, i) => i === index ? { ...quiz, [field]: value } : quiz);
        setQuizzes(newQuizzes);
    };

    useEffect(() => {
        async function get_contract() {
            setQuizzes(quizzes.map(quiz => ({
                ...quiz,
                correct_limit: (await Contract.get_num_of_students()) + 30
            })));
        }
        get_contract();
        setnow(getLocalizedDateTimeString());
    }, []);

    return (
        <div>
            <div className="row">
                <div className="col-2" />
                <div className="col-8">
                    {quizzes.map((quiz, index) => (
                        <div key={index}>
                            <h3>クイズ {index + 1}</h3>
                            <Form>
                                <Form.Group className="mb-3" controlId={`form_title_${index}`} style={{ textAlign: "left" }}>
                                    <Form.Label>タイトル</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Title" value={quiz.title} onChange={(event) => handleQuizChange(index, "title", event.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                                    <Form.Label>説明</Form.Label>
                                    <Form.Control as="textarea" rows={quiz.explanation.split("\n").length + 3} value={quiz.explanation} onChange={(event) => handleQuizChange(index, "explanation", event.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                                    <Form.Label>サムネイル</Form.Label>
                                    <Form.Control type="url" value={quiz.thumbnail_url} onChange={(event) => handleQuizChange(index, "thumbnail_url", event.target.value)} />
                                </Form.Group>
                                <img src={quiz.thumbnail_url} width="200" alt="サムネイル" />
                                <br />
                                <Form.Group className="mb-3" data-color-mode="light" style={{ textAlign: "left" }}>
                                    <Form.Label>内容</Form.Label>
                                    <MDEditor height={500} value={quiz.content} onChange={(value) => handleQuizChange(index, "content", value)} />
                                </Form.Group>
                                <Answer_select name={"回答の追加"} variable={quiz.answer_data} variable1={quiz.correct} set={(data) => handleQuizChange(index, "answer_data", data)} set1={(correct) => handleQuizChange(index, "correct", correct)} setAnswer_type={(type) => handleQuizChange(index, "answer_type", type)} answer_type={quiz.answer_type} />
                                <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                                    <Form.Label>回答開始日時</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        defaultValue={quiz.reply_startline}
                                        min={now}
                                        onChange={(event) => handleQuizChange(index, "reply_startline", new Date(event.target.value))}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                                    <Form.Label>回答締切日時</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        defaultValue={quiz.reply_deadline}
                                        min={now}
                                        onChange={(event) => handleQuizChange(index, "reply_deadline", new Date(event.target.value))}
                                    />
                                </Form.Group>
                                <Button variant="danger" onClick={() => removeQuiz(index)} style={{ marginTop: "20px" }}>
                                    クイズを削除
                                </Button>
                                <hr />
                            </Form>
                        </div>
                    ))}
                    <div style={{ textAlign: "right" }}>
                        <Button variant="primary" onClick={addQuiz} style={{ marginRight: "10px" }}>
                            クイズを追加
                        </Button>
                        <Button variant="primary" onClick={create_quiz} style={{ marginTop: "20px" }}>
                            クイズを作成
                        </Button>
                    </div>
                </div>
                <div className="col-2" />
            </div>
            <Wait_Modal showFlag={show} />
        </div>
    );
}

export default Create_quiz
