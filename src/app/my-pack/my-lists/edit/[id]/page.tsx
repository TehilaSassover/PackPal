"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getListByIdAPI } from "@/services/myLists";
import { EditListForm } from "@/components/EditListForm";

export default function EditListPage() {
  const params = useParams();
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    
  if (typeof params.id === 'string') {
      getListByIdAPI(params.id).then(data => setList(data));}  }, []);

 if (!list) return <div>Loading...</div>;

return <EditListForm initialList={list} />;
}
