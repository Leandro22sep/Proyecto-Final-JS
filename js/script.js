//seccion del DOM donde voy a "pegar" los productos
const items = document.getElementById("items");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();

// se espera a que cargue el DOM para llamar a la función
document.addEventListener("DOMContentLoaded",() => {
    obtenerCarrito();
})

// funcion que usa fetch para obtener el objeto de productos.json
const obtenerCarrito = async() => {
    const responseCarrito = await fetch("productos.json");
    const productos = await responseCarrito.json();
    pintarCards(productos);
}

//"pego" los productos en el DOM. Titulo, precio e imagen del producto
const pintarCards = productos => {
    console.log(productos);//BORRARRRRRR
    productos.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
}