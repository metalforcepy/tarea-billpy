import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

const DragHandle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'grab' }}>
    <path d="M5 10H7M5 14H7M11 10H13M11 14H13M17 10H19M17 14H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function ProductRow({ item, onChange, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const handleChange = (field, value) => {
    onChange(item.id, { [field]: value });
  };

  const subtotal = (item.cantidad || 0) * (item.precio || 0);

  return (
    <tr ref={setNodeRef} style={style} className={`product-row ${isDragging ? 'is-dragging' : ''}`}>
      <td className="drag-handle" {...attributes} {...listeners}>
        <DragHandle />
      </td>

      <td data-label="Descripción">
        <input type="text" value={item.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} />
      </td>
      <td data-label="Cantidad">
        <input type="number" min="0" value={item.cantidad} onChange={(e) => handleChange("cantidad", Number(e.target.value))} />
      </td>
      <td data-label="Precio">
        <input type="number" min="0" value={item.precio} onChange={(e) => handleChange("precio", Number(e.target.value))} />
      </td>
      <td data-label="Subtotal">
        Gs. {subtotal.toLocaleString("es-PY")}
      </td>
      <td data-label="Eliminar">
        <button className="btn-delete" onClick={() => onDelete(item.id)}>
          🗑️
        </button>
      </td>
    </tr>
  );
}