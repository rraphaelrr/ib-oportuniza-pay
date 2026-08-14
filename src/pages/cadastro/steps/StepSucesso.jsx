import React from "react";

import {
  FaCheckCircle,
  FaEnvelope,
  FaClock,
  FaHome,
  FaDownload,
} from "react-icons/fa";

import "./CadastroSteps.css";


export default function StepSucesso({
  protocolo,
  onHome,
  onComprovante,
}) {


  return (

    <div className="step sucesso-step">



      <div className="success-icon">

        <FaCheckCircle />

      </div>





      <h1>

        Cadastro enviado com sucesso!

      </h1>





      <p className="success-text">

        Recebemos sua solicitação de abertura de conta.
        Agora nossa equipe realizará a análise das
        informações e documentos enviados.

      </p>








      <div className="success-card">



        <div className="success-item">


          <FaClock />


          <div>

            <strong>
              Prazo de análise
            </strong>


            <span>

              Até <b>2 dias úteis</b>.

            </span>


          </div>


        </div>







        <div className="success-item">


          <FaEnvelope />


          <div>

            <strong>
              Status da solicitação
            </strong>


            <span>

              Você receberá atualizações por e-mail
              e SMS.

            </span>


          </div>


        </div>



      </div>









      <div className="protocol-card">


        <span>
          Número do protocolo
        </span>


        <strong>

          {
            protocolo ||
            "202607210001245"
          }

        </strong>


      </div>









      <div className="next-steps">


        <h3>
          Próximas etapas
        </h3>



        <ul>


          <li>
            ✔ Validação dos documentos.
          </li>


          <li>
            ✔ Validação biométrica da selfie.
          </li>


          <li>
            ✔ Consulta aos órgãos reguladores.
          </li>


          <li>
            ✔ Aprovação e abertura da conta.
          </li>


          <li>
            ✔ Envio dos dados de acesso.
          </li>


        </ul>


      </div>









      <div className="tips-box">


        <h4>
          Importante
        </h4>



        <p>

          Caso seja necessário complementar alguma
          informação, entraremos em contato através
          do e-mail ou telefone informado durante
          o cadastro.

        </p>


      </div>









      <div className="success-buttons">


       {/*  <button

          className="btn btn-secondary"

          onClick={
            onComprovante
          }

        >

          <FaDownload />

          Baixar Comprovante

        </button> */}







        <button

          className="btn btn-primary"

          onClick={
            onHome
          }

        >

          <FaHome />

          Ir para Login

        </button>



      </div>





    </div>

  );

}