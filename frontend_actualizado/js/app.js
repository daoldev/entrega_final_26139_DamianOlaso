const API_ARTICULOS = "http://localhost:8080/api/articulos";
const API_PEDIDOS = "http://localhost:8080/api/pedidos";
const API_USUARIOS = "http://localhost:8080/api/usuarios";

let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    listarArticulos();
    listarUsuarios();
    cargarSelectProductos();
});

document.getElementById("form-articulo").addEventListener("submit", guardarArticulo);
document.getElementById("cancelar").addEventListener("click", cancelarEdicion);
document.getElementById("agregar-al-carrito").addEventListener("click", agregarAlCarrito);
document.getElementById("realizar-pedido").addEventListener("click", realizarPedido);
document.getElementById("limpiar-carrito").addEventListener("click", limpiarCarrito);
document.getElementById("buscar-pedidos").addEventListener("click", buscarPedidos);
document.getElementById("form-usuario").addEventListener("submit", crearUsuario);

function cancelarEdicion() {
    document.getElementById("form-articulo").reset();
    document.getElementById("idArticulo").value = "";
    document.getElementById("titulo-form").textContent = "Nuevo Artículo";
}

function listarArticulos() {
    fetch(API_ARTICULOS)
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById("tabla-articulos");
            tbody.innerHTML = "";
            data.forEach(a => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${a.id}</td>
                    <td>${a.nombre}</td>
                    <td>${a.descripcion || ""}</td>
                    <td>$${a.precio.toFixed(2)}</td>
                    <td>${a.categoria || ""}</td>
                    <td>${a.stock}</td>
                    <td>${a.imagen ? "<img src='" + a.imagen + "' width='40'>" : ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarArticulo(${a.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarArticulo(${a.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila);
            });
        })
        .catch(e => console.error("Error al listar artículos:", e));
}

function guardarArticulo(event) {
    event.preventDefault();
    const id = document.getElementById("idArticulo").value;
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const stock = parseInt(document.getElementById("stock").value);
    const imagen = document.getElementById("imagen").value.trim();

    if (!nombre || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    const articulo = { nombre, descripcion, precio, categoria, stock, imagen };
    const url = id ? `${API_ARTICULOS}/${id}` : API_ARTICULOS;
    const metodo = id ? "PUT" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo)
    })
    .then(r => {
        if (!r.ok) throw new Error("Error al guardar");
        return r.json();
    })
    .then(() => {
        document.getElementById("form-articulo").reset();
        document.getElementById("idArticulo").value = "";
        document.getElementById("titulo-form").textContent = "Nuevo Artículo";
        listarArticulos();
        cargarSelectProductos();
    })
    .catch(e => console.error("Error al guardar artículo:", e));
}

function editarArticulo(id) {
    fetch(`${API_ARTICULOS}/${id}`)
        .then(r => r.json())
        .then(a => {
            document.getElementById("idArticulo").value = a.id;
            document.getElementById("nombre").value = a.nombre;
            document.getElementById("descripcion").value = a.descripcion || "";
            document.getElementById("precio").value = a.precio;
            document.getElementById("categoria").value = a.categoria || "";
            document.getElementById("stock").value = a.stock;
            document.getElementById("imagen").value = a.imagen || "";
            document.getElementById("titulo-form").textContent = "Editar Artículo";
            document.getElementById("tabNav").querySelector('[data-bs-target="#productos"]').click();
        })
        .catch(e => console.error("Error al obtener artículo:", e));
}

function eliminarArticulo(id) {
    if (confirm("¿Deseás eliminar este artículo?")) {
        fetch(`${API_ARTICULOS}/${id}`, { method: "DELETE" })
            .then(r => {
                if (!r.ok) throw new Error("Error al eliminar");
                listarArticulos();
                cargarSelectProductos();
            })
            .catch(e => console.error("Error al eliminar artículo:", e));
    }
}

function cargarSelectProductos() {
    fetch(API_ARTICULOS)
        .then(r => r.json())
        .then(data => {
            const select = document.getElementById("productoCarrito");
            select.innerHTML = "";
            data.forEach(a => {
                const opt = document.createElement("option");
                opt.value = a.id;
                opt.textContent = `${a.nombre} - $${a.precio.toFixed(2)} (Stock: ${a.stock})`;
                select.appendChild(opt);
            });
        })
        .catch(e => console.error("Error al cargar productos:", e));
}

