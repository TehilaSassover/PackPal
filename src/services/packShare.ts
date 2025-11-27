import { PackShare } from "@/app/types/lists";
export async function getAllPackSharesAPI(): Promise<PackShare[]> {
  const res = await fetch(`/api/community`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData: { error?: string } | null = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Error fetching pack shares");
  }

  const data: PackShare[] = await res.json(); // TypeScript ידע שזה מערך של PackShare
  return data;
}
export async function sendPackShareAPI(share: PackShare): Promise<PackShare> {
  const res = await fetch(`/api/community`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(share),
  });
  if (!res.ok) {
    const errorData: { error?: string } | null = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Error sending pack share");
  } 
 ;
 return await res.json();
}
