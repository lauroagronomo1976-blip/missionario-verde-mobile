// ===== MAPA =====
let circuloGPS = null;
const map = L.map("map").setView([-15.7801, -47.9292], 5);
maxZoom: 19,
  minZoom: 5
});

// Camadas
const camadaRua = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19
  }
);
).addTo(map);

const camadaSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    maxNativeZoom: 17
  }
);

let usandoSatelite = false;

// ===== BOTÃO CAMADAS (DENTRO DO MAPA) =====
const controleCamadas = L.control({ position: "topright" });

controleCamadas.onAdd = function () {
  const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
  div.style.width = "48px";
div.style.height = "48px";
div.style.lineHeight = "48px";
div.style.fontSize = "22px";
div.style.textAlign = "center";
  div.innerHTML = "🗺️";
  div.title = "Alternar camadas";

  div.onclick = function (e) {
    L.DomEvent.stop(e);
    if (usandoSatelite) {
      map.removeLayer(camadaSatelite);
      map.addLayer(camadaRua);
      usandoSatelite = false;
    } else {
      map.removeLayer(camadaRua);
      map.addLayer(camadaSatelite);
      usandoSatelite = true;
    }
  };

  return div;
};

controleCamadas.addTo(map);

// ===== BOTÃO GPS (BOLINHA AZUL) =====
const controleGPS = L.control({ position: "topright" });

controleGPS.onAdd = function () {
  const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

  div.style.width = "48px";
  div.style.height = "48px";
  div.style.lineHeight = "48px";
  div.style.fontSize = "22px";
  div.style.textAlign = "center";

  div.innerHTML = "🎯";
  div.title = "Minha localização";

  div.onclick = function (e) {
    L.DomEvent.stop(e);

   const zoomGPS = map.hasLayer(camadaSatelite) ? 17 : 18;

map.locate()
  enableHighAccuracy: true,
  watch: false
});

  return div;
};

controleGPS.addTo(map);

// ===== EVENTO: LOCALIZAÇÃO ENCONTRADA =====
map.on("locationfound", function (e) {
  const latlng = e.latlng;

  // Define zoom seguro dependendo da camada
  let zoomSeguro;

  if (map.hasLayer(camadaSatelite)) {
    zoomSeguro = 17; // NUNCA 18 no satélite
  } else {
    zoomSeguro = 18; // Rua pode
  }

  map.flyTo(latlng, zoomSeguro, {
    animate: true,
    duration: 1.2
  });

  // Bolinha azul (localização)
  if (window.localizacaoAtual) {
    map.removeLayer(window.localizacaoAtual);
  }

  window.localizacaoAtual = L.circleMarker(latlng, {
    radius: 6,
    color: "#1e90ff",
    fillColor: "#1e90ff",
    fillOpacity: 0.9
  }).addTo(map);
});
  // Remove localização anterior
  if (circuloGPS) {
    map.removeLayer(circuloGPS);
  }

  // Bolinha azul (estilo GPS)
  circuloGPS = L.circleMarker(latlng, {
    radius: 8,
    fillColor: "#007bff",
    color: "#007bff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.7
  }).addTo(map);
});

// ===== EVENTO: ERRO DE GPS =====
map.on("locationerror", function () {
  alert("Não foi possível obter a localização GPS.");
});


