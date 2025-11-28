// Variables
let articulosCarrito = []; 
const carritoContainer = document.querySelector(".offcanvas-body"); 
const offcanvas = document.querySelector(".offcanvas"); 
const btn_shopping = document.querySelector(".btn_shopping"); 
const subtotalElement = document.getElementById("subtotal"); 
const contadorCarrito = document.querySelector("#contador-carrito"); 
const closeButton = document.querySelector(".btn-close"); 

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sushis-container").addEventListener("click", agregarAlCarrito);
  renderizarCarrito();
});

// Función para agregar al carrito
function agregarAlCarrito(e) {
  const btn = e.target.closest(".btn-cart");

  if (btn) {
    offcanvas.classList.add("show");
    btn_shopping.classList.add("balanceo");
    setTimeout(() => {
      btn_shopping.classList.remove("balanceo");
    }, 500);

    console.log("linea 19");
    // Se obtiene el card relacionado con el botón para extraer la información del producto
    const card = btn.closest(".card");
    const producto = {
      id: card.querySelector("img").alt, 
      nombre: card.querySelector(".card-title").textContent,
      categoria: card.querySelector(".card-text strong").textContent, 
      precio: parseFloat(card.querySelector(".price").textContent.slice(1)), 
      cantidad: 1, 
      imagen: card.querySelector("img").src,
    };

    // Verificar si el producto ya existe en el carrito
    const existe = articulosCarrito.find((item) => item.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      articulosCarrito.push(producto);
    }

    // Renderizar el carrito actualizado
    renderizarCarrito();
    actualizarSubtotal();
    actualizarContadorCarrito();
  }
}

// Función para renderizar el carrito
function renderizarCarrito() {
  carritoContainer.innerHTML = "";

  if (articulosCarrito.length === 0) {
    carritoContainer.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
  }

  // Iterar sobre los productos en el carrito y renderizarlos
  articulosCarrito.forEach((producto) => {
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
            <!-- Mostrar cantidad y precio total del producto -->
            <span class="fw-bold"><span class="fs-6 color-gris">${
              producto.cantidad
            }x</span><span class="fs-5 precio">$${(producto.precio * producto.cantidad).toFixed(
      2
    )}</span>
            </span>

            <!-- Botón para eliminar el producto del carrito -->
            <button class="btn btn-danger mt-2 btn-borrar" data-id="${
              producto.id
            }"><i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    carritoContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  // eliminación de producto
  agregarEventosBorrar();
}

// Función para eliminar un producto del carrito
function agregarEventosBorrar() {
  const botonesBorrar = document.querySelectorAll(".btn-borrar");

  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const productoId = e.target.closest("button").dataset.id;

      articulosCarrito = articulosCarrito
        .map((producto) => {
          if (producto.id === productoId) {
            if (producto.cantidad > 1) {
              producto.cantidad--; 
              return producto; 
            }
            return null;
          }
          return producto;
        })
        .filter((producto) => producto !== null); 

      // Volver a renderizar el carrito con los cambios
      renderizarCarrito();
      actualizarSubtotal();
      actualizarContadorCarrito();

    });
  });
}

// Función para calcular y actualizar el subtotal
function actualizarSubtotal() {
  const subtotal = articulosCarrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

// Función para actualizar el contador de productos en el carrito
function actualizarContadorCarrito() {
  const totalProductos = articulosCarrito.length;
  contadorCarrito.textContent = totalProductos;
}


// Función para mostrar/ocultar el carrito con animación
function toggleOffcanvas(show) {
  // Añadir transiciones para el efecto visual de apertura/cierre
  offcanvas.style.transition = "transform 0.6s ease, opacity 0.6s ease";

  // Mostrar el carrito si 'show' es true, ocultarlo si es false
  if (show) {
    offcanvas.classList.add("show");
  } else {
    offcanvas.classList.remove("show");
    offcanvas.classList.add("hiding");
    // Eliminar la clase 'hiding' después de la animación
    setTimeout(() => offcanvas.classList.remove("hiding"), 600);
  }
}

// Evento para mostrar/ocultar el carrito al hacer clic en el botón de compra
btn_shopping.addEventListener("click", () => {
  toggleOffcanvas(!offcanvas.classList.contains("show"));
  // Añadir una animación de balanceo al botón
  btn_shopping.classList.toggle("balanceo");
});

// Evento para cerrar el carrito al hacer clic en el botón de cerrar
closeButton.addEventListener("click", () => toggleOffcanvas(false));



