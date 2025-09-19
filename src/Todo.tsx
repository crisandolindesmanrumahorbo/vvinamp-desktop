import { ReactNode, useEffect, useMemo, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import TimePicker from "./components/TimePicker";
import { validateTimeAhead } from "./utils/time";
//https://www.retroui.dev/themes

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ITodo>();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const todosSort = useMemo(() => {
    const incompleted = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);
    return incompleted.concat(completed);
  }, [todos]);

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
    if (todo.title === "") {
      return { isValid: false, message: "Empty Title" };
    }
    if (todo.reminder) {
      return validateTimeAhead(todo.reminder);
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

  async function updateTodo(todo: ITodo) {
    try {
      setIsLoadingUsers(true);

      await invoke("update_state_todo_by_id", {
        completed: todo.completed ? 0 : 1,
        id: todo.id,
      });
      setError("");

      getTodosServer().then(() => setIsLoadingUsers(false));
    } catch (error) {
      console.log(error);
      setError("Failed to update todo - check console");
    }
  }

  async function deleteTodo(todo: ITodo | undefined) {
    try {
      setIsLoadingUsers(true);

      await invoke("delete_todo_by_id", {
        id: todo?.id,
      });
      setError("");

      getTodosServer().then(() => setIsLoadingUsers(false));
      setSelectedTodo(undefined);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      setError("Failed to delete todo - check console");
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
                  <th></th>
                  <th>Title</th>
                  <th>Reminder</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {todosSort.map((todo) => (
                  <tr key={todo.id} className="items-center">
                    <td>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => updateTodo(todo)}
                      />
                    </td>
                    <td>
                      {todo.completed ? (
                        <p>
                          <s>{todo.title}</s>
                        </p>
                      ) : (
                        todo.title
                      )}
                    </td>

                    <td>{todo.reminder}</td>

                    <td>
                      <button
                        className="text-red-600 p-2"
                        onClick={() => {
                          setSelectedTodo(todo);
                          openModal();
                        }}
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {/* <h2 className="text-2xl font-bold mb-4">Centered Modal</h2> */}
            <p>{`Are you sure delete ${selectedTodo?.title}`} </p>
            <button
              onClick={() => deleteTodo(selectedTodo)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </Modal>
        </div>
      )}
    </main>
  );
}

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-700 py-2 px-4"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
