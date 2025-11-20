export interface PackItem {
  name: string;
  quantity: number;
  shopping: boolean;
  isPacked: boolean;
}

export interface PackList {
  _id: string;
  title: string;
  description: string;
  dateOfTrip: string;
  items: PackItem[];
}
export interface ListCardProps {
  id: string;
  name: string;
  itemCount: number;
  isSelected: boolean;
  onSelect: () => void;
}
export interface Item {
  name: string;
  quantity: number;
}

export interface List {
  _id: string;
  name: string;
  defaultItems: Item[];
}

export interface ListSidePanelProps {
  list: List | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToMyLists: (listId: string) => void;
}

export interface ListEditorProps {
  list: PackList;
  onClose: () => void;
  onSave: (updatedList: PackList) => void;
}
