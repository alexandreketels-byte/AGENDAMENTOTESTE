    let dados = []; // seu CSV já carregado

// Exemplo: dados já carregados
// dados = [
//   { fabricante: "ABC Indústria", data: "2025-10-01", codigo: "123", produto: "Produto X", qtd: "10" },
//   ...
// ];

// Função para calcular distância de Levenshtein
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deleção
        matrix[i][j - 1] + 1,       // inserção
        matrix[i - 1][j - 1] + cost // substituição
      );
    }
  }

  return matrix[a.length][b.length];
}

// Função genérica de sugestões
function setupSearch(inputId, suggestionsId, campo, exato = false, fuzzy = false) {
  const input = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);

  input.addEventListener("input", () => {
    const termo = input.value.toLowerCase();
    suggestions.innerHTML = "";
    if (termo.length > 0) {
      let filtrados;
      if (fuzzy) {
        // busca fuzzy: distância <= 2
        filtrados = dados.filter(d => levenshtein(d[campo].toLowerCase(), termo) <= 2);
      } else {
        filtrados = dados.filter(d => {
          const valor = d[campo].toLowerCase();
          return exato ? valor === termo : valor.includes(termo);
        });
      }

      filtrados.slice(0, 5).forEach(d => {
        const li = document.createElement("li");
        li.textContent = d[campo];
        li.onclick = () => {
          input.value = d[campo];
          suggestions.innerHTML = "";
          mostrarResultados();
        };
        suggestions.appendChild(li);
      });
    }
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      mostrarResultados();
      suggestions.innerHTML = "";
    }
  });
}

// Função para mostrar resultados com todos os filtros
function mostrarResultados() {
  const tbody = document.querySelector("#results tbody");
  tbody.innerHTML = "";

  const fabricanteFiltro = document.getElementById("searchFabricante").value.toLowerCase();
  const codigoFiltro = document.getElementById("searchCodigo").value.toLowerCase();
  const produtoFiltro = document.getElementById("searchProduto").value.toLowerCase();

  const filtrados = dados.filter(d => {
    const f = d.fabricante.toLowerCase().includes(fabricanteFiltro);
    const c = codigoFiltro ? d.codigo.toLowerCase() === codigoFiltro : true;
    const p = produtoFiltro
      ? levenshtein(d.produto.toLowerCase(), produtoFiltro) <= 2
      : true; // fuzzy para produto
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
setupSearch("searchProduto", "suggestionsProduto", "produto", false, true); // fuzzy
