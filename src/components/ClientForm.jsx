export default function ClientForm({ client, setClient }) {
  return (
    <div className="client-form">
      <label>Cliente:</label>
      <input
        type="text"
        value={client}
        placeholder="Nombre del cliente"
        onChange={(e) => setClient(e.target.value)}
        maxLength="7"
      />
    </div>
  );
}