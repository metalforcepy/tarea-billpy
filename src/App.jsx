import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Componentes
import Header from "./components/Header";
import ClientForm from "./components/ClientForm";
import ProductTable from "./components/ProductTable";
import Summary from "./components/Summary";
import InvoiceTemplate from "./components/InvoiceTemplate";
import "./App.css";

import initialProducts from "./productos.json";

function App() {
  const [products, setProducts] = useState(initialProducts.map(p => ({ ...p, cantidad: p.cantidad || 1 })));
  const [client, setClient] = useState("");
  const [step, setStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const sortedProducts = useMemo(() => {
    let sortableItems = [...products];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'descripcion') {
          return a.descripcion.localeCompare(b.descripcion, 'es', { sensitivity: 'base' }) * (sortConfig.direction === 'ascending' ? 1 : -1);
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const addProduct = () => {
    const newProduct = { id: Date.now(), descripcion: "", cantidad: 1, precio: 0 };
    setProducts(currentProducts => [...currentProducts, newProduct]);
  };
  const deleteProduct = (id) => {
    setProducts(currentProducts => currentProducts.filter((p) => p.id !== id));
  };
  const updateProduct = (id, updatedFields) => {
    setProducts(currentProducts =>
      currentProducts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const handleNextStep = () => {
    if (client.trim() === "") {
      alert("Por favor, ingresa el nombre del cliente para continuar.");
      return;
    }
    setStep(2);
  };
  const handlePreviousStep = () => {
    setStep(1);
  };

  const total = products.reduce((acc, p) => acc + (p.cantidad || 0) * (p.precio || 0), 0);
  const handleEmit = () => {
    if (!client) {
      alert("Por favor, ingrese el nombre del cliente.");
      return;
    }
    const invoiceToPrint = document.getElementById('invoice-to-print');
    html2canvas(invoiceToPrint, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`factura-${client.replace(/\s/g, '_')}-${Date.now()}.pdf`);
    });
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="app-container">
          <div className="header-container">
            <Header />
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <main>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  className="step-container card"
                  variants={stepVariants} initial="hidden" animate="visible" exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2>Paso 1: Datos del Cliente</h2>
                  <ClientForm client={client} setClient={setClient} />
                  <button onClick={handleNextStep} className="btn-next">
                    Siguiente →
                  </button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  className="invoice-step-container card"
                  variants={stepVariants} initial="hidden" animate="visible" exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="client-display">
                    <span>CLIENTE: <strong>{client}</strong></span>
                    <button onClick={handlePreviousStep} className="btn-edit">
                      Editar
                    </button>
                  </div>
                  <hr />
                  <div className="sort-controls">
                    <button onClick={() => requestSort('descripcion')} className={`sort-button ${sortConfig.key === 'descripcion' ? 'active' : ''}`}>
                      Ordenar por Nombre
                      {sortConfig.key === 'descripcion' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                    </button>
                    <button onClick={() => requestSort('precio')} className={`sort-button ${sortConfig.key === 'precio' ? 'active' : ''}`}>
                      Ordenar por Precio
                      {sortConfig.key === 'precio' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                    </button>
                  </div>
                  <ProductTable
                    products={sortedProducts}
                    onAdd={addProduct}
                    onDelete={deleteProduct}
                    onChange={updateProduct}
                  />
                  <Summary total={total} onEmit={handleEmit} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </DndContext>
      <div className="hidden-for-print">
        <InvoiceTemplate client={client} products={products} total={total} />
      </div>
    </>
  );
}

export default App;