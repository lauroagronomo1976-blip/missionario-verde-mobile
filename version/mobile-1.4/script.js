// ===============================
// MAPA
// ===============================
const map = L.map("map", {
  zoomControl: true,
}).setView([-15.78, -47.93], 5);

// CAMADAS
const camadaRua = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { maxZoom: 19 }
);

const camadaSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19 }
);

// camada inicial
camadaRua.addTo(map);

// ===============================
// CONTROLES DE CAMADA
// ===============================
let usandoSatelite = false;

// ===============================
// VARIÁVEIS DE ESTADO
// ===============================
let pontoAtual = null;
let inicioPonto = null;
let registrosDoPontoAtual = [];

// ===============================
// ELEMENTOS
// ===============================
const btnMarcar = document.getElementById("btnMarcarPonto");
const btnGravar = document.getElementById("btnGravarPonto");
const btnAdicionarRegistro = document.getElementById("btnAdicionarRegistro");
const btnLayers = document.getElementById("btnLayers");
const btnLocate = document.getElementById("btnLocate");

const registroArea = document.getElementById("registroIndividuos");

// lista de registros
const listaRegistros = document.createElement("div");
registroArea.appendChild(listaRegistros);

// CAMPOS DO FORMULÁRIO
const individuoInput = document.getElementById("individuoInput");
const especieInput = document.getElementById("especieInput");
const faseSelect = document.getElementById("faseSelect");
const quantidadeInput = document.getElementById("quantidadeInput");

// ===============================
// BOTÃO MARCAR PONTO
// ===============================
btnMarcar.addEventListener("click", () => {
  map.locate({ enableHighAccuracy: true });
});

// ===============================
// LOCALIZAÇÃO ENCONTRADA
// ===============================
map.on("locationfound", (e) => {
  if (pontoAtual) map.removeLayer(pontoAtual);

  pontoAtual = L.marker(e.latlng).addTo(map);
  pontoAtual
    .bindPopup("📍 Ponto marcado (não gravado)")
    .openPopup();

  map.setView(e.latlng, 17);

  inicioPonto = new Date();
  registrosDoPontoAtual = [];
  listaRegistros.innerHTML = "";

  registroArea.style.display = "block";
});

// ===============================
// BOTÃO MIRA 🎯
// ===============================
btnLocate.addEventListener("click", () => {
  map.locate({ enableHighAccuracy: true });
});

// ===============================
// BOTÃO CAMADAS 🗺
// ===============================
btnLayers.addEventListener("click", () => {
  if (usandoSatelite) {
    map.removeLayer(camadaSatelite);
    camadaRua.addTo(map);
  } else {
    map.removeLayer(camadaRua);
    camadaSatelite.addTo(map);
  }
  usandoSatelite = !usandoSatelite;
});

// ===============================
// ADICIONAR REGISTRO
// ===============================
btnAdicionarRegistro.addEventListener("click", () => {
  const individuo = individuoInput.value.trim();
  const especie = especieInput.value.trim();
  const fase = faseSelect.value;
  const quantidade = quantidadeInput.value.trim();

  if (!individuo || !especie || !quantidade) {
    alert("Preencha todos os campos do registro técnico");
    return;
  }

  const registro = {
    individuo,
    especie,
    fase,
    quantidade,
  };

  registrosDoPontoAtual.push(registro);

  const index = registrosDoPontoAtual.length - 1;

  const item = document.createElement("div");
  item.style.borderBottom = "1px solid #ccc";
  item.style.padding = "6px 0";

  item.innerHTML = `
    <strong>${individuo}</strong> – ${especie}<br>
    Fase: ${fase || "-"} | Qtde: ${quantidade}
    <div style="margin-top:4px;">
      <button class="btn-editar">✏️ Editar</button>
      <button class="btn-excluir">🗑 Excluir</button>
    </div>
  `;

  // EXCLUIR
  item.querySelector(".btn-excluir").addEventListener("click", () => {
    registrosDoPontoAtual.splice(index, 1);
    item.remove();
  });

  // EDITAR
  item.querySelector(".btn-editar").addEventListener("click", () => {
    const r = registrosDoPontoAtual[index];
    individuoInput.value = r.individuo;
    especieInput.value = r.especie;
    faseSelect.value = r.fase;
    quantidadeInput.value = r.quantidade;

    registrosDoPontoAtual.splice(index, 1);
    item.remove();
  });

  listaRegistros.appendChild(item);

  // LIMPA FORM
  individuoInput.value = "";
  especieInput.value = "";
  quantidadeInput.value = "";
  faseSelect.selectedIndex = 0;
});

// ===============================
// GRAVAR PONTO
// ===============================
btnGravar.addEventListener("click", () => {
  if (!pontoAtual) {
    alert("Marque um ponto primeiro.");
    return;
  }

  const fimPonto = new Date();
  const tempoMin = Math.round((fimPonto - inicioPonto) / 60000);

  pontoAtual.bindPopup(
    `📍 Ponto gravado<br>
     Registros: ${registrosDoPontoAtual.length}<br>
     ⏱ ${tempoMin} min`
  );

  alert("Ponto gravado com sucesso!");

  console.log("Registros do ponto:", registrosDoPontoAtual);
});
