// ================= MAPA =================
const map = L.map("map", {
  zoomControl: true
}).setView([-15.78, -47.93], 13);

// ================= CAMADAS BASE =================

// Mapa de Rua (OpenStreetMap)
const rua = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }
);

// Satélite (Esri)
const satelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: "Esri"
  }
);

// >>> IMPORTANTE: adiciona uma camada inicial
rua.addTo(map);

// ================= CONTROLE DE CAMADAS =================
const baseMaps = {
  "Rua": rua,
  "Satélite": satelite
};

L.control.layers(baseMaps, null, {
  position: "topright",
  collapsed: true
}).addTo(map);

// ================= BOTÃO MIRA (GPS) =================
const gpsControl = L.control({ position: "topright" });

gpsControl.onAdd = function () {
  const div = L.DomUtil.create("div", "gps-button leaflet-bar");
  div.innerHTML = "📍";

  div.style.background = "#ffffff";
  div.style.width = "42px";
  div.style.height = "42px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.cursor = "pointer";
  div.style.fontSize = "20px";

  // Evita conflito com o mapa
  L.DomEvent.disableClickPropagation(div);

  div.onclick = () => {
    map.locate({
      setView: true,
      maxZoom: 17
    });
  };

  return div;
};

gpsControl.addTo(map);

// ================= EVENTO DE LOCALIZAÇÃO =================
map.on("locationfound", function (e) {
  L.circleMarker(e.latlng, {
    radius: 6,
    color: "#1976d2",
    fillColor: "#1976d2",
    fillOpacity: 0.9
  }).addTo(map);
});

map.on("locationerror", function () {
  alert("Não foi possível obter a localização.");
});
