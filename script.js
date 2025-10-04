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

      // Mostra até 5 sugestões
      filtrados.slice(0, 5).forEach(d => {
        const li = document.createElement("li");
        li.textContent = d[campo];
        li.onclick = () => {
          input.value = d[campo];
          suggestions.innerHTML = "";
          mostrarResultados(); // atualiza tabela com todos os filtros
        };
        suggestions.appendChild(li);
      });
    }
  });

  // Enter para pesquisar
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      mostrarResultados();
      suggestions.innerHTML = "";
    }
  });
}

// Função para mostrar resultados aplicando os filtros de todas as caixas
function mostrarResultados() {
  const tbody = document.querySelector("#results tbody");
  tbody.innerHTML = "";

  const fabricanteFiltro = document.getElementById("searchFabricante").value.toLowerCase();
  const codigoFiltro = document.getElementById("searchCodigo").value.toLowerCase();
  const produtoFiltro = document.getElementById("searchProduto").value.toLowerCase();

  const filtrados = dados.filter(d => {
    const f = d.fabricante.toLowerCase().includes(fabricanteFiltro);
    const c = codigoFiltro ? d.codigo.toLowerCase() === codigoFiltro : true;
    const p = d.produto.toLowerCase().includes(produtoFiltro);
    return f && c && p;
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

// Configura os 3 campos de pesquisa
setupSearch("searchFabricante", "suggestionsFabricante", "fabricante", false);
setupSearch("searchCodigo", "suggestionsCodigo", "codigo", true);
setupSearch("searchProduto", "suggestionsProduto", "produto", false);
