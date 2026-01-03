// MAPA
const map = L.map('map').setView([-15.8, -47.9], 5);

// CAMADAS
const rua = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { maxZoom: 19 }
);

const satelite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { maxZoom: 19 }
);

rua.addTo(map);

// FUNÇÕES
function usarRua() {
  map.removeLayer(satelite);
  rua.addTo(map);
}

function usarSatelite() {
  map.removeLayer(rua);
  satelite.addTo(map);
}

function toggleCamadas() {
  document.getElementById('menu-camadas')
    .classList.toggle('hidden');
}

function localizar() {
  map.locate({
    setView: true,
    maxZoom: 18,
    enableHighAccuracy: true
  });
}

// EVENTO DE LOCALIZAÇÃO
map.on('locationfound', function (e) {
  L.circleMarker(e.latlng, {
    radius: 8,
    color: '#136AEC',
    fillColor: '#2A93EE',
    fillOpacity: 0.7
  }).addTo(map);
});
