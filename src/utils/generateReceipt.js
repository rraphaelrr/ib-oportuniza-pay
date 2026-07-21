// utils/generateReceipt.js

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Gera um PDF do comprovante
 */
export async function downloadReceiptPDF(
  elementId,
  fileName = "Comprovante_PIX",
) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error("Elemento não encontrado:", elementId);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;
  }

  const pdfBlob = pdf.output("blob");

  const pdfUrl = URL.createObjectURL(pdfBlob);

  window.open(pdfUrl, "_blank");

  pdf.save(`${fileName}.pdf`);
}

/**
 * Baixa como imagem PNG
 */
export async function downloadReceiptImage(
  elementId,
  fileName = "Comprovante_PIX",
) {
  const element = document.getElementById(elementId);

  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const image = canvas.toDataURL("image/png");

  const link = document.createElement("a");

  link.href = image;

  link.download = `${fileName}.png`;

  link.click();
}

/**
 * Compartilha (Web Share API)
 */
export async function shareReceipt(elementId, fileName = "Comprovante_PIX") {
  if (!navigator.share) {
    alert("Seu navegador não suporta compartilhamento.");
    return;
  }

  const element = document.getElementById(elementId);

  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  canvas.toBlob(async (blob) => {
    const file = new File([blob], `${fileName}.png`, {
      type: "image/png",
    });

    try {
      await navigator.share({
        title: "Comprovante PIX",
        text: "Comprovante da transação.",
        files: [file],
      });
    } catch (err) {
      console.log(err);
    }
  });
}

/**
 * Imprime o comprovante
 */
export function printReceipt(elementId) {
  const element = document.getElementById(elementId);

  if (!element) return;

  const popup = window.open("", "_blank");

  popup.document.write(`
    <html>
      <head>
        <title>Comprovante</title>
        <style>
          body{
            font-family:Arial;
            margin:40px;
            background:#FFF;
          }
        </style>
      </head>

      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);

  popup.document.close();

  popup.focus();

  setTimeout(() => {
    popup.print();
    popup.close();
  }, 400);
}

/**
 * Copia texto para área de transferência
 */
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);

  alert("Copiado com sucesso!");
}

/**
 * Gera um código EndToEnd fictício
 */
export function generateEndToEnd() {
  return "E" + Date.now() + Math.random().toString().substring(2, 18);
}

/**
 * Gera um TXID fictício
 */
export function generateTxId() {
  return "TX" + Math.random().toString(36).substring(2, 14).toUpperCase();
}

/**
 * Gera código de autenticação
 */
export function generateAuthenticationCode() {
  return (
    Math.random().toString(36).substring(2, 12).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 12).toUpperCase()
  );
}
