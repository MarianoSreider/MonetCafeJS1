const carrito = new Carrito([]);
const contadorCarrito = document.getElementById("contadorCarrito");


let productosCarrito = carrito.productos;


function displayCarrito() {
	document.getElementById("cruzicon").onclick = () => {
		if ($("#carritoAbsolute").css("display") == "block") {
			$("#carritoAbsolute").fadeOut(1000);
			$("#formularioReserva").fadeOut();
		}
	};

	document.getElementById("carritoDesplegar").onclick = () => {
		if ($("#carritoAbsolute").css("display") == "none") {
			$("#carritoAbsolute").fadeIn(700);
			$("#btnContinuarReserva").fadeIn();
		}
	};
}


function recuperarCarrito() {
	let carritoRecuperados =
		JSON.parse(sessionStorage.getItem("PRODUCTOS")) || [];

	if (carritoRecuperados.length) {
		for (let i = 0; i < carritoRecuperados.length; i++) {
			let producto = carritoRecuperados[i];
			const cantidadSeleccionada = producto.cantidad;
			carrito.agregarProducto(cantidadSeleccionada, producto);
		}
		imprimirCarrito();

		console.log("RECUPERADOS");
		console.log(carritoRecuperados);
	}
}


function listarProductos() {

	let categoriaStorage = JSON.parse(sessionStorage.getItem("CATEGORIA")) || [];

	const nodoProductos = document.getElementById("productos");
	nodoProductos.innerHTML = "";
	let lista = document.createElement("div");
	lista.classList.add("contenedorProductos");

	const productosCategoria = productos.filter(
		(element) => element.categoria === categoriaStorage
	);


	for (let i = 0; i < productosCategoria.length; i++) {
		let producto = productosCategoria[i];

		let item = document.createElement("div");
		item.classList.add("contenedorProducto");

		item.innerHTML = `<div><h3 class="tituloCafe">${producto.nombre}</h3></div>                      
                      <img class="imgProductos" src="../images/${producto.slug}.jpg" alt="${producto.nombre}">

                      <div>Precio: $${producto.precio}</div>
                      <div>Descripcion: ${producto.descripcion}</div>
                        
                      <h6>Cantidad</h6><select name="cantidad" id="cantidad"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div><br><br>
                      `;

		let boton = document.createElement("button");
		boton.classList.add("btn-sm");
		boton.classList.add("btn-color");
		boton.innerHTML = "Agregar al carrito";
		boton.onclick = (event) => mostrarAlert(event, producto);
		item.appendChild(boton);

		lista.appendChild(item);
	}
	nodoProductos.appendChild(lista);
}


function mostrarAlert(e, producto) {
	const cantidadSeleccionada = Number(
		e.target.parentElement.childNodes[9].value
	);

	Swal.fire({
		title: "Agregaste un  producto al carrito",

		imageUrl: "../images/PortadaMenu2.jpg",
		imageWidth: 200,
		imageHeight: 200,
		imageAlt: "Custom image",

		showCancelButton: true,
		confirmButtonText: "Seguir agregando",
		confirmButtonColor: "#777953",
		cancelButtonText: "Ver carrito",
		cancelButtonColor: "#777953",
	}).then((result) => {

		if (result.isConfirmed) {
			carrito.agregarProducto(cantidadSeleccionada, producto);
			imprimirCarrito();
		}

		else if (result.isDismissed) {
			carrito.agregarProducto(cantidadSeleccionada, producto);
			imprimirCarrito();

			$("#carritoAbsolute").fadeIn(1000);
		}
	});
}

