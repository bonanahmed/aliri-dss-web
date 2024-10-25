import { useState } from "react";

export interface FolderTreeStructure {
  title: string;
  children?: FolderTreeStructure[];
}

interface FolderTreeProps {
  folder: FolderTreeStructure;
}

const FolderTree: React.FC<FolderTreeProps> = ({ folder }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ml-4">
      <div
        className="cursor-pointer flex items-center space-x-1"
        onClick={toggleOpen}
      >
        <span>{isOpen ? "▼" : "▶︎"}</span>
        <span>{folder.title}</span>
      </div>
      {isOpen && folder.children && (
        <div className="ml-4">
          {folder.children.map((child, index) => (
            <FolderTree key={index} folder={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTree;
