console.log("🟢 JS ATIVO – TELA 3 REGISTRO DA MISSÃO");

// ===============================
// STORAGE
// ===============================
function carregarMissao() {
  return JSON.parse(localStorage.getItem("missaoAtiva")) || { pontos: [] };
}

function salvarMissao(missao) {
  localStorage.setItem("missaoAtiva", JSON.stringify(missao));
}

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTOS
  // ===============================
  const btnMarcar = document.getElementById("btnMarcarPonto");
  const btnGravar = document.getElementById("btnGravarPonto");
  const btnAdicionar = document.getElementById("btnAddRegistro");

  const btnLayers = document.getElementById("btnLayers");
  const btnLocate = document.getElementById("btnLocate");

  const registroArea = document.getElementById("registroIndividuos");
  const listaRegistros = document.getElementById("listaRegistros");

  const ocorrenciaSelect = document.getElementById("ocorrenciaSelect");
  const individuoInput = document.getElementById("individuoInput");
  const especieInput = document.getElementById("especieInput");
  const faseSelect = document.getElementById("faseSelect");
  const quantidadeInput = document.getElementById("quantidadeInput");

  registroArea.style.display = "block";
  listaRegistros.style.display = "block";
  // ===============================
  // MAPA
  // ===============================
  const map = L.map("map").setView([-15.78, -47.93], 5);
  setTimeout(() => {
  map.invalidateSize();
}, 300);

  const camadaRua = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 19 }
  ).addTo(map);

  const camadaSatelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19 }
  );

  let usandoSatelite = false;

  // ===============================
  // ESTADO
  // ===============================
  let pontoAtual = null;
  let inicioPonto = null;
  let registrosDoPontoAtual = [];
  let indiceEdicao = null;
  let modoCriarPonto = false;

  // ===============================
  // MAPA – CONTROLES
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

  btnLocate.addEventListener("click", () => {
    map.locate({ enableHighAccuracy: true });
  });

  // ===============================
  // MARCAR PONTO
  // ===============================
  btnMarcar.addEventListener("click", () => {
    modoCriarPonto = true;
    map.locate({ enableHighAccuracy: true });
  });

  map.on("locationfound", (e) => {
    map.setView(e.latlng, 17);

    if (!modoCriarPonto) return;
    modoCriarPonto = false;

    if (pontoAtual) map.removeLayer(pontoAtual);

    pontoAtual = L.marker(e.latlng).addTo(map);
    pontoAtual.bindPopup("📍 Ponto em registro").openPopup();

    inicioPonto = new Date();
    registrosDoPontoAtual = [];
    indiceEdicao = null;

    renderizarRegistros();
  });
function renderizarListaPontos() {
  const missao = carregarMissao();
  listaRegistros.innerHTML = "";
  if (!missao.pontos.length) {
    listaRegistros.innerHTML = "<p>Nenhum ponto registrado.</p>";
    return;
  }

  missao.pontos.forEach((ponto, index) => {
    const div = document.createElement("div");
    div.className = "registro-item";
    div.style.cursor = "pointer";

    div.innerHTML = `
      <strong>📍 Ponto ${index + 1}</strong><br>
      📋 ${ponto.registros.length} registros<br>
      ⏱ ${ponto.tempoMin} min
    `;

    div.addEventListener("click", () => {
      registrosDoPontoAtual = [...ponto.registros];
      indiceEdicao = null;
      renderizarRegistros();
    });

    listaRegistros.appendChild(div);
  });
}

  // ===============================
  // ADICIONAR / EDITAR REGISTRO
  // ===============================
  btnAdicionar.addEventListener("click", () => {
    if (!pontoAtual) {
      alert("Marque um ponto primeiro");
      return;
    }

    const registro = {
      ocorrencia: ocorrenciaSelect.value,
      individuo: individuoInput.value.trim(),
      especie: especieInput.value.trim(),
      fase: faseSelect.value,
      quantidade: quantidadeInput.value
    };

    if (!registro.ocorrencia || !registro.individuo || !registro.especie || registro.quantidade === "") {
      alert("Preencha todos os campos");
      return;
    }

    if (indiceEdicao !== null) {
      registrosDoPontoAtual[indiceEdicao] = registro;
      indiceEdicao = null;
    } else {
      registrosDoPontoAtual.push(registro);
    }

    limparFormulario();
    renderizarRegistros();
  });

  function limparFormulario() {
    ocorrenciaSelect.selectedIndex = 0;
    individuoInput.value = "";
    especieInput.value = "";
    faseSelect.selectedIndex = 0;
    quantidadeInput.value = "";
  }

  // ===============================
  // LISTA DE REGISTROS
  // ===============================
  function renderizarRegistros() {
    listaRegistros.innerHTML = "";

    if (!registrosDoPontoAtual.length) {
      listaRegistros.innerHTML = "<p>Sem registros no ponto.</p>";
      return;
    }

    registrosDoPontoAtual.forEach((r, index) => {
      const div = document.createElement("div");
      div.className = "registro-item";

      div.innerHTML = `
        <strong>${r.ocorrencia}</strong><br>
        ${r.individuo} – ${r.especie}<br>
        Fase: ${r.fase} | Qtde: ${r.quantidade}
        <div style="margin-top:6px">
          <button data-edit="${index}">✏️</button>
          <button data-del="${index}">🗑</button>
        </div>
      `;

      listaRegistros.appendChild(div);
    });
  }

  listaRegistros.addEventListener("click", (e) => {
    if (e.target.dataset.del !== undefined) {
      registrosDoPontoAtual.splice(e.target.dataset.del, 1);
      renderizarRegistros();
    }

    if (e.target.dataset.edit !== undefined) {
      const r = registrosDoPontoAtual[e.target.dataset.edit];

      ocorrenciaSelect.value = r.ocorrencia;
      individuoInput.value = r.individuo;
      especieInput.value = r.especie;
      faseSelect.value = r.fase;
      quantidadeInput.value = r.quantidade;

      indiceEdicao = e.target.dataset.edit;
    }
  });

  // ===============================
  // GRAVAR PONTO
  // ===============================
  btnGravar.addEventListener("click", () => {
  if (!pontoAtual) {
    setTimeout(() => {
  map.invalidateSize();
}, 200);
    alert("Nenhum ponto marcado");
    return;
  }

  const tempoMin = Math.round((new Date() - inicioPonto) / 60000);
  const missao = carregarMissao();

  missao.pontos.push({
    lat: pontoAtual.getLatLng().lat,
    lng: pontoAtual.getLatLng().lng,
    tempoMin,
    registros: [...registrosDoPontoAtual]
  });

  salvarMissao(missao);

  pontoAtual.bindPopup(
    `📍 Ponto gravado<br>
     📋 ${registrosDoPontoAtual.length} registros<br>
     ⏱ ${tempoMin} min`
  ).openPopup();

  pontoAtual = null;
  registrosDoPontoAtual = [];
  indiceEdicao = null;

  renderizarListaPontos(); // 👈 AQUI ESTÁ A VIRADA DE CHAVE
setTimeout(() => {
  map.invalidateSize();
}, 200);

    alert("Ponto gravado com sucesso!");
});
