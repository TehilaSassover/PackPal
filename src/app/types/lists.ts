import { ObjectId } from "mongodb";

export interface PackItem {
  name: string;
  quantity: number;
  shopping: boolean;
  isPacked: boolean;
}

export interface PackList {
  _id: string;
  title: string;
  description?: string;
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
  items: Item[];
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
export interface PackShare {
  _id?: ObjectId;        
  firstName: string;   
  lastName: string;    // שם משפחה
  email: string;       // אימייל
  content: string;     // תוכן ההערה / השיתוף
  date: Date;         // תאריך, מסוג Date
like:Array<string>; // מערך של מיילים של משתמשים שאהבו את השיתוף
dislike:Array<string>; // מערך של מיילים של משתמשים שלא אהבו את השיתוף
}
export interface ShoppingList{
  _id:ObjectId,
  userId:string,
  listId:string,
  name:string,
  quantity:number,
  createdAt:Date
}
export interface NewShoppingList{
  userId:string,
  listId:string,
  name:string,
  quantity:number,
  createdAt:Date
}