// PONGO CARRITO EN EL HTML
function imprimirCarrito() {
	// nodo para imprimir carrito
	const nodoCarrito = document.getElementById("carrito");
	nodoCarrito.innerHTML = "";


	let contador = 0;
	while (contador < productosCarrito.length) {
		let producto = productosCarrito[contador];

		let item = document.createElement("div");
		item.classList.add("margenCarrito");
		item.innerHTML = `<hr><div><h4 class="tituloCarrito tituloTotal">${producto.nombre}</h4></div>
                      <img class=" imgCarrito" src="../images/${producto.slug}.jpg" alt="${producto.nombre}">
                      <div>Precio: $${producto.precio}</div> 
                      <div>Cantidad: ${producto.cantidad}</div>

                      <select name="cantidad" id="cantidad"><option value="1">${producto.cantidad}</option><option value="1">1</option><option value="2">2</option> <option value="3">3</option> <option value="4">4</option></select>

                      
                      </br> 


                      `;
		nodoCarrito.appendChild(item);

		// // BOTON CAMBIO DE CANTIDAD:
		let botonCambios = document.createElement("button");
		botonCambios.classList.add("buttom");
		botonCambios.classList.add("btn-sm");
		botonCambios.innerHTML = "Calcular cambios";		
		botonCambios.onclick = (e) => { botoncambio(e, producto) };
		item.appendChild(botonCambios);

		// BOTON QUITAR PRODUCTO
		let botonQuitar = document.createElement("button");
		botonQuitar.classList.add("buttom");
		botonQuitar.classList.add("btn-sm");

		botonQuitar.innerHTML = "Eliminar producto";
		botonQuitar.onclick = () => {  botonquitar(producto)};
		item.appendChild(botonQuitar);

		// INPUT OCULTO
		inputoculto();

		//////

		contador++;
	}


	sessionStorage.setItem("PRODUCTOS", JSON.stringify(productosCarrito));


	const nodoContendorTotal = document.createElement("div");
	nodoContendorTotal.appendChild(document.createElement("hr"));
	
	const total = carrito.totalizar();

	const nodoTotal = document.createElement("div");
	nodoTotal.classList.add("divTotal");

	nodoTotal.innerHTML = `<a class="aCarrito" href="../pages/productos.html">agregar mas productos</a> <h2 class="tituloCarrito" id="tituloTotal">  TOTAL: $${total}</h2>
      <a id="btnContinuarReserva"  class="btn btn-primary btn-sm" onclick="fadeInReserva()" >CONTINUAR RESERVA</a>
   `;

	nodoContendorTotal.appendChild(nodoTotal);
	nodoCarrito.appendChild(nodoContendorTotal);
}

// // BOTON CAMBIO DE CANTIDAD:
function botoncambio(e, producto) {
	
	const cantidadSeleccionada = Number(
		e.target.parentElement.childNodes[9].value
	);
	producto.cantidad = Number(cantidadSeleccionada);
	imprimirCarrito();
	$("#formularioReserva").fadeOut(0);	
}

// BOTON QUITAR PRODUCTO,
function botonquitar(producto) {


	Swal.fire({
		title: "¿Querés eliminar este producto?",
		// icon: "success",

		showCancelButton: true,
		confirmButtonText: "SI",
		confirmButtonColor: "#777953",
		cancelButtonText: "NO",
	
		cancelButtonColor: "#777953",
	}).then((result) => {
		if (result.isConfirmed) {
			carrito.quitarProducto(producto);
			imprimirCarrito();
			$("#formularioReserva").fadeOut(0);
		}
	});	
	
}

// INPUT OCULTO
function inputoculto() {

	const nodocarritoFormulario = document.getElementById("carritoFormulario");
	nodocarritoFormulario.innerHTML = "";

	let contador = 0;
	while (contador < productosCarrito.length) {
		let producto = productosCarrito[contador];

		let datos = document.createElement("p");
		datos.innerHTML = `<p> //  PRODUCTO: ${producto.cantidad} ${producto.nombre} </br>, valor $ ${producto.precio} cada uno </br> // </p>`;
		nodocarritoFormulario.appendChild(datos);

		contador++;
	}

	let totalMail = document.createElement("p");
	totalMail.innerHTML = `<p> // VALOR TOTAL: $${carrito.totalizar()} </p>`;
	nodocarritoFormulario.appendChild(totalMail);
}


function fadeInReserva() {
	$("#formularioReserva").fadeIn();
	$("#btnContinuarReserva").fadeOut(100);
}


(function () {
	emailjs.init("jt6DMsGIXAp9BHsX7");
})();

const resetear = document.querySelector("#myForm");

// USE https://www.emailjs.com/docs/rest-api/send-form/

$("#myForm").on("submit", function (event) {
	event.preventDefault(); // prevent reload

	let formData = new FormData(this);
	formData.append("service_id", "service_393szeq");
	formData.append("template_id", "template_6oe83s8");
	formData.append("user_id", "jt6DMsGIXAp9BHsX7");

	$.ajax("https://api.emailjs.com/api/v1.0/email/send-form", {
		type: "POST",
		data: formData,
		contentType: false, // auto-detection
		processData: false, // no need to parse formData to string
	})
		.done(function () {
			resetear.reset();

			Swal.fire({
				title: "Tus datos fueron ingresados =)",
				text: "Te contactaremos a la brevedad",

				imageUrl: "../images/PortadaMenu2.jpg",
				imageWidth: 225,
				imageHeight: 175,
				imageAlt: "Datos Ingresados",

				showConfirmButton: false,
				timer: 5000,
			});
			$("#carritoAbsolute").fadeOut(100);

			productosCarrito.splice(0, productosCarrito.length);
			imprimirCarrito();

			// borro esto
			$("#formularioReserva").fadeOut();
			$("#btnContinuarReserva").fadeOut();
		})
		.fail(function (error) {
			alert("Oops... " + JSON.stringify(error));
		});
});

recuperarCarrito();
listarProductos();
displayCarrito();
