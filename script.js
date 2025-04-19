const API_BASE = "https://script.google.com/macros/s/AKfycbx6cniTeUoVFFmbV8AvcUnqecbi6IqV5d3ezNinEmhtQb5bnsY3i2RexRiqYlj0elQB-A/exec";
const CLAVE = "elviene2025";
const GUARDAR_DATOS_URL = "https://script.google.com/macros/s/AKfycbyRDDRYbkVaS-u0qzguBwXcvHbOYdl6fXc-RsDIMBFj-CEs5W_oz0KBHzCbjb4cW2UD/exec";

function mostrarSnackbar(texto) {
  const snack = document.getElementById("snackbar");
  snack.innerText = texto;
  snack.classList.add("show");
  setTimeout(() => snack.classList.remove("show"), 3000);
}

function mostrarCheckAnimado() {
  const check = document.getElementById("check-exito");
  check.classList.add("activo");
  setTimeout(() => check.classList.remove("activo"), 2500);
}

function cargarHermanos(grupo) {
  fetch(`${API_BASE}?grupo=${encodeURIComponent(grupo)}`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista-hermanos");
      lista.innerHTML = "";
      data.forEach(nombre => {
        const li = document.createElement("li");
        li.classList.add("fade-in");
        li.innerHTML = `
          <label class="item-check">
            <span>${nombre}</span>
            <div>
              <input type="checkbox" value="${nombre}" />
              ${panelActivo() ? `<button onclick="editarNombre('${nombre}')">✏️</button>
              <button onclick="eliminarNombre('${nombre}', this)">🗑️</button>` : ""}
            </div>
          </label>
        `;
        lista.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Error al cargar los nombres:", err);
      alert("No se pudieron cargar los nombres del grupo. Verifica la conexión.");
    });
}

function panelActivo() {
  return document.getElementById("clave").value === CLAVE;
}

document.getElementById("registro-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const grupo = document.getElementById('grupo').value;
  const visitas = document.getElementById('visitas').value;
  const estudios = document.getElementById('estudios').value;
  const cultos = document.getElementById('cultos').value;
  const cartas = document.getElementById('cartas').value;
  const inscripciones = document.getElementById('inscripciones').value;
  const alumnos = document.getElementById('alumnos').value;
  const traidas = document.getElementById('traidas').value;
  const auxilio = document.getElementById('auxilio').value;
  const contactos = document.getElementById('contactos').value;
  const libros = document.getElementById('libros').value;
  const folletos = document.getElementById('folletos').value;
  const medico = document.getElementById('medico').value;
  const enfermos = document.getElementById('enfermos').value;
  const faltantes = [...document.querySelectorAll('#lista-hermanos input:checked')]
    .map(cb => cb.value)
    .join(', ');

  const hoy = new Date().toLocaleDateString('es-BO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mensaje = `📋 *Reporte Escuela Sabática - ${grupo}*
🗓️ Fecha: ${hoy}

1️⃣ Visitas Misioneras: ${visitas}
2️⃣ Estudios Bíblicos: ${estudios}
3️⃣ Cultos con Hnos. o interesados: ${cultos}
4️⃣ Cartas misioneras o E-MAIL: ${cartas}
5️⃣ Inscripciones a Cursos Bíblicos: ${inscripciones}
6️⃣ Alumnos Atendidos: ${alumnos}
7️⃣ Personas traídas a la Iglesia: ${traidas}
8️⃣ Personas auxiliadas: ${auxilio}
9️⃣ Contactos Misioneros: ${contactos}
🔟 Libros prestados o regalados: ${libros}
📚 Volantes distribuidos: ${folletos}
🩺 Obra médico misionera: ${medico}
🏥 Visitas a Enfermos: ${enfermos}
🚫 No asistieron: ${faltantes || 'Ninguno'}`;

  // WhatsApp
  const whatsappURL = `https://api.whatsapp.com/send?phone=59177824576&text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');

  // Guardar en Google Sheet
  fetch(GUARDAR_DATOS_URL, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grupo,
      visitas,
      estudios,
      cultos,
      cartas,
      inscripciones,
      alumnos,
      traidas,
      auxilio,
      contactos,
      libros,
      folletos,
      medico,
      enfermos,
      faltantes
    })
  });

  mostrarCheckAnimado();
  mostrarSnackbar("¡Registro enviado a WhatsApp y guardado!");

  this.reset();
  document.getElementById("lista-hermanos").innerHTML = "";
  document.getElementById("admin-panel").style.display = "none";
});

function agregarNombre() {
  const grupo = document.getElementById("grupo").value;
  const nombre = document.getElementById("nuevo-nombre").value;
  if (!nombre || !grupo) return alert("Debe ingresar un nombre y seleccionar un grupo");

  fetch(API_BASE, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      accion: "agregar",
      grupo,
      nuevo: nombre,
      clave: CLAVE
    })
  })
    .then(res => res.text())
    .then(msg => {
      mostrarSnackbar(msg);
      document.getElementById("nuevo-nombre").value = "";
      cargarHermanos(grupo);
    });
}

function eliminarNombre(nombre, boton) {
  const grupo = document.getElementById("grupo").value;
  if (!confirm(`¿Eliminar a ${nombre}?`)) return;

  fetch(API_BASE, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      accion: "eliminar",
      grupo,
      nombre,
      clave: CLAVE
    })
  })
    .then(res => res.text())
    .then(msg => {
      mostrarSnackbar(msg);
      const li = boton.closest("li");
      if (li) li.classList.add("fade-out");
      setTimeout(() => cargarHermanos(grupo), 400);
    });
}

function editarNombre(nombreAnterior) {
  const nuevo = prompt("Editar nombre:", nombreAnterior);
  if (!nuevo || nuevo === nombreAnterior) return;
  const grupo = document.getElementById("grupo").value;

  fetch(API_BASE, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      accion: "editar",
      grupo,
      anterior: nombreAnterior,
      nuevo,
      clave: CLAVE
    })
  })
    .then(res => res.text())
    .then(msg => {
      mostrarSnackbar(msg);
      cargarHermanos(grupo);
    });
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  const claveInput = document.getElementById("clave");
  const btnValidar = document.getElementById("btn-validar-clave");
  const bloqueClave = document.getElementById("bloque-clave");
  const bloqueAusentes = document.getElementById("bloque-ausentes");
  const panelAdmin = document.getElementById("admin-panel");
  const selectGrupo = document.getElementById("grupo");

  if (selectGrupo) {
    selectGrupo.addEventListener("change", function () {
      const mostrar = !!this.value;
      bloqueClave.style.display = mostrar ? "block" : "none";
      bloqueAusentes.style.display = mostrar ? "block" : "none";
      panelAdmin.style.display = "none";
      document.getElementById("lista-hermanos").innerHTML = "";
      if (mostrar) cargarHermanos(this.value);
    });
  }

  if (btnValidar) {
    btnValidar.addEventListener("click", function () {
      const valorClave = claveInput.value.trim();
      if (valorClave === CLAVE) {
        panelAdmin.style.display = "block";
        mostrarSnackbar("✅ Acceso concedido.");
        const grupo = selectGrupo.value;
        if (grupo) cargarHermanos(grupo);
      } else {
        panelAdmin.style.display = "none";
        mostrarSnackbar("❌ Contraseña incorrecta.");
        claveInput.value = "";
      }
    });
  }
});

