document.addEventListener("DOMContentLoaded", function () {

  const map = L.map("map").setView([-15, -50], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

});
