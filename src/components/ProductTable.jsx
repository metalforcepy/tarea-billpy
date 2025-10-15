import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ProductRow from "./ProductRow";

export default function ProductTable({ products, onAdd, onDelete, onChange }) {
  return (
    <div className="product-table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {products.map((item) => (
              <ProductRow
                key={item.id}
                item={item}
                onChange={onChange}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="empty-state">
          <p>Aún no hay productos en la factura.</p>
          <p>¡Añade el primero!</p>
        </div>
      )}
      <button onClick={onAdd} className="btn-add">Añadir Producto</button>
    </div>
  );
}