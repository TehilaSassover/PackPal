import { EditListForm } from "@/components/EditListForm";
import { getListById } from "@/lib/myLists";

export default async function EditListPage({ params }: any) {
  const resolvedParams = await params;
  const list = await getListById(resolvedParams.id);

  if (!list) return <div>List not found</div>;

  return <EditListForm initialList={list} />;
}

