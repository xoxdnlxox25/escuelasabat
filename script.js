// ✅ Pega aquí tu URL de Google Apps Script 👇
const API_BASE = "https://script.google.com/macros/s/AKfycbw79TRHoNmZzHJ06V3H9_3us97wjMg447QDK0wJ-asgXkoDFGJnHadBbAmqDdet27uMRw/exec";

function cargarHermanos(grupo) {
  fetch(`${API_BASE}?grupo=${encodeURIComponent(grupo)}`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista-hermanos");
      lista.innerHTML = "";

      data.forEach(nombre => {
        const li = document.createElement("li");
        li.innerHTML = `
          <label style="display:flex; justify-content:space-between; align-items:center;">
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
  const literatura = document.getElementById('literatura').value;
  const auxilio = document.getElementById('auxilio').value;
  const enfermos = document.getElementById('enfermos').value;
  const traidas = document.getElementById('traidas').value;

  const faltantes = [...document.querySelectorAll('#lista-hermanos input:checked')]
    .map(cb => cb.value)
    .join(', ');

  const mensaje = `📋 *Reporte Escuela Sabática - ${grupo}*\n\n➡️ Visitas Misioneras: ${visitas}\n📖 Estudios Bíblicos: ${estudios}\n📚 Literatura Distribuida: ${literatura}\n🫂 Personas Auxiliadas: ${auxilio}\n🏥 Visitas a Enfermos: ${enfermos}\n🏠 Personas a la Iglesia: ${traidas}\n🚫 No asistieron: ${faltantes || 'Ninguno'}`;

  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');

  document.getElementById('resultado').innerText = '¡Registro enviado a WhatsApp!';
  this.reset();
  document.getElementById("lista-hermanos").innerHTML = "";
});
