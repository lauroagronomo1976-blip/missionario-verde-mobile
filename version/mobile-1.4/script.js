document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // MAPA
  // =========================
  const map = L.map("map").setView([-15.78, -47.93], 5);

  const rua = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  });

  const satelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18 }
  );

  rua.addTo(map);

  // =========================
  // CONTROLES DE CAMADA
  // =========================
  let menuVisible = false;

  const menu = document.createElement("div");
  menu.className = "layer-menu";
  menu.innerHTML = `
    <div id="optRua">Rua</div>
    <div id="optSat">Satélite</div>
  `;
  document.getElementById("map-container").appendChild(menu);

  document.getElementById("btnLayers").addEventListener("click", () => {
    menuVisible = !menuVisible;
    menu.style.display = menuVisible ? "block" : "none";
  });

  document.getElementById("optRua").onclick = () => {
    map.removeLayer(satelite);
    rua.addTo(map);
    menu.style.display = "none";
    menuVisible = false;
  };

  document.getElementById("optSat").onclick = () => {
    map.removeLayer(rua);
    satelite.addTo(map);
    menu.style.display = "none";
    menuVisible = false;
  };

  // =========================
  // BOTÃO MIRA (SÓ LOCALIZA)
  // =========================
  let marcadorMira;

  document.getElementById("btnLocate").addEventListener("click", () => {
    map.locate({ setView: true, maxZoom: 17, enableHighAccuracy: true });
  });

  map.on("locationfound", (e) => {
    if (marcadorMira) map.removeLayer(marcadorMira);

    marcadorMira = L.circleMarker(e.latlng, {
      radius: 8,
      color: "#1e90ff",
      fillOpacity: 0.8
    }).addTo(map);
  });

  // =========================
  // CONTROLE DE PONTOS
  // =========================
  let pontoAtual = null;
  let pontos = [];

  const btnMarcar = document.getElementById("btnMarcarPonto");
  const btnGravar = document.getElementById("btnGravarPonto");
  const btnFinalizar = document.getElementById("btnFinalizarMissao");

  // =========================
  // MARCAR PONTO
  // =========================
  btnMarcar.addEventListener("click", () => {
    map.locate({ enableHighAccuracy: true });
  });

  map.on("locationfound", (e) => {

    if (pontoAtual && pontoAtual.marcador) {
      map.removeLayer(pontoAtual.marcador);
    }

    pontoAtual = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      inicio: new Date(),
      marcador: L.marker(e.latlng).addTo(map)
    };

    pontoAtual.marcador
      .bindPopup("📍 Ponto marcado (não gravado)")
      .openPopup();

    // mostra registro técnico
    const reg = document.getElementById("registroIndividuos");
    if (reg) reg.style.display = "block";
  });

  // =========================
  // GRAVAR PONTO
  // =========================
  btnGravar.addEventListener("click", () => {

    if (!pontoAtual) {
      alert("Marque um ponto primeiro.");
      return;
    }

    const fim = new Date();
    const duracaoMs = fim - pontoAtual.inicio;

    const segundos = Math.floor(duracaoMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const tempo = `${minutos} min ${segundos % 60} s`;

    const missao = document.getElementById("missaoInput").value || "—";

    const pontoGravado = {
      id: pontos.length + 1,
      lat: pontoAtual.lat,
      lng: pontoAtual.lng,
      missao,
      tempo,
      marcador: pontoAtual.marcador
    };

    pontoGravado.marcador.bindPopup(`
      📍 Ponto ${pontoGravado.id}<br>
      Missão: ${missao}<br>
      Lat: ${pontoGravado.lat.toFixed(6)}<br>
      Lng: ${pontoGravado.lng.toFixed(6)}<br>
      ⏱️ Tempo: ${tempo}
    `);

    pontos.push(pontoGravado);

    pontoAtual = null;

    alert("✅ Ponto gravado com sucesso!");
  });

  // =========================
  // FINALIZAR MISSÃO
  // =========================
  btnFinalizar.addEventListener("click", () => {
    if (pontos.length === 0) {
      alert("Nenhum ponto registrado.");
      return;
    }

    alert(`Missão finalizada com ${pontos.length} pontos.`);
  });

});
