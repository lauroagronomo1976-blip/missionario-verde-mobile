window.onload = function () {

  const map = L.map("map").setView([-15.8, -47.9], 5);

  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 });
  const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 });

  osm.addTo(map);
  const baseMaps = { "Rua": osm, "Satélite": sat };
  const layerControl = L.control.layers(baseMaps).addTo(map);

  setTimeout(() => { map.invalidateSize(); }, 300);

  let kmlLayer = null;
  let talhoes = [];
  let pontos = [];

  // BOTÃO GPS
  document.getElementById("btnGps").addEventListener("click", obterGPS);

  // BOTÃO MIRA MAPA
  document.getElementById("btnGpsMap").addEventListener("click", obterGPS);

  function obterGPS() {
    if (!navigator.geolocation) { alert("GPS não disponível"); return; }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;
        document.getElementById("acc").value = acc;

        if (talhoes.length === 0 || pointInPolygons([lat,lng], talhoes)) {
          map.setView([lat, lng], 18);
          L.marker([lat, lng]).addTo(map);
        } else {
          alert("Ponto fora do talhão!");
        }
      },
      function () { alert("Erro ao obter localização"); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // UPLOAD KML
  document.getElementById("kmlUpload").addEventListener("change", function(e){
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
      if (kmlLayer) map.removeLayer(kmlLayer);
      kmlLayer = omnivore.kml.parse(reader.result).on('ready', function() {
        map.fitBounds(kmlLayer.getBounds());
        talhoes = [];
        kmlLayer.eachLayer(function(l){
          if (l instanceof L.Polygon) talhoes.push(l.getLatLngs());
        });
      }).addTo(map);
    };
    reader.readAsText(file);
  });

  // FUNÇÃO PONTO DENTRO DO TALHÃO
  function pointInPolygons(latlng, polygons) {
    const pt = L.latLng(latlng[0], latlng[1]);
    return polygons.some(poly => poly.some(ring => L.Polygon.prototype.contains.call(L.polygon(ring), pt)));
  }

  // BOTÃO ADICIONAR PONTO
  document.getElementById("addPonto").addEventListener("click", function(){
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const problema = document.getElementById("problema").value;
    const quantidade = document.getElementById("quantidade").value;
    const obs = document.getElementById("obs").value;

    if (!lat || !lng) { alert("Informe a coordenada!"); return; }

    if (talhoes.length === 0 || pointInPolygons([lat,lng], talhoes)) {
      const marker = L.marker([lat,lng]).addTo(map)
        .bindPopup(`Problema: ${problema}<br>Quantidade: ${quantidade}<br>Obs: ${obs}`);
      pontos.push({lat,lng,problema,quantidade,obs});
      atualizarResumo();
    } else { alert("Ponto fora do talhão!"); }
  });

  // BOTÃO LIMPAR CAMPOS
  document.getElementById("limparCampos").addEventListener("click", function(){
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = "";
    document.getElementById("acc").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("obs").value = "";
  });

  // FUNÇÃO ATUALIZAR RESUMO
  function atualizarResumo(){
    const ul = document.getElementById("resumoPontos");
    ul.innerHTML = "";
    pontos.forEach((p, i)=>{
      const li = document.createElement("li");
      li.innerHTML = `ID ${i+1}: ${p.problema} - ${p.quantidade} unidades (${p.lat.toFixed(5)}, ${p.lng.toFixed(5)})`;
      ul.appendChild(li);
    });
  }

};
document.getElementById("btnGps").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("GPS não disponível neste aparelho.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      map.setView([lat, lng], 17);

      L.marker([lat, lng]).addTo(map)
        .bindPopup("📍 Localização atual")
        .openPopup();
    },
    () => alert("Não foi possível obter a localização.")
  );
});

