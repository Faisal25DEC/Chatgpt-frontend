import { useEffect, useState } from "react";
import Send from "./assets/send.png";
function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await fetch(`http://localhost:8080/completions`, options);
      const data = await res.json();
      console.log(data);
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = () => {};

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prev) => [
        ...prev,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChat = previousChats?.filter(
    (prev) => prev.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats?.map((prev) => prev.title))
  );
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, idx) => {
            return (
              <li key={idx} onClick={handleClick}>
                {uniqueTitles}
              </li>
            );
          })}
        </ul>
        <nav>
          <p>Made By Faisal</p>
        </nav>
      </section>
      <section className="main">
        <h1>Faisal GPT</h1>
        <ul className="feed">
          {currentChat.map((c, idx) => {
            return (
              <li key={idx}>
                <p className="role">{c.role}</p>
                <p>{c.message}</p>
              </li>
            );
          })}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <div id="submit" onClick={getMessages}>
              <img src={Send} alt="" />
            </div>
          </div>
          <p className="info">
            Chat GPT November Version. Free Research Preview. Our goal is to mak
            eAI systems more natural and safe to interact with. Your feedvback
            will help us improve
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
