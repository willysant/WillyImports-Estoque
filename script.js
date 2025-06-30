let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

function salvarDados() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function adicionarProduto() {
  const nome = prompt("Nome do produto:");
  if (!nome) return alert("Nome obrigatório!");

  const categoria = prompt("Categoria:");
  const cor = prompt("Cor:");
  const qtd = parseInt(prompt("Quantidade:"), 10);
  if (isNaN(qtd)) return alert("Quantidade inválida!");

  const custo = parseFloat(prompt("Preço de custo:").replace(",", "."));
  if (isNaN(custo)) return alert("Preço de custo inválido!");

  const venda = parseFloat(prompt("Preço de venda:").replace(",", "."));
  if (isNaN(venda)) return alert("Preço de venda inválido!");

  const data = new Date().toISOString().split("T")[0];

  estoque.push({ nome, categoria, cor, qtd, custo, venda, data });
  salvarDados();
  renderizar();
}

function venderProduto(index) {
  if (estoque[index].qtd > 0) {
    estoque[index].qtd--;
    vendas.push({
      nome: estoque[index].nome,
      categoria: estoque[index].categoria,
      lucro: +(estoque[index].venda - estoque[index].custo).toFixed(2),
      data: new Date().toISOString().split("T")[0]
    });
    salvarDados();
    renderizar();
  } else {
    alert("Estoque esgotado!");
  }
}

    salvarDados();
    renderizar();
  } else {
    alert("Estoque esgotado!");
  }
}

function excluirTodasVendas() {
  if (confirm("Tem certeza?")) {
    vendas = [];
    salvarDados();
    renderizar();
  }
}

function exportarCSV() {
  let csv = "Nome,Categoria,Cor,Quantidade,Custo,Venda\n";
  estoque.forEach(p => {
    csv += `${p.nome},${p.categoria},${p.cor},${p.qtd},${p.custo},${p.venda}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "estoque.csv";
  a.click();
}

function filtrarProdutos(termo) {
  renderizar(termo);
}

function renderizar(filtro = "") {
  const tbody = document.getElementById("tabelaEstoque");
  const tbodyVendas = document.getElementById("tabelaVendas");
  tbody.innerHTML = "";
  tbodyVendas.innerHTML = "";

  let totalCusto = 0, totalVenda = 0, totalProdutos = 0;

  estoque.forEach((p, i) => {
    if (filtro && !p.nome.toLowerCase().includes(filtro.toLowerCase()) && !p.categoria.toLowerCase().includes(filtro.toLowerCase())) return;

    const lucro = (p.venda - p.custo).toFixed(2);
    const lowStock = p.qtd <= 2 ? "low-stock" : "";

    tbody.innerHTML += `
      <tr class="${lowStock}">
        <td>${p.nome}</td>
        <td>${p.categoria}</td>
        <td>${p.cor}</td>
        <td>${p.qtd}</td>
        <td>R$ ${p.custo.toFixed(2)}</td>
        <td>R$ ${p.venda.toFixed(2)}</td>
        <td>R$ ${lucro}</td>
        <td>${p.data}</td>
        <td><button onclick="venderProduto(${i})">Vender</button></td>
      </tr>`;

    totalProdutos++;
    totalCusto += p.custo * p.qtd;
    totalVenda += p.venda * p.qtd;
  });

vendas.forEach(v => {
  tbodyVendas.innerHTML += `
    <tr>
      <td>${v.nome}</td>
      <td>${v.categoria}</td>
      <td>R$ ${v.lucro}</td>
      <td>${v.data}</td>
    </tr>`;
});

  document.getElementById("totalProdutos").textContent = totalProdutos;
  document.getElementById("totalCusto").textContent = totalCusto.toFixed(2);
  document.getElementById("totalVenda").textContent = totalVenda.toFixed(2);
  document.getElementById("lucroBruto").textContent = (totalVenda - totalCusto).toFixed(2);
}

renderizar();
