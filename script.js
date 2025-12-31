// ===== CAMADAS =====

// Mapa de ruas (OpenStreetMap)
const camadaRua = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }
);

// Mapa Satélite (Esri)
const camadaSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    maxNativeZoom: 17,
    attribution: "Esri"
  }
);

// ===== MAPA =====
const map = L.map("map", {
  center: [-15.5, -55.5], // Brasil
  zoom: 5,
  layers: [camadaRua]
});

// Controle de camadas
L.control.layers(
  {
    "Rua": camadaRua,
    "Satélite": camadaSatelite
  },
  {},
  { position: "topright" }
).addTo(map);

// ===== BOTÃO GPS (estilo FieldsArea) =====
const botaoGPS = L.control({ position: "topright" });

botaoGPS.onAdd = function () {
  const div = L.DomUtil.create("div", "leaflet-control leaflet-bar gps-btn");

  div.innerHTML = `
    <div class="gps-alvo"></div>
  `;

  div.title = "Minha localização";

  div.onclick = function () {
    div.classList.add("gps-ativo");
    setTimeout(() => div.classList.remove("gps-ativo"), 600);

    map.locate({ enableHighAccuracy: true });
  };

  return div;
};

botaoGPS.addTo(map);
// ===== EVENTOS GPS =====
let marcadorLocalizacao = null;

map.on("locationfound", function (e) {
  const latlng = e.latlng;

  const zoomSeguro = map.hasLayer(camadaSatelite) ? 17 : 18;
  map.flyTo(latlng, zoomSeguro);

  if (marcadorLocalizacao) {
    map.removeLayer(marcadorLocalizacao);
  }

  marcadorLocalizacao = L.circleMarker(latlng, {
    radius: 6,
    color: "#1e90ff",
    fillColor: "#1e90ff",
    fillOpacity: 0.9
  }).addTo(map);
});

map.on("locationerror", function () {
  alert("Não foi possível acessar o GPS.");
});