function agregarAlCarrito() {
    const productoId = parseInt(document.getElementById("productoCarrito").value);
    const cantidad = parseInt(document.getElementById("cantidadCarrito").value);
    if (!productoId || cantidad < 1) return;

    fetch(`${API_ARTICULOS}/${productoId}`)
        .then(r => r.json())
        .then(producto => {
            const existente = carrito.find(l => l.productoId === productoId);
            if (existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push({
                    productoId: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: cantidad
                });
            }
            actualizarTablaCarrito();
            document.getElementById("cantidadCarrito").value = 1;
        })
        .catch(e => console.error("Error al agregar al carrito:", e));
}

function actualizarTablaCarrito() {
    const tbody = document.getElementById("tabla-carrito");
    tbody.innerHTML = "";
    let total = 0;
    carrito.forEach((item, i) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="quitarDelCarrito(${i})">X</button></td>
        `;
        tbody.appendChild(fila);
    });
    document.getElementById("total-carrito").textContent = `$${total.toFixed(2)}`;
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarTablaCarrito();
}

function limpiarCarrito() {
    carrito = [];
    actualizarTablaCarrito();
    document.getElementById("resultado-pedido").innerHTML = "";
}

function realizarPedido() {
    const usuarioId = parseInt(document.getElementById("usuarioIdCarrito").value);
    if (!usuarioId || carrito.length === 0) {
        alert("Agregá productos al carrito primero.");
        return;
    }

    const pedido = {
        usuarioId: usuarioId,
        lineas: carrito.map(l => ({
            productoId: l.productoId,
            cantidad: l.cantidad
        }))
    };

    fetch(API_PEDIDOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
    })
    .then(r => {
        if (!r.ok) return r.text().then(msg => { throw new Error(msg); });
        return r.json();
    })
    .then(pedidoCreado => {
        document.getElementById("resultado-pedido").innerHTML =
            `<div class="alert alert-success">Pedido #${pedidoCreado.id} creado - Total: $${pedidoCreado.total.toFixed(2)}</div>`;
        carrito = [];
        actualizarTablaCarrito();
        listarArticulos();
        cargarSelectProductos();
    })
    .catch(e => {
        document.getElementById("resultado-pedido").innerHTML =
            `<div class="alert alert-danger">${e.message}</div>`;
    });
}

function buscarPedidos() {
    const usuarioId = document.getElementById("usuarioIdPedidos").value;
    const container = document.getElementById("pedidos-container");

    fetch(`${API_USUARIOS}/${usuarioId}/pedidos`)
        .then(r => r.json())
        .then(pedidos => {
            if (pedidos.length === 0) {
                container.innerHTML = "<p class='text-muted'>No hay pedidos para este usuario.</p>";
                return;
            }
            let html = "";
            pedidos.forEach(p => {
                const lineasHtml = (p.lineas || []).map(l =>
                    `<tr><td>${l.productoId}</td><td>${l.cantidad}</td><td>$${l.subtotal.toFixed(2)}</td></tr>`
                ).join("");
                html += `
                    <div class="card mb-3">
                        <div class="card-header">
                            <strong>Pedido #${p.id}</strong> | Fecha: ${new Date(p.fecha).toLocaleString()} | Estado: <span class="badge bg-warning">${p.estado}</span> | Total: <strong>$${p.total.toFixed(2)}</strong>
                        </div>
                        <div class="card-body">
                            <table class="table table-sm mb-0">
                                <thead><tr><th>Producto ID</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
                                <tbody>${lineasHtml}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        })
        .catch(e => {
            container.innerHTML = `<div class="alert alert-danger">Error al obtener pedidos: ${e.message}</div>`;
        });
}

function crearUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    if (!nombre || !email) { alert("Completá nombre y email."); return; }

    fetch(`${API_USUARIOS}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    })
    .then(r => {
        if (!r.ok) throw new Error("Error al crear usuario");
        return r.json();
    })
    .then(() => {
        document.getElementById("form-usuario").reset();
        alert("Usuario creado correctamente");
        listarUsuarios();
    })
    .catch(e => alert("Error al crear usuario: " + e.message));
}

function listarUsuarios() {
    fetch(API_USUARIOS)
        .then(r => {
            if (!r.ok) throw new Error("No se pudieron cargar los usuarios");
            return r.json();
        })
        .then(data => {
            const tbody = document.getElementById("tabla-usuarios");
            tbody.innerHTML = "";
            data.forEach(u => {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td>${u.id}</td><td>${u.nombre}</td><td>${u.email}</td>`;
                tbody.appendChild(fila);
            });
        })
        .catch(e => console.error("Error al listar usuarios:", e));
}
