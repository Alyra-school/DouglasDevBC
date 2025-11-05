'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Check } from "lucide-react";

import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {

  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = () => {
    if(inputValue.trim()) {
      setTodos([...todos, { id: crypto.randomUUID(), text: inputValue.trim(), completed: false}]);
      setInputValue("");
    }
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  const handleCompleteTodo = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  return (
    <div className="w-full p-5">
      <div>
        <Input 
          type="text"
          id="todo"
          placeholder="Ajouter une tâche..."
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <Button className="mt-2 w-full" onClick={handleAddTodo}>Ajouter</Button>
      </div>
      <div className="mt-5">
        {todos.length === 0 ? (
          <p className="text-center italic">Pas de tâche pour le moment.</p>
        ) : (
          <div>
            {todos.map((todo) =>  (
              <div className="flex items-center mt-2" key={todo.id}>
                <div className={`flex-1 ${todo.completed && 'line-through'}`}>{todo.text}</div>
                <Button 
                  variant='destructive'
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <Trash />
                </Button>
                <Button
                  className="ml-2 bg-green-500"
                  onClick={() => handleCompleteTodo(todo.id)}
                >
                  <Check />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
