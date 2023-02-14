import { useState, useEffect } from "react";

export default function TaskCard({ task, onEdit }) {
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    onEdit(task.id, description);
  };

  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);

  return (
    <div>
      <textarea
        className="w-full px-0 text-sm text-gray-900 bg-white focus:outline-none"
        value={description}
        rows={6}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleSave}
      />
    </div>
  );
}
