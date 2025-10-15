import React from 'react';
import './InvoiceTemplate.css';

const InvoiceTemplate = ({ client, products, total }) => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div id="invoice-to-print" className="invoice-template">
            <header className="invoice-header">
                <h1>FACTURA</h1>
                <div className="invoice-details">
                    <div><span>Fecha:</span> {currentDate}</div>
                    <div><span>Factura #:</span> {Date.now().toString().slice(-6)}</div>
                </div>
            </header>

            <section className="client-info">
                <h2>Facturar a:</h2>
                <p>{client}</p>
            </section>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.descripcion}</td>
                            <td>{product.cantidad}</td>
                            <td>Gs. {product.precio.toLocaleString('es-PY')}</td>
                            <td>Gs. {(product.cantidad * product.precio).toLocaleString('es-PY')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="invoice-footer">
                <div className="total-section">
                    <strong>Total a Pagar:</strong>
                    <span>Gs. {total.toLocaleString('es-PY')}</span>
                </div>
                <p className="thank-you-message">¡Gracias por su compra!</p>
            </footer>
        </div>
    );
};

export default InvoiceTemplate;