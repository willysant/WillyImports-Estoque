const form = document.getElementById('product-form');
const inventory = document.querySelector('#inventory tbody');
const exportBtn = document.getElementById('export-btn');

let products = JSON.parse(localStorage.getItem('products')) || [];

renderTable();

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const cost = parseFloat(document.getElementById('cost').value);
  const price = parseFloat(document.getElementById('price').value);
  const date = new Date().toLocaleDateString();

  const product = { name, category, quantity, cost, price, date };
  products.push(product);

  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
  form.reset();
});

function renderTable() {
  inventory.innerHTML = '';
  products.forEach((prod, i) => {
    const row = `<tr style="background-color: ${prod.quantity < 3 ? '#ffe6e6' : 'white'}">
      <td>${prod.name}</td>
      <td>${prod.category}</td>
      <td>${prod.quantity}</td>
      <td>R$ ${prod.cost.toFixed(2)}</td>
      <td>R$ ${prod.price.toFixed(2)}</td>
      <td>${prod.date}</td>
      <td><button class="remove-btn" onclick="removeProduct(${i})">Excluir</button></td>
    </tr>`;
    inventory.innerHTML += row;
  });
}

function removeProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
}

exportBtn.addEventListener('click', function () {
  let csv = "Nome,Categoria,Quantidade,Custo,Preço,Data de Cadastro\n";
  products.forEach(prod => {
    csv += `${prod.name},${prod.category},${prod.quantity},${prod.cost},${prod.price},${prod.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "estoque-willy.csv");
  link.click();
});
