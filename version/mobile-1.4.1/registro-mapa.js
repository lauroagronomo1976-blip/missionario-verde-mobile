console.log("🟢 REGISTRO – MAPA PURO ATIVO");

let map; // mapa global e único

// ===============================
// MAPA
// ===============================
if (!map) {
  map = L.map("map").setView([-15.78, -47.93], 5);
}

// CAMADA RUA (INICIAL)
const camadaRua = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { maxZoom: 19 }
).addTo(map);

// CAMADA SATÉLITE (NÃO adiciona ainda)
const camadaSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19 }
);

setTimeout(() => {
  map.invalidateSize();
  console.log("🛡️ invalidateSize aplicado");
}, 200);

// CONTROLE
let usandoSatelite = false;

// ===============================
// ESTADO
// ===============================
let marcadorAtual = null;

// ===============================
// BOTÕES
// ===============================
const btnMarcar = document.getElementById("btnMarcar");
const btnLocate = document.getElementById("btnLocate");
const btnLayers = document.getElementById("btnLayers");

btnMarcarPonto.addEventListener("click", () => {
  if (modoCriarPonto) return;

  modoCriarPonto = true;
  map.locate({ enableHighAccuracy: true });

  console.log("📍 Modo marcar ponto ATIVO");
});

// ===============================
// MARCAR PONTO
// ===============================
btnMarcar.addEventListener("click", () => {
  map.locate({ enableHighAccuracy: true });
});

// ===============================
// LOCALIZAR
// ===============================
btnLocate.addEventListener("click", () => {
  map.locate({ enableHighAccuracy: true });
});

btnLayers.addEventListener("click", () => {
  if (usandoSatelite) {
    map.removeLayer(camadaSatelite);
    camadaRua.addTo(map);
    console.log("🗺️ Rua ON");
  } else {
    map.removeLayer(camadaRua);
    camadaSatelite.addTo(map);
    console.log("🛰️ Satélite ON");
  }

  usandoSatelite = !usandoSatelite;
});

// ===============================
// EVENTO GPS
// ===============================
map.on("locationfound", (e) => {
  map.setView(e.latlng, 17);

  if (marcadorAtual) {
    map.removeLayer(marcadorAtual);
  }

  marcadorAtual = L.marker(e.latlng).addTo(map);
  marcadorAtual.bindPopup("📍 Ponto marcado").openPopup();

  // salva ponto no storage
  localStorage.setItem("pontoAtual", JSON.stringify({
    lat: e.latlng.lat,
    lng: e.latlng.lng,
    data: new Date().toISOString()
  }));

  console.log("📍 Ponto salvo:", e.latlng);
});

// ===============================
// ERRO GPS
// ===============================
map.on("locationerror", () => {
  alert("Não foi possível obter localização");
});

map.on("locationfound", (e) => {
  if (!modoCriarPonto) return;

  modoCriarPonto = false;

  map.setView(e.latlng, 17);

  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("📍 Ponto marcado")
    .openPopup();

  console.log("✅ Ponto criado com sucesso");
});
