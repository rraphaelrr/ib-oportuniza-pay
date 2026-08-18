import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ClienteCard from "../../components/boletos/ClienteCard";
import DashboardLayout from "../../layout/DashboardLayout";

import { criarCliente } from "../../services/boletoService";

import "./Clientes.css";

/* =========================================================
   UTILITÁRIOS
========================================================= */

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getClientName(cliente) {
  return (
    cliente.name ||
    cliente.nome ||
    cliente.full_name ||
    "Cliente não informado"
  );
}

function getClientDocument(cliente) {
  return (
    cliente.document ||
    cliente.document_number ||
    cliente.cpf ||
    cliente.cnpj ||
    ""
  );
}

function getClientContracts(cliente) {
  return cliente.contracts || cliente.contratos || [];
}

function getClientBoletos(cliente) {
  return cliente.boletos || cliente.bills || [];
}

function getClientOverdue(cliente) {
  if (cliente.overdue_count != null) {
    return Number(cliente.overdue_count);
  }

  if (cliente.inadimplent_count != null) {
    return Number(cliente.inadimplent_count);
  }

  const boletos = getClientBoletos(cliente);

  return boletos.filter(
    (boleto) =>
      String(boleto.status || "").toUpperCase() === "OVERDUE"
  ).length;
}

function getActiveContracts(cliente) {
  const contracts = getClientContracts(cliente);

  return contracts.filter(
    (contract) =>
      String(contract.status || "").toUpperCase() === "ACTIVE"
  ).length;
}

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

/* =========================================================
   MÁSCARAS
========================================================= */

function formatCpf(value) {
  const numbers = onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 3) {
    return numbers;
  }

  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }

  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(
      3,
      6
    )}.${numbers.slice(6)}`;
  }

  return `${numbers.slice(0, 3)}.${numbers.slice(
    3,
    6
  )}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
}

