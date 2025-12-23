import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Existing features
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // NEW: price sort state
  const [priceSort, setPriceSort] = useState("asc"); // asc | desc

  const fetchProducts = () => {
    setRefreshing(true);
    setError(null);

    getProducts()
      .then(data => {
        setProducts(data);
        setLastUpdated(new Date());
      })
      .catch(() => {
        setError("Failed to load products");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const categories = ["All", ...new Set(products.map(p => p.category))];

  // Filter first
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || p.category === selectedCategory)
  );

  // NEW: sort after filtering (non-mutating)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (priceSort === "asc") {
      return a.price - b.price;
    }
    return b.price - a.price;
  });

  const toggleSort = () => {
    setPriceSort(prev => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.25rem" }}
        />

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.25rem" }}
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={fetchProducts}
          disabled={refreshing}
          style={{ marginRight: "1rem", padding: "0.25rem 0.5rem" }}
        >
          {refreshing ? "Refreshing..." : "Refresh Products"}
        </button>

        {/* NEW: Price sort toggle */}
        <button onClick={toggleSort} style={{ padding: "0.25rem 0.5rem" }}>
          Sort: Price {priceSort === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* Timestamp */}
      {lastUpdated && (
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <p>Showing {sortedProducts.length} products</p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Category</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length === 0 ? (
            <tr>
              <td colSpan="3">No matching products found.</td>
            </tr>
          ) : (
            sortedProducts.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
