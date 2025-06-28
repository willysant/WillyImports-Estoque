// Elementos principais
const inventory = document.querySelector('#inventory tbody');
const sales = document.querySelector('#sales tbody');
const exportBtn = document.getElementById('export-btn');
const searchInput = document.getElementById('search');
const saveBtn = document.getElementById('saveProduct');

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

  totalProducts.textContent = totalQtd;
  totalCost.textContent = sumCost.toFixed(2);
  totalPrice.textContent = sumPrice.toFixed(2);
  totalProfit.textContent = (sumPrice - sumCost).toFixed(2);
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
  }

  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

  renderTable();
  renderSales();
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
}

exportBtn.addEventListener('click', function () {
  let csv = 'Produto,Categoria,Cor,Quantidade,Custo,Preço de Venda,Lucro Unidade,Data\n';
  products.forEach(prod => {
    const lucroUnidade = prod.price - prod.cost;
    csv += `${prod.name},${prod.category},${prod.color || '-'},${prod.quantity},${prod.cost.toFixed(2)},${prod.price.toFixed(2)},${lucroUnidade.toFixed(2)},${prod.date}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'estoque.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

searchInput.addEventListener('input', renderTable);
