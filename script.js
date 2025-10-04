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

// Função genérica de sugestões
function setupSearch(inputId, suggestionsId, campo, exato = false) {
  const input = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);

  input.addEventListener("input", () => {
    const termo = input.value.toLowerCase();
    suggestions.innerHTML = "";
    if (termo.length > 0) {
      const filtrados = dados.filter(d => {
        const valor = d[campo].toLowerCase();
        return exato ? valor === termo : valor.includes(termo);
      });
      filtrados.slice(0, 5).forEach(d => {
        const li = document.createElement("li");
        li.textContent = d[campo];
        li.onclick = () => {
          input.value = d[campo];
          suggestions.innerHTML = "";
          mostrarResultados(input.value, campo, exato);
        };
        suggestions.appendChild(li);
      });
    }
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      mostrarResultados(input.value, campo, exato);
      suggestions.innerHTML = "";
    }
  });
}

// Mostra resultados filtrando pelo campo específico
function mostrarResultados(valor, campo, exato) {
  const tbody = document.querySelector("#results tbody");
  tbody.innerHTML = "";

  const filtrados = dados.filter(d => {
    const dadoCampo = d[campo].toLowerCase();
    return exato ? dadoCampo === valor.toLowerCase() : dadoCampo.includes(valor.toLowerCase());
  });

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

// Configura os 3 campos
setupSearch("searchFabricante", "suggestionsFabricante", "fabricante", false);
setupSearch("searchCodigo", "suggestionsCodigo", "codigo", true); // código busca exata
setupSearch("searchProduto", "suggestionsProduto", "produto", false); // produto busca aproximada
