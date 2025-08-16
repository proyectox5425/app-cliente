import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const imei = params.get('imei');
  const token = params.get('token');

  if (!imei || !token) {
    showError('Faltan parámetros en la URL');
    return;
  }

  const { data, error } = await supabase
    .from('dispositivos')
    .select('*')
    .eq('imei', imei)
    .eq('token', token)
    .single();

  if (error || !data) {
    showError('Dispositivo no encontrado o token inválido');
    return;
  }

  renderEstado(data);
  registrarEvento(imei, 'cliente_abierto');

  // Si está bloqueado, redirigir
  if (data.estado === 'bloqueado') {
    window.location.href = bloqueo.html?imei=${imei}&token=${token};
  }
});

function renderEstado(dispositivo) {
  const estadoDiv = document.getElementById('estado');
  estadoDiv.innerHTML = `
    <h2>Estado: ${dispositivo.estado}</h2>
    <p>Cuotas disponibles: ${dispositivo.cuotas ?? 'N/A'}</p>
  `;
}

async function registrarEvento(imei, tipo) {
  await supabase.from('eventos').insert([
    {
      imei,
      tipo,
      timestamp: new Date().toISOString()
    }
  ]);
}

function showError(msg) {
  const estadoDiv = document.getElementById('estado');
  estadoDiv.innerHTML = <p style="color:red;">${msg}</p>;
}