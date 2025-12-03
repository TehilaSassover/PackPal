interface ShoppingItemProps {
  item: string;
  quantity: number;
}

export default function ShoppingItem({ item, quantity }: ShoppingItemProps) {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <strong>{item}</strong> - Quantity: {quantity}
    </div>
  );
}
