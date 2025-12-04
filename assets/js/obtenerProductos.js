document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sushis-container");

  // ===== Función para crear cada tarjeta de producto ====================
function createSushiCard({ name, price, image, category, details }) {
  const detailsHTML = Array.isArray(details)
    ? `<ul class="small">${details.map((d) => `<li>${d}</li>`).join("")}</ul>`
    : details ? `<p class="small">${details}</p>` : "";

  return `
    <div class="col-md-3">
      <div 
        class="card h-100 border-0 custom-card bg-dark text-white"
        data-id="${name.replace(/\s+/g, "_")}"
        data-name="${name}"
        data-category="${category}"
        data-price="${price ? price : 0}"
        data-image="${image}"
      >
        
        <img src="assets/img/img-products/${image}.jpg" class="card-img-top" alt="${name}">

        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold">${name}</h5>

          <p class="card-text">Categoría: <strong>${category}</strong></p>

          <p class="card-text text-warning fs-5">
            ${price ? "$" + price.toLocaleString() : ""}
          </p>

          ${detailsHTML}

          <button class="btn btn-cart w-100 mt-auto">
            Agregar al carrito &nbsp;<i class="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}


  // ======= Función para cargar JSON con los productos ==================
  async function loadSushis() {
    try {
      const response = await fetch("./assets/datos/data_sushis.json");

      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }

      const data = await response.json();

      container.innerHTML = "";

      data.forEach((categoria) => {
        container.innerHTML += `
          <div class="col-12 mt-5 mb-3">
            <h2 class="text-center text-warning fw-bold border-bottom pb-2">
              ${categoria.title}
            </h2>
          </div>
        `;
        const cardsHTML = categoria.items
          .map((item) => createSushiCard(item))
          .join("");

        container.innerHTML += cardsHTML;
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      container.innerHTML = `<p class="text-danger text-center">Hubo un error al cargar los datos.</p>`;
    }
  }

  loadSushis();
});
