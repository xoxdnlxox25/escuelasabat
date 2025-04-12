// script.js
const API_BASE = "https://script.google.com/macros/s/AKfycbx6cniTeUoVFFmbV8AvcUnqecbi6IqV5d3ezNinEmhtQb5bnsY3i2RexRiqYlj0elQB-A/exec";
const CLAVE = "elviene2025";

function cargarHermanos(grupo) {
  fetch(`${API_BASE}?grupo=${encodeURIComponent(grupo)}`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista-hermanos");
      lista.innerHTML = "";

      data.forEach(nombre => {
        const li = document.createElement("li");
        li.innerHTML = `
          <label class="item-check">
            <span>${nombre}</span>
            <div>
              <input type="checkbox" value="${nombre}" />
              ${panelActivo() ? `<button onclick="editarNombre('${nombre}')">✏️</button>
              <button onclick="eliminarNombre('${nombre}')">🗑️</button>` : ""}
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

document.getElementById("grupo").addEventListener("change", function () {
  cargarHermanos(this.value);
});

document.getElementById("clave").addEventListener("input", function () {
  const claveIngresada = this.value;
  const panel = document.getElementById("admin-panel");
  if (claveIngresada === CLAVE) {
    panel.style.display = "block";
    cargarHermanos(document.getElementById("grupo").value);
  } else {
    panel.style.display = "none";
    cargarHermanos(document.getElementById("grupo").value);
  }
});

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

  const whatsappURL = `https://api.whatsapp.com/send?phone=59177824576&text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');

  document.getElementById('resultado').innerText = '¡Registro enviado a WhatsApp!';
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
    body: `accion=agregar&grupo=${grupo}&nuevo=${nombre}&clave=${CLAVE}`
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      document.getElementById("nuevo-nombre").value = "";
      cargarHermanos(grupo);
    });
}

function eliminarNombre(nombre) {
  const grupo = document.getElementById("grupo").value;
  if (!confirm(`¿Eliminar a ${nombre}?`)) return;

  fetch(API_BASE, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `accion=eliminar&grupo=${grupo}&nombre=${nombre}&clave=${CLAVE}`
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      cargarHermanos(grupo);
    });
}

function editarNombre(nombreAnterior) {
  const nuevo = prompt("Editar nombre:", nombreAnterior);
  if (!nuevo || nuevo === nombreAnterior) return;
  const grupo = document.getElementById("grupo").value;

  fetch(API_BASE, {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `accion=editar&grupo=${grupo}&anterior=${nombreAnterior}&nuevo=${nuevo}&clave=${CLAVE}`
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      cargarHermanos(grupo);
    });
}
