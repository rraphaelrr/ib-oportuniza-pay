import React, { useState } from "react";
import "./GerarBoleto.css";
import DashboardLayout from "../../layout/DashboardLayout";

function formatCurrencyInput(value) {
  const numbers = value.replace(/\D/g, "");

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

  return Number(
    value
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("pt-BR");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function GerarBoleto({
  clientes = [],
  contratos = [],
  loading = false,
  onBack,
  onSubmit,
}) {
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

  const clienteSelecionado = clientes.find(
    (cliente) => String(cliente.id) === String(clienteId),
  );

  const contratosDoCliente = contratos.filter(
    (contrato) =>
      !clienteId ||
      String(contrato.client_id || contrato.cliente_id) === String(clienteId),
  );

  const contratoSelecionado = contratos.find(
    (contrato) => String(contrato.id) === String(contratoId),
  );

  function handleClienteChange(event) {
    setClienteId(event.target.value);

    // Evita manter um contrato de outro cliente.
    setContratoId("");
  }

  function handleValorChange(event) {
    setValor(formatCurrencyInput(event.target.value));
  }

  function handleDescontoChange(event) {
    setDesconto(formatCurrencyInput(event.target.value));
  }

  function validate() {
    const nextErrors = {};

    if (!clienteId) {
      nextErrors.cliente = "Selecione o cliente.";
    }

    if (!contratoId) {
      nextErrors.contrato = "Selecione o contrato.";
    }

    if (!valor || parseCurrency(valor) <= 0) {
      nextErrors.valor = "Informe um valor válido.";
    }

    if (!vencimento) {
      nextErrors.vencimento = "Informe o vencimento.";
    }

    if (vencimento && vencimento < today()) {
      nextErrors.vencimento =
        "O vencimento não pode ser anterior à data atual.";
    }

    if (
      tipoDesconto !== "NONE" &&
      (!desconto || parseCurrency(desconto) <= 0)
    ) {
      nextErrors.desconto = "Informe o valor do desconto.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      client_id: clienteId,
      contract_id: contratoId,

      amount: parseCurrency(valor),

      due_date: vencimento,

      description: descricao.trim() || null,

      discount:
        tipoDesconto === "NONE"
          ? null
          : {
              type: tipoDesconto,
              value: parseCurrency(desconto),
            },

      interest: juros !== "" ? Number(juros) : 0,

      fine: multa !== "" ? Number(multa) : 0,

      instructions: instructions.trim() || null,
    };

    try {
      setSubmitting(true);

      await onSubmit?.(payload);
    } finally {
      setSubmitting(false);
    }
  }

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
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>

            <div>
              <h1>Gerar boleto</h1>

              <p>Crie uma nova cobrança para um cliente.</p>
            </div>
          </div>
        </header>

        {/* ==================================================
          FORMULÁRIO
      ================================================== */}

        <form className="gerar-boleto-form" onSubmit={handleSubmit}>
          {/* ==================================================
            CLIENTE E CONTRATO
        ================================================== */}

          <section className="gerar-boleto-card">
            <div className="gerar-boleto-card-header">
              <div>
                <h2>Cliente e contrato</h2>

                <p>Informe quem será responsável pela cobrança.</p>
              </div>
            </div>

            <div className="gerar-boleto-grid">
              <div className="gerar-boleto-field">
                <label htmlFor="cliente">Cliente</label>

                <select
                  id="cliente"
                  value={clienteId}
                  onChange={handleClienteChange}
                  className={errors.cliente ? "has-error" : ""}
                >
                  <option value="">Selecione um cliente</option>

                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.name || cliente.nome || "Cliente sem nome"}
                      {cliente.document ? ` — ${cliente.document}` : ""}
                    </option>
                  ))}
                </select>

                {errors.cliente && (
                  <span className="gerar-boleto-error">{errors.cliente}</span>
                )}
              </div>

              <div className="gerar-boleto-field">
                <label htmlFor="contrato">Contrato</label>

                <select
                  id="contrato"
                  value={contratoId}
                  onChange={(event) => setContratoId(event.target.value)}
                  disabled={!clienteId}
                  className={errors.contrato ? "has-error" : ""}
                >
                  <option value="">
                    {clienteId
                      ? "Selecione um contrato"
                      : "Selecione primeiro o cliente"}
                  </option>

                  {contratosDoCliente.map((contrato) => (
                    <option key={contrato.id} value={contrato.id}>
                      #{contrato.number || contrato.numero || contrato.id}
                    </option>
                  ))}
                </select>

                {errors.contrato && (
                  <span className="gerar-boleto-error">{errors.contrato}</span>
                )}
              </div>
            </div>

            {clienteSelecionado && (
              <div className="gerar-boleto-selected">
                <div className="gerar-boleto-avatar">
                  {(clienteSelecionado.name || clienteSelecionado.nome || "?")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {clienteSelecionado.name || clienteSelecionado.nome}
                  </strong>

                  {clienteSelecionado.document && (
                    <span>{clienteSelecionado.document}</span>
                  )}
                </div>
              </div>
            )}

            {contratoSelecionado && (
              <div className="gerar-boleto-contract">
                <span>Contrato</span>

                <strong>
                  #
                  {contratoSelecionado.number ||
                    contratoSelecionado.numero ||
                    contratoSelecionado.id}
                </strong>
              </div>
            )}
          </section>

          {/* ==================================================
            COBRANÇA
        ================================================== */}

          <section className="gerar-boleto-card">
            <div className="gerar-boleto-card-header">
              <div>
                <h2>Dados da cobrança</h2>

                <p>Configure o valor e o vencimento do boleto.</p>
              </div>
            </div>

            <div className="gerar-boleto-grid">
              <div className="gerar-boleto-field">
                <label htmlFor="valor">Valor</label>

                <input
                  id="valor"
                  type="text"
                  inputMode="decimal"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={handleValorChange}
                  className={errors.valor ? "has-error" : ""}
                />

                {errors.valor && (
                  <span className="gerar-boleto-error">{errors.valor}</span>
                )}
              </div>

              <div className="gerar-boleto-field">
                <label htmlFor="vencimento">Vencimento</label>

                <input
                  id="vencimento"
                  type="date"
                  min={today()}
                  value={vencimento}
                  onChange={(event) => setVencimento(event.target.value)}
                  className={errors.vencimento ? "has-error" : ""}
                />

                {vencimento && (
                  <small>Vencimento: {formatDate(vencimento)}</small>
                )}

                {errors.vencimento && (
                  <span className="gerar-boleto-error">
                    {errors.vencimento}
                  </span>
                )}
              </div>
            </div>

            <div className="gerar-boleto-field">
              <label htmlFor="descricao">Descrição</label>

              <input
                id="descricao"
                type="text"
                placeholder="Ex.: Mensalidade de agosto"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                maxLength={120}
              />
            </div>
          </section>

          {/* ==================================================
            ENCARGOS
        ================================================== */}

          <section className="gerar-boleto-card">
            <div className="gerar-boleto-card-header">
              <div>
                <h2>Descontos e encargos</h2>

                <p>
                  Configure as condições para pagamento após ou antes do
                  vencimento.
                </p>
              </div>
            </div>

            <div className="gerar-boleto-grid">
              <div className="gerar-boleto-field">
                <label htmlFor="tipo-desconto">Tipo de desconto</label>

                <select
                  id="tipo-desconto"
                  value={tipoDesconto}
                  onChange={(event) => setTipoDesconto(event.target.value)}
                >
                  <option value="NONE">Sem desconto</option>

                  <option value="FIXED">Valor fixo</option>

                  <option value="PERCENTAGE">Percentual</option>
                </select>
              </div>

              <div className="gerar-boleto-field">
                <label htmlFor="desconto">Desconto</label>

                <input
                  id="desconto"
                  type="text"
                  inputMode="decimal"
                  placeholder={tipoDesconto === "PERCENTAGE" ? "0%" : "R$ 0,00"}
                  value={desconto}
                  onChange={handleDescontoChange}
                  disabled={tipoDesconto === "NONE"}
                  className={errors.desconto ? "has-error" : ""}
                />

                {errors.desconto && (
                  <span className="gerar-boleto-error">{errors.desconto}</span>
                )}
              </div>

              <div className="gerar-boleto-field">
                <label htmlFor="juros">Juros ao mês (%)</label>

                <input
                  id="juros"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={juros}
                  onChange={(event) => setJuros(event.target.value)}
                />
              </div>

              <div className="gerar-boleto-field">
                <label htmlFor="multa">Multa (%)</label>

                <input
                  id="multa"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={multa}
                  onChange={(event) => setMulta(event.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ==================================================
            INSTRUÇÕES
        ================================================== */}

          <section className="gerar-boleto-card">
            <div className="gerar-boleto-card-header">
              <div>
                <h2>Instruções</h2>

                <p>Informações adicionais que podem acompanhar a cobrança.</p>
              </div>
            </div>

            <div className="gerar-boleto-field">
              <label htmlFor="instructions">Instruções do boleto</label>

              <textarea
                id="instructions"
                rows={4}
                maxLength={500}
                placeholder="Ex.: Não receber após o vencimento."
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>
          </section>

          {/* ==================================================
            RESUMO
        ================================================== */}

          <section className="gerar-boleto-review">
            <div>
              <span>Cliente</span>

              <strong>
                {clienteSelecionado?.name ||
                  clienteSelecionado?.nome ||
                  "Não selecionado"}
              </strong>
            </div>

            <div>
              <span>Contrato</span>

              <strong>
                {contratoSelecionado
                  ? `#${
                      contratoSelecionado.number ||
                      contratoSelecionado.numero ||
                      contratoSelecionado.id
                    }`
                  : "Não selecionado"}
              </strong>
            </div>

            <div>
              <span>Valor</span>

              <strong>{valor || "R$ 0,00"}</strong>
            </div>

            <div>
              <span>Vencimento</span>

              <strong>{vencimento ? formatDate(vencimento) : "-"}</strong>
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
              disabled={submitting || loading}
            >
              {submitting ? "Gerando boleto..." : "Gerar boleto"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
