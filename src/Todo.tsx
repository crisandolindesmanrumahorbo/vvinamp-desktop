import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useRef,
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
import { GripVertical, X, Trash } from "lucide-react";
import { Checkbox } from "./components/Checkbox";
import { Badge } from "./components/Badge";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// https://www.retroui.dev/themes
// handle icon
// handle max input todo, since it will impact modal deleting
// update todo

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
  const videoRef = useRef<HTMLVideoElement>(null);

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
  async function getTodosServerInit() {
    try {
      // Force minimum 4 second loading time
      const [dbTodos] = await Promise.all([
        invoke("get_all_todos"),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);

      setError("");
      setTodos(dbTodos as ITodo[]);
      setIsLoadingUsers(false);

      // Pause video when loading completes
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } catch (error) {
      console.log(error);
      setError("Failed to get users - check console");
      setIsLoadingUsers(false);
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
    setError("");
  };

  useEffect(() => {
    getTodosServerInit();
  }, []);

  if (isLoadingUsers) {
    return (
      <div className="flex flex-col justify-center bg-primary items-center min-h-screen space-y-4">
        {/* Small centered video animation */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-[150px] h-[150px] object-contain rounded-xl"
          >
            <source src="/splash-animation.mp4" type="video/mp4" />
            {/* Fallback if video doesn't load */}
            <div className="w-20 h-20 bg-blue-500 rounded-full animate-pulse" />
          </video>
        </div>

        {/* Loading text */}
        <p className="text-primary-foreground text-sm font-medium animate-pulse">
          Wait yaa..
        </p>
      </div>
    );
  }

  return (
    <main className="px-4 overflow-x-hidden [overflow-anchor:none] h-screen">
      <h1 className="mt-2 font-head text-lg">Todotte</h1>

      <div>
        <form
          className="sticky top-0 bg-foreground pt-1 pb-2"
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
              onChange={(e) => {
                setTitle(e.currentTarget.value);
                setError("");
              }}
              clearText={() => {
                setTitle("");
                setError("");
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
          {/* <h2 className="text-2xl font-bold mb-4">Delete</h2> */}
          <div className="w-full items-center justify-center flex flex-col gap-2 ">
            <p className="font-sans mt-4">
              <span>Are you sure delete</span>
              <span className="font-semibold">
                {` ${(selectedTodo?.title.length ?? 0) > 100 ? `"${selectedTodo?.title.substring(0, 100)}..."` : `"${selectedTodo?.title}"`}`}
              </span>
            </p>
            <Button
              onClick={() => deleteTodo(selectedTodo)}
              className="hover:bg-transparent !bg-destructive text-white hover:text-white"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </Modal>
      </div>
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
          className="absolute top-2 right-2 text-white hover:text-gray-700 py-2 px-2 hover:bg-red-100 hover:rounded-md"
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
          <div className="mt-6">
            <div className="flex flex-col gap-6">
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
              className="p-1 hover:bg-red-100 hover:rounded-md"
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
