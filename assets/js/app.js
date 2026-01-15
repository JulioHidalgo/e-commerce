// ================= VARIABLES =================
let articulosCarrito = [];

const carritoContainer = document.querySelector(".offcanvas-body");
const offcanvas = document.querySelector(".offcanvas");
const btnShopping = document.querySelector(".btn_shopping");
const subtotalElement = document.getElementById("subtotal");
const contadorCarrito = document.getElementById("contador-carrito");
const btnWhatsApp = document.getElementById("btn-wsp");
const closeButton = document.querySelector(".btn-close");

const PRECIO_EXTRA = 800;

const extrasPedido = {
  acevichada: 0,
  teriyaki: 0,
  spicy: 0,
  maracuya: 0,
};

// ================= INICIO =================
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("sushis-container")
    .addEventListener("click", agregarAlCarrito);

  btnWhatsApp.addEventListener("click", generarPedidoWhatsApp);

  document.querySelectorAll(".btn-extra-mas").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      cambiarExtra(e.target.dataset.tipo, 1)
    );
  });

  document.querySelectorAll(".btn-extra-menos").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      cambiarExtra(e.target.dataset.tipo, -1)
    );
  });

  document
    .getElementById("btn-reset-extras")
    .addEventListener("click", resetearExtras);

  actualizarVista();
});

// ================= EXTRAS =================
function cambiarExtra(tipo, cambio) {
  if (!extrasPedido.hasOwnProperty(tipo)) return;

  extrasPedido[tipo] = Math.max(0, extrasPedido[tipo] + cambio);
  document.getElementById(`contador-${tipo}`).textContent = extrasPedido[tipo];

  actualizarVista();
}

function resetearExtras() {
  Object.keys(extrasPedido).forEach((tipo) => {
    extrasPedido[tipo] = 0;
    document.getElementById(`contador-${tipo}`).textContent = 0;
  });

  actualizarVista();
}

// ================= CARRITO =================
function agregarAlCarrito(e) {
  const btn = e.target.closest(".btn-cart");
  if (!btn) return;

  const card = btn.closest(".card");

  const producto = {
    id: card.dataset.id,
    nombre: card.dataset.name,
    categoria: card.dataset.category,
    precio: Number(card.dataset.price),
    cantidad: 1,
    imagen: `assets/img/img-products/${card.dataset.image}.jpg`,
  };

  const existe = articulosCarrito.find((p) => p.id === producto.id);

  existe ? existe.cantidad++ : articulosCarrito.push(producto);

  offcanvas.classList.add("show");
  btnShopping.classList.add("balanceo");
  setTimeout(() => btnShopping.classList.remove("balanceo"), 400);

  actualizarVista();
}

function renderizarCarrito() {
  carritoContainer.innerHTML = "";

  if (!articulosCarrito.length) {
    carritoContainer.innerHTML =
      "<p class='text-center'>El carrito está vacío.</p>";
    return;
  }

  articulosCarrito.forEach((producto) => {
    carritoContainer.innerHTML += `
      <div class="container mb-2">
        <div class="row align-items-center border-bottom py-2">
          <div class="col-3">
            <img class="img-fluid rounded" src="${producto.imagen}">
          </div>
          <div class="col-6">
            <strong>${producto.nombre}</strong>
            <p class="mb-0 small">${producto.categoria}</p>
          </div>
          <div class="col-3 text-end">
            ${producto.cantidad}x $${producto.precio * producto.cantidad}
            <button class="btn btn-danger btn-sm mt-1 btn-borrar" data-id="${
              producto.id
            }">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>`;
  });

  document
    .querySelectorAll(".btn-borrar")
    .forEach((btn) => btn.addEventListener("click", eliminarProducto));
}

function eliminarProducto(e) {
  const id = e.target.closest("button").dataset.id;

  articulosCarrito = articulosCarrito
    .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
    .filter((p) => p.cantidad > 0);

  actualizarVista();
}

// ================= TOTALES =================
function calcularSubtotal() {
  const productos = articulosCarrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const extras = Object.values(extrasPedido).reduce(
    (acc, c) => acc + c * PRECIO_EXTRA,
    0
  );

  return productos + extras;
}

function actualizarVista() {
  renderizarCarrito();

  subtotalElement.textContent = `$${calcularSubtotal()}`;

  contadorCarrito.textContent = articulosCarrito.reduce(
    (acc, p) => acc + p.cantidad,
    0
  );

  btnWhatsApp.disabled = articulosCarrito.length === 0;
}

// ================= WHATSAPP =================
function generarPedidoWhatsApp() {
  if (!articulosCarrito.length) return;

  let mensaje = "🍣 *PEDIDO KAIKAI SUSHI* 🍣\n\n";

  articulosCarrito.forEach((p, i) => {
    mensaje += `${i + 1}. ${p.nombre} x${p.cantidad} - $${
      p.precio * p.cantidad
    }\n`;
  });

  mensaje += "\n*EXTRAS:*\n";
  Object.entries(extrasPedido).forEach(([tipo, cantidad]) => {
    if (cantidad > 0) {
      mensaje += `• ${tipo} x${cantidad} (+$${cantidad * PRECIO_EXTRA})\n`;
    }
  });

  mensaje += `\n*TOTAL:* $${calcularSubtotal()}\n`;
  mensaje += "\n1 Salsa Soya por roll\n2 Palitos por persona\n\n📍 El Quisco";

  const url = `https://wa.me/56974649523?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// ================= OFFCANVAS =================
btnShopping.addEventListener("click", () => offcanvas.classList.toggle("show"));

closeButton.addEventListener("click", () => offcanvas.classList.remove("show"));
