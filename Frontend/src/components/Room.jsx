import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

let debounceTimer;

const Room = () => {
  const { roomid } = useParams();
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // Fetch room details on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/room/${roomid}`);
        const data = await res.json();

        setLanguage(data.language);
        setCode(data.code || getDefaultCode(data.language));
      } catch (err) {
        console.error("Error fetching room data", err);
      }
    };

    fetchRoom();
  }, [roomid]);

  // Auto-save code when it changes
  useEffect(() => {
    if (!code) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        await fetch(`http://localhost:5000/room/${roomid}/code`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
      } catch (err) {
        console.error("Error saving code:", err);
      }
    }, 1000); // Debounce by 1s

    return () => clearTimeout(debounceTimer);
  }, [code, roomid]);

  const getDefaultCode = (lang) => {
    switch (lang) {
      case "python":
        return 'print("Hello, World!")';
      case "java":
        return `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`;
      case "c":
        return `#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}`;
      case "cpp":
        return `#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}`;
      default:
        return "// Start coding...";
    }
  };

  const handleRun = async () => {
    try {
      const res = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setOutput("Error running code.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Room ID: {roomid}</h2>
      <p>Language: <strong>{language}</strong></p>

      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />

      <button onClick={handleRun} style={{ marginTop: "15px", padding: "10px 20px" }}>
        Run
      </button>

      <h3>Output:</h3>
      <pre style={{ background: "#222", color: "#fff", padding: "10px" }}>{output}</pre>
    </div>
  );
};

export default Room;
