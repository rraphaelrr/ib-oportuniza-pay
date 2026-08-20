import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, Search, WalletCards } from "lucide-react";


import DashboardLayout from "../../../layout/DashboardLayout";


import "./Ofertas.css";
import OfferCard from "../../../components/antecipacao/OfferCard";
import useAntecipacao from "../../../hooks/useAntecipacao";

export default function Ofertas({
  advanceId,
  onBack,
  onAccepted,
}) {
  const {
    getOffers,
    acceptOffer,
    loading,
    error,
  } = useAntecipacao();

  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [localError, setLocalError] = useState("");

  async function loadOffers() {
    if (!advanceId) return;

    setLocalError("");

    try {
      const response = await getOffers(advanceId);

      setOffers(Array.isArray(response) ? response : []);
    } catch (err) {
      setLocalError(
        err?.response?.data?.message ||
          err?.message ||
          "Não foi possível carregar as ofertas."
      );
    }
  }

  useEffect(() => {
    loadOffers();
  }, [advanceId]);

  const filteredOffers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return offers;
    }

    return offers.filter((offer) => {
      const name =
        offer.funding_partner_name ||
        offer.fundingPartnerName ||
        "";

      const status = offer.status || "";

      return (
        String(name).toLowerCase().includes(term) ||
        String(status).toLowerCase().includes(term)
      );
    });
  }, [offers, search]);

  const activeOffers = useMemo(
    () =>
      offers.filter(
        (offer) =>
          String(offer.status || "").toUpperCase() === "ACTIVE"
      ),
    [offers]
  );

  async function handleAccept(offer) {
    if (!advanceId || !offer?.id || acceptingId) {
      return;
    }

    const confirmed = window.confirm(
      "Deseja aceitar esta proposta de antecipação?"
    );

    if (!confirmed) {
      return;
    }

    setLocalError("");
    setAcceptingId(offer.id);

    try {
      const acceptedOffer = await acceptOffer(
        advanceId,
        offer.id
      );

      setOffers((current) =>
        current.map((item) =>
          item.id === offer.id
            ? {
                ...item,
                ...(acceptedOffer || {}),
                status:
                  acceptedOffer?.status || "ACTIVE",
              }
            : item
        )
      );

      if (onAccepted) {
        onAccepted(acceptedOffer || offer);
      }
    } catch (err) {
      setLocalError(
        err?.response?.data?.message ||
          err?.message ||
          "Não foi possível aceitar a proposta."
      );
    } finally {
      setAcceptingId(null);
    }
  }

  const currentError = localError || error;

  return (
    <DashboardLayout>

    <div className="ofertas-container">
      <div className="ofertas-header">
        <div className="ofertas-header-left">
          <button
            type="button"
            className="ofertas-back-button"
            onClick={onBack}
            disabled={loading || Boolean(acceptingId)}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <span className="ofertas-eyebrow">
              ANTECIPAÇÃO
            </span>

            <h2>Ofertas recebidas</h2>

            <p>
              Compare as propostas dos fundos e escolha a
              melhor condição para sua antecipação.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="ofertas-refresh-button"
          onClick={loadOffers}
          disabled={loading || Boolean(acceptingId)}
        >
          <RefreshCw
            size={16}
            className={loading ? "ofertas-spin" : ""}
          />

          Atualizar
        </button>
      </div>

      <div className="ofertas-content">
        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="ofertas-summary">
          <div className="ofertas-summary-item">
            <div className="ofertas-summary-icon">
              <WalletCards size={18} />
            </div>

            <div>
              <span>Total de ofertas</span>

              <strong>{offers.length}</strong>
            </div>
          </div>

          <div className="ofertas-summary-item">
            <div className="ofertas-summary-icon">
              <WalletCards size={18} />
            </div>

            <div>
              <span>Ofertas disponíveis</span>

              <strong>{activeOffers.length}</strong>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="ofertas-toolbar">
          <div className="ofertas-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por fundo..."
            />
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {currentError && (
          <div className="ofertas-error">
            <span>{currentError}</span>

            <button
              type="button"
              onClick={loadOffers}
              disabled={loading}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && offers.length === 0 && (
          <div className="ofertas-loading">
            <div className="ofertas-loading-spinner" />

            <span>Carregando ofertas...</span>
          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading && !currentError && offers.length === 0 && (
          <div className="ofertas-empty">
            <div className="ofertas-empty-icon">
              <WalletCards size={24} />
            </div>

            <h3>Nenhuma oferta recebida</h3>

            <p>
              Quando os fundos analisarem sua solicitação,
              as propostas aparecerão nesta tela.
            </p>

            <button
              type="button"
              className="ofertas-empty-button"
              onClick={loadOffers}
            >
              <RefreshCw size={15} />

              Atualizar ofertas
            </button>
          </div>
        )}

        {/* =====================================================
            NO SEARCH RESULTS
        ===================================================== */}

        {!loading &&
          offers.length > 0 &&
          filteredOffers.length === 0 && (
            <div className="ofertas-empty ofertas-empty-small">
              <Search size={21} />

              <span>
                Nenhuma oferta encontrada para sua busca.
              </span>
            </div>
          )}

        {/* =====================================================
            OFFERS
        ===================================================== */}

        {filteredOffers.length > 0 && (
          <div className="ofertas-list">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onAccept={() => handleAccept(offer)}
                accepting={acceptingId === offer.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}