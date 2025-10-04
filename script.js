let dados = [];

// Carrega o CSV
fetch("dados.csv")
  .then(response => response.text())
  .then(text => {
    dados = text.split("\n").slice(1).map(linha => {
      const [FABRICANTE, DATA, CODIGO, PRODUTO, QTD] = linha.split(",");
      return { FABRICANTE, DATA, CODIGO, PRODUTO, QTD };
    });
  });

// Elementos
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const tbody = document.querySelector("#results tbody");

// Função de sugestões
search.addEventListener("input", () => {
  const termo = search.value.toLowerCase();
  suggestions.innerHTML = "";
  if (termo.length > 0) {
    const filtrados = dados.filter(d => d.FABRICANTE.toLowerCase().includes(termo));
    filtrados.slice(0, 5).forEach(d => {
      const li = document.createElement("li");
      li.textContent = d.FABRICANTE;
      li.onclick = () => {
        search.value = d.FABRICANTE;
        suggestions.innerHTML = "";
        mostrarResultados(d.FABRICANTE);
      };
      suggestions.appendChild(li);
    });
  }
});

// Enter para pesquisar
search.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    mostrarResultados(search.value);
    suggestions.innerHTML = "";
  }
});

// Mostrar tabela
function mostrarResultados(fabricante) {
  tbody.innerHTML = "";
  const filtrados = dados.filter(d => d.cidade.toLowerCase() === cidade.toLowerCase());
  filtrados.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.FABRICANTE}</td>
      <td>${d.DATA}</td>
      <td>${d.CODIGO}</td>
      <td>${d.PRODUTO}</td>
      <td>${d.QTD}</td>
    `;
    tbody.appendChild(tr);
  });
}
