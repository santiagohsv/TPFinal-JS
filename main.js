//------------------------------------CLASES------------------------------------//
// CLASE PARA LOS PRODUCTOS OFRECIDOS

class Productos {
  constructor(id, nombre, precioTamaño = [], stockTamaño = [], imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precioTamaño = precioTamaño;
    this.stockTamaño = stockTamaño;
    this.imagen = imagen;

    this.verificarStock = function (size) {
      if (this.stockTamaño[size] > 0) {
        this.stockTamaño[size]--;
        return true;
      } else {
        return false;
      }
    };
  }
}

// CLASE PARA EL CARRITO DE COMPRA 

class Cart {
  constructor(items = [], total=0) {
    this.items = items;
    this.total = total;
   
    this.addToCart = function (item, index, size) {
      if (item.verificarStock(index)) {
        if (
          this.items.find(
            (prod) => prod.nombre === item.nombre && prod.tamaño === size
          ) == undefined
        ) {
          this.items.push({
            nombre: item.nombre,
            tamaño: size,
            precio: item.precioTamaño[index],
            imgen: item.imagen,
            cantidad: 1,
          });
        } else {
          let index = this.items.findIndex(
            (prod) => prod.nombre == item.nombre && prod.tamaño == size
          );
          this.items[index].cantidad++;
        }
      this.totalPrice();  
      } else alert("No hay stock");
    };

    this.totalPrice = function () {
      let totalizador = 0;
      for (let item of this.items) {
        if (item != undefined) {
         totalizador += item.precio * item.cantidad;
        }
      }
      this.total=totalizador
      return totalizador;
    }  
  }  
  
}

//------------------------CARGA DE PRODUCTOS------------------------//

// TAMAÑO Y PRECIO SON ARRAYS QUE CORRESPONDEN A DISTINTOS TAMAÑOS DISPONIBLES.
// EJ. PRIMER PRODUCTO, EN UN TAMAÑO 11X14 CUESTA $1000 y hay 10 UNIDADES EN STOCK.

listaProductos = [];
listaProductos.push(
  new Productos(
    0,
    "White Clouds",
    [100, 110, 120], // <= PRECIOS
    [2, 30, 20], // <= STOCK
    "media/pexels-ruvim-3560044.jpg"
  )
);
listaProductos.push(
  new Productos(
    1,
    "Mountains",
    [120, 125, 140],
    [150,54,23],
    "media/pexels-kasuma-1785493.jpg"
  )
);
listaProductos.push(
  new Productos(
    2,
    "Empty Highway",
    [140, 150, 160],
    [130,352, 101],
    "media/pexels-sebastian-palomino-1955134.jpg"
  )
);

// GENERACIÓN DEL HTML A PARTIR DEL ARRAY DE PRODUCTOS

let mainContainer = document.querySelector(".mainContainter");

listaProductos.forEach((items) => {
  let div = document.createElement("div");
  div.classList.add("contenedorProd");
  div.innerHTML = ` 
                    <div class="contenedorImg"> <img class="itemImg" src="${items.imagen}" /></div>
                    <div class="contenedorSelect">
                      <h2 class="itemName">${items.nombre}</h2>
                      <h2>$ <span class="itemPrice">${items.precioTamaño[0]}</span></h2>
                      <p>Tamaños disponibles</p>
                      <select class="opcion">
                        <option value="0">11x14</option>
                        <option value="1">16x20</option>
                        <option value="2">24x30</option>
                      </select>
                      <button class="primaryBtn addBtn">Agregar</button>
                    `;
  mainContainer.appendChild(div);
});

// ACTUALIZACIÒN DEL PRECIO MOSTRADO EN FUNCIÒN DEL TAMAÑO SELECIONADO.

$(".opcion").change((e) => {
  let itemName = e.target.closest(".contenedorSelect").children[0].innerHTML; // NOMBRE
  let selectedIndex = e.target.selectedIndex; // INDEX
  let itemPriceSearch = listaProductos.find(function (product) {
    return product.nombre == itemName;
  });
  let newPrice = itemPriceSearch.precioTamaño[selectedIndex];
  e.target.closest(".contenedorSelect").children[1].lastChild.innerHTML =  newPrice;
});



//-------------------------INICIO------------------------------//

let carrito;

// SE VERIFICO SI YA EXISTE UN CARRITO EN EL SESSION STORAGE.

if (sessionStorage.carrito == undefined) {
  carrito = new Cart();

} else {
  savedCart = JSON.parse(sessionStorage.getItem("carrito"));
  carrito = new Cart(savedCart.items, savedCart.total);
  listarItems(carrito);
  refreshInfo();
}

// AGREGAR ITEMS


$(".addBtn").click((e) => {
  let btn = e.target;
  let selectedSize = btn.previousElementSibling.selectedIndex;

  // CAPTURA EL PRODUCTO AGREGADO 
  let selectedItem = btn.closest(".contenedorProd");
  let itemName = selectedItem.querySelector(".contenedorSelect h2").textContent;
  let itemSize = selectedItem.querySelector(".opcion").selectedOptions.item(0).innerHTML;
  let itemSearch = listaProductos.find((product) => product.nombre == itemName);

  carrito.addToCart(itemSearch, selectedSize, itemSize);
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  listarItems(carrito);
  refreshInfo();
 
});

//  BOTON BORRAR

let btnClear = document.querySelector("#btnClear");
btnClear.addEventListener("click", () => {
  sessionStorage.clear();
  carrito = new Cart();
  listarItems(carrito);
  refreshInfo();
});


$(".cart-container").hide();
$(".shopping-bag-logo").click(()=>{$(".cart-container").toggle()})
$("#btnClose").click(()=>{$(".cart-container").hide()}); 

// FUNCION MOSTRAR LISTADO DE COMPRA

function listarItems(carrito) {
  $(".cart-resume").empty();
  for (items of carrito.items) {
    $(".cart-resume").append(
      `
          <div class="item-resume">
          <div class="item-img"><img src=${items.imgen}></div>
          <div class="item-name"><h3>${items.nombre}</h3></div>
          <div class="item-size"><h3>${items.tamaño}</h3></div>
          <div class="item-qty"><h3>${items.cantidad}</h3></div>
          <div class="item-price"><h3>$ ${items.precio}</h3></div>
          <button class="removeBtn">  <img class="trashImg" src="media/trash-can.png" /> </button>
          </div>
          
          `
    );
  }
  removeItem();
}

function removeItem() {
  let removeBtn = document.querySelectorAll(".removeBtn");
  removeBtn.forEach((btn, index) => {
    removeBtn[index].addEventListener("click", () => {
      carrito.items.splice(index, 1);
      carrito.totalPrice();
      sessionStorage.setItem("carrito", JSON.stringify(carrito));
      listarItems(carrito);
      refreshInfo();
    });
  });
}



function refreshInfo(){

  document.querySelector(".price").textContent=carrito.total;
  //totalQty();
  let prodQty = 0;
  for (let item of carrito.items) {
    if (item != undefined) {
     prodQty += item.cantidad;
    }
  }
  document.querySelector(".qty").textContent=prodQty;

}



$(".cart-container-1").hide();

let btnFinish = document.querySelector("#btnFinish");


btnFinish.addEventListener("click", () => {

  if(document.querySelector(".qty").textContent!=0){
  $(".cart-container-1").show();
  $(".cart-container-1").fadeOut(4000);
  }
});
