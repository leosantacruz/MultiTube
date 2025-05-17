import React from "react";
import { useChannels } from "../contexts/ChannelContext";
import { Monitor, Settings } from "lucide-react";

const Navigation: React.FC = () => {
  const { isManagingGroups, toggleManagingGroups } = useChannels();

  return (
    <nav className="flex space-x-2">
      <button
        onClick={toggleManagingGroups}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          isManagingGroups
            ? "bg-indigo-600 text-white"
            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
        }`}
        aria-label={isManagingGroups ? "Administrar Grupos" : "Ver Canales"}
      >
        {!isManagingGroups ? (
          <>
            <Settings size={18} />
            <span>Administrar Grupos</span>
          </>
        ) : (
          <>
            <Monitor size={18} />
            <span>Ver Canales</span>
          </>
        )}
      </button>
    </nav>
  );
};

export default Navigation;
