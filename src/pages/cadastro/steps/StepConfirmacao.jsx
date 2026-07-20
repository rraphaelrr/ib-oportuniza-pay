import React from "react";

export default function StepConfirmacao({
  tipoConta,
  data,
  onChange,
  onSubmit,
  loading,
}) {
  return (
    <div className="cadastro-step">

      <h2>Confirmação do Cadastro</h2>

      <p className="step-description">
        Revise todas as informações antes de concluir a abertura da conta.
      </p>

      {/* DADOS DA CONTA */}

      <div className="confirm-card">

        <h3>Tipo de Conta</h3>

        <div className="confirm-item">
          <span>Conta</span>
          <strong>
            {tipoConta === "PJ"
              ? "Pessoa Jurídica"
              : "Pessoa Física"}
          </strong>
        </div>

      </div>

      {/* DADOS PESSOAIS */}

      <div className="confirm-card">

        <h3>Dados Pessoais</h3>

        <div className="confirm-item">
          <span>Nome</span>
          <strong>{data.nomeCompleto}</strong>
        </div>

        <div className="confirm-item">
          <span>CPF</span>
          <strong>{data.cpf}</strong>
        </div>

        <div className="confirm-item">
          <span>RG</span>
          <strong>{data.rg}</strong>
        </div>

        <div className="confirm-item">
          <span>Nascimento</span>
          <strong>{data.dataNascimento}</strong>
        </div>

        <div className="confirm-item">
          <span>Sexo</span>
          <strong>{data.sexo}</strong>
        </div>

        <div className="confirm-item">
          <span>Nome da Mãe</span>
          <strong>{data.nomeMae}</strong>
        </div>

      </div>

      {/* EMPRESA */}

      {tipoConta === "PJ" && (
        <div className="confirm-card">

          <h3>Empresa</h3>

          <div className="confirm-item">
            <span>Razão Social</span>
            <strong>{data.razaoSocial}</strong>
          </div>

          <div className="confirm-item">
            <span>Nome Fantasia</span>
            <strong>{data.nomeFantasia}</strong>
          </div>

          <div className="confirm-item">
            <span>CNPJ</span>
            <strong>{data.cnpj}</strong>
          </div>

          <div className="confirm-item">
            <span>Data de Abertura</span>
            <strong>{data.dataAbertura}</strong>
          </div>

          <div className="confirm-item">
            <span>Porte</span>
            <strong>{data.porteEmpresa}</strong>
          </div>

          <div className="confirm-item">
            <span>CNAE</span>
            <strong>{data.cnae}</strong>
          </div>

        </div>
      )}

      {/* ENDEREÇO */}

      <div className="confirm-card">

        <h3>Endereço</h3>

        <div className="confirm-item">
          <span>CEP</span>
          <strong>{data.cep}</strong>
        </div>

        <div className="confirm-item">
          <span>Rua</span>
          <strong>{data.rua}</strong>
        </div>

        <div className="confirm-item">
          <span>Número</span>
          <strong>{data.numero}</strong>
        </div>

        <div className="confirm-item">
          <span>Complemento</span>
          <strong>{data.complemento || "-"}</strong>
        </div>

        <div className="confirm-item">
          <span>Bairro</span>
          <strong>{data.bairro}</strong>
        </div>

        <div className="confirm-item">
          <span>Cidade</span>
          <strong>{data.cidade}</strong>
        </div>

        <div className="confirm-item">
          <span>Estado</span>
          <strong>{data.estado}</strong>
        </div>

      </div>

      {/* CONTATO */}

      <div className="confirm-card">

        <h3>Contato</h3>

        <div className="confirm-item">
          <span>E-mail</span>
          <strong>{data.email}</strong>
        </div>

        <div className="confirm-item">
          <span>Telefone</span>
          <strong>{data.telefone}</strong>
        </div>

        <div className="confirm-item">
          <span>Status do E-mail</span>

          <strong
            className={
              data.codigoEmail?.length === 6
                ? "status-ok"
                : "status-pending"
            }
          >
            {data.codigoEmail?.length === 6
              ? "✔ Validado"
              : "Pendente"}
          </strong>
        </div>

        <div className="confirm-item">
          <span>Status do SMS</span>

          <strong
            className={
              data.codigoSMS?.length === 6
                ? "status-ok"
                : "status-pending"
            }
          >
            {data.codigoSMS?.length === 6
              ? "✔ Validado"
              : "Pendente"}
          </strong>
        </div>

      </div>

      {/* DOCUMENTOS */}

      <div className="confirm-card">

        <h3>Documentos</h3>

        <div className="confirm-item">
          <span>Documento Frente</span>

          <strong>
            {data.documentoFrente
              ? "✔ Enviado"
              : "Não enviado"}
          </strong>
        </div>

        <div className="confirm-item">
          <span>Documento Verso</span>

          <strong>
            {data.documentoVerso
              ? "✔ Enviado"
              : "Não enviado"}
          </strong>
        </div>

        <div className="confirm-item">
          <span>Selfie</span>

          <strong>
            {data.selfie
              ? "✔ Enviada"
              : "Não enviada"}
          </strong>
        </div>

        {tipoConta === "PJ" && (
          <div className="confirm-item">
            <span>Cartão CNPJ</span>

            <strong>
              {data.cartaoCnpj
                ? "✔ Enviado"
                : "Não enviado"}
            </strong>
          </div>
        )}

      </div>

      {/* TERMOS */}

      <div className="terms-box">

        <label className="checkbox-row">

          <input
            type="checkbox"
            checked={data.aceite || false}
            onChange={(e) =>
              onChange(
                "aceite",
                e.target.checked
              )
            }
          />

          <span>
            Declaro que todas as informações
            fornecidas são verdadeiras e aceito
            os Termos de Uso, Política de
            Privacidade e Contrato de Abertura
            de Conta.
          </span>

        </label>

      </div>

      {/* BOTÃO */}

      <button
        type="button"
        className="btn-primary"
        disabled={!data.aceite || loading}
        onClick={onSubmit}
      >
        {loading
          ? "Enviando cadastro..."
          : "Finalizar Cadastro"}
      </button>

    </div>
  );
}