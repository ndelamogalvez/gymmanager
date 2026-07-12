const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');
const nombre = localStorage.getItem('nombre');

if (!token) {
  window.location.href = 'login.html';
}

document.getElementById('saludo').textContent = `Hola, ${nombre} (${rol})`;

if (rol === 'admin' || rol === 'entrenador') {
  document.getElementById('adminOnly').style.display = 'block';
}

document.getElementById('logout').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

async function cargarSocios() {
  try {
    const res = await fetch(`${API_URL}/socios`);
    const socios = await res.json();

    const tbody = document.getElementById('tablaSocios');
    tbody.innerHTML = '';
    socios.forEach(s => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${s.id}</td>
        <td>${s.nombre}</td>
        <td>${s.apellido}</td>
        <td>${s.telefono || '-'}</td>
        <td>${new Date(s.fecha_alta).toLocaleDateString('es-ES')}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error cargando socios:', err);
  }
}

const form = document.getElementById('nuevoSocioForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const fecha_alta = document.getElementById('fecha_alta').value;

    try {
      const res = await fetch(`${API_URL}/socios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, apellido, telefono, fecha_alta })
      });

      if (res.ok) {
        form.reset();
        cargarSocios();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al crear socio');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  });
}

cargarSocios();