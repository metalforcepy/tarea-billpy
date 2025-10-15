import ProductRow from "./ProductRow";

export default function ProductTable({ products, setProducts }) {
  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), descripcion: "", cantidad: 1, precio: 0 },
    ]);
  };

  const updateProduct = (index, updated) => {
    const newList = [...products];
    newList[index] = updated;
    setProducts(newList);
  };

  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, i) => (
            <ProductRow
              key={item.id}
              item={item}
              onChange={(updated) => updateProduct(i, updated)}
              onDelete={() => deleteProduct(i)}
            />
          ))}
        </tbody>
      </table>
      <button className="add-btn" onClick={addProduct}>
        + Agregar producto
      </button>
    </div>
  );
}
