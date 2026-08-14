import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import BoletoFilters from "../../components/boletos/BoletoFilters";
import BoletoTable from "../../components/boletos/BoletoTable";

import "./BoletosLista.css";
import DashboardLayout from "../../layout/DashboardLayout";

import boletoService from "../../services/boletoService";

export default function BoletosLista({
  onViewBoleto,
  onDownloadBoleto,
  onCancelBoleto,
  onViewClient,
  onViewContract,
}) {
  const navigate = useNavigate();

  // =========================================================
  // ESTADOS
  // =========================================================

  const [boletos, setBoletos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [period, setPeriod] = useState("ALL");

  // =========================================================
  // CARREGAR BOLETOS
  // =========================================================

  useEffect(() => {
    carregarBoletos();
  }, []);

  async function carregarBoletos() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await boletoService.listarBoletos();

      /*
       * O service pode retornar:
       *
       * [
       *   boleto,
       *   boleto,
       * ]
       *
       * ou:
       *
       * {
       *   data: [...]
       * }
       *
       * ou:
       *
       * {
       *   boletos: [...]
       * }
       */

      let lista = [];

      if (Array.isArray(response)) {
        lista = response;
      } else if (
        Array.isArray(response?.data)
      ) {
        lista = response.data;
      } else if (
        Array.isArray(response?.boletos)
      ) {
        lista = response.boletos;
      }

      setBoletos(lista);
    } catch (err) {
      console.error(
        "Erro ao carregar boletos:",
        err,
      );

      setError(
        err?.message ||
          "Não foi possível carregar os boletos.",
      );

      setBoletos([]);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // NORMALIZAÇÃO
  // =========================================================

  const safeBoletos = Array.isArray(boletos)
    ? boletos
    : [];

  // =========================================================
  // FILTRAGEM
  // =========================================================

  const filteredBoletos = useMemo(() => {
    let result = [...safeBoletos];

    const normalizedSearch = search
      .trim()
      .toLowerCase();

    // =======================================================
    // BUSCA
    // =======================================================

    if (normalizedSearch) {
      result = result.filter((boleto) => {
        const clientName =
          boleto?.client?.name ||
          boleto?.payer?.name ||
          boleto?.customer?.name ||
          boleto?.cliente ||
          "";

        const document =
          boleto?.client?.document ||
          boleto?.payer?.document ||
          boleto?.customer?.document ||
          boleto?.document ||
          boleto?.document_number ||
          "";

        const boletoId =
          boleto?.id ||
          boleto?.number ||
          boleto?.numero ||
          boleto?.external_id ||
          "";

        const contractNumber =
          boleto?.contract?.number ||
          boleto?.contract?.id ||
          boleto?.contrato ||
          "";

        const digitableLine =
          boleto?.digitable_line ||
          boleto?.digitableLine ||
          boleto?.barcode ||
          boleto?.linha_digitavel ||
          "";

        const searchableText = [
          clientName,
          document,
          boletoId,
          contractNumber,
          digitableLine,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch,
        );
      });
    }

    // =======================================================
    // STATUS
    // =======================================================

    if (status !== "ALL") {
      result = result.filter((boleto) => {
        const boletoStatus = String(
          boleto?.status || "",
        ).toUpperCase();

        return boletoStatus === status;
      });
    }

    // =======================================================
    // PERÍODO
    // =======================================================

    if (period !== "ALL") {
      const now = new Date();

      const startDate = new Date(now);

      switch (period) {
        case "TODAY":
          startDate.setHours(0, 0, 0, 0);
          break;

        case "7_DAYS":
          startDate.setDate(
            now.getDate() - 7,
          );
          break;

        case "30_DAYS":
          startDate.setDate(
            now.getDate() - 30,
          );
          break;

        case "90_DAYS":
          startDate.setDate(
            now.getDate() - 90,
          );
          break;

        default:
          break;
      }

      result = result.filter((boleto) => {
        const boletoDate =
          boleto?.due_date ||
          boleto?.dueDate ||
          boleto?.vencimento ||
          boleto?.created_at ||
          boleto?.createdAt;

        if (!boletoDate) {
          return false;
        }

        const parsedDate =
          new Date(boletoDate);

        if (
          Number.isNaN(
            parsedDate.getTime(),
          )
        ) {
          return false;
        }

        return parsedDate >= startDate;
      });
    }

    return result;
  }, [
    safeBoletos,
    search,
    status,
    period,
  ]);

  // =========================================================
  // LIMPAR FILTROS
  // =========================================================

  function handleClearFilters() {
    setSearch("");
    setStatus("ALL");
    setPeriod("ALL");
  }

  // =========================================================
  // AÇÕES
  // =========================================================

  function handleView(boleto) {
    if (typeof onViewBoleto === "function") {
      onViewBoleto(boleto);
      return;
    }

    const id =
      boleto?.id ||
      boleto?.number ||
      boleto?.numero;

    if (!id) {
      return;
    }

    navigate(
      `/boletos/${encodeURIComponent(id)}`,
    );
  }

  async function handleDownload(boleto) {
    if (
      typeof onDownloadBoleto ===
      "function"
    ) {
      onDownloadBoleto(boleto);
      return;
    }

    try {
      if (
        typeof boletoService.baixarBoleto ===
        "function"
      ) {
        await boletoService.baixarBoleto(
          boleto,
        );
      } else {
        console.log(
          "Download do boleto:",
          boleto,
        );
      }
    } catch (err) {
      console.error(
        "Erro ao baixar boleto:",
        err,
      );
    }
  }

  async function handleCancel(boleto) {
    if (
      typeof onCancelBoleto ===
      "function"
    ) {
      onCancelBoleto(boleto);
      return;
    }

    const id =
      boleto?.id ||
      boleto?.number ||
      boleto?.numero;

    if (!id) {
      return;
    }

    try {
      if (
        typeof boletoService.cancelarBoleto ===
        "function"
      ) {
        await boletoService.cancelarBoleto(id);

        await carregarBoletos();
      } else {
        console.log(
          "Cancelar boleto:",
          boleto,
        );
      }
    } catch (err) {
      console.error(
        "Erro ao cancelar boleto:",
        err,
      );
    }
  }

  // =========================================================
  // ESTADO DOS FILTROS
  // =========================================================

  const hasFilters =
    search.trim() !== "" ||
    status !== "ALL" ||
    period !== "ALL";

  // =========================================================
  // RENDER - ERRO
  // =========================================================

  if (error) {
    return (
      <DashboardLayout>
        <div className="boletos-lista">
          <div className="boletos-lista-header">
            <div className="boletos-lista-header-main">
              <span className="boletos-lista-eyebrow">
                Cobranças
              </span>

              <h1>Boletos</h1>

              <p>
                Gerencie cobranças, vencimentos
                e pagamentos.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            <h2>
              Não foi possível carregar os boletos
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="boletos-button primary"
              onClick={carregarBoletos}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <DashboardLayout>
      <div className="boletos-lista">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="boletos-lista-header">
          <div className="boletos-lista-header-main">

            <span className="boletos-lista-eyebrow">
              Cobranças
            </span>

            <h1>Boletos</h1>

            <p>
              Gerencie cobranças, vencimentos
              e pagamentos.
            </p>

          </div>
        </div>

        {/* ===================================================
            FILTROS
        ==================================================== */}

        <div className="boletos-lista-filters">

          <BoletoFilters
            search={search}
            status={status}
            period={period}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPeriodChange={setPeriod}
            onClear={handleClearFilters}
          />

        </div>

        {/* ===================================================
            RESUMO
        ==================================================== */}

        <div className="boletos-lista-summary">

          <span>

            {loading
              ? "Carregando..."
              : `${filteredBoletos.length} ${
                  filteredBoletos.length === 1
                    ? "boleto encontrado"
                    : "boletos encontrados"
                }`}

          </span>

          {hasFilters && (
            <span className="boletos-lista-summary-filtered">
              Filtros aplicados
            </span>
          )}

        </div>

        {/* ===================================================
            TABELA
        ==================================================== */}

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