function ahora() {
  return new Date().toISOString();
}

async function verificarEstado(imei) {
  const { data, error } = await supabase
    .from("dispositivos")
    .select("estado")
    .eq("imei", imei)
    .single();

  if (error) {
    console.error("Error al verificar estado:", error);
    return;
  }

  if (data && data.estado === "bloqueado") {
    window.location.href = "bloqueo.html";
  }
}

async function registrar() {
  const imei = document.getElementById("imei").value.trim();
  const token = document.getElementById("token").value.trim();
  const resultado = document.getElementById("resultado");

await verificarEstado(imei);

  if (!imei || !token) {
    resultado.textContent = "❌ Completa los dos campos";
    return;
  }

  if (!/^\d{15}$/.test(imei)) {
    resultado.textContent = "❌ IMEI inválido (15 dígitos)";
    return;
  }

  const { data: existe } = await supabase
    .from("dispositivos")
    .select("id")
    .eq("imei", imei)
    .single();

  if (existe) {
    resultado.textContent = "⚠️ Este dispositivo ya está registrado";
    return;
  }

  await supabase.from("dispositivos").insert({
    imei,
    token,
    estado: "activo",
    fecha_instalacion: ahora(),
  });

  await supabase.from("eventos_dispositivo").insert({
  imei,
  tipo: "instalacion",
  fecha: ahora(),
});

  resultado.textContent = "✅ Registro exitoso";
  console.log("📦 Registro creado:", { imei, token });
}