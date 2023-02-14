import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "firebase/database";
import TaskCard from "../components/TaskCard";
import { config } from "../config/serviceAccountConfig";

const app = initializeApp(config);
const db = getDatabase(app);

export default function TaskManagementTool() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      const taskList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      if (taskList.length === 0) {
        const localStorageTasks =
          JSON.parse(localStorage.getItem("tasks")) || [];
        setTasks(localStorageTasks);
      } else {
        setTasks(taskList);
        localStorage.setItem("tasks", JSON.stringify(taskList));
      }
    });

    return () => remove(tasksRef);
  }, []);

  const handleAddTask = async () => {
    localStorage.clear();
    try {
      const newTask = {
        description: "",
      };
      const taskRef = push(ref(db, "tasks"));
      await set(taskRef, newTask);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTask = async (id, description) => {
    try {
      const updates = { description };
      await update(ref(db, `tasks/${id}`), updates);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveTask = async (id) => {
    try {
      await remove(ref(db, `tasks/${id}`)); 
      const filteredTasks = tasks.filter((task) => task.id !== id);
      setTasks(filteredTasks);
      localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-24 py-6 bg-gray-100 h-screen">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="max-w-sm p-4 h-48 bg-white border border-gray-200 rounded-lg shadow group"
          >
            <div className="flex justify-end invisible group-hover:visible">
              <button onClick={() => handleRemoveTask(task.id)}>X</button>
            </div>
            <TaskCard task={task} onEdit={handleEditTask} />
          </div>
        ))}
        <div className="max-w-sm p-6 h-48 flex items-center justify-center rounded-lg">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddTask}
          >
            Add Task +
          </button>
        </div>
      </div>
    </div>
  );
}

