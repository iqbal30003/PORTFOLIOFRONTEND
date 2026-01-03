import { useEffect, useRef, useState } from "react";
import { getProducts } from "../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [priceSort, setPriceSort] = useState("asc");

  const searchInputRef = useRef(null);

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

  useEffect(() => {
    const handleKeyDown = e => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || p.category === selectedCategory)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    priceSort === "asc" ? a.price - b.price : b.price - a.price
  );

  const toggleSort = () => {
    setPriceSort(prev => (prev === "asc" ? "desc" : "asc"));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceSort("asc");
    searchInputRef.current?.focus();
  };

  const exportToCsv = () => {
    if (sortedProducts.length === 0) return;

    const headers = ["Name", "Category", "Price"];
    const rows = sortedProducts.map(p => [p.name, p.category, p.price]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by name (press /)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.25rem" }}
        />

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.25rem" }}
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button onClick={fetchProducts} disabled={refreshing} style={{ marginRight: "0.5rem" }}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

        <button onClick={toggleSort} style={{ marginRight: "0.5rem" }}>
          Sort: Price {priceSort === "asc" ? "↑" : "↓"}
        </button>

        <button onClick={clearFilters} style={{ marginRight: "0.5rem" }}>
          Clear Filters
        </button>

        <button onClick={exportToCsv} disabled={sortedProducts.length === 0}>
          Export CSV
        </button>
      </div>

      {lastUpdated && (
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        Showing {sortedProducts.length} / {products.length} products
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left" style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              Name
            </th>
            <th align="left" style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              Category
            </th>
            <th align="left" style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length === 0 ? (
            <tr>
              <td colSpan="3">No matching products found.</td>
            </tr>
          ) : (
            sortedProducts.map(p => (
              <tr
                key={p.id}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
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
