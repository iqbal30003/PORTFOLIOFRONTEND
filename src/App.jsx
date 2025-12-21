import ProductList from "./components/ProductList";
import ApiStatus from "./components/ApiStatus";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Portfolio Product API Demo</h1>
      <p>This frontend consumes a .NET Web API deployed separately.</p>

      {/* NEW FEATURE */}
      <ApiStatus />

      <ProductList />
    </div>
  );
}

export default App;
