import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import io from "socket.io-client";

const PollDetails = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        console.log(`http://localhost:5000/api/polls/${id}`);
        const response = await axios.get(
          `http://localhost:5000/api/polls/${id}`
        );
        setPoll(response.data);
      } catch (error) {
        setError("Failed to fetch poll details");
      }
    };

    fetchPoll();

    const socket = io("http://localhost:5000");
    socket.on("vote_update", (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleVote = async () => {
    if (selectedOption === null) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/polls/${id}/vote`,
        { optionIndex: selectedOption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPoll(response.data);
    } catch (error) {
      setError("Failed to submit vote");
    }
  };

  if (!poll) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{poll.question}</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="space-y-4">
        {poll.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`option-${index}`}
              name="poll-option"
              value={index}
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <label htmlFor={`option-${index}`} className="flex-grow">
              {option.text}
            </label>
            <span className="ml-2 text-gray-600">{option.votes} votes</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleVote}
        disabled={selectedOption === null}
        className="btn btn-primary w-full mt-6"
      >
        Vote
      </button>
    </div>
  );
};

export default PollDetails;
