/*************************************************
 * VARIÁVEIS GLOBAIS (NÃO MEXER NA ORDEM)
 *************************************************/
let map;
let rua, satelite;
let userMarker = null;

let pontoTemporario = null;
let pontosRegistrados = [];
let missaoAtiva = true;

/*************************************************
 * MAPA – SEMPRE DENTRO DO DOMContentLoaded
 *************************************************/
document.addEventListener("DOMContentLoaded", function () {

  // ===== MAPA BASE =====
  map = L.map("map", {
    zoomControl: true
  }).setView([-15.78, -47.93], 5);

  // ===== CAMADA RUA =====
  rua = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 19 }
  ).addTo(map);

  // ===== CAMADA SATÉLITE =====
  satelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18 }
  );

  // ===== MENU PERSONALIZADO DE CAMADAS =====
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

  document.getElementById("optRua").addEventListener("click", () => {
    map.removeLayer(satelite);
    rua.addTo(map);
    menu.style.display = "none";
    menuVisible = false;
  });

  document.getElementById("optSat").addEventListener("click", () => {
    map.removeLayer(rua);
    satelite.addTo(map);
    menu.style.display = "none";
    menuVisible = false;
  });

  // ===== BOTÃO MIRA / LOCALIZAÇÃO =====
  document.getElementById("btnLocate").addEventListener("click", () => {
    map.locate({
      setView: true,
      maxZoom: 17,
      enableHighAccuracy: true
    });
  });

  map.on("locationfound", (e) => {
    if (userMarker) map.removeLayer(userMarker);

    userMarker = L.circleMarker(e.latlng, {
      radius: 7,
      color: "#1e90ff",
      fillColor: "#1e90ff",
      fillOpacity: 0.8
    }).addTo(map);
  });

  map.on("locationerror", () => {
    alert("Não foi possível acessar a localização.");
  });

});

/*************************************************
 * BOTÃO MARCAR (GPS → ponto temporário)
 *************************************************/
document.getElementById("btnMarcarPonto").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("GPS não disponível neste dispositivo.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      pontoTemporario = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      map.setView([pontoTemporario.lat, pontoTemporario.lng], 17);
    },
    () => alert("Erro ao obter localização."),
    { enableHighAccuracy: true }
  );
});

/*************************************************
 * BOTÃO GRAVAR PONTO (CONFIRMA O PONTO)
 *************************************************/
document.getElementById("btnGravarPonto").addEventListener("click", () => {
  if (!missaoAtiva) {
    alert("Missão finalizada.");
    return;
  }

  if (!pontoTemporario) {
    alert("Use primeiro o botão Marcar.");
    return;
  }

  const agora = Date.now();

  // Fecha duração do ponto anterior
  if (pontosRegistrados.length > 0) {
    const ultimo = pontosRegistrados[pontosRegistrados.length - 1];
    if (!ultimo.fim) {
      ultimo.fim = agora;
      ultimo.duracaoMin = Math.round((ultimo.fim - ultimo.inicio) / 60000);
    }
  }

  const missaoTexto =
    document.getElementById("missaoInput")?.value || "Sem missão";

  const novoPonto = {
    id: pontosRegistrados.length + 1,
    missao: missaoTexto,
    lat: pontoTemporario.lat,
    lng: pontoTemporario.lng,
    inicio: agora,
    fim: null,
    duracaoMin: null
  };

  pontosRegistrados.push(novoPonto);

  const marcador = L.marker([novoPonto.lat, novoPonto.lng]).addTo(map);

  marcador
    .bindPopup(
      `📍 Ponto ${novoPonto.id}<br>
       Missão: ${novoPonto.missao}<br>
       Lat: ${novoPonto.lat.toFixed(6)}<br>
       Lng: ${novoPonto.lng.toFixed(6)}`
    )
    .openPopup();

  pontoTemporario = null;
});

/*************************************************
 * BOTÃO FINALIZAR MISSÃO
 *************************************************/
document
  .getElementById("btnFinalizarMissao")
  ?.addEventListener("click", () => {
    if (!missaoAtiva) return;

    const agora = Date.now();

    if (pontosRegistrados.length > 0) {
      const ultimo = pontosRegistrados[pontosRegistrados.length - 1];
      if (!ultimo.fim) {
        ultimo.fim = agora;
        ultimo.duracaoMin = Math.round(
          (ultimo.fim - ultimo.inicio) / 60000
        );
      }
    }

    missaoAtiva = false;
    console.table(pontosRegistrados);
    alert("Missão finalizada com sucesso.");
  });
