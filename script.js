let dados = [];

// Carrega o CSV
fetch("dados.csv")
  .then(response => response.text())
  .then(text => {
    dados = text.split("\n").slice(1).map(linha => {
      const [fabricante, data, codigo, produto, qtd] = linha.split(",");
      return { fabricante, data, codigo, produto, qtd };
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
    const filtrados = dados.filter(d => d.fabricante.toLowerCase().includes(termo));
    filtrados.slice(0, 5).forEach(d => {
      const li = document.createElement("li");
      li.textContent = d.fabricante;
      li.onclick = () => {
        search.value = d.fabricante;
        suggestions.innerHTML = "";
        mostrarResultados(d.fabricante);
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
      <td>${d.fabricante}</td>
      <td>${d.data}</td>
      <td>${d.codigo}</td>
      <td>${d.produto}</td>
      <td>${d.qtd}</td>
    `;
    tbody.appendChild(tr);
  });
}
