document.addEventListener("DOMContentLoaded", function () {
console.log("JS carregado");
 console.log("Marcar:", document.getElementById("btnMarcarPonto"));
 console.log("Gravar:", document.getElementById("btnGravarPonto"));
 console.log("Finalizar:", document.getElementById("btnFinalizarMissao")); 
 
  /************** MAPA **************/
  const map = L.map("map").setView([-15.78, -47.93], 5);

  const rua = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 19 }
  );

  const satelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18 }
  );

  rua.addTo(map);

/ ==========================
// ESTADO DO MAPA
// ==========================
let marcadorTemporario = null;
let pontosRegistrados = [];
 
 /************** BOTÕES DO MAPA **************/
  document.getElementById("btnLayers").onclick = () => {
    if (map.hasLayer(rua)) {
      map.removeLayer(rua);
      satelite.addTo(map);
    } else {
      map.removeLayer(satelite);
      rua.addTo(map);
    }
  };

  document.getElementById("btnLocate").addEventListener("click", () => {
  map.locate({
    setView: true,
    maxZoom: 17,
    enableHighAccuracy: true
  });
});
  
 // ==========================
// BOTÃO MARCAR (PONTO TEMPORÁRIO)
// ==========================
const btnMarcarPonto = document.getElementById("btnMarcarPonto");

if (btnMarcarPonto) {
  btnMarcarPonto.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("GPS não disponível.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Remove ponto temporário anterior
        if (marcadorTemporario) {
          map.removeLayer(marcadorTemporario);
        }

        // Cria novo ponto temporário
        marcadorTemporario = L.marker([lat, lng]).addTo(map);

        marcadorTemporario.bindPopup("📍 Ponto marcado (não gravado)");
      },
      () => {
        alert("Erro ao obter localização.");
      },
      { enableHighAccuracy: true }
    );
  });
}
// ==========================
// BOTÃO GRAVAR PONTO
// ==========================
const btnGravarPonto = document.getElementById("btnGravarPonto");

if (btnGravarPonto) {
  btnGravarPonto.addEventListener("click", () => {
    if (!marcadorTemporario) {
      alert("Marque um ponto antes de gravar.");
      return;
    }

    const missao = document.getElementById("missaoInput")?.value || "Sem missão";
    const latlng = marcadorTemporario.getLatLng();

    const ponto = {
      id: pontosRegistrados.length + 1,
      missao: missao,
      lat: latlng.lat,
      lng: latlng.lng,
      data: new Date().toLocaleString()
    };

    pontosRegistrados.push(ponto);

    marcadorTemporario.bindPopup(
      `<strong>Ponto ${ponto.id}</strong><br>
       Missão: ${ponto.missao}<br>
       Lat: ${ponto.lat.toFixed(6)}<br>
       Lng: ${ponto.lng.toFixed(6)}`
    ).openPopup();

    marcadorTemporario = null;

    alert("Ponto gravado com sucesso!");
  });
 
 btnGravar.onclick = () => {
    if (!ultimoPonto) {
      alert("Marque um ponto antes.");
      return;
    }

    ultimoPonto.bindPopup("📌 Ponto gravado");
    ultimoPonto = null;

    alert("Ponto salvo com sucesso!");
  };

  btnFinalizar.onclick = () => {
    alert("🏁 Missão finalizada");
  };

});
