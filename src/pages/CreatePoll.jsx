import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/polls`,
        { question, options: options.filter((option) => option.trim() !== "") },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (error) {
      setError("Failed to create poll. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Poll</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block mb-1 font-medium">
            Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="input"
          />
        </div>
        {options.map((option, index) => (
          <div key={index}>
            <label
              htmlFor={`option-${index}`}
              className="block mb-1 font-medium"
            >
              Option {index + 1}
            </label>
            <input
              type="text"
              id={`option-${index}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              className="input"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="text-blue-600 hover:underline"
        >
          Add Option
        </button>
        <button type="submit" className="btn btn-primary w-full">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
