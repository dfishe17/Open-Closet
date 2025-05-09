export default function ListItemHtmlPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>List an Item (HTML Version)</h1>

      <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ padding: "15px", borderBottom: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
          <h2 style={{ margin: 0 }}>Item Details</h2>
        </div>

        <div style={{ padding: "20px" }}>
          <form id="listItemForm" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label htmlFor="name" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Item Name*
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Vintage Denim Jacket"
                    required
                    style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>

                <div>
                  <label htmlFor="designer" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Designer/Brand
                  </label>
                  <input
                    id="designer"
                    name="designer"
                    placeholder="Levi's, Gucci, etc."
                    style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>

                <div>
                  <label htmlFor="description" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item in detail..."
                    rows={4}
                    required
                    style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label htmlFor="category" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Category*
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    >
                      <option value="">Select category</option>
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="size" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Size*
                    </label>
                    <select
                      id="size"
                      name="size"
                      required
                      style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Product Images</label>
                  <div
                    style={{
                      border: "2px dashed #ccc",
                      borderRadius: "4px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>Click to upload images</div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Up to 4 images</div>
                  </div>
                </div>

                <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "4px" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Pricing Options</h3>

                  <div style={{ marginTop: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <input type="checkbox" id="available-for-rent" name="available-for-rent" checked />
                      <label htmlFor="available-for-rent">Available for Rent</label>
                    </div>

                    <div style={{ marginLeft: "25px", marginBottom: "15px" }}>
                      <label htmlFor="rental-price" style={{ display: "block", marginBottom: "5px" }}>
                        Rental Price per Day ($)*
                      </label>
                      <input
                        id="rental-price"
                        name="rental-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <input type="checkbox" id="available-for-sale" name="available-for-sale" />
                      <label htmlFor="available-for-sale">Available for Sale</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
              }}
            >
              <a
                href="/profile"
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Back to Profile
              </a>

              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                List Item
              </button>
            </div>
          </form>

          <script
            dangerouslySetInnerHTML={{
              __html: `
            document.getElementById('listItemForm').addEventListener('submit', function(e) {
              e.preventDefault();
              alert('Item successfully listed!');
              window.location.href = '/profile';
            });
          `,
            }}
          />
        </div>
      </div>
    </div>
  )
}