function formatCnpj(value) {
  const numbers = onlyNumbers(value).slice(0, 14);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  }

  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(
      2,
      5
    )}.${numbers.slice(5)}`;
  }

  if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(
      2,
      5
    )}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  }

  return `${numbers.slice(0, 2)}.${numbers.slice(
    2,
    5
  )}.${numbers.slice(5, 8)}/${numbers.slice(
    8,
    12
  )}-${numbers.slice(12)}`;
}

function formatPhone(value) {
  const numbers = onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      6
    )}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(
    2,
    7
  )}-${numbers.slice(7)}`;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function Clientes({
  clientes = [],
  loading = false,
  onBack,
  onViewClient,
  onViewContract,
  onViewBoleto,
  onReloadClientes,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("NAME");

  /*
   * Clientes criados somente para a apresentação.
   *
   * Eles ficam no estado do componente e são adicionados
   * imediatamente à lista.
   */
  const [mockClientesCriados, setMockClientesCriados] =
    useState([]);

  /* =======================================================
     MODAL / CADASTRO
  ======================================================= */

  const [showPayerModal, setShowPayerModal] =
    useState(false);

  const [creatingPayer, setCreatingPayer] =
    useState(false);

  const [payerError, setPayerError] =
    useState("");

  const [payerForm, setPayerForm] = useState({
    name: "",
    document_number: "",
    document_type: "CPF",
    email: "",
    external_id: "",
    metadata: {},
    person_type: "PF",
    phone: "",
  });

  /* =======================================================
     CLIENTES DA LISTA
  ======================================================= */

  const todosClientes = useMemo(() => {
    return [
      ...mockClientesCriados,
      ...clientes,
    ];
  }, [clientes, mockClientesCriados]);

  /* =======================================================
     FILTROS
  ======================================================= */

  const filteredClientes = useMemo(() => {
    let result = [...todosClientes];

    const normalizedSearch = normalize(search);

    /* -------------------------------------------------------
       BUSCA
    ------------------------------------------------------- */

    if (normalizedSearch) {
      result = result.filter((cliente) => {
        const name = normalize(
          getClientName(cliente)
        );

        const document = normalize(
          getClientDocument(cliente)
        );

        const email = normalize(
          cliente.email
        );

        const id = normalize(
          cliente.id
        );

        return [
          name,
          document,
          email,
          id,
        ].some((value) =>
          value.includes(normalizedSearch)
        );
      });
    }

    /* -------------------------------------------------------
       STATUS
    ------------------------------------------------------- */

    if (status !== "ALL") {
      result = result.filter((cliente) => {
        const overdue =
          getClientOverdue(cliente);

        const activeContracts =
          getActiveContracts(cliente);

        if (status === "OVERDUE") {
          return overdue > 0;
        }

        if (status === "ACTIVE") {
          return activeContracts > 0;
        }

        if (status === "REGULAR") {
          return overdue === 0;
        }

        return true;
      });
    }

    /* -------------------------------------------------------
       ORDENAÇÃO
    ------------------------------------------------------- */

    result.sort((a, b) => {
      if (sort === "NAME") {
        return getClientName(a).localeCompare(
          getClientName(b),
          "pt-BR",
          {
            sensitivity: "base",
          }
        );
      }

      if (sort === "OVERDUE") {
        return (
          getClientOverdue(b) -
          getClientOverdue(a)
        );
      }

      if (sort === "CONTRACTS") {
        return (
          getClientContracts(b).length -
          getClientContracts(a).length
        );
      }

      return 0;
    });

    return result;
  }, [
    todosClientes,
    search,
    status,
    sort,
  ]);

  /* =======================================================
     INDICADORES
  ======================================================= */

  const totalClientes =
    todosClientes.length;

  const totalInadimplentes =
    todosClientes.filter(
      (cliente) =>
        getClientOverdue(cliente) > 0
    ).length;

  const totalRegulares = Math.max(
    totalClientes -
      totalInadimplentes,
    0
  );

  /* =======================================================
     AÇÕES
  ======================================================= */

  function handleClear() {
    setSearch("");
    setStatus("ALL");
    setSort("NAME");
  }

  function handleViewClient(cliente) {
    onViewClient?.(cliente);
  }

  /* =======================================================
     MODAL
  ======================================================= */

  function handleOpenPayerModal() {
    setPayerError("");

    setPayerForm({
      name: "",
      document_number: "",
      document_type: "CPF",
      email: "",
      external_id: "",
      metadata: {},
      person_type: "PF",
      phone: "",
    });

    setShowPayerModal(true);
  }

  function handleClosePayerModal() {
    if (creatingPayer) {
      return;
    }

    setShowPayerModal(false);
    setPayerError("");
  }

  /* =======================================================
     FORM
  ======================================================= */

  function handlePayerChange(event) {
    const {
      name,
      value,
    } = event.target;

    setPayerForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePayerPersonTypeChange(
    event
  ) {
    const personType =
      event.target.value;

    setPayerForm((previous) => ({
      ...previous,

      person_type:
        personType,

      document_type:
        personType === "PF"
          ? "CPF"
          : "CNPJ",

      document_number: "",
    }));
  }

  function handlePayerDocumentChange(
    event
  ) {
    const value =
      event.target.value;

    const formatted =
      payerForm.document_type ===
      "CPF"
        ? formatCpf(value)
        : formatCnpj(value);

    setPayerForm((previous) => ({
      ...previous,
      document_number:
        formatted,
    }));
  }

  function handlePayerPhoneChange(
    event
  ) {
    const value =
      formatPhone(
        event.target.value
      );

    setPayerForm((previous) => ({
      ...previous,
      phone: value,
    }));
  }

  /* =======================================================
     CADASTRAR CLIENTE
  ======================================================= */

  async function handleSubmitPayer(
    event
  ) {
    event.preventDefault();

    if (creatingPayer) {
      return;
    }

    setPayerError("");

    try {
      setCreatingPayer(true);

      const payload = {
        document_number:
          onlyNumbers(
            payerForm.document_number
          ),

        document_type:
          payerForm.document_type,

        email:
          payerForm.email.trim(),

        external_id:
          uuidv4(),

        metadata: {},

        name:
          payerForm.name.trim(),

        person_type:
          payerForm.person_type,

        phone:
          onlyNumbers(
            payerForm.phone
          ),
      };

      /*
       * =====================================================
       * MOCK
       * =====================================================
       *
       * O service cria o cliente mockado.
       *
       * Não existe chamada de API porque
       * USE_MOCK = true.
       */
      const novoCliente =
        await criarCliente(
          payload
        );

      /*
       * =====================================================
       * GARANTE OS DADOS USADOS PELA TELA
       * =====================================================
       */

      const clienteParaLista = {
        ...novoCliente,

        id:
          novoCliente?.id ||
          `cli-${uuidv4()}`,

        name:
          novoCliente?.name ||
          payload.name,

        document:
          novoCliente?.document ||
          payload.document_number,

        document_number:
          novoCliente?.document_number ||
          payload.document_number,

        document_type:
          novoCliente?.document_type ||
          payload.document_type,

        person_type:
          novoCliente?.person_type ||
          payload.person_type,

        email:
          novoCliente?.email ||
          payload.email,

        phone:
          novoCliente?.phone ||
          payload.phone,

        contracts:
          novoCliente?.contracts ||
          [],

        boletos:
          novoCliente?.boletos ||
          [],

        overdue_count:
          Number(
            novoCliente?.overdue_count ||
            0
          ),
      };

      /*
       * =====================================================
       * ADICIONA IMEDIATAMENTE NA LISTA
       * =====================================================
       */

      setMockClientesCriados(
        (previous) => [
          clienteParaLista,
          ...previous,
        ]
      );

      /*
       * =====================================================
       * FECHA MODAL
       * =====================================================
       */

      setShowPayerModal(false);

      /*
       * =====================================================
       * LIMPA FORMULÁRIO
       * =====================================================
       */

      setPayerForm({
        name: "",
        document_number: "",
        document_type: "CPF",
        email: "",
        external_id: "",
        metadata: {},
        person_type: "PF",
        phone: "",
      });

      /*
       * =====================================================
       * SE EXISTIR RELOAD EXTERNO, EXECUTA
       * =====================================================
       */

      await onReloadClientes?.();

    } catch (error) {
      console.error(
        "Erro ao cadastrar pagador:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Não foi possível cadastrar o pagador.";

      setPayerError(message);

    } finally {
      setCreatingPayer(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <DashboardLayout>
      <div className="clientes">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="clientes-header">

          <div className="clientes-header-left">

            {onBack && (
              <button
                type="button"
                className="clientes-back"
                onClick={onBack}
                aria-label="Voltar"
                title="Voltar"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
              </button>
            )}

            <div>
              <h1>Clientes</h1>

              <p>
                Consulte clientes, contratos,
                cobranças e situação financeira.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="clientes-add-button"
            onClick={
              handleOpenPayerModal
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>

            Adicionar pagador
          </button>

        </header>

        {/* =================================================
            INDICADORES
        ================================================= */}

        <section className="clientes-summary">

          <div className="clientes-summary-card">
            <span>
              Total de clientes
            </span>

            <strong>
              {totalClientes}
            </strong>
          </div>

          <div className="clientes-summary-card">
            <span>
              Clientes regulares
            </span>

            <strong>
              {totalRegulares}
            </strong>
          </div>

          <div className="clientes-summary-card clientes-summary-card-warning">
            <span>
              Com inadimplência
            </span>

            <strong>
              {totalInadimplentes}
            </strong>
          </div>

        </section>

        {/* =================================================
            FILTROS
        ================================================= */}

        <section className="clientes-filters">

          <div className="clientes-search">

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              placeholder="Buscar por nome, CPF/CNPJ, e-mail..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              aria-label="Buscar clientes"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Limpar busca"
                title="Limpar busca"
              >
                ×
              </button>
            )}

          </div>

          <div className="clientes-filter-group">

            <label htmlFor="cliente-status">
              Situação
            </label>

            <select
              id="cliente-status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                Todos
              </option>

              <option value="REGULAR">
                Regulares
              </option>

              <option value="ACTIVE">
                Com contratos ativos
              </option>

              <option value="OVERDUE">
                Com inadimplência
              </option>
            </select>

          </div>

          <div className="clientes-filter-group">

            <label htmlFor="cliente-sort">
              Ordenar por
            </label>

            <select
              id="cliente-sort"
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
            >
              <option value="NAME">
                Nome
              </option>

              <option value="OVERDUE">
                Inadimplência
              </option>

              <option value="CONTRACTS">
                Número de contratos
              </option>
            </select>

          </div>

          {(search ||
            status !== "ALL" ||
            sort !== "NAME") && (
            <button
              type="button"
              className="clientes-clear"
              onClick={handleClear}
            >
              Limpar filtros
            </button>
          )}

        </section>

        {/* =================================================
            RESULTADOS
        ================================================= */}

        <div className="clientes-results-header">
          <span>
            {filteredClientes.length}{" "}
            {filteredClientes.length === 1
              ? "cliente encontrado"
              : "clientes encontrados"}
          </span>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="clientes-loading">

            <div className="clientes-spinner" />

            <span>
              Carregando clientes...
            </span>

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          filteredClientes.length === 0 && (
            <div className="clientes-empty">

              <div className="clientes-empty-icon">

                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                  />

                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />

                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>

              </div>

              <h2>
                Nenhum cliente encontrado
              </h2>

              <p>
                Tente alterar os filtros ou
                realizar uma nova busca.
              </p>

              {(search ||
                status !== "ALL") && (
                <button
                  type="button"
                  onClick={handleClear}
                >
                  Limpar filtros
                </button>
              )}

            </div>
          )}

        {/* =================================================
            LISTA
        ================================================= */}

        {!loading &&
          filteredClientes.length > 0 && (
            <section className="clientes-list">

              {filteredClientes.map(
                (cliente) => (
                  <div
                    className="cliente-list-item"
                    key={cliente.id}
                  >

                    <ClienteCard
                      cliente={cliente}
                      onClick={() =>
                        handleViewClient(
                          cliente
                        )
                      }
                    />

                    <div className="cliente-list-meta">

                      <div>
                        <span>
                          Contratos
                        </span>

                        <strong>
                          {
                            getClientContracts(
                              cliente
                            ).length
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          Inadimplência
                        </span>

                        <strong
                          className={
                            getClientOverdue(
                              cliente
                            ) > 0
                              ? "cliente-list-overdue"
                              : ""
                          }
                        >
                          {
                            getClientOverdue(
                              cliente
                            )
                          }
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="cliente-list-details"
                        onClick={() =>
                          handleViewClient(
                            cliente
                          )
                        }
                      >
                        Ver detalhes

                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />

                          <path d="m13 6 6 6-6 6" />
                        </svg>

                      </button>

                    </div>

                  </div>
                )
              )}

            </section>
          )}

        {/* =================================================
            MODAL - NOVO PAGADOR
        ================================================= */}

        {showPayerModal && (
          <div
            className="payer-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                  event.currentTarget &&
                !creatingPayer
              ) {
                handleClosePayerModal();
              }
            }}
          >

            <div
              className="payer-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="payer-modal-title"
            >

              {/* HEADER */}

              <div className="payer-modal-header">

                <div>

                  <h2 id="payer-modal-title">
                    Novo pagador
                  </h2>

                  <p>
                    Preencha os dados do pagador.
                  </p>

                </div>

                <button
                  type="button"
                  className="payer-modal-close"
                  onClick={
                    handleClosePayerModal
                  }
                  disabled={creatingPayer}
                  aria-label="Fechar"
                  title="Fechar"
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmitPayer
                }
              >

                <div className="payer-modal-body">

                  {payerError && (
                    <div className="payer-error">
                      {payerError}
                    </div>
                  )}

                  {/* NOME */}

                  <div className="payer-form-group">

                    <label htmlFor="payer-name">
                      Nome
                    </label>

                    <input
                      id="payer-name"
                      name="name"
                      type="text"
                      value={
                        payerForm.name
                      }
                      onChange={
                        handlePayerChange
                      }
                      placeholder="Nome completo ou razão social"
                      required
                      disabled={
                        creatingPayer
                      }
                    />

                  </div>

                  {/* TIPO DE PESSOA / DOCUMENTO */}

                  <div className="payer-form-row">

                    <div className="payer-form-group">

                      <label htmlFor="payer-person-type">
                        Tipo de pessoa
                      </label>

                      <select
                        id="payer-person-type"
                        name="person_type"
                        value={
                          payerForm.person_type
                        }
                        onChange={
                          handlePayerPersonTypeChange
                        }
                        required
                        disabled={
                          creatingPayer
                        }
                      >
                        <option value="PF">
                          Pessoa Física
                        </option>

                        <option value="PJ">
                          Pessoa Jurídica
                        </option>
                      </select>

                    </div>

                    <div className="payer-form-group">

                      <label htmlFor="payer-document-type">
                        Tipo de documento
                      </label>

                      <select
                        id="payer-document-type"
                        name="document_type"
                        value={
                          payerForm.document_type
                        }
                        onChange={
                          handlePayerChange
                        }
                        required
                        disabled={
                          creatingPayer
                        }
                      >
                        <option value="CPF">
                          CPF
                        </option>

                        <option value="CNPJ">
                          CNPJ
                        </option>
                      </select>

                    </div>

                  </div>

                  {/* DOCUMENTO */}

                  <div className="payer-form-group">

                    <label htmlFor="payer-document">
                      Número do documento
                    </label>

                    <input
                      id="payer-document"
                      name="document_number"
                      type="text"
                      inputMode="numeric"
                      value={
                        payerForm.document_number
                      }
                      onChange={
                        handlePayerDocumentChange
                      }
                      placeholder={
                        payerForm.document_type ===
                        "CPF"
                          ? "000.000.000-00"
                          : "00.000.000/0000-00"
                      }
                      maxLength={
                        payerForm.document_type ===
                        "CPF"
                          ? 14
                          : 18
                      }
                      required
                      disabled={
                        creatingPayer
                      }
                    />

                  </div>

                  {/* EMAIL / TELEFONE */}

                  <div className="payer-form-row">

                    <div className="payer-form-group">

                      <label htmlFor="payer-email">
                        E-mail
                      </label>

                      <input
                        id="payer-email"
                        name="email"
                        type="email"
                        value={
                          payerForm.email
                        }
                        onChange={
                          handlePayerChange
                        }
                        placeholder="email@exemplo.com"
                        required
                        disabled={
                          creatingPayer
                        }
                      />

                    </div>

                    <div className="payer-form-group">

                      <label htmlFor="payer-phone">
                        Telefone
                      </label>

                      <input
                        id="payer-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        value={
                          payerForm.phone
                        }
                        onChange={
                          handlePayerPhoneChange
                        }
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        required
                        disabled={
                          creatingPayer
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="payer-modal-footer">

                  <button
                    type="button"
                    className="payer-modal-cancel"
                    onClick={
                      handleClosePayerModal
                    }
                    disabled={
                      creatingPayer
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="payer-modal-submit"
                    disabled={
                      creatingPayer
                    }
                  >

                    {creatingPayer ? (
                      <>
                        <span className="payer-button-spinner" />

                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>

                        Cadastrar pagador
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}