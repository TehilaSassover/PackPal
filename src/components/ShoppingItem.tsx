interface ShoppingItemProps {
  name: string;
  quantity: number;
}
export default function ShoppingItem({ name, quantity }: ShoppingItemProps) {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <strong>{name}</strong> - Quantity: {quantity}
    </div>
  );
}
