const hojasGrupo = {
  "Grupo 1": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTval85fAyOcwqmD5etcelAdYqo0a5WsQUP5ZQB0HAuRD1NabKs_hfevFAgOF8r-Yh1CWsgpQfOGxH6/pub?gid=0&single=true&output=csv",
  "Grupo 2": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTval85fAyOcwqmD5etcelAdYqo0a5WsQUP5ZQB0HAuRD1NabKs_hfevFAgOF8r-Yh1CWsgpQfOGxH6/pub?gid=1280824297&single=true&output=csv",
  "Grupo 3": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTval85fAyOcwqmD5etcelAdYqo0a5WsQUP5ZQB0HAuRD1NabKs_hfevFAgOF8r-Yh1CWsgpQfOGxH6/pub?gid=249553127&single=true&output=csv",
  "Grupo 4": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTval85fAyOcwqmD5etcelAdYqo0a5WsQUP5ZQB0HAuRD1NabKs_hfevFAgOF8r-Yh1CWsgpQfOGxH6/pub?gid=1779055312&single=true&output=csv",
  "Grupo 5": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTval85fAyOcwqmD5etcelAdYqo0a5WsQUP5ZQB0HAuRD1NabKs_hfevFAgOF8r-Yh1CWsgpQfOGxH6/pub?gid=1668958024&single=true&output=csv"
};

function cargarHermanos(grupo) {
  const url = hojasGrupo[grupo];
  if (!url) return;

  fetch(url)
    .then(res => res.text())
    .then(data => {
      const lineas = data.split("\n").slice(1);
      const lista = document.getElementById("lista-hermanos");
      lista.innerHTML = "";

      lineas.forEach(linea => {
        const nombre = linea.trim();
        if (nombre) {
          const li = document.createElement("li");
          li.innerHTML = \`
            <label style="display:flex; justify-content:space-between; align-items:center;">
              \${nombre}
              <input type="checkbox" value="\${nombre}" />
            </label>
          \`;
          lista.appendChild(li);
        }
      });
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

  const mensaje = \`📋 *Reporte Escuela Sabática - \${grupo}*\n\n➡️ Visitas Misioneras: \${visitas}\n📖 Estudios Bíblicos: \${estudios}\n📚 Literatura Distribuida: \${literatura}\n🫂 Personas Auxiliadas: \${auxilio}\n🏥 Visitas a Enfermos: \${enfermos}\n🏠 Personas a la Iglesia: \${traidas}\n🚫 No asistieron: \${faltantes || 'Ninguno'}\`;

  const whatsappURL = \`https://wa.me/?text=\${encodeURIComponent(mensaje)}\`;
  window.open(whatsappURL, '_blank');

  document.getElementById('resultado').innerText = '¡Registro enviado a WhatsApp!';
  this.reset();
  document.getElementById("lista-hermanos").innerHTML = "";
});