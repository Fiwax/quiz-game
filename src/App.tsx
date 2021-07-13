import React, { useEffect, useState } from "react";
import { IQuiz } from "./types/interfaces";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState<IQuiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClickAnswer, setClickAnswer] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [currentUserAnswer, setCurrentUserAnswer] = useState<string>("");

  const correctAnswer = questions[currentIndex]?.correct_answer;

  useEffect(() => {
    const getQuestions = async () => {
      const data = await fetch(
        "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple"
      )
        .then((response) => response.json())
        .then((res) => res.results);
      const newData = data.map((question: IQuiz) => {
        return {
          ...question,
          answers: [question.correct_answer, ...question.incorrect_answers],
        };
      });
      setQuestions(newData);
    };

    getQuestions();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setClickAnswer(false);
      setCurrentIndex(currentIndex + 1);
      setCurrentUserAnswer("");
    }, 1000);
  }, [isClickAnswer]);

  const handleAnswer = (answer: string) => {
    if (correctAnswer === answer) {
      setScore(score + 1);
    }
    setClickAnswer(true);
    setCurrentUserAnswer(answer);
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-gray-800">
      <div className="bg-gray-900 p-10 w-1/3 text-white font-bold rounded-md text-center mb-2">
        {currentIndex >= questions.length ? (
          <span>Game finished. Your score is {score}</span>
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: questions[currentIndex]?.question,
            }}
          ></span>
        )}
      </div>
      {questions[currentIndex]?.answers?.map(
        (answer: string, index: number) => {
          const bgColor = !isClickAnswer
            ? "bg-gray-700"
            : isClickAnswer && correctAnswer === answer
            ? "bg-green-700"
            : "bg-red-700";
          return (
            <button
              key={`${answer}${index}`}
              onClick={() => handleAnswer(answer)}
              className={`${bgColor} w-1/3 ${
                answer === currentUserAnswer ? " userAnswer" : ""
              } duration-250 rounded py-2 text-white my-1`}
            >
              {answer}
            </button>
          );
        }
      )}
    </div>
  );
}

export default App;
