import React, { useState, useEffect } from 'react';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customOptions, setCustomOptions] = useState(['', '', '', '']);
  const [customAnswer, setCustomAnswer] = useState('');

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('customQuestions'));
    if (storedQuestions && storedQuestions.length > 0) {
      setQuestions(storedQuestions);
      setCurrentQuestionIndex(parseInt(localStorage.getItem('currentQuestionIndex')));
      setSelectedOption(localStorage.getItem('selectedOption'));
      setScore(parseInt(localStorage.getItem('score')));
      setShowResults(localStorage.getItem('showResults') === 'true');
      setCustomQuestion(localStorage.getItem('customQuestion'));
      setCustomOptions(JSON.parse(localStorage.getItem('customOptions')));
      setCustomAnswer(localStorage.getItem('customAnswer'));
    } else {
      // Load default questions if no custom questions are stored
      const defaultQuestions = [
        {
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris',
        },
        {
          question: 'Who wrote "To Kill a Mockingbird"?',
          options: ['Harper Lee', 'J.K. Rowling', 'Stephen King', 'Jane Austen'],
          correctAnswer: 'Harper Lee',
        },
      ];
      setQuestions(defaultQuestions);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('customQuestions', JSON.stringify(questions));
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('selectedOption', selectedOption);
    localStorage.setItem('score', score);
    localStorage.setItem('showResults', showResults);
    localStorage.setItem('customQuestion', customQuestion);
    localStorage.setItem('customOptions', JSON.stringify(customOptions));
    localStorage.setItem('customAnswer', customAnswer);
  }, [questions, currentQuestionIndex, selectedOption, score, showResults, customQuestion, customOptions, customAnswer]);

  const handleCustomQuestionChange = (e) => {
    setCustomQuestion(e.target.value);
  };

  const handleCustomOptionChange = (index, e) => {
    const newOptions = [...customOptions];
    newOptions[index] = e.target.value;
    setCustomOptions(newOptions);
  };

  const handleCustomAnswerChange = (e) => {
    setCustomAnswer(e.target.value);
  };

  const handleDeleteCustomQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddCustomQuestion = (e) => {
    e.preventDefault();
    const newQuestion = {
      question: customQuestion,
      options: customOptions.filter(option => option.trim() !== ''),
      correctAnswer: customAnswer,
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    setCustomQuestion('');
    setCustomOptions(['', '', '', '']);
    setCustomAnswer('');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setScore(0);
    setShowResults(false);
  };


  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-2/3 lg:w-1/2 xl:w-1/3">
        {!showResults ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">Quiz</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{questions[currentQuestionIndex]?.question}</h2>
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-800 font-semibold focus:outline-none transition duration-300 ${
                      selectedOption === option ? 'bg-blue-300' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md font-semibold ${
                !selectedOption ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              } focus:outline-none transition duration-300`}
            >
              Next
            </button>
            <form onSubmit={handleAddCustomQuestion} className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Add Custom Question</h2>
              <input
                type="text"
                placeholder="Question"
                value={customQuestion}
                onChange={handleCustomQuestionChange}
                className="border border-gray-300 rounded-md py-2 px-4 mb-2 w-full"
              />
              {customOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleCustomOptionChange(index, e)}
                  className="border border-gray-300 rounded-md py-2 px-4 mb-2 w-full"
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={customAnswer}
                onChange={handleCustomAnswerChange}
                className="border border-gray-300 rounded-md py-2 px-4 mb-4 w-full"
              />
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-pink-600 focus:outline-none transition duration-300"
              >
                Add Question
              </button>
            </form>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Custom Questions</h2>
              {questions.map((question, index) => (
                <div key={index} className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-4 mb-2">
                  <p>{question.question}</p>
                  <button onClick={() => handleDeleteCustomQuestion(index)} className="text-red-500 hover:text-red-700 font-semibold focus:outline-none">Delete</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">Results</h1>
            <p className="text-xl font-semibold mb-8 text-center">Score: {score}</p>
            <button
              onClick={handleRestartQuiz}
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-pink-600 focus:outline-none transition duration-300"
            >
              Restart Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
