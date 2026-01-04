document.addEventListener("DOMContentLoaded", function () {

  // ===== MAPA BASE =====
  const map = L.map("map", {
    zoomControl: true,
    attributionControl: false
  }).setView([-15.7801, -47.9292], 4); // Brasil como padrão seguro

  // ===== CAMADA RUA =====
  const rua = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19
    }
  );

  // ===== CAMADA SATÉLITE =====
  const satelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19
    }
  );

  // ===== CAMADA PADRÃO =====
  rua.addTo(map);

  // ===== CONTROLE DE CAMADAS (ESTÁVEL) =====
  
