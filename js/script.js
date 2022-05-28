const items = document.getElementById("items");
const templateCard = document.getElementById("template-card").content;

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

const pintarCards = productos => {
    console.log(productos);
}