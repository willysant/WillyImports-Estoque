const form = document.getElementById('product-form');
const inventory = document.querySelector('#inventory tbody');
const exportBtn = document.getElementById('export-btn');
const searchInput = document.getElementById('search');

const totalProducts = document.getElementById('total-products');
const totalCost = document.getElementById('total-cost');
const totalPrice = document.getElementById('total-price');
const totalProfit = document.getElementById('total-profit');

let products = JSON.parse(localStorage.getItem('products')) || [];

renderTable();

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const cost = parseFloat(document.getElementById('cost').value);
  const price = parseFloat(document.getElementById('price').value);
  const date = new Date().toLocaleDateString('pt-BR');

  const product = { name, category, quantity, cost, price, date };
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
  form.reset();
});

function renderTable() {
  const filter = searchInput.value.toLowerCase();
  inventory.innerHTML = '';
  let totalQtd = 0, sumCost = 0, sumPrice = 0;

  products.forEach((prod, i) => {
    if (
      prod.name.toLowerCase().includes(filter) ||
      prod.category.toLowerCase().includes(filter)
    ) {
      const row = document.createElement('tr');
      if (prod.quantity <= 3) row.style.backgroundColor = '#ffcccc';

      row.innerHTML = `
        <td>${prod.name}</td>
        <td>${prod.category}</td>
        <td>${prod.quantity}</td>
        <td>R$ ${prod.cost.toFixed(2)}</td>
        <td>R$ ${prod.price.toFixed(2)}</td>
        <td>${prod.date}</td>
        <td><button onclick="removeProduct(${i})" class="delete-btn">Excluir</button></td>
      `;
      inventory.appendChild(row);

      totalQtd++;
      sumCost += prod.cost * prod.quantity;
      sumPrice += prod.price * prod.quantity;
    }
  });

  totalProducts.textContent = totalQtd;
  totalCost.textContent = sumCost.toFixed(2);
  totalPrice.textContent = sumPrice.toFixed(2);
  totalProfit.textContent = (sumPrice - sumCost).toFixed(2);
}

function removeProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
}

exportBtn.addEventListener('click', function() {
  let csv = 'Produto,Categoria,Quantidade,Custo,Preço de Venda,Data\n';
  products.forEach(prod => {
    csv += `${prod.name},${prod.category},${prod.quantity},${prod.cost},${prod.price},${prod.date}\n`;
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
