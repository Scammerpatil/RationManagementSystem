import React, { useState, useEffect } from "react";

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <p className="mt-4 pr-10 text-base">{currentTime}</p>;
};

export default Clock;
