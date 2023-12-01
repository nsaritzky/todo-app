import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"

interface Todo {
  text: string
  complete: boolean
  id: number
}

function App() {
  const [newTodo, setNewTodo] = useState<string>("")

  const [todos, setTodos] = useState<Todo[]>([])
  let [nextId, setNextId] = useState<number>(2)
  let completed = todos.filter((todo) => todo.complete).length
  let left = todos.length - completed

  const [view, setView] = useState<"all" | "active" | "completed">("all")

  const [darkMode, setDarkMode] = useState(false)

  const visibleTodos = todos.filter((todo) => {
    switch (view) {
      case "active":
        return !todo.complete
      case "completed":
        return todo.complete
      default:
        return true
    }
  })

  const addTodo = (text: string) => {
    const newTodos = [...todos, { text, complete: false, id: nextId }]
    setNextId(nextId + 1)

    setTodos(newTodos)
  }

  const toggleTodo = (selectedTodo: Todo) => {
    const newTodos = todos.map((todo) => {
      if (todo === selectedTodo) {
        return { ...todo, complete: !todo.complete }
      }

      return todo
    })

    setTodos(newTodos)
  }
  const deleteTodo = (selectedTodo: Todo) => {
    const newTodos = todos.filter((todo) => todo !== selectedTodo)

    setTodos(newTodos)
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const TodoItem = ({ todo }: { todo: Todo }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: todo.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group flex w-full justify-between bg-white p-4 text-lg text-very-dark-grayish-blue-light first:rounded-t ${
          darkMode && "bg-very-dark-grayer-blue"
        }`}
      >
        <div className="flex">
          <div data-no-dnd>
            <input
              type="checkbox"
              className="hidden"
              onChange={() => toggleTodo(todo)}
              checked={todo.complete}
            />
            <span
              className={`mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-gradient-to-br from-grad-start to-grad-end p-[1px]
                  `}
              onClick={() => toggleTodo(todo)}
            >
              {todo.complete ? (
                <img src="./images/icon-check.svg" />
              ) : (
                <span
                  className={`h-full w-full rounded-full border bg-white p-3 hover:p-0 ${
                    darkMode && "bg-very-dark-grayer-blue"
                  }`}
                />
              )}
            </span>
          </div>
          <span
            className={`${
              todo.complete && "text-light-grayish-blue line-through"
            } ${darkMode && "text-light-grayish-blue"} ${
              todo.complete && darkMode && "text-dark-grayish-blue"
            }`}
          >
            {todo.text}
          </span>{" "}
        </div>
        <button
          data-no-dnd
          onClick={() => deleteTodo(todo)}
          className="hidden group-hover:block"
        >
          <img src="./images/icon-cross.svg" />
        </button>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id !== over.id) {
      setTodos((todos) => {
        const oldIndex = todos.findIndex((todo) => todo.id === active.id)
        const newIndex = todos.findIndex((todo) => !over || todo.id === over.id)

        return arrayMove(todos, oldIndex, newIndex)
      })
    }
  }

  return (
    <div
      className={`absolute -z-20 h-screen w-screen ${
        darkMode && "bg-very-dark-blue"
      } font-josefin-sans`}
    >
      <picture className="w-full">
        <source
          srcSet="./images/bg-desktop-light.jpg"
          media="(min-width: 768px)"
        />
        <source
          srcSet="./images/bg-mobile-light.jpg"
          media="(max-width: 767px)"
        />
        <img
          className="absolute -z-10 h-auto w-full min-w-full object-cover"
          src="./images/bg-desktop-light.jpg"
          alt="background"
        />
      </picture>
      <div className="mx-auto w-11/12 max-w-screen-sm">
        <div className="flex items-center justify-between py-8">
          <h1 className="text-4xl font-bold text-white">T O D O</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? (
              <img src="./images/icon-moon.svg" />
            ) : (
              <img src="./images/icon-sun.svg" />
            )}
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTodo(newTodo)
            setNewTodo("")
          }}
        >
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className={`my-6 w-full rounded bg-white p-4 text-lg text-very-dark-grayish-blue-light outline-none
                ${darkMode && " bg-very-dark-grayer-blue"}`}
            placeholder="Create a new todo..."
          />
        </form>
        <div
          className={`flex w-full flex-col items-center divide-y shadow-lg ${
            darkMode && " divide-dark-grayish-blue bg-very-dark-grayer-blue"
          }`}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleTodos}
              strategy={verticalListSortingStrategy}
            >
              {visibleTodos.map((todo, i) => {
                return <TodoItem todo={todo} key={i} />
              })}
            </SortableContext>
          </DndContext>
          <div
            className={`flex w-full justify-between rounded-b bg-white p-4 ${
              darkMode && "bg-very-dark-grayer-blue"
            }`}
          >
            <div className="text-dark-grayish-blue-light">
              {left} {left == 1 ? "item" : "items"} left
            </div>
            <div className="flex gap-2 font-bold capitalize text-dark-grayish-blue-light">
              {["all", "active", "completed"].map((item, i) => (
                <button
                  key={i}
                  className={`capitalize hover:text-very-dark-grayish-blue-light ${
                    darkMode && "hover:text-light-grayish-blue"
                  } ${
                    view === item && "text-bright-blue hover:text-bright-blue"
                  } `}
                  onClick={() => setView(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              className={`text-dark-grayish-blue-light hover:text-very-dark-grayish-blue-light ${
                darkMode && "hover:text-light-grayish-blue"
              }`}
              onClick={() => {
                setTodos(todos.filter((todo) => !todo.complete))
              }}
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
} from "@dnd-kit/core"
import { MouseEvent, TouchEvent } from "react"

// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement as HTMLElement
  }

  return true
}

export class MouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: "onMouseDown", handler },
  ] as (typeof LibMouseSensor)["activators"]
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: "onTouchStart", handler },
  ] as (typeof LibTouchSensor)["activators"]
}

export default App
