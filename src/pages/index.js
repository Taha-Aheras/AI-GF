import { useState } from "react";

export default function Home() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = async () => {
    let localChatHistory = chatHistory
    localChatHistory.push({ sender: "Me", text: inputText })
    setChatHistory(localChatHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gf-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      const { reply } = await response.json();
      console.log("chatHistory 1 ", chatHistory);
      localChatHistory.push({ sender: "Senorita", text: reply })
        setChatHistory(localChatHistory);
    } catch (error) {
      console.error("AI conversation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("chatHistory ", chatHistory);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-black">
      <h1 className="text-3xl font-semibold mb-6">AI Girlfriend Companion</h1>
      <div className="chat-container bg-white rounded-lg shadow-md p-4 w-80 h-96 overflow-y-auto">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`chat-message mb-2 ${
              message.sender === "Senorita" ? "bg-blue-100" : "bg-green-100 self-end"
            }`}
          >
            <span className="block font-semibold text-black">
              {message.sender === "Senorita" ? "Senorita" : "Me"}:
            </span>{" "}
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container mt-4 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Start a conversation..."
          className="flex-grow border rounded-l-md p-2"
        />
        <button
          onClick={handleInput}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md disabled:bg-gray-300"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}