import React from "react";

import "./CadastroSteps.css";

export default function StepConfirmacao({
  tipoConta,
  values,
  updateField,
  onSubmit,
  loading,
  back,
}) {
  function renderItem(label, value) {
    return (
      <div className="confirm-item">
        <span>{label}</span>

        <strong>{value || "-"}</strong>
      </div>
    );
  }

  return (
    <div className="step">
      <div className="step-header">
        <h2 className="step-title">Confirmação do Cadastro</h2>

        <p className="step-description">Revise seus dados antes de concluir.</p>
      </div>

      <div className="confirm-card">
        <h3>Tipo de Conta</h3>

        {renderItem(
          "Conta",
          tipoConta === "PJ" ? "Pessoa Jurídica" : "Pessoa Física",
        )}
      </div>

      <div className="confirm-card">
        <h3>Dados Pessoais</h3>

        {renderItem("Nome", values.nome)}

        {renderItem("CPF", values.cpf)}

        {renderItem("Nascimento", values.dataNascimento)}

        {renderItem("RG", values.rg)}

        {renderItem("Nome da Mãe", values.mae)}

        {renderItem("Sexo", values.sexo)}
      </div>

      {tipoConta === "PJ" && (
        <div className="confirm-card">
          <h3>Empresa</h3>

          {renderItem("CNPJ", values.cnpj)}

          {renderItem("Razão Social", values.razaoSocial)}

          {renderItem("Nome Fantasia", values.nomeFantasia)}

          {renderItem("Inscrição Estadual", values.inscricaoEstadual)}

          {renderItem("Inscrição Municipal", values.inscricaoMunicipal)}

          {renderItem("Fundação", values.fundacao)}
        </div>
      )}

      <div className="confirm-card">
        <h3>Endereço</h3>

        {renderItem("CEP", values.cep)}

        {renderItem("Rua", values.rua)}

        {renderItem("Número", values.numero)}

        {renderItem("Complemento", values.complemento)}

        {renderItem("Bairro", values.bairro)}

        {renderItem("Cidade", values.cidade)}

        {renderItem("Estado", values.estado)}
      </div>

      <div className="confirm-card">
        <h3>Contato</h3>

        {renderItem("E-mail", values.email)}

        {renderItem("Telefone", values.telefone)}

        {renderItem(
          "Status E-mail",
          values.codigoEmail?.length === 6 ? "✔ Validado" : "Pendente",
        )}

        {renderItem(
          "Status SMS",
          values.codigoSMS?.length === 6 ? "✔ Validado" : "Pendente",
        )}
      </div>

      <div className="confirm-card">
        <h3>Documentos</h3>

        {renderItem(
          "Documento Frente",
          values.documentoFrente ? "✔ Enviado" : "Não enviado",
        )}

        {renderItem(
          "Documento Verso",
          values.documentoVerso ? "✔ Enviado" : "Não enviado",
        )}

        {renderItem("Selfie", values.selfie ? "✔ Enviada" : "Não enviada")}

        {tipoConta === "PJ" &&
          renderItem(
            "Cartão CNPJ",
            values.cartaoCNPJ ? "✔ Enviado" : "Não enviado",
          )}
      </div>

      <div className="terms-box">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={values.aceite || false}
            onChange={(e) => updateField("aceite", e.target.checked)}
          />

          <span>
            Declaro que todas as informações fornecidas são verdadeiras e aceito
            os Termos de Uso, Política de Privacidade e Contrato de Abertura de
            Conta.
          </span>
        </label>
      </div>

      <div className="step-buttons">
        <button className="btn btn-secondary" onClick={back}>
          Voltar
        </button>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!values.aceite || loading}
          onClick={onSubmit}
        >
          {loading ? "Enviando cadastro..." : "Finalizar Cadastro"}
        </button>
      </div>
    </div>
  );
}
