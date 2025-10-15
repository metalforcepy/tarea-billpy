import { useState } from "react";
import Header from "./components/Header";
import ClientForm from "./components/ClientForm";
import ProductTable from "./components/ProductTable";
import Summary from "./components/Summary";
import "./styles.css";

function App() {
  const [client, setClient] = useState("");
  const [products, setProducts] = useState([]);

  return (
    <div className="app-container">
      <Header />
      <ClientForm client={client} setClient={setClient} />
      <ProductTable products={products} setProducts={setProducts} />
      <Summary client={client} products={products} />
    </div>
  );
}

export default App;
