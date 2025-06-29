
const form = document.getElementById('product-form');
const inventory = document.querySelector('#inventory tbody');

let products = [];

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const cost = parseFloat(document.getElementById('cost').value);
  const price = parseFloat(document.getElementById('price').value);

  const product = { name, category, quantity, cost, price };
  products.push(product);
  renderTable();
  form.reset();
});

function renderTable() {
  inventory.innerHTML = '';
  products.forEach((prod, i) => {
    const row = `<tr>
      <td>${prod.name}</td>
      <td>${prod.category}</td>
      <td>${prod.quantity}</td>
      <td>R$ ${prod.cost.toFixed(2)}</td>
      <td>R$ ${prod.price.toFixed(2)}</td>
      <td><button onclick="removeProduct(${i})">Excluir</button></td>
    </tr>`;
    inventory.innerHTML += row;
  });
}

function removeProduct(index) {
  products.splice(index, 1);
  renderTable();
}
