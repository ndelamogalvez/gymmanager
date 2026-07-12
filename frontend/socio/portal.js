const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');
const nombre = localStorage.getItem('nombre');

if (!token) window.location.href = '../login.html';

document.getElementById('saludo').textContent = `Hola, ${nombre}`;

document.getElementById('logout').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../login.html';
});

async function cargarClases() {
  try {
    const res = await fetch(`${API_URL}/clases`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const clases = await res.json();

    const contenedor = document.getElementById('listaClases');
    contenedor.innerHTML = '';
    clases.forEach(c => {
      const div = document.createElement('div');
      div.className = 'clase-card';
      div.innerHTML = `
        <div>
          <strong>${c.nombre}</strong> — ${c.dia_semana} ${c.hora_inicio || ''} a ${c.hora_fin || ''}
          <br><small>Entrenador: ${c.entrenador || 'Sin asignar'} — Aforo: ${c.aforo_max}</small>
        </div>
        <button class="reservar" data-id="${c.id}">Reservar</button>
      `;
      contenedor.appendChild(div);
    });

    document.querySelectorAll('.reservar').forEach(btn => {
      btn.addEventListener('click', () => reservarClase(btn.dataset.id));
    });
  } catch (err) {
    console.error('Error cargando clases:', err);
  }
}

async function reservarClase(clase_id) {
  const fecha_reserva = new Date().toISOString().split('T')[0];
  try {
    const res = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ clase_id, fecha_reserva })
    });
    if (res.ok) {
      alert('¡Reserva realizada!');
      cargarReservas();
    } else {
      const data = await res.json();
      alert(data.error || 'Error al reservar');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

async function cargarReservas() {
  try {
    const res = await fetch(`${API_URL}/reservas/mias`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const reservas = await res.json();

    const tbody = document.getElementById('tablaReservas');
    tbody.innerHTML = '';
    reservas.forEach(r => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${r.clase}</td>
        <td>${r.hora_inicio || ''} - ${r.hora_fin || ''}</td>
        <td>${new Date(r.fecha_reserva).toLocaleDateString('es-ES')}</td>
        <td>${r.estado}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error cargando reservas:', err);
  }
}

cargarClases();
cargarReservas();