let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
let vendas = JSON.parse(localStorage.getItem('vendas') || '[]');

function salvar() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
  localStorage.setItem('vendas', JSON.stringify(vendas));
  render();
}

function adicionarProduto() {
  const produto = prompt("Produto:");
  const categoria = prompt("Categoria:");
  const cor = prompt("Cor:");
  const qtd = parseInt(prompt("Quantidade:"), 10);
  const custo = parseFloat(prompt("Custo por unidade:")).toFixed(2);
  const venda = parseFloat(prompt("Preço de venda:")).toFixed(2);
  const lucro = (venda - custo).toFixed(2);
  const data = new Date().toLocaleDateString();

  produtos.push({ produto, categoria, cor, qtd, custo, venda, lucro, data });
  salvar();
}

function vender(index) {
  const p = produtos[index];
  const pago = parseFloat(prompt(`Quanto o cliente pagou? Preço padrão: R$ ${p.venda}`));
  const lucro = (pago - p.custo).toFixed(2);
  const dataVenda = new Date().toLocaleString();

  vendas.push({ produto: p.produto, categoria: p.categoria, lucro, dataVenda });
  p.qtd -= 1;
  if (p.qtd <= 0) produtos.splice(index, 1);
  salvar();
}

function excluirProduto(index) {
  produtos.splice(index, 1);
  salvar();
}

function excluirTodasVendas() {
  if (confirm("Tem certeza que quer excluir todas as vendas?")) {
    vendas = [];
    salvar();
  }
}

function filtrarProdutos() {
  render();
}

function exportarCSV() {
  let csv = "Produto,Categoria,Cor,Qtd,Custo,Venda,Lucro Unidade,Data\n";
  produtos.forEach(p => {
    csv += `${p.produto},${p.categoria},${p.cor},${p.qtd},${p.custo},${p.venda},${p.lucro},${p.data}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'estoque.csv';
  a.click();
  URL.revokeObjectURL(url);
}

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Estoque Willy Imports", 10, 10);
  let y = 20;
  produtos.forEach(p => {
    doc.text(
      `${p.produto} | ${p.categoria} | ${p.cor} | Qtd: ${p.qtd} | Custo: R$ ${p.custo} | Venda: R$ ${p.venda} | Lucro: R$ ${p.lucro} | ${p.data}`,
      10, y
    );
    y += 8;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("estoque.pdf");
}

function render() {
  const filtro = document.getElementById('busca').value.toLowerCase();
  const tbody = document.querySelector("#estoque tbody");
  tbody.innerHTML = "";
  let totalCusto = 0, totalVenda = 0;

  produtos.forEach((p, i) => {
    if (!p.produto.toLowerCase().includes(filtro)) return;
    totalCusto += p.custo * p.qtd;
    totalVenda += p.venda * p.qtd;

    const tr = document.createElement('tr');
    tr.classList.add('colored');
    tr.innerHTML = `
      <td>${p.produto}</td><td>${p.categoria}</td><td>${p.cor}</td><td>${p.qtd}</td>
      <td>R$ ${p.custo}</td><td>R$ ${p.venda}</td><td>R$ ${p.lucro}</td><td>${p.data}</td>
      <td>
        <button class="blue" onclick="vender(${i})">Vender</button>
        <button class="red" onclick="excluirProduto(${i})">Excluir ${p.qtd}</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('resumo').innerHTML = `
    <p>Total de produtos: ${produtos.reduce((a, p) => a + p.qtd, 0)}</p>
    <p>Valor total de custo: R$ ${totalCusto.toFixed(2)}</p>
    <p>Valor total de venda: R$ ${totalVenda.toFixed(2)}</p>
    <p>Lucro bruto estimado: R$ ${(totalVenda - totalCusto).toFixed(2)}</p>
  `;

  const vendasTbody = document.querySelector("#vendas tbody");
  vendasTbody.innerHTML = "";
  vendas.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${v.produto}</td><td>${v.categoria}</td><td>R$ ${v.lucro}</td><td>${v.dataVenda}</td>`;
    vendasTbody.appendChild(tr);
  });
}

render();
