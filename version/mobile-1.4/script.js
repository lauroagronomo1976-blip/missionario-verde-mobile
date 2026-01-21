// ===============================
// MAPA
// ===============================
const map = L.map("map").setView([-15.78, -47.93], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let pontoAtual = null;
let inicioPonto = null;

// ===============================
// ELEMENTOS
// ===============================
const btnMarcar = document.getElementById("btnMarcarPonto");
const btnGravar = document.getElementById("btnGravarPonto");
const btnAdicionarRegistro = document.getElementById("btnAdicionarRegistro");

const registroArea = document.getElementById("registroIndividuos");

// Container da lista de registros
const listaRegistros = document.createElement("div");
registroArea.appendChild(listaRegistros);

// Campos do formulário técnico
const individuoInput = document.getElementById("individuoInput");
const especieInput = document.getElementById("especieInput");
const faseSelect = document.getElementById("faseSelect");
const quantidadeInput = document.getElementById("quantidadeInput");

// ===============================
// DADOS
// ===============================
let registrosDoPontoAtual = [];

// ===============================
// MARCAR PONTO
// ===============================
btnMarcar.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    if (pontoAtual) {
      map.removeLayer(pontoAtual);
    }

    pontoAtual = L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 17);

    inicioPonto = new Date();
    registrosDoPontoAtual = [];
    listaRegistros.innerHTML = "";

    registroArea.style.display = "block";
  });
});

// ===============================
// ADICIONAR REGISTRO (EMPILHAR)
// ===============================
if (btnAdicionarRegistro) {
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

    // EXCLUIR REGISTRO
    item.querySelector(".btn-excluir").addEventListener("click", () => {
      registrosDoPontoAtual.splice(index, 1);
      item.remove();
    });

    // EDITAR REGISTRO
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

    // Limpa formulário para novo registro
    individuoInput.value = "";
    especieInput.value = "";
    quantidadeInput.value = "";
    faseSelect.selectedIndex = 0;
  });
}

// ===============================
// GRAVAR PONTO
// ===============================
btnGravar.addEventListener("click", () => {
  if (!pontoAtual) {
    alert("Nenhum ponto marcado.");
    return;
  }

  const fimPonto = new Date();
  const tempoMin = Math.round((fimPonto - inicioPonto) / 60000);

  alert(
    `PONTO GRAVADO\n\n` +
      `Registros técnicos: ${registrosDoPontoAtual.length}\n` +
      `Tempo no ponto: ${tempoMin} min`
  );

  console.log("Registros técnicos do ponto:", registrosDoPontoAtual);
});
