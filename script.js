// MAPA
const map = L.map("map").setView([-15.78, -47.93], 14);

// CAMADAS
const rua = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

const satelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19 }
);

L.control.layers(
  { Rua: rua, Satélite: satelite },
  null,
  { position: "topright" }
).addTo(map);

// BOTÃO MIRA (GPS) – estilo Fields
const gpsControl = L.control({ position: "topright" });

gpsControl.onAdd = function () {
  const div = L.DomUtil.create("div", "gps-button");
  div.innerHTML = "📍";
  div.style.background = "#fff";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.cursor = "pointer";

  div.onclick = () => {
    map.locate({ setView: true, maxZoom: 17 });
  };

  return div;
};

gpsControl.addTo(map);

// MOSTRA LOCALIZAÇÃO
map.on("locationfound", (e) => {
  L.circleMarker(e.latlng, {
    radius: 6,
    color: "blue",
    fillColor: "blue",
    fillOpacity: 0.8
  }).addTo(map);
});
