"use dom";

export default function DOMComponent({ name }: { name: string }) {
  console.log("DOMComponent :>> ", DOMComponent);
  return (
    <div>
      <h1>Hello, {name}</h1>
    </div>
  );
}
