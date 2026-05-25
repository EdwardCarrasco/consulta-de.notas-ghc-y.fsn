// js/buscar.js - Búsqueda segura en GitHub Pages

document.getElementById('formularioBusqueda').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const cedulaInput = document.getElementById('cedula').value.trim();
  const cedulaNormalizada = normalizarCedula(cedulaInput);
  
  mostrarCargando();
  
  try {
    // Cargar datos desde JSON (en GitHub Pages)
    const response = await fetch('datos/notas.json');
    if (!response.ok) throw new Error('Error al cargar datos');
    
    const datos = await response.json();
    const estudiante = buscarEstudiante(datos.estudiantes, cedulaNormalizada);
    
    if (estudiante) {
      mostrarResultado(estudiante);
    } else {
      mostrarError('❌ Cédula no encontrada. Verifica el número o contacta al docente.');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarError('⚠️ Error de conexión. Intenta más tarde.');
  }
});

// Normalizar cédula: eliminar puntos, guiones, espacios y "V"
function normalizarCedula(cedula) {
  return cedula.toUpperCase().replace(/[^0-9V]/g, '').replace(/^V/, '');
}

// Buscar estudiante por cédula exacta
function buscarEstudiante(lista, cedulaBuscada) {
  return lista.find(est => 
    est.cedula.replace(/[^0-9]/g, '') === cedulaBuscada.replace(/[^0-9]/g, '')
  );
}

// Mostrar resultado formateado
function mostrarResultado(est) {
  const resultado = document.getElementById('resultado');
  const notaTexto = est.nota !== null ? `${est.nota}/20` : 'Pendiente';
  const mensaje = obtenerMensajeMotivacional(est.nota);
  
  resultado.innerHTML = `
    <div class="tarjeta-resultado">
      <h3>🎓 Resultado de Consulta</h3>
      <p><strong>🆔 Cédula:</strong> V-${formatoCedula(est.cedula)}</p>
      <p><strong>👤 Estudiante:</strong> ${est.nombre}</p>
      <p><strong>📚 Grado/Sección:</strong> ${est.grado} - ${est.seccion}</p>
      <p><strong>📝 Actividad:</strong> ACTIVIDAD PRÁCTICA (FORMULARIO)</p>
      <p><strong>⭐ Nota:</strong> ${notaTexto}</p>
      <p><strong>💬 ${mensaje}</strong></p>
      <hr>
      <small>🔒 Consulta realizada el ${new Date().toLocaleDateString('es-VE')}</small>
    </div>
  `;
  
  resultado.classList.remove('oculto');
  document.getElementById('mensajeError').classList.add('oculto');
}

// Mensajes motivacionales según nota
function obtenerMensajeMotivacional(nota) {
  if (nota === null) return "Nota pendiente de carga. Consulta al docente.";
  if (nota >= 16) return "¡Excelente! Continúa con ese compromiso revolucionario 🌟";
  if (nota >= 12) return "¡Muy bien! Puedes mejorar con un poco más de práctica 💪";
  return "No te desanimes. Revisa los contenidos y consulta al docente 📚";
}

// Formatear cédula con puntos: 34667882 → 34.667.882
function formatoCedula(cedula) {
  const num = cedula.replace(/[^0-9]/g, '');
  if (num.length === 8) return `${num.slice(0,2)}.${num.slice(2,5)}.${num.slice(5)}`;
  return num;
}

// Funciones auxiliares de UI
function mostrarCargando() {
  document.getElementById('resultado').classList.add('oculto');
  document.getElementById('mensajeError').classList.add('oculto');
}

function mostrarError(mensaje) {
  const errorDiv = document.getElementById('mensajeError');
  errorDiv.textContent = mensaje;
  errorDiv.classList.remove('oculto');
  document.getElementById('resultado').classList.add('oculto');
}