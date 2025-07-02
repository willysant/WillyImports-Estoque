// Elementos principais
const inventory = document.querySelector('#inventory tbody');
const sales = document.querySelector('#sales tbody');
const exportBtn = document.getElementById('export-btn');
const searchInput = document.getElementById('search');
const saveBtn = document.getElementById('saveProduct');Add commentMore actions

// Totais
const totalProducts = document.getElementById('total-products');
const totalCost = document.getElementById('total-cost');
const totalPrice = document.getElementById('total-price');
const totalProfit = document.getElementById('total-profit');

// Dados locais
let products = JSON.parse(localStorage.getItem('products')) || [];
let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

// Render inicial
renderTable();
renderSales();

// Salvar produto
saveBtn.addEventListener('click', function () {
  const name = document.getElementById('name').value.trim();
  const category = document.getElementById('category').value.trim();
  const color = document.getElementById('color').value.trim(); // COR
  const quantity = parseInt(document.getElementById('quantity').value);
  const cost = parseFloat(document.getElementById('cost').value);
  const price = parseFloat(document.getElementById('price').value);
  const date = new Date().toLocaleDateString('pt-BR');

  if (!name || isNaN(quantity) || isNaN(cost) || isNaN(price)) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

  const product = { name, category, color, quantity, cost, price, date };
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();

  // Limpa os campos
  document.getElementById('name').value = '';
  document.getElementById('category').value = '';
  document.getElementById('color').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('cost').value = '';
  document.getElementById('price').value = '';

  // Fecha modal
  document.getElementById('productModal').style.display = 'none';
});

function renderTable() {
  const filter = searchInput.value.toLowerCase();
  inventory.innerHTML = '';
  let totalQtd = 0, sumCost = 0, sumPrice = 0;

  products.forEach((prod, i) => {
    const match = (
      prod.name.toLowerCase().includes(filter) ||
      prod.category.toLowerCase().includes(filter) ||
      (prod.color && prod.color.toLowerCase().includes(filter))
    );

    if (match) {
      const lucroUnidade = prod.price - prod.cost;
      const row = document.createElement('tr');

      if (prod.quantity <= 3) row.style.backgroundColor = '#ffcccc';

      row.innerHTML = `
        <td>${prod.name}</td>
        <td>${prod.category}</td>
        <td>${prod.color || '-'}</td>
        <td>${prod.quantity}</td>
        <td>R$ ${prod.cost.toFixed(2)}</td>
        <td>R$ ${prod.price.toFixed(2)}</td>
        <td>R$ ${lucroUnidade.toFixed(2)}</td>
        <td>${prod.date}</td>
        <td>
          <button onclick="removeOne(${i})" class="delete-btn">Excluir 1</button>
        </td>
      `;
      inventory.appendChild(row);

      totalQtd += prod.quantity;
      sumCost += prod.cost * prod.quantity;
      sumPrice += prod.price * prod.quantity;
    }
  });
function salvarDados() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

  totalProducts.textContent = totalQtd;
  totalCost.textContent = sumCost.toFixed(2);
  totalPrice.textContent = sumPrice.toFixed(2);
  totalProfit.textContent = (sumPrice - sumCost).toFixed(2);
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

function removeOne(index) {
  const prod = products[index];
  prod.quantity -= 1;

  const sale = {
    name: prod.name,
    category: prod.category,
    color: prod.color,
    lucro: (prod.price - prod.cost).toFixed(2),
    date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')
  };
  salesHistory.push(sale);

  if (prod.quantity <= 0) {
    products.splice(index, 1);
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

  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
function excluirTodasVendas() {
  if (confirm("Tem certeza que deseja excluir todas as vendas?")) {
    vendas = [];
    salvarDados();
    renderizar();
  }
}

  renderTable();
  renderSales();
function filtrarProdutos(termo) {
  renderizar(termo);
}

function renderSales() {
  sales.innerHTML = '';
  salesHistory.forEach(sale => {
    const row = `<tr>
      <td>${sale.name}</td>
      <td>${sale.category}</td>
      <td>R$ ${sale.lucro}</td>
      <td>${sale.date}</td>
    </tr>`;
    sales.innerHTML += row;
  });
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

exportBtn.addEventListener('click', function () {
  let csv = 'Produto,Categoria,Cor,Quantidade,Custo,Preço de Venda,Lucro Unidade,Data\n';
  products.forEach(prod => {
    const lucroUnidade = prod.price - prod.cost;
    csv += `${prod.name},${prod.category},${prod.color || '-'},${prod.quantity},${prod.cost.toFixed(2)},${prod.price.toFixed(2)},${lucroUnidade.toFixed(2)},${prod.date}\n`;
function exportarCSV() {
  let csv = "Produto,Categoria,Cor,Qtd,Custo,Venda\n";
  estoque.forEach(p => {
    csv += `${p.nome},${p.categoria},${p.cor},${p.qtd},${p.custo},${p.venda}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'estoque.csv');
  document.body.appendChild(a);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "estoque.csv";
  a.click();
  document.body.removeChild(a);
});

searchInput.addEventListener('input', renderTable);
const clearSalesBtn = document.getElementById('clear-sales');

clearSalesBtn.addEventListener('click', function () {
  const confirmClear = confirm("Tem certeza que deseja excluir todas as vendas? Essa ação não pode ser desfeita.");
  if (confirmClear) {
    salesHistory = [];
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    renderSales();
    alert("Histórico de vendas limpo com sucesso!");
  }
});
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
