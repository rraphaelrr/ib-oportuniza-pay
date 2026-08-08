import React, { useMemo, useState } from "react";

import BoletoFilters from "../../components/boletos/BoletoFilters";
import BoletoTable from "../../components/boletos/BoletoTable";

import "./BoletosLista.css";
import DashboardLayout from "../../layout/DashboardLayout";


export default function BoletosLista({
  boletos = [],
  loading = false,

  onViewBoleto,
  onDownloadBoleto,
  onCancelBoleto,
  onViewClient,
  onViewContract,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [period, setPeriod] = useState("ALL");

  /*
   * Filtragem dos boletos.
   *
   * A API poderá futuramente fazer essa filtragem no backend,
   * mas manteremos essa camada aqui para o funcionamento do front
   * enquanto a integração não estiver fechada.
   */
  const filteredBoletos = useMemo(() => {
    let result = [...boletos];

    // ---------------------------------------------------------
    // BUSCA
    // ---------------------------------------------------------

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((boleto) => {
        const clientName =
          boleto.client?.name ||
          boleto.payer?.name ||
          boleto.customer?.name ||
          "";

        const document =
          boleto.client?.document ||
          boleto.payer?.document ||
          boleto.customer?.document ||
          "";

        const boletoId = boleto.id || "";

        const contractNumber =
          boleto.contract?.number || boleto.contract?.id || "";

        const digitableLine = boleto.digitable_line || boleto.barcode || "";

        const searchableText = [
          clientName,
          document,
          boletoId,
          contractNumber,
          digitableLine,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    // ---------------------------------------------------------
    // STATUS
    // ---------------------------------------------------------

    if (status !== "ALL") {
      result = result.filter(
        (boleto) => String(boleto.status || "").toUpperCase() === status,
      );
    }

    // ---------------------------------------------------------
    // PERÍODO
    // ---------------------------------------------------------

    if (period !== "ALL") {
      const now = new Date();

      const startDate = new Date(now);

      switch (period) {
        case "TODAY":
          startDate.setHours(0, 0, 0, 0);
          break;

        case "7_DAYS":
          startDate.setDate(now.getDate() - 7);
          break;

        case "30_DAYS":
          startDate.setDate(now.getDate() - 30);
          break;

        case "90_DAYS":
          startDate.setDate(now.getDate() - 90);
          break;

        default:
          break;
      }

      if (period !== "ALL") {
        result = result.filter((boleto) => {
          const boletoDate = boleto.due_date || boleto.created_at;

          if (!boletoDate) {
            return false;
          }

          const parsedDate = new Date(boletoDate);

          if (Number.isNaN(parsedDate.getTime())) {
            return false;
          }

          return parsedDate >= startDate;
        });
      }
    }

    return result;
  }, [boletos, search, status, period]);

  // ---------------------------------------------------------
  // LIMPAR FILTROS
  // ---------------------------------------------------------

  function handleClearFilters() {
    setSearch("");
    setStatus("ALL");
    setPeriod("ALL");
  }

  // ---------------------------------------------------------
  // AÇÕES
  // ---------------------------------------------------------

  function handleView(boleto) {
    onViewBoleto?.(boleto);
  }

  function handleDownload(boleto) {
    onDownloadBoleto?.(boleto);
  }

  function handleCancel(boleto) {
    onCancelBoleto?.(boleto);
  }

  // ---------------------------------------------------------
  // RESUMO
  // ---------------------------------------------------------

  const hasFilters =
    search.trim() !== "" || status !== "ALL" || period !== "ALL";

  return (
    <DashboardLayout>

    <div className="boletos-lista">
      {/* ---------------------------------------------------
          CABEÇALHO
          --------------------------------------------------- */}

      <div className="boletos-lista-header">
        <div>
          <h1>Boletos</h1>

          <p>Gerencie cobranças, vencimentos e pagamentos.</p>
        </div>
      </div>

      {/* ---------------------------------------------------
          FILTROS
      --------------------------------------------------- */}

      <BoletoFilters
        search={search}
        status={status}
        period={period}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPeriodChange={setPeriod}
        onClear={handleClearFilters}
      />

      {/* ---------------------------------------------------
          RESUMO DOS RESULTADOS
      --------------------------------------------------- */}

      <div className="boletos-lista-summary">
        <span>
          {filteredBoletos.length}{" "}
          {filteredBoletos.length === 1
            ? "boleto encontrado"
            : "boletos encontrados"}
        </span>

        {hasFilters && (
          <span className="boletos-lista-summary-filtered">
            Filtros aplicados
          </span>
        )}
      </div>

      {/* ---------------------------------------------------
          TABELA
      --------------------------------------------------- */}

      <BoletoTable
        boletos={filteredBoletos}
        loading={loading}
        onView={handleView}
        onDownload={handleDownload}
        onCancel={handleCancel}
        onViewClient={onViewClient}
        onViewContract={onViewContract}
      />
    </div>
        </DashboardLayout>
  );
}
