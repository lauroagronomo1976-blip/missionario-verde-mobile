console.log("🟢 REGISTRO – MAPA PURO ATIVO");

// ===============================
// MAPA
// ===============================
const map = L.map("map").setView([-15.78, -47.93], 5);

// Camadas
const camadaRua = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { maxZoom: 19 }
).addTo(map);

const camadaSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19 }
);

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
  } else {
    map.removeLayer(camadaRua);
    camadaSatelite.addTo(map);
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
