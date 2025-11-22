// =========================
// VARIABLES
// =========================

// Array base para manejar productos
let articulosCarrito = [];

// Contenedor de cards
const sushisContainer = document.getElementById("sushis-container");

// Contador visual del carrito
const contadorCarrito = document.getElementById("contador-carrito");

// =========================
// INICIO
// =========================

document.addEventListener("DOMContentLoaded", () => {

  // Escuchar clicks en botones "Agregar al carrito"
  sushisContainer.addEventListener("click", manejarClickProducto);
});

// =========================
// MANEJAR CLICK EN UNA CARD
// =========================

function manejarClickProducto(e) {
  console.log("Click dentro del contenedor");

  const btn = e.target.closest(".btn-cart");

  if (!btn) {
    console.log("Click ignorado");
    return;
  }

  console.log("Botón 'Agregar al carrito' presionado");

  const card = btn.closest(".card");

  if (!card) {
    console.log("No se encontró la card");
    return;
  }

  console.log("Card encontrada");

  // Estructura simple del producto
  const producto = {
    id: card.querySelector("img").alt || "",
    nombre: card.querySelector(".card-title")?.textContent || "",
    categoria: card.querySelector(".card-text strong")?.textContent || "",
    precio: obtenerPrecio(card),
    imagen: card.querySelector("img")?.src || ""
  };

  console.log("Producto preparado:", producto);

  // Guardar o actualizar
  agregarProductoBase(producto);

  // Actualizar contador
  actualizarContador();
}

// =========================
// FUNCIÓN BASE PARA GUARDAR PRODUCTO
// =========================

function agregarProductoBase(producto) {

  const existe = articulosCarrito.find((p) => p.id === producto.id);

  if (existe) {
    console.log(`El producto ya existe`);
    existe.cantidad = (existe.cantidad || 1) + 1;
  } else {
    producto.cantidad = 1;
    articulosCarrito.push(producto);
  }

  console.log("Estado actual del carrito:", articulosCarrito);
}

// =========================
// OBTENER PRECIO CORRECTO DE LA CARD
// =========================

function obtenerPrecio(card) {
  const precioEl = card.querySelector(".price");

  if (!precioEl) {
    return 0;
  }

  const precio = parseFloat(precioEl.textContent.replace("$", ""));
  
  if (isNaN(precio)) {
    return 0;
  }
  return precio;
}

// =========================
// CONTADOR DEL CARRITO
// =========================

function actualizarContador() {
  const total = articulosCarrito.reduce((acc, prod) => acc + prod.cantidad, 0);

  contadorCarrito.textContent = total;

  console.log("Contador actualizado:", total);
}
