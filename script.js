const API_BASE = "https://script.google.com/macros/s/AKfycbw79TRHoNmZzHJ06V3H9_3us97wjMg447QDK0wJ-asgXkoDFGJnHadBbAmqDdet27uMRw/exec"; // Reemplaza con tu URL si cambia

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
            ${nombre}
            <input type="checkbox" value="${nombre}" />
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
8️⃣ Personas auxiliadas (comida, dinero, ropa, etc.): ${auxilio}
9️⃣ Contactos Misioneros: ${contactos}
🔟 Libros prestados o regalados: ${libros}
📚 Volantes o folletos distribuidos: ${folletos}
🩺 Obra médico Misionera: ${medico}
🏥 Visitas a Enfermos: ${enfermos}
🚫 No asistieron: ${faltantes || 'Ninguno'}`;

  const whatsappURL = `https://wa.me/59177824576?text=${encodeURIComponent(mensaje)}`;

  window.open(whatsappURL, '_blank');

  document.getElementById('resultado').innerText = '¡Registro enviado a WhatsApp!';
  this.reset();
  document.getElementById("lista-hermanos").innerHTML = "";
});
