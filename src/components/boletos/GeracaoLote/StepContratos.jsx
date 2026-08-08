import React, { useEffect, useMemo, useState } from "react";

import "./StepContratos.css";

function formatCurrency(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "R$ 0,00";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

export default function StepContratos({
  value,
  onChange,
  onNext,
  onBack,
  contratos = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(
    value?.contracts?.map(
      (contract) => contract.id
    ) || []
  );

  const filteredContracts = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return contratos;
    }

    return contratos.filter((contract) => {
      const clientName =
        contract.client?.name ||
        contract.customer?.name ||
        contract.client_name ||
        "";

      const document =
        contract.client?.document ||
        contract.customer?.document ||
        contract.document ||
        "";

      const number =
        contract.number ||
        contract.id ||
        "";

      return (
        clientName
          .toLowerCase()
          .includes(term) ||
        document
          .toLowerCase()
          .includes(term) ||
        String(number)
          .toLowerCase()
          .includes(term)
      );
    });
  }, [contratos, search]);

  const allVisibleSelected =
    filteredContracts.length > 0 &&
    filteredContracts.every((contract) =>
      selectedIds.includes(contract.id)
    );

  useEffect(() => {
    const selectedContracts = contratos.filter(
      (contract) =>
        selectedIds.includes(contract.id)
    );

    onChange?.({
      ...value,
      contracts: selectedContracts,
    });
  }, [selectedIds]);

  function toggleContract(contract) {
    setSelectedIds((current) => {
      if (current.includes(contract.id)) {
        return current.filter(
          (id) => id !== contract.id
        );
      }

      return [
        ...current,
        contract.id,
      ];
    });
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) =>
            !filteredContracts.some(
              (contract) =>
                contract.id === id
            )
        )
      );

      return;
    }

    setSelectedIds((current) => [
      ...new Set([
        ...current,
        ...filteredContracts.map(
          (contract) => contract.id
        ),
      ]),
    ]);
  }

  function handleNext() {
    if (selectedIds.length === 0) {
      return;
    }

    const selectedContracts =
      contratos.filter((contract) =>
        selectedIds.includes(contract.id)
      );

    onNext?.({
      ...value,
      contracts: selectedContracts,
    });
  }

  return (
    <div className="step-contratos">

      <div className="step-contratos-header">
        <div>
          <span className="step-contratos-eyebrow">
            ETAPA 2
          </span>

          <h2>
            Selecione os contratos
          </h2>

          <p>
            Escolha os contratos que terão
            boletos gerados neste lote.
          </p>
        </div>

        <div className="step-contratos-counter">
          <strong>
            {selectedIds.length}
          </strong>

          <span>
            selecionado
            {selectedIds.length === 1
              ? ""
              : "s"}
          </span>
        </div>
      </div>

      <div className="step-contratos-toolbar">

        <div className="step-contratos-search">
          <input
            type="text"
            placeholder="Buscar cliente, CPF/CNPJ ou contrato..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="step-contratos-select-all"
          onClick={toggleAllVisible}
          disabled={
            filteredContracts.length === 0
          }
        >
          {allVisibleSelected
            ? "Desmarcar todos"
            : "Selecionar todos"}
        </button>

      </div>

      <div className="step-contratos-list">

        {loading ? (
          <div className="step-contratos-state">
            Carregando contratos...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="step-contratos-state">
            Nenhum contrato encontrado.
          </div>
        ) : (
          filteredContracts.map(
            (contract) => {

              const selected =
                selectedIds.includes(
                  contract.id
                );

              const client =
                contract.client ||
                contract.customer ||
                {};

              const installments =
                contract.installments ||
                contract.parcelas ||
                [];

              const openInstallments =
                installments.filter(
                  (item) =>
                    !item.boleto &&
                    !item.bill &&
                    item.status !==
                      "PAID"
                );

              return (
                <button
                  type="button"
                  key={contract.id}
                  className={`step-contratos-item ${
                    selected
                      ? "step-contratos-item-selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleContract(
                      contract
                    )
                  }
                >

                  <div className="step-contratos-checkbox">
                    <span
                      className={
                        selected
                          ? "step-contratos-check-selected"
                          : ""
                      }
                    >
                      {selected ? "✓" : ""}
                    </span>
                  </div>

                  <div className="step-contratos-client">

                    <strong>
                      {client.name ||
                        contract.client_name ||
                        "Cliente não informado"}
                    </strong>

                    <span>
                      {client.document ||
                        contract.document ||
                        "Documento não informado"}
                    </span>

                  </div>

                  <div className="step-contratos-number">

                    <span>
                      Contrato
                    </span>

                    <strong>
                      #
                      {contract.number ||
                        contract.id}
                    </strong>

                  </div>

                  <div className="step-contratos-installments">

                    <strong>
                      {openInstallments.length}
                    </strong>

                    <span>
                      parcelas disponíveis
                    </span>

                  </div>

                  <div className="step-contratos-value">

                    <span>
                      Valor
                    </span>

                    <strong>
                      {formatCurrency(
                        contract.amount ||
                          contract.total_amount ||
                          0
                      )}
                    </strong>

                  </div>

                  <div className="step-contratos-due">

                    <span>
                      Próximo vencimento
                    </span>

                    <strong>
                      {formatDate(
                        contract.next_due_date
                      )}
                    </strong>

                  </div>

                </button>
              );
            }
          )
        )}

      </div>

      <div className="step-contratos-summary">

        <div>
          <span>
            Contratos selecionados
          </span>

          <strong>
            {selectedIds.length}
          </strong>
        </div>

        <div>
          <span>
            Parcelas disponíveis
          </span>

          <strong>
            {contratos
              .filter((contract) =>
                selectedIds.includes(
                  contract.id
                )
              )
              .reduce(
                (total, contract) => {
                  const installments =
                    contract.installments ||
                    contract.parcelas ||
                    [];

                  return (
                    total +
                    installments.filter(
                      (item) =>
                        !item.boleto &&
                        !item.bill &&
                        item.status !==
                          "PAID"
                    ).length
                  );
                },
                0
              )}
          </strong>
        </div>

      </div>

      <div className="step-contratos-footer">

        <button
          type="button"
          className="step-contratos-button-secondary"
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          type="button"
          className="step-contratos-button-primary"
          disabled={selectedIds.length === 0}
          onClick={handleNext}
        >
          Continuar
        </button>

      </div>

    </div>
  );
}