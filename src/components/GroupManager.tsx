import React, { useState } from "react";
import { useChannels } from "../contexts/ChannelContext";
import { PlusCircle, Edit2, Trash2, Check, X } from "lucide-react";
import { saveChannelGroups } from "../utils/localStorage";
const GroupManager: React.FC = () => {
  const { groups, createGroup, updateGroup, deleteGroup, setActiveGroupId } =
    useChannels();

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupUrls, setNewGroupUrls] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrls, setEditUrls] = useState("");

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();

    if (newGroupName.trim() === "") {
      alert("Por favor ingresa un nombre para el grupo");
      return;
    }

    if (newGroupUrls.trim() === "") {
      alert("Por favor ingresa al menos una URL de YouTube");
      return;
    }

    createGroup(newGroupName, newGroupUrls);
    setNewGroupName("");
    setNewGroupUrls("");
  };

  const startEditing = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    setEditingGroupId(groupId);
    setEditName(group.name);
    setEditUrls(group.channels.map((c) => c.url).join(", "));
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditName("");
    setEditUrls("");
  };

  const saveEditedGroup = (groupId: string) => {
    if (editName.trim() === "") {
      alert("Por favor ingresa un nombre para el grupo");
      return;
    }

    if (editUrls.trim() === "") {
      alert("Por favor ingresa al menos una URL de YouTube");
      return;
    }

    updateGroup(groupId, editName, editUrls);
    cancelEditing();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Tus Grupos de Canales</h2>

        {groups.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Aún no creaste ningún grupo de canales. Crea uno para comenzar.
          </p>
        ) : (
          <ul className="space-y-4">
            {groups.map((group) => (
              <li
                key={group.id}
                className="bg-gray-700 rounded-md p-4 hover:bg-gray-650 transition-colors"
              >
                {editingGroupId === group.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <textarea
                      value={editUrls}
                      onChange={(e) => setEditUrls(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditedGroup(group.id)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        <Check size={16} />
                        <span>Guardar</span>
                      </button>

                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        <X size={16} />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{group.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {group.channels.length} canales
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveGroupId(group.id);
                          (
                            document.querySelector("nav button") as HTMLElement
                          )?.click();
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => startEditing(group.id)}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        <Edit2 size={16} />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `¿Estás seguro que deseas eliminar "${group.name}"?`
                            )
                          ) {
                            deleteGroup(group.id);
                          }
                        }}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Grupo de Canales</h2>

        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nombre del Grupo
            </label>
            <input
              id="groupName"
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Mis Canales Favoritos"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="groupUrls"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              URLs de YouTube (separadas por comas)
            </label>
            <textarea
              id="groupUrls"
              value={newGroupUrls}
              onChange={(e) => setNewGroupUrls(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=ejemplo1, https://www.youtube.com/watch?v=ejemplo2"
              rows={4}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-400">
              Ingresa las URLs de YouTube separadas por comas. Admite varios
              formatos de URL.
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <PlusCircle size={18} />
            <span>Crear Grupo</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupManager;
