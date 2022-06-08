//guardo las secciones del DOM que voy a modificar despues
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
//obtengo los templates del DOM para usarlos despues
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;

const fragment = document.createDocumentFragment();

let carrito = {}

// se espera a que cargue el DOM para llamar a la función
document.addEventListener("DOMContentLoaded", () => {
    obtenerCarrito();
    cards.addEventListener("click", e => {
        agregarCarrito(e);
    })
    items.addEventListener("click", e => {
        btnAccion(e);
    })
    //almaceno en local storage:
    if(localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito();
    }
})

// funcion que usa fetch para obtener el objeto de productos.json
const obtenerCarrito = async () => {
    const responseCarrito = await fetch("productos.json");
    const productos = await responseCarrito.json();
    pintarCards(productos);
}

//"pego" los productos en el DOM. Titulo, precio e imagen del producto
const pintarCards = productos => {
    productos.forEach(producto => {
        //recorro el template para modificar el DOM
        templateCard.querySelector("h5").textContent = producto.title;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id;
        //clono el template
        const clone = templateCard.cloneNode(true);
        //agrego el clone al DOM con fragment
        fragment.appendChild(clone);
    })
    //agrego el clone al DOM
    cards.appendChild(fragment);
}

const agregarCarrito = e => {
    if (e.target.classList.contains("btn-dark")) {
        (setCarrito(e.target.parentElement)); //obtengo todo el div 'card-body' y se lo paso como parametro a la funcion setCarrito
    }
    Toastify({
        text: "Producto Agregado al Carrito",
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
    e.stopPropagation(); //para detener otros eventos(click en precio, titulo, img...)
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }
    //uso hasOwnProperty para ver su la propiedad cantidad ya existe. Si ya existe accedemos solo a ese objeto, y una vez q accedemos le sumamos 1 a la cantidad
    if (carrito.hasOwnProperty(producto.id)) { 
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    //agrego el producto al carrito. si el producto ya existe solamente le sumo 1 a la cantidad
    carrito[producto.id] = {
        ...producto
    }
    pintarCarrito();
}

const pintarCarrito = () => {
    //limpio el DOM
    items.innerHTML = "";
    //uso Object.values para poder usar la funcion forEach que no se puede usar en colecciones de objetos, pero si en arreglos de objetos
    Object.values(carrito).forEach(producto => {
        //recorro el template para modificar el DOM
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;
        //clono el template
        const clone = templateCarrito.cloneNode(true);
        //agrego el clone al DOM con fragment
        fragment.appendChild(clone);
    })
    //agrego el clone al DOM
    items.appendChild(fragment);
    pintarFooter();

    //Tambien uso esta funcion para guardar el carrito en local storage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const pintarFooter = () => {
    //limpio el DOM
    footer.innerHTML = "";
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>';
        return; //sale de la funcion. no ejecuta el resto
    }

    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {
        precio,
        cantidad
    }) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    //clono el template
    const clone = templateFooter.cloneNode(true);
    //agrego el clone al DOM con fragment
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () => {
        carrito = {};
        Toastify({
            text: "Carrito Vaciado",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, red, #f86f6f)",
            }
        }).showToast();
        pintarCarrito();
    })
}

const btnAccion = e => {
    //accion de aumentar
    if (e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        Toastify({
            text: "Producto Agregado",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        carrito[e.target.dataset.id] = {
            ...producto
        };
        pintarCarrito();
    }
    //accion de disminuir
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        Toastify({
            text: "Producto Eliminado",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, red, #f86f6f)",
            }
        }).showToast();
        if (producto.cantidad === 0) {
            (delete carrito[e.target.dataset.id]);
        }
         pintarCarrito();
    }

    e.stopPropagation(); //para detener otros eventos(click en precio, titulo, img...)
}