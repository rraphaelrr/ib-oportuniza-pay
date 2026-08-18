import jsPDF from "jspdf";

/* =========================================================
   FORMATAÇÃO
========================================================= */

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function dateBR(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("pt-BR");
}

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

/* =========================================================
   BARCODE FAKE
   Visual semelhante a código de barras.
   NÃO É VÁLIDO PARA PAGAMENTO.
========================================================= */

function drawFakeBarcode(doc, value, x, y, width, height) {
  const numbers = onlyNumbers(value);

  if (!numbers) return;

  let cursor = x;

  const patterns = [
    [1, 2],
    [2, 1],
    [1, 3],
    [3, 1],
    [2, 2],
    [1, 1],
  ];

  for (let i = 0; i < numbers.length && cursor < x + width; i++) {
    const digit = Number(numbers[i]);

    const pattern = patterns[digit % patterns.length];

    const total = pattern[0] + pattern[1];

    const barWidth = Math.max(
      0.6,
      (width / numbers.length) * pattern[0] / total
    );

    const spaceWidth = Math.max(
      0.4,
      (width / numbers.length) * pattern[1] / total
    );

    doc.setFillColor(0, 0, 0);

    doc.rect(
      cursor,
      y,
      barWidth,
      height,
      "F"
    );

    cursor += barWidth + spaceWidth;
  }
}

/* =========================================================
   LINHA
========================================================= */

function drawLine(doc, x1, y1, x2, y2) {
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.25);
  doc.line(x1, y1, x2, y2);
}

/* =========================================================
   CAMPO
========================================================= */

function field(
  doc,
  label,
  value,
  x,
  y,
  width,
  height = 12
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(90, 90, 90);

  doc.text(label, x + 2, y + 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);

  doc.text(
    String(value || "-"),
    x + 2,
    y + 9,
    {
      maxWidth: width - 4,
    }
  );

  doc.rect(x, y, width, height);
}

/* =========================================================
   PDF
========================================================= */

