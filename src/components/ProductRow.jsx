export default function ProductRow({ item, onChange, onDelete }) {
  const handleChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const subtotal = (item.cantidad || 0) * (item.precio || 0);

  return (
    <tr>
      <td>
        <input
          type="text"
          value={item.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          value={item.cantidad}
          onChange={(e) => handleChange("cantidad", Number(e.target.value))}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          value={item.precio}
          onChange={(e) => handleChange("precio", Number(e.target.value))}
        />
      </td>
      <td>{subtotal.toLocaleString("es-PY")}</td>
      <td>
        <button onClick={onDelete}>🗑️</button>
      </td>
    </tr>
  );
}
