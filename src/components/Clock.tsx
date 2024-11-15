import React, { useState, useEffect } from "react";

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <p className="mt-4 pr-10 text-base">{currentTime}</p>;
};

export default Clock;
