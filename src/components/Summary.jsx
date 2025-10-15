export default function Summary({ total, onEmit }) {
  return (
    <div className="summary">
      <hr />
      { }
      <h3>Total: Gs. {total.toLocaleString("es-PY")}</h3>
      <button onClick={onEmit}>Emitir Factura</button>
    </div>
  );
}