import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const imei = params.get('imei');
  const token = params.get('token');

  if (!imei || !token) return;

  await registrarEvento(imei, 'bloqueo_mostrado');

  // Verificar si el estado cambió
  const { data, error } = await supabase
    .from('dispositivos')
    .select('estado')
    .eq('imei', imei)
    .eq('token', token)
    .single();

  if (data && data.estado === 'activo') {
    window.location.href = cliente.html?imei=${imei}&token=${token};
  }
});

async function registrarEvento(imei, tipo) {
  await supabase.from('eventos').insert([
    {
      imei,
      tipo,
      timestamp: new Date().toISOString()
    }
  ]);
}

async function validarcodigolocal(codigoIngresado) {
  const imei = localStorage.getItem("imei");
  const codigosCache = JSON.parse(localStorage.getItem("codigos_desbloqueo") || "[]");

  const codigoValido = codigosCache.find(c => 
    c.codigo === codigoIngresado && 
    c.imei === imei && 
    c.usado === false
  );

  if (codigoValido) {
    // Desbloqueo local
    localStorage.setItem("estado", "activo");
    codigoValido.usado = true;
    localStorage.setItem("codigos_desbloqueo", JSON.stringify(codigosCache));

    // Sincronización futura
    localStorage.setItem("evento_desbloqueo_pendiente", JSON.stringify({
      imei,
      codigo: codigoIngresado,
      fecha: new Date().toISOString()
    }));

    window.location.href = "cliente.html";
  } else {
    alert("Código inválido o ya usado.");
  }
}