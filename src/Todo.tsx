import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import TimePicker from "./components/TimePicker";
import { validateTimeAhead } from "./utils/time";

type ITodo = {
  id: number;
  title: string;
  completed: boolean;
  reminder: string | null;
};

export default function Todo() {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("00:00");

  async function getTodosServer() {
    try {
      const dbTodos: ITodo[] = await invoke("get_all_todos");

      setError("");
      setTodos(dbTodos);
      setIsLoadingUsers(false);
    } catch (error) {
      console.log(error);
      setError("Failed to get users - check console");
    }
  }
  const validateForm = (todo: Omit<ITodo, "id">) => {
    if (todo.reminder) {
      return validateTimeAhead(todo.reminder);
    }
    if (todo.title === "") {
      return { isValid: false, message: "Empty Title" };
    }
    return { isValid: true, message: "" };
  };
  async function setTodoServer(todo: Omit<ITodo, "id">) {
    try {
      const { isValid, message } = validateForm(todo);
      console.log(isValid, message);
      if (!isValid) {
        setError(message);
        return;
      }

      setIsLoadingUsers(true);

      await invoke("add_todo", {
        title: todo.title,
        completed: todo.completed ? 1 : 0,
        reminder: todo.reminder,
      });
      setError("");

      getTodosServer().then(() => setIsLoadingUsers(false));
    } catch (error) {
      console.log(error);
      setError("Failed to insert user - check console");
    }
  }

  useEffect(() => {
    getTodosServer();
  }, []);

  return (
    <main className="container">
      <h1>Welcome to Fansipan</h1>

      {isLoadingUsers ? (
        <div>Loading todos...</div>
      ) : (
        <div>
          <form
            className="flex flex-start gap-4 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              setTodoServer({
                title: title,
                completed: completed,
                reminder: selectedTime === "00:00" ? null : selectedTime,
              });
            }}
          >
            <input
              id="name-input"
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="Enter title..."
            />
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) => setCompleted(event.target.checked)}
            />
            <TimePicker
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
            <button type="submit">Add Todo</button>
            {error && <p className="text-red-500">{error}</p>}
          </form>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <h1>Todos</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Completed</th>
                  <th>Reminder</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.title}</td>
                    <td>{user.completed ? "true" : "false"}</td>
                    <td>{user.reminder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
