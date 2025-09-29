import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import { validateTimeAhead } from "./utils/time";
import { IInput } from "./components/IInput";
import { Button } from "./components/Button";
import ClockPicker from "./components/ClockPicker";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Checkbox } from "./components/Checkbox";
import { Badge } from "./components/Badge";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

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
  const [error, setError] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ITodo>();

  const closeModal = () => setIsModalOpen(false);

  const todosSort = useMemo(() => {
    const incompleted = todos
      .filter((todo) => !todo.completed)
      .sort((a, b) => b.id - a.id); // Sort by ID in descending order
    const completed = todos
      .filter((todo) => todo.completed)
      .sort((a, b) => b.id - a.id); // Sort by ID in descending order
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
      console.log(isValid, message, todo);
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

      getTodosServer().then(() => {
        setIsLoadingUsers(false);
        setTitle("");
        setSelectedTime("");
      });
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

  const onChangeTime = (time: string) => {
    setSelectedTime(time);
    console.log(time);
  };

  useEffect(() => {
    getTodosServer();
  }, []);

  return (
    <main className="py-2 px-4 overflow-x-hidden [overflow-anchor:none]">
      <h1 className="font-head text-lg">Todotte</h1>

      {isLoadingUsers ? (
        <div>Loading todos...</div>
      ) : (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTodoServer({
                title: title,
                completed: false,
                reminder: selectedTime === "00:00" ? null : selectedTime,
              });
            }}
          >
            <div className="flex flex-start gap-4 items-center">
              <IInput
                type="text"
                placeholder="type something..."
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                clearText={() => {
                  setTitle("");
                }}
                aria-invalid={error === "Empty Title"}
              />
              <ClockPicker
                timeSelected={selectedTime}
                onTimeChange={onChangeTime}
              />
              <Button type="submit">+</Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
          <Todos
            todos={todosSort}
            setSelectedTodo={setSelectedTodo}
            setOpenModal={setIsModalOpen}
            updateTodo={updateTodo}
          />
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Delete</h2>
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
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-700 py-2 px-4"
        >
          <X size={16} color="gray" />
        </button>
        {children}
      </div>
    </div>
  );
};

interface ITodoListProps {
  todos: ITodo[];
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setSelectedTodo: Dispatch<SetStateAction<ITodo | undefined>>;
  updateTodo: (todo: ITodo) => void;
}

const Todos = ({
  todos,
  setSelectedTodo,
  setOpenModal,
  updateTodo,
}: ITodoListProps) => {
  const [items, setItems] = useState(todos);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="mt-4">
            <div className="flex flex-col gap-4">
              {items.map((todo) => (
                <SortableItem
                  key={todo.id}
                  todo={todo}
                  setOpenModal={setOpenModal}
                  updateTodo={updateTodo}
                  setSelectedTodo={setSelectedTodo}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;
    console.log({ active, over });

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};

interface ISortableItem {
  todo: ITodo;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setSelectedTodo: Dispatch<SetStateAction<ITodo | undefined>>;
  updateTodo: (todo: ITodo) => void;
}

export function SortableItem({
  todo,
  setOpenModal,
  setSelectedTodo,
  updateTodo,
}: ISortableItem) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center w-full gap-2">
        <button {...listeners} className="drag-handle cursor-move">
          <GripVertical size={20} color="gray" />
        </button>
        <div className="w-full">
          <div className="flex w-full gap-2 items-center">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => {
                updateTodo(todo);
              }}
            />
            <div className="w-full items-center leading-tight">
              <span
                className={`mr-2 leading-none font-sans ${todo.completed ? `line-through` : ""}`}
              >
                {todo.title}
              </span>
              {todo.reminder && (
                <span>
                  <Badge>{todo.reminder}</Badge>
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedTodo(todo);
                setOpenModal(true);
              }}
            >
              <X size={16} color="gray" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
