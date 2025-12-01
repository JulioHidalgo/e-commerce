// ===== VARIABLES // ========
let articulosCarrito = []; 
const carritoContainer = document.querySelector(".offcanvas-body"); 
const offcanvas = document.querySelector(".offcanvas"); 
const btn_shopping = document.querySelector(".btn_shopping"); 
const subtotalElement = document.getElementById("subtotal"); 
const contadorCarrito = document.querySelector("#contador-carrito"); 
const closeButton = document.querySelector(".btn-close"); 

// ===== INICIO  ===========
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sushis-container").addEventListener("click", agregarAlCarrito);
  renderizarCarrito();
});

// ===== AGREGAR AL CARRITO ======
function agregarAlCarrito(e) {
  const btn = e.target.closest(".btn-cart");
  if (!btn) return;

  offcanvas.classList.add("show");
  btn_shopping.classList.add("balanceo");
  setTimeout(() => btn_shopping.classList.remove("balanceo"), 500);

  const card = btn.closest(".card");

  const producto = {
    id: card.dataset.id,
    nombre: card.dataset.name,
    categoria: card.dataset.category,
    precio: parseFloat(card.dataset.price),
    cantidad: 1,
    imagen: `assets/img-products/${card.dataset.image}.jpg`
  };

  const existe = articulosCarrito.find(item => item.id === producto.id);

  if (existe) {
    existe.cantidad++;
  } else {
    articulosCarrito.push(producto);
  }

  renderizarCarrito();
  actualizarSubtotal();
  actualizarContadorCarrito();
}

function renderizarCarrito() {
  carritoContainer.innerHTML = "";

  if (articulosCarrito.length === 0) {
    carritoContainer.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    return;
  }

  articulosCarrito.forEach(producto => {
    const itemHTML = `
      <div class="container mb-3">
        <div class="row align-items-center border-bottom py-2">
          <div class="col-3">
            <img class="img-fluid rounded" src="${producto.imagen}" alt="${producto.nombre}" />
          </div>
          <div class="col-6">
            <h6 class="mb-1 title-product">${producto.nombre}</h6>
            <p class="mb-0 detalles-product">Categoría: ${producto.categoria}</p>
          </div>
          <div class="col-3 text-end">
            <span class="fw-bold">
              <span class="fs-6 color-gris">${producto.cantidad}x</span>
              <span class="fs-5 precio">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
            </span>

            <button class="btn btn-danger mt-2 btn-borrar" data-id="${producto.id}">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    carritoContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  agregarEventosBorrar();
}

// ==== ELIMINAR PRODUCTOS =================
function agregarEventosBorrar() {
  const botonesBorrar = document.querySelectorAll(".btn-borrar");

  botonesBorrar.forEach(boton => {
    boton.addEventListener("click", e => {
      const productoId = e.target.closest("button").dataset.id;

      articulosCarrito = articulosCarrito
        .map(p => {
          if (p.id === productoId) {
            if (p.cantidad > 1) {
              p.cantidad--;
              return p;
            }
            return null;
          }
          return p;
        })
        .filter(p => p !== null);

      renderizarCarrito();
      actualizarSubtotal();
      actualizarContadorCarrito();
    });
  });
}

// ========= SUBTOTAL ==========
function actualizarSubtotal() {
  const subtotal = articulosCarrito.reduce(
    (total, p) => total + p.precio * p.cantidad,
    0
  );
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

// ===== CONTADOR ================
function actualizarContadorCarrito() {
  contadorCarrito.textContent = articulosCarrito.reduce(
    (total, p) => total + p.cantidad,
    0
  );
}

// === ANIMACIÓN VENTANA COSTADO CON PRODUCTOS ================
function toggleOffcanvas(show) {
  offcanvas.style.transition = "transform 0.6s ease, opacity 0.6s ease";

  if (show) {
    offcanvas.classList.add("show");
  } else {
    offcanvas.classList.remove("show");
    offcanvas.classList.add("hiding");
    setTimeout(() => offcanvas.classList.remove("hiding"), 600);
  }
}

btn_shopping.addEventListener("click", () => {
  toggleOffcanvas(!offcanvas.classList.contains("show"));
  btn_shopping.classList.toggle("balanceo");
});

closeButton.addEventListener("click", () => toggleOffcanvas(false));
