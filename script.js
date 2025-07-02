// Função para remover acentos e espaços para CSV
function sanitizeCSV(str) {
  return '"' + str.replace(/"/g, '""') + '"';
}

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('estoqueTable');
  const exportarCSVBtn = document.getElementById('exportarCSV');
  const exportarPDFBtn = document.getElementById('exportarPDF');

  // Função para exportar CSV
  exportarCSVBtn.addEventListener('click', () => {
    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
      let cols = row.querySelectorAll('th, td');
      let rowData = [];
      cols.forEach(col => {
        rowData.push(sanitizeCSV(col.innerText.trim()));
      });
      csv.push(rowData.join(','));
    });

    const csvString = csv.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estoque.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Função para exportar PDF (usando jsPDF)
  exportarPDFBtn.addEventListener('click', () => {
    import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(jsPDFModule => {
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      const rows = [];
      const headers = [];

      table.querySelectorAll('thead th').forEach(th => headers.push(th.innerText.trim()));
      table.querySelectorAll('tbody tr').forEach(tr => {
        let rowData = [];
        tr.querySelectorAll('td').forEach(td => rowData.push(td.innerText.trim()));
        rows.push(rowData);
      });

      doc.text('Controle de Estoque - Willy Imports', 14, 15);
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 25,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [233, 30, 99] },
      });

      doc.save('estoque.pdf');
    });
  });

  // Função para tratar clique em vender (excluir linha com valor pago)
  table.addEventListener('click', (e) => {
    if (e.target.classList.contains('vender-btn')) {
      const tr = e.target.closest('tr');
      const produto = tr.querySelector('td:first-child').innerText;
      const quantidade = tr.querySelector('td:nth-child(2)').innerText;

      let valorPago = prompt(`Digite o valor pago pelo cliente para o produto "${produto}" (Qtd: ${quantidade}):`, '');
      if (valorPago !== null && valorPago.trim() !== '') {
        // Aqui você pode salvar o valorPago em algum lugar ou processar
        alert(`Venda registrada: Produto "${produto}" vendido por R$ ${valorPago}`);
        tr.remove();
      }
    }
  });
});
