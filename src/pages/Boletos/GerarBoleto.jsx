import React, { useEffect, useState } from "react";

import "./GerarBoleto.css";
import DashboardLayout from "../../layout/DashboardLayout";

import {
  getClientes,
  getContratos,
  criarBoleto,
} from "../../services/boletoService";

/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrencyInput(value) {
  const numbers = String(value || "").replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  const amount = Number(numbers) / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseCurrency(value) {
  if (!value) return 0;

  const normalized = String(value)
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const number = Number(normalized);

  return Number.isNaN(number) ? 0 : number;
}

function formatPercentageInput(value) {
  let normalized = String(value || "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  const parts = normalized.split(".");

  if (parts.length > 2) {
    normalized = `${parts[0]}.${parts.slice(1).join("")}`;
  }

  if (normalized === ".") {
    normalized = "0.";
  }

  return normalized;
}

function parsePercentage(value) {
  if (!value) return 0;

  const number = Number(
    String(value)
      .replace(",", ".")
      .replace(/[^0-9.]/g, ""),
  );

  return Number.isNaN(number) ? 0 : number;
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("pt-BR");
}

function today() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function GerarBoleto({
  clientes: clientesProp = [],
  contratos: contratosProp = [],
  loading: loadingProp = false,

  onBack,
  onSubmit,
  onSuccess,
}) {
  /* =========================================================
     DADOS
  ========================================================= */

  const [clientes, setClientes] = useState(clientesProp);
  const [contratos, setContratos] = useState(contratosProp);

  const [loadingData, setLoadingData] = useState(false);

  /* =========================================================
     FORMULÁRIO
  ========================================================= */

  const [clienteId, setClienteId] = useState("");
  const [contratoId, setContratoId] = useState("");

  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [descricao, setDescricao] = useState("");

  const [tipoDesconto, setTipoDesconto] = useState("NONE");
  const [desconto, setDesconto] = useState("");

  const [juros, setJuros] = useState("");
  const [multa, setMulta] = useState("");

  const [instructions, setInstructions] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* =========================================================
     CARREGAR CLIENTES E CONTRATOS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      /*
       * Se o componente já recebeu os dados por props,
       * não precisa buscar novamente.
       */

      if (
        clientesProp?.length > 0 &&
        contratosProp?.length > 0
      ) {
        return;
      }

      try {
        setLoadingData(true);

        const [clientesResponse, contratosResponse] =
          await Promise.all([
            clientesProp?.length > 0
              ? Promise.resolve(clientesProp)
              : getClientes(),

            contratosProp?.length > 0
              ? Promise.resolve(contratosProp)
              : getContratos(),
          ]);

        if (!mounted) return;

        setClientes(
          Array.isArray(clientesResponse)
            ? clientesResponse
            : [],
        );

        setContratos(
          Array.isArray(contratosResponse)
            ? contratosResponse
            : [],
        );
      } catch (error) {
        console.error(
          "Erro ao carregar dados do boleto:",
          error,
        );

        if (mounted) {
          setErrors((current) => ({
            ...current,
            geral:
              "Não foi possível carregar os clientes e contratos.",
          }));
        }
      } finally {
        if (mounted) {
          setLoadingData(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [clientesProp, contratosProp]);

  /* =========================================================
     LOADING FINAL
  ========================================================= */

  const loading =
    Boolean(loadingProp) || loadingData;

  /* =========================================================
     CLIENTE SELECIONADO
  ========================================================= */

  const clienteSelecionado = clientes.find(
    (cliente) =>
      String(cliente.id) === String(clienteId),
  );

  /* =========================================================
     CONTRATOS DO CLIENTE
  ========================================================= */

  const contratosDoCliente = contratos.filter(
    (contrato) => {
      if (!clienteId) {
        return false;
      }

      return (
        String(
          contrato.client_id ??
            contrato.cliente_id ??
            contrato.clientId,
        ) === String(clienteId)
      );
    },
  );

  /* =========================================================
     CONTRATO SELECIONADO
  ========================================================= */

  const contratoSelecionado = contratos.find(
    (contrato) =>
      String(contrato.id) === String(contratoId),
  );

  /* =========================================================
     HANDLERS
  ========================================================= */

  function handleClienteChange(event) {
    const value = event.target.value;

    setClienteId(value);

    setContratoId("");

    setErrors((current) => ({
      ...current,
      cliente: undefined,
      contrato: undefined,
      geral: undefined,
    }));
  }

  function handleContratoChange(event) {
    setContratoId(event.target.value);

    setErrors((current) => ({
      ...current,
      contrato: undefined,
      geral: undefined,
    }));
  }

  function handleValorChange(event) {
    setValor(
      formatCurrencyInput(event.target.value),
    );

    setErrors((current) => ({
      ...current,
      valor: undefined,
      geral: undefined,
    }));
  }

  function handleVencimentoChange(event) {
    setVencimento(event.target.value);

    setErrors((current) => ({
      ...current,
      vencimento: undefined,
      geral: undefined,
    }));
  }

  function handleTipoDescontoChange(event) {
    const type = event.target.value;

    setTipoDesconto(type);
    setDesconto("");

    setErrors((current) => ({
      ...current,
      desconto: undefined,
      geral: undefined,
    }));
  }

  function handleDescontoChange(event) {
    if (tipoDesconto === "PERCENTAGE") {
      setDesconto(
        formatPercentageInput(
          event.target.value,
        ),
      );
    } else {
      setDesconto(
        formatCurrencyInput(
          event.target.value,
        ),
      );
    }

    setErrors((current) => ({
      ...current,
      desconto: undefined,
      geral: undefined,
    }));
  }

  function handleJurosChange(event) {
    const value = event.target.value;

    if (value === "") {
      setJuros("");
      return;
    }

    const number = Number(value);

    if (number < 0) {
      return;
    }

    setJuros(value);
  }

  function handleMultaChange(event) {
    const value = event.target.value;

    if (value === "") {
      setMulta("");
      return;
    }

    const number = Number(value);

    if (number < 0) {
      return;
    }

    setMulta(value);
  }

  /* =========================================================
     VALIDAÇÃO
  ========================================================= */

  function validate() {
    const nextErrors = {};

    if (!clienteId) {
      nextErrors.cliente =
        "Selecione o cliente.";
    }

    if (!contratoId) {
      nextErrors.contrato =
        "Selecione o contrato.";
    }

    const valorNumerico =
      parseCurrency(valor);

    if (!valor || valorNumerico <= 0) {
      nextErrors.valor =
        "Informe um valor válido.";
    }

    if (!vencimento) {
      nextErrors.vencimento =
        "Informe o vencimento.";
    }

    if (
      vencimento &&
      vencimento < today()
    ) {
      nextErrors.vencimento =
        "O vencimento não pode ser anterior à data atual.";
    }

    /* DESCONTO */

    if (tipoDesconto !== "NONE") {
      const descontoNumerico =
        tipoDesconto === "PERCENTAGE"
          ? parsePercentage(desconto)
          : parseCurrency(desconto);

      if (
        !desconto ||
        descontoNumerico <= 0
      ) {
        nextErrors.desconto =
          "Informe o valor do desconto.";
      }

      if (
        tipoDesconto === "PERCENTAGE" &&
        descontoNumerico > 100
      ) {
        nextErrors.desconto =
          "O desconto percentual não pode ser maior que 100%.";
      }

      if (
        tipoDesconto === "FIXED" &&
        descontoNumerico > valorNumerico
      ) {
        nextErrors.desconto =
          "O desconto não pode ser maior que o valor da cobrança.";
      }
    }

    /* JUROS */

    if (juros !== "") {
      const jurosNumerico =
        Number(juros);

      if (
        Number.isNaN(jurosNumerico) ||
        jurosNumerico < 0 ||
        jurosNumerico > 100
      ) {
        nextErrors.juros =
          "Informe uma taxa de juros entre 0% e 100%.";
      }
    }

    /* MULTA */

    if (multa !== "") {
      const multaNumerico =
        Number(multa);

      if (
        Number.isNaN(multaNumerico) ||
        multaNumerico < 0 ||
        multaNumerico > 100
      ) {
        nextErrors.multa =
          "Informe uma multa entre 0% e 100%.";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const valorNumerico =
      parseCurrency(valor);

    const payload = {
      client_id: clienteId,
      contract_id: contratoId,

      amount: valorNumerico,

      due_date: vencimento,

      description:
        descricao.trim() || null,

      discount:
        tipoDesconto === "NONE"
          ? null
          : {
              type: tipoDesconto,

              value:
                tipoDesconto ===
                "PERCENTAGE"
                  ? parsePercentage(
                      desconto,
                    )
                  : parseCurrency(
                      desconto,
                    ),
            },

      interest:
        juros !== ""
          ? Number(juros)
          : 0,

      fine:
        multa !== ""
          ? Number(multa)
          : 0,

      instructions:
        instructions.trim() || null,
    };

    try {
      setSubmitting(true);

      /*
       * =====================================================
       * CONEXÃO COM BOLETO SERVICE
       * =====================================================
       *
       * Aqui acontece a chamada centralizada.
       *
       * Atualmente o service devolve um boleto mockado.
       * Depois ele poderá chamar a API real.
       */

      const boletoCriado =
        await criarBoleto(payload);

      console.log(
        "Boleto criado:",
        boletoCriado,
      );

      /*
       * Mantém compatibilidade com quem
       * já utiliza onSubmit no componente.
       */

      if (
        typeof onSubmit === "function"
      ) {
        await onSubmit(
          payload,
          boletoCriado,
        );
      }

      /*
       * Callback específico após criação.
       */

      if (
        typeof onSuccess === "function"
      ) {
        onSuccess(boletoCriado);
      }
    } catch (error) {
      console.error(
        "Erro ao gerar boleto:",
        error,
      );

      setErrors((current) => ({
        ...current,
        geral:
          error?.message ||
          "Não foi possível gerar o boleto.",
      }));
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================================
     LABEL DO CONTRATO
  ========================================================= */

  function getContratoLabel(
    contrato,
  ) {
    return (
      contrato.number ||
      contrato.numero ||
      contrato.contract_number ||
      contrato.id
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <DashboardLayout>
      <div className="gerar-boleto">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="gerar-boleto-header">
          <div className="gerar-boleto-header-left">

            <button
              type="button"
              className="gerar-boleto-back"
              onClick={onBack}
              aria-label="Voltar"
              disabled={submitting}
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

            <div>
              <h1>Gerar boleto</h1>

              <p>
                Crie uma nova cobrança para um cliente.
              </p>
            </div>
          </div>
        </header>

        {/* ==================================================
            ERRO GERAL
        ================================================== */}

        {errors.geral && (
          <div
            className="gerar-boleto-error"
            style={{
              marginBottom: "16px",
              display: "block",
            }}
          >
            {errors.geral}
          </div>
        )}

        {/* ==================================================
            FORMULÁRIO
        ================================================== */}

        <form
          className="gerar-boleto-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* ==================================================
              CLIENTE E CONTRATO
          ================================================== */}

          <section className="gerar-boleto-card">

            <div className="gerar-boleto-card-header">
              <div>
                <h2>
                  Cliente e contrato
                </h2>

                <p>
                  Informe quem será responsável pela cobrança.
                </p>
              </div>
            </div>

            <div className="gerar-boleto-grid">

              {/* CLIENTE */}

              <div className="gerar-boleto-field">

                <label htmlFor="cliente">
                  Cliente
                </label>

                <select
                  id="cliente"
                  value={clienteId}
                  onChange={
                    handleClienteChange
                  }
                  className={
                    errors.cliente
                      ? "has-error"
                      : ""
                  }
                  disabled={
                    submitting ||
                    loading
                  }
                >
                  <option value="">
                    {loading
                      ? "Carregando clientes..."
                      : "Selecione um cliente"}
                  </option>

                  {clientes.map(
                    (cliente) => (
                      <option
                        key={cliente.id}
                        value={cliente.id}
                      >
                        {cliente.name ||
                          cliente.nome ||
                          "Cliente sem nome"}

                        {cliente.document
                          ? ` — ${cliente.document}`
                          : ""}
                      </option>
                    ),
                  )}
                </select>

                {errors.cliente && (
                  <span className="gerar-boleto-error">
                    {errors.cliente}
                  </span>
                )}

              </div>

              {/* CONTRATO */}

              <div className="gerar-boleto-field">

                <label htmlFor="contrato">
                  Contrato
                </label>

                <select
                  id="contrato"
                  value={contratoId}
                  onChange={
                    handleContratoChange
                  }
                  disabled={
                    !clienteId ||
                    submitting ||
                    loading
                  }
                  className={
                    errors.contrato
                      ? "has-error"
                      : ""
                  }
                >
                  <option value="">
                    {clienteId
                      ? contratosDoCliente.length >
                        0
                        ? "Selecione um contrato"
                        : "Nenhum contrato encontrado"
                      : "Selecione primeiro o cliente"}
                  </option>

                  {contratosDoCliente.map(
                    (contrato) => (
                      <option
                        key={contrato.id}
                        value={contrato.id}
                      >
                        #
                        {getContratoLabel(
                          contrato,
                        )}
                      </option>
                    ),
                  )}
                </select>

                {errors.contrato && (
                  <span className="gerar-boleto-error">
                    {errors.contrato}
                  </span>
                )}

              </div>
            </div>

            {/* CLIENTE SELECIONADO */}

            {clienteSelecionado && (
              <div className="gerar-boleto-selected">

                <div className="gerar-boleto-avatar">
                  {(
                    clienteSelecionado.name ||
                    clienteSelecionado.nome ||
                    "?"
                  )
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {clienteSelecionado.name ||
                      clienteSelecionado.nome ||
                      "Cliente"}
                  </strong>

                  {clienteSelecionado.document && (
                    <span>
                      {
                        clienteSelecionado.document
                      }
                    </span>
                  )}
                </div>

              </div>
            )}

            {/* CONTRATO SELECIONADO */}

            {contratoSelecionado && (
              <div className="gerar-boleto-contract">

                <span>
                  Contrato
                </span>

                <strong>
                  #
                  {getContratoLabel(
                    contratoSelecionado,
                  )}
                </strong>

              </div>
            )}

          </section>

          {/* ==================================================
              DADOS DA COBRANÇA
          ================================================== */}

          <section className="gerar-boleto-card">

            <div className="gerar-boleto-card-header">
              <div>
                <h2>
                  Dados da cobrança
                </h2>

                <p>
                  Configure o valor e o vencimento do boleto.
                </p>
              </div>
            </div>

            <div className="gerar-boleto-grid">

              {/* VALOR */}

              <div className="gerar-boleto-field">

                <label htmlFor="valor">
                  Valor
                </label>

                <input
                  id="valor"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={
                    handleValorChange
                  }
                  className={
                    errors.valor
                      ? "has-error"
                      : ""
                  }
                  disabled={
                    submitting ||
                    loading
                  }
                />

                {errors.valor && (
                  <span className="gerar-boleto-error">
                    {errors.valor}
                  </span>
                )}

              </div>

              {/* VENCIMENTO */}

              <div className="gerar-boleto-field">

                <label htmlFor="vencimento">
                  Vencimento
                </label>

                <input
                  id="vencimento"
                  type="date"
                  min={today()}
                  value={vencimento}
                  onChange={
                    handleVencimentoChange
                  }
                  className={
                    errors.vencimento
                      ? "has-error"
                      : ""
                  }
                  disabled={
                    submitting ||
                    loading
                  }
                />

                {vencimento &&
                  !errors.vencimento && (
                    <small>
                      Vencimento:{" "}
                      {formatDate(
                        vencimento,
                      )}
                    </small>
                  )}

                {errors.vencimento && (
                  <span className="gerar-boleto-error">
                    {errors.vencimento}
                  </span>
                )}

              </div>

            </div>

            {/* DESCRIÇÃO */}

            <div className="gerar-boleto-card-field">

              <label htmlFor="descricao">
                Descrição
              </label>

              <input
                id="descricao"
                type="text"
                placeholder="Ex.: Mensalidade de agosto"
                value={descricao}
                onChange={(event) =>
                  setDescricao(
                    event.target.value,
                  )
                }
                maxLength={120}
                disabled={
                  submitting ||
                  loading
                }
              />

              <div className="gerar-boleto-counter">
                {descricao.length}/120
              </div>

            </div>

          </section>

          {/* ==================================================
              DESCONTOS E ENCARGOS
          ================================================== */}

          <section className="gerar-boleto-card">

            <div className="gerar-boleto-card-header">
              <div>
                <h2>
                  Descontos e encargos
                </h2>

                <p>
                  Configure as condições para pagamento antes ou após o vencimento.
                </p>
              </div>
            </div>

            <div className="gerar-boleto-grid">

              {/* TIPO DESCONTO */}

              <div className="gerar-boleto-field">

                <label htmlFor="tipo-desconto">
                  Tipo de desconto
                </label>

                <select
                  id="tipo-desconto"
                  value={tipoDesconto}
                  onChange={
                    handleTipoDescontoChange
                  }
                  disabled={
                    submitting ||
                    loading
                  }
                >
                  <option value="NONE">
                    Sem desconto
                  </option>

                  <option value="FIXED">
                    Valor fixo
                  </option>

                  <option value="PERCENTAGE">
                    Percentual
                  </option>
                </select>

              </div>

              {/* DESCONTO */}

              <div className="gerar-boleto-field">

                <label htmlFor="desconto">
                  Desconto
                </label>

                <div className="gerar-boleto-input-wrapper">

                  <input
                    id="desconto"
                    type="text"
                    inputMode="decimal"
                    placeholder={
                      tipoDesconto ===
                      "PERCENTAGE"
                        ? "0,00%"
                        : "R$ 0,00"
                    }
                    value={desconto}
                    onChange={
                      handleDescontoChange
                    }
                    disabled={
                      tipoDesconto ===
                        "NONE" ||
                      submitting ||
                      loading
                    }
                    className={
                      errors.desconto
                        ? "has-error"
                        : ""
                    }
                  />

                  {tipoDesconto ===
                    "PERCENTAGE" && (
                    <span className="gerar-boleto-input-suffix">
                      %
                    </span>
                  )}

                </div>

                {errors.desconto && (
                  <span className="gerar-boleto-error">
                    {errors.desconto}
                  </span>
                )}

              </div>

              {/* JUROS */}

              <div className="gerar-boleto-field">

                <label htmlFor="juros">
                  Juros ao mês (%)
                </label>

                <div className="gerar-boleto-input-wrapper">

                  <input
                    id="juros"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={juros}
                    onChange={
                      handleJurosChange
                    }
                    disabled={
                      submitting ||
                      loading
                    }
                    className={
                      errors.juros
                        ? "has-error"
                        : ""
                    }
                  />

                  <span className="gerar-boleto-input-suffix">
                    %
                  </span>

                </div>

                {errors.juros && (
                  <span className="gerar-boleto-error">
                    {errors.juros}
                  </span>
                )}

              </div>

              {/* MULTA */}

              <div className="gerar-boleto-field">

                <label htmlFor="multa">
                  Multa (%)
                </label>

                <div className="gerar-boleto-input-wrapper">

                  <input
                    id="multa"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={multa}
                    onChange={
                      handleMultaChange
                    }
                    disabled={
                      submitting ||
                      loading
                    }
                    className={
                      errors.multa
                        ? "has-error"
                        : ""
                    }
                  />

                  <span className="gerar-boleto-input-suffix">
                    %
                  </span>

                </div>

                {errors.multa && (
                  <span className="gerar-boleto-error">
                    {errors.multa}
                  </span>
                )}

              </div>

            </div>

          </section>

          {/* ==================================================
              INSTRUÇÕES
          ================================================== */}

          <section className="gerar-boleto-card">

            <div className="gerar-boleto-card-header">
              <div>
                <h2>
                  Instruções
                </h2>

                <p>
                  Informações adicionais que podem acompanhar a cobrança.
                </p>
              </div>
            </div>

            <div className="gerar-boleto-card-field">

              <label htmlFor="instructions">
                Instruções do boleto
              </label>

              <textarea
                id="instructions"
                rows={4}
                maxLength={500}
                placeholder="Ex.: Não receber após o vencimento."
                value={instructions}
                onChange={(event) =>
                  setInstructions(
                    event.target.value,
                  )
                }
                disabled={
                  submitting ||
                  loading
                }
              />

              <div className="gerar-boleto-counter">
                {instructions.length}/500
              </div>

            </div>

          </section>

          {/* ==================================================
              RESUMO
          ================================================== */}

          <section className="gerar-boleto-review">

            <div>
              <span>
                Cliente
              </span>

              <strong>
                {clienteSelecionado?.name ||
                  clienteSelecionado?.nome ||
                  "Não selecionado"}
              </strong>
            </div>

            <div>
              <span>
                Contrato
              </span>

              <strong>
                {contratoSelecionado
                  ? `#${getContratoLabel(
                      contratoSelecionado,
                    )}`
                  : "Não selecionado"}
              </strong>
            </div>

            <div>
              <span>
                Valor
              </span>

              <strong>
                {valor ||
                  "R$ 0,00"}
              </strong>
            </div>

            <div>
              <span>
                Vencimento
              </span>

              <strong>
                {vencimento
                  ? formatDate(
                      vencimento,
                    )
                  : "-"}
              </strong>
            </div>

          </section>

          {/* ==================================================
              AÇÕES
          ================================================== */}

          <div className="gerar-boleto-footer">

            <button
              type="button"
              className="gerar-boleto-button-secondary"
              onClick={onBack}
              disabled={submitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="gerar-boleto-button-primary"
              disabled={
                submitting ||
                loading
              }
            >
              {submitting
                ? "Gerando boleto..."
                : loading
                  ? "Carregando..."
                  : "Gerar boleto"}
            </button>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}