export function Chips({ items }: { items: string[] }) {
  return (
    <div className="djk-chips">
      {items.map((t) => (
        <span key={t} className="djk-chip">
          {t}
        </span>
      ))}
    </div>
  );
}
