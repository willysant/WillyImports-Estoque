let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

function salvarDados() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function adicionarProduto() {
  const nome = prompt("Nome do produto:");
  const categoria = prompt("Categoria:");
  const cor = prompt("Cor:");
  const qtd = parseInt(prompt("Quantidade:"), 10);
  const custo = parseFloat(prompt("Preço de custo:"));
  const venda = parseFloat(prompt("Preço de venda:"));
  const data = new Date().toLocaleDateString();

  if (!nome || isNaN(qtd)) return;

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
      lucro: (estoque[index].venda - estoque[index].custo).toFixed(2),
      data: new Date().toLocaleDateString()
    });
    salvarDados();
    renderizar();
  }
}

function excluirTodasVendas() {
  if (confirm("Tem certeza que deseja excluir todas as vendas?")) {
    vendas = [];
    salvarDados();
    renderizar();
  }
}

function filtrarProdutos(termo) {
  renderizar(termo);
}

function filtrarData(tipo) {
  const hoje = new Date();
  let filtro;

  if (tipo === "hoje") {
    filtro = hoje.toLocaleDateString();
  } else if (tipo === "ontem") {
    hoje.setDate(hoje.getDate() - 1);
    filtro = hoje.toLocaleDateString();
  } else if (tipo === "semana") {
    const seteDias = new Date();
    seteDias.setDate(seteDias.getDate() - 7);
    const vendasFiltradas = vendas.filter(v => {
      const dataVenda = new Date(v.data.split("/").reverse().join("-"));
      return dataVenda >= seteDias;
    });
    return renderizar("", vendasFiltradas);
  }

  if (filtro) {
    const vendasFiltradas = vendas.filter(v => v.data === filtro);
    renderizar("", vendasFiltradas);
  }
}

function exportarCSV() {
  let csv = "Produto,Categoria,Cor,Qtd,Custo,Venda\n";
  estoque.forEach(p => {
    csv += `${p.nome},${p.categoria},${p.cor},${p.qtd},${p.custo},${p.venda}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "estoque.csv";
  a.click();
}

function renderizar(filtro = "", vendasFiltradas = vendas) {
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
      </tr>
    `;

    totalProdutos++;
    totalCusto += p.custo * p.qtd;
    totalVenda += p.venda * p.qtd;
  });

  vendasFiltradas.forEach(v => {
    tbodyVendas.innerHTML += `
      <tr>
        <td>${v.nome}</td>
        <td>${v.categoria}</td>
        <td>R$ ${v.lucro}</td>
        <td>${v.data}</td>
      </tr>
    `;
  });

  document.getElementById("totalProdutos").textContent = totalProdutos;
  document.getElementById("totalCusto").textContent = totalCusto.toFixed(2);
  document.getElementById("totalVenda").textContent = totalVenda.toFixed(2);
  document.getElementById("lucroBruto").textContent = (totalVenda - totalCusto).toFixed(2);
}

renderizar();
