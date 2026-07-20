import React, { useState } from "react";

import Input from "../../../components/Input";
import PhoneInput from "../../../components/PhoneInput";
import OTPInput from "../../../components/OTPInput";

import "./CadastroSteps.css";


export default function StepContato({
  values,
  updateField,
  errors = {},
  next,
  back,
}) {


  const [emailToken, setEmailToken] =
    useState(false);


  const [smsToken, setSmsToken] =
    useState(false);



  function validarEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }




  function enviarTokenEmail() {

    if(
      !validarEmail(
        values.email
      )
    ){

      alert(
        "Informe um e-mail válido."
      );

      return;

    }


    alert(
      "Código enviado para o e-mail."
    );


    setEmailToken(true);

  }





  function enviarTokenSMS() {

    const telefone =
      values.telefone?.replace(
        /\D/g,
        ""
      );


    if(
      telefone.length < 11
    ){

      alert(
        "Telefone inválido."
      );

      return;

    }


    alert(
      "Código SMS enviado."
    );


    setSmsToken(true);

  }





  return (

    <div className="step">


      <div className="step-header">


        <h2 className="step-title">

          Contato

        </h2>


        <p className="step-description">

          Informe seus meios de contato.

        </p>


      </div>





      <div className="form-grid">





        <Input

          label="E-mail"

          name="email"

          type="email"

          value={
            values.email || ""
          }

          onChange={(e)=>
            updateField(
              "email",
              e.target.value
            )
          }

          placeholder="email@empresa.com"

          error={
            errors.email
          }

          required

        />





        <Input

          label="Confirmar E-mail"

          name="confirmarEmail"

          type="email"

          value={
            values.confirmarEmail || ""
          }

          onChange={(e)=>
            updateField(
              "confirmarEmail",
              e.target.value
            )
          }

          placeholder="Repita o e-mail"

          error={
            errors.confirmarEmail
          }

          required

        />





        <button

          type="button"

          className="btn btn-secondary"

          onClick={
            enviarTokenEmail
          }

        >

          Enviar código e-mail

        </button>





        {
          emailToken && (

            <OTPInput

              label="Código do e-mail"

              value={
                values.codigoEmail || ""
              }

              onChange={(value)=>
                updateField(
                  "codigoEmail",
                  value
                )
              }

              length={6}

              error={
                errors.codigoEmail
              }

            />

          )
        }







        <PhoneInput

          label="Celular"

          value={
            values.telefone || ""
          }

          onChange={(e)=>
            updateField(
              "telefone",
              e.target.value
            )
          }

          error={
            errors.telefone
          }

          required

        />







        <PhoneInput

          label="Confirmar Celular"

          value={
            values.confirmarTelefone || ""
          }

          onChange={(e)=>
            updateField(
              "confirmarTelefone",
              e.target.value
            )
          }

          error={
            errors.confirmarTelefone
          }

          required

        />





        <button

          type="button"

          className="btn btn-secondary"

          onClick={
            enviarTokenSMS
          }

        >

          Enviar SMS

        </button>







        {
          smsToken && (

            <OTPInput

              label="Código SMS"

              value={
                values.codigoSMS || ""
              }

              onChange={(value)=>
                updateField(
                  "codigoSMS",
                  value
                )
              }

              length={6}

              error={
                errors.codigoSMS
              }

            />

          )
        }



      </div>







      <div className="step-buttons">


        <button

          className="btn btn-secondary"

          onClick={back}

        >

          Voltar

        </button>




        <button

          className="btn btn-primary"

          onClick={next}

        >

          Continuar

        </button>


      </div>



    </div>

  );

}