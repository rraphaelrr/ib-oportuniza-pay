import React from "react";
import {
  FaUser,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa";

export default function StepTipoConta({
  values,
  updateField,
  next,
}) {
  function handleSelect(tipo) {
    updateField("tipoConta", tipo);
  }

  function continuar() {
    if (!values.tipoConta) {
      alert("Selecione o tipo da conta.");
      return;
    }

    next();
  }

  return (
    <div className="step">

      <h2 className="step-title">
        Qual tipo de conta deseja abrir?
      </h2>

      <p className="step-description">
        Escolha abaixo o tipo de conta que melhor atende às
        suas necessidades. Você poderá prosseguir com o
        preenchimento dos seus dados na próxima etapa.
      </p>

      <div className="account-types">

        {/* Pessoa Física */}

        <div
          className={`account-card ${
            values.tipoConta === "pf"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleSelect("pf")
          }
        >
          <FaUser
            size={45}
            color="#003399"
          />

          <h3>
            Pessoa Física
          </h3>

          <p>
            Conta destinada para uso pessoal.
            Faça transferências, PIX, pagamentos,
            investimentos e utilize todos os
            serviços do banco digital.
          </p>

          <ul
            style={{
              marginTop: 20,
              color: "#555",
              lineHeight: "28px",
            }}
          >
            <li>✔ PIX ilimitado</li>
            <li>✔ Cartão virtual</li>
            <li>✔ Conta corrente</li>
            <li>✔ Investimentos</li>
          </ul>

        </div>

        {/* Pessoa Jurídica */}

        <div
          className={`account-card ${
            values.tipoConta === "pj"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleSelect("pj")
          }
        >
          <FaBuilding
            size={45}
            color="#003399"
          />

          <h3>
            Pessoa Jurídica
          </h3>

          <p>
            Conta destinada para empresas,
            MEI, LTDA, EIRELI e demais
            pessoas jurídicas.
          </p>

          <ul
            style={{
              marginTop: 20,
              color: "#555",
              lineHeight: "28px",
            }}
          >
            <li>✔ Conta Empresarial</li>
            <li>✔ PIX Empresarial</li>
            <li>✔ Cobranças</li>
            <li>✔ Gestão Financeira</li>
          </ul>

        </div>

      </div>

      <div className="step-buttons">

        <div />

        <button
          className="btn btn-primary"
          onClick={continuar}
        >
          Continuar

          <FaArrowRight
            style={{
              marginLeft: 10,
            }}
          />
        </button>

      </div>

    </div>
  );
}