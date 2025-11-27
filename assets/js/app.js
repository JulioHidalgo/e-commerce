// Variables 
let articulosCarrito = []; 
const offcanvas = document.querySelector(".offcanvas");
const btn_shopping = document.querySelector(".btn_shopping");
const contadorCarrito = document.querySelector("#contador-carrito");
const closeButton = document.querySelector(".btn-close");

// Inicio
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sushis-container")
    .addEventListener("click", agregarAlCarrito);
});



// MOSTRAR / CERRAR CON ANIMACIÓN

function toggleOffcanvas(show) {
  offcanvas.style.transition = "transform 0.6s ease, opacity 0.6s ease";

  if (show) {
    offcanvas.classList.add("show");
    offcanvas.classList.remove("hiding");
  } else {
    offcanvas.classList.add("hiding");

    setTimeout(() => {
      offcanvas.classList.remove("show");
      offcanvas.classList.remove("hiding");
    }, 600);
  }
}


//  AGREGAR AL CARRITO
function agregarAlCarrito(e) {
  const btn = e.target.closest(".btn-cart");
  if (!btn) return;

  // Activar animación del offcanvas
  toggleOffcanvas(true);

  // Animación del botón del carrito
  btn_shopping.classList.add("balanceo");
  setTimeout(() => btn_shopping.classList.remove("balanceo"), 500);

  const card = btn.closest(".card");

  // IMPORTANTE: precio debe tener class="price"
  const precioTexto = card.querySelector(".price").textContent.replace("$", "");
  const precio = parseFloat(precioTexto);

  // Producto básico
  const producto = {
    id: card.querySelector(".card-title").textContent, // mejor que el "alt"
    cantidad: 1,
    precio
  };

  // Revisar si ya existe
  const existe = articulosCarrito.find(p => p.id === producto.id);
  if (existe) {
    existe.cantidad++;
  } else {
    articulosCarrito.push(producto);
  }

  actualizarContadorCarrito();
}



// CONTADOR
function actualizarContadorCarrito() {
  const total = articulosCarrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  contadorCarrito.textContent = total;
}


// CERRAR OFFCANVAS

btn_shopping.addEventListener("click", () => {
  toggleOffcanvas(!offcanvas.classList.contains("show"));
});

closeButton.addEventListener("click", () => toggleOffcanvas(false));
