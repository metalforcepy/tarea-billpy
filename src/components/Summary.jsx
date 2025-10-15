export default function Summary({ client, products }) {
  const total = products.reduce(
    (acc, p) => acc + (p.cantidad || 0) * (p.precio || 0),
    0
  );

  const handleEmit = () => {
    if (!client) {
      alert("Por favor, ingrese el nombre del cliente.");
      return;
    }
    alert(`Factura emitida para ${client}\nTotal: Gs. ${total.toLocaleString("es-PY")}`);
  };

  return (
    <div className="summary">
      <h3>Total: Gs. {total.toLocaleString("es-PY")}</h3>
      <button onClick={handleEmit}>Emitir factura</button>
    </div>
  );
}