export function gerarBoletoPDF(boleto) {
  if (!boleto) {
    throw new Error(
      "Boleto não informado."
    );
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;

  const margin = 12;

  const contentWidth =
    pageWidth - margin * 2;

  let y = 12;

  /* =====================================================
     MARCA DE DEMONSTRAÇÃO
  ===================================================== */

  doc.setFillColor(245, 245, 245);

  doc.rect(
    margin,
    y,
    contentWidth,
    12,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.setTextColor(40, 40, 40);

  doc.text(
    "BANCO DEMONSTRAÇÃO",
    margin + 4,
    y + 8
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    `Código bancário: ${boleto.bank?.code || "001"}`,
    pageWidth - margin - 4,
    y + 5,
    {
      align: "right",
    }
  );

  doc.text(
    "BOLETO DE DEMONSTRAÇÃO",
    pageWidth - margin - 4,
    y + 9,
    {
      align: "right",
    }
  );

  y += 16;

  /* =====================================================
     AVISO
  ===================================================== */

  doc.setFillColor(255, 248, 220);

  doc.rect(
    margin,
    y,
    contentWidth,
    10,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);

  doc.setTextColor(130, 90, 0);

  doc.text(
    "DOCUMENTO FICTÍCIO — SEM VALOR PARA PAGAMENTO",
    pageWidth / 2,
    y + 6.5,
    {
      align: "center",
    }
  );

  y += 14;

  /* =====================================================
     CABEÇALHO DO BOLETO
  ===================================================== */

  const bankWidth = 42;
  const lineWidth = contentWidth - bankWidth;

  doc.setDrawColor(30, 30, 30);

  doc.rect(
    margin,
    y,
    bankWidth,
    18
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.setTextColor(0, 0, 0);

  doc.text(
    boleto.bank?.code || "001",
    margin + bankWidth / 2,
    y + 12,
    {
      align: "center",
    }
  );

  doc.rect(
    margin + bankWidth,
    y,
    lineWidth,
    18
  );

  doc.setFontSize(8);

  doc.text(
    "Linha digitável",
    margin + bankWidth + 4,
    y + 5
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    boleto.linha_digitavel || "-",
    margin + bankWidth + 4,
    y + 12
  );

  y += 22;

  /* =====================================================
     DADOS DO BOLETO
  ===================================================== */

  field(
    doc,
    "Número do documento",
    boleto.numero_documento,
    margin,
    y,
    55
  );

  field(
    doc,
    "Nosso número",
    boleto.nosso_numero,
    margin + 55,
    y,
    55
  );

  field(
    doc,
    "Vencimento",
    dateBR(boleto.due_date),
    margin + 110,
    y,
    contentWidth - 110
  );

  y += 12;

  field(
    doc,
    "Data de emissão",
    boleto.created_at
      ? new Date(
          boleto.created_at
        ).toLocaleDateString("pt-BR")
      : dateBR(new Date().toISOString().slice(0, 10)),
    margin,
    y,
    55
  );

  field(
    doc,
    "Agência / Conta",
    `${boleto.bank?.agency || "0001"} / ${
      boleto.bank?.account || "123456-7"
    }`,
    margin + 55,
    y,
    55
  );

  field(
    doc,
    "Valor do documento",
    money(boleto.amount),
    margin + 110,
    y,
    contentWidth - 110
  );

  y += 16;

  /* =====================================================
     PAGADOR
  ===================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "PAGADOR",
    margin,
    y
  );

  y += 3;

  const client = boleto.client || {};

  field(
    doc,
    "Nome",
    client.name,
    margin,
    y,
    105,
    14
  );

  field(
    doc,
    "CPF / CNPJ",
    client.document,
    margin + 105,
    y,
    contentWidth - 105,
    14
  );

  y += 17;

  field(
    doc,
    "E-mail",
    client.email,
    margin,
    y,
    105,
    14
  );

  field(
    doc,
    "Contrato",
    boleto.contract?.number ||
      boleto.contract_id,
    margin + 105,
    y,
    contentWidth - 105,
    14
  );

  y += 18;

  /* =====================================================
     BENEFICIÁRIO
  ===================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "BENEFICIÁRIO",
    margin,
    y
  );

  y += 3;

  field(
    doc,
    "Nome",
    "Oportuniza Pay — Demonstração",
    margin,
    y,
    105,
    14
  );

  field(
    doc,
    "Agência / Conta",
    `${boleto.bank?.agency || "0001"} / ${
      boleto.bank?.account || "123456-7"
    }`,
    margin + 105,
    y,
    contentWidth - 105,
    14
  );

  y += 18;

  /* =====================================================
     DESCRIÇÃO
  ===================================================== */

  field(
    doc,
    "Descrição",
    boleto.description || "Cobrança",
    margin,
    y,
    contentWidth,
    16
  );

  y += 20;

  /* =====================================================
     INSTRUÇÕES
  ===================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "INSTRUÇÕES",
    margin,
    y
  );

  y += 3;

  doc.rect(
    margin,
    y,
    contentWidth,
    28
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const instructions = [];

  if (boleto.instructions) {
    instructions.push(
      boleto.instructions
    );
  }

  if (boleto.discount) {
    if (
      boleto.discount.type ===
      "PERCENTAGE"
    ) {
      instructions.push(
        `Desconto: ${boleto.discount.value}%`
      );
    } else {
      instructions.push(
        `Desconto: ${money(
          boleto.discount.value
        )}`
      );
    }
  }

  if (boleto.interest) {
    instructions.push(
      `Juros: ${boleto.interest}%`
    );
  }

  if (boleto.fine) {
    instructions.push(
      `Multa: ${boleto.fine}%`
    );
  }

  if (!instructions.length) {
    instructions.push(
      "Não existem instruções adicionais."
    );
  }

  instructions.forEach(
    (instruction, index) => {
      doc.text(
        `• ${instruction}`,
        margin + 4,
        y + 7 + index * 5,
        {
          maxWidth:
            contentWidth - 8,
        }
      );
    }
  );

  y += 34;

  /* =====================================================
     VALOR
  ===================================================== */

  doc.setFillColor(248, 248, 248);

  doc.rect(
    margin,
    y,
    contentWidth,
    18,
    "F"
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.setTextColor(80, 80, 80);

  doc.text(
    "VALOR DO DOCUMENTO",
    margin + 4,
    y + 6
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.setTextColor(0, 0, 0);

  doc.text(
    money(boleto.amount),
    pageWidth - margin - 4,
    y + 12,
    {
      align: "right",
    }
  );

  y += 24;

  /* =====================================================
     CÓDIGO DE BARRAS
  ===================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "CÓDIGO DE BARRAS",
    margin,
    y
  );

  y += 4;

  drawFakeBarcode(
    doc,
    boleto.barcode,
    margin,
    y,
    contentWidth,
    18
  );

  y += 23;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    boleto.barcode || "-",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  y += 10;

  /* =====================================================
     LINHA DIGITÁVEL
  ===================================================== */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "LINHA DIGITÁVEL",
    margin,
    y
  );

  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    boleto.linha_digitavel || "-",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  /* =====================================================
     RODAPÉ
  ===================================================== */

  const footerY = 285;

  drawLine(
    doc,
    margin,
    footerY,
    pageWidth - margin,
    footerY
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);

  doc.setTextColor(100, 100, 100);

  doc.text(
    "Este documento foi gerado para fins de demonstração.",
    margin,
    footerY + 5
  );

  doc.text(
    "BOLETO FICTÍCIO — NÃO UTILIZAR PARA PAGAMENTO.",
    pageWidth - margin,
    footerY + 5,
    {
      align: "right",
    }
  );

  /* =====================================================
     DOWNLOAD
  ===================================================== */

  const fileName =
    `boleto-${boleto.numero_documento || boleto.id}.pdf`;

  doc.save(fileName);

  return fileName;
}