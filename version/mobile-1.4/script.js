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
const listaRegistros = document.createElement("div");
registroArea.appendChild(listaRegistros);

// Campos do formulário
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

    if (pontoAtual) map.removeLayer(pontoAtual);

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
btnAdicionarRegistro.addEventListener("click", () => {
  const individuo = individuoInput.value.trim();
  const especie = especieInput.value.trim();
  const fase = faseSelect.value;
  const quantidade = quantidadeInput.value;

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

  // Mostrar na lista
  const item = document.createElement("div");
  item.style.borderBottom = "1px solid #ccc";
  item.style.padding = "4px 0";
  item.innerHTML = `
    <strong>${individuo}</strong> – ${especie}<br>
    Fase: ${fase} | Qtde: ${quantidade}
  `;

  listaRegistros.appendChild(item);

  // Limpar formulário (ponto-chave do seu pedido)
  individuoInput.value = "";
  especieInput.value = "";
  quantidadeInput.value = "";
  faseSelect.selectedIndex = 0;
});

// ===============================
// GRAVAR PONTO
// ===============================
btnGravar.addEventListener("click", () => {
  if (!pontoAtual) return;

  const fimPonto = new Date();
  const tempoMin = Math.round((fimPonto - inicioPonto) / 60000);

  alert(
    `PONTO GRAVADO\n\n` +
      `Registros: ${registrosDoPontoAtual.length}\n` +
      `Tempo no ponto: ${tempoMin} min`
  );

  console.log("Registros técnicos:", registrosDoPontoAtual);
});
