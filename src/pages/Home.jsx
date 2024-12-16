import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/polls`);
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Active Polls</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Link key={poll._id} to={`/poll/${poll._id}`} className="card">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">
                {poll.question}
              </h2>
              <p className="text-gray-600">{poll.options.length} options</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
