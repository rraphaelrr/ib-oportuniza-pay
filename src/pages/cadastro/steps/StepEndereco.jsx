import React from "react";

import Input from "../../../components/Input";
import CEPInput from "../../../components/CEPInput";

import "./CadastroSteps.css";


export default function StepEndereco({
  values,
  updateField,
  errors = {},
  next,
  back,
}) {


  function handleCEPChange(e) {

    updateField(
      "cep",
      e.target.value
    );

  }



  function handleAddressFound(address) {

    updateField(
      "cep",
      address.cep
    );


    updateField(
      "rua",
      address.rua
    );


    updateField(
      "bairro",
      address.bairro
    );


    updateField(
      "cidade",
      address.cidade
    );


    updateField(
      "estado",
      address.estado
    );

  }




  function handleChange(e) {

    const {
      name,
      value
    } = e.target;


    let newValue = value;


    if(name === "estado") {

      newValue =
        value.toUpperCase();

    }


    updateField(
      name,
      newValue
    );

  }




  return (

    <div className="step">


      <div className="step-header">

        <h2 className="step-title">

          Endereço

        </h2>


        <p className="step-description">

          Informe o endereço da conta.

        </p>


      </div>




      <div className="form-grid">



        <CEPInput

          label="CEP"

          value={
            values.cep || ""
          }

          onChange={
            handleCEPChange
          }

          onAddressFound={
            handleAddressFound
          }

          error={
            errors.cep
          }

          required

        />





        <Input

          label="Rua"

          name="rua"

          value={
            values.rua || ""
          }

          onChange={
            handleChange
          }

          placeholder="Rua"

          error={
            errors.rua
          }

          required

        />





        <Input

          label="Número"

          name="numero"

          value={
            values.numero || ""
          }

          onChange={
            handleChange
          }

          placeholder="Número"

          error={
            errors.numero
          }

          required

        />





        <Input

          label="Complemento"

          name="complemento"

          value={
            values.complemento || ""
          }

          onChange={
            handleChange
          }

          placeholder="Apartamento, bloco..."

        />





        <Input

          label="Bairro"

          name="bairro"

          value={
            values.bairro || ""
          }

          onChange={
            handleChange
          }

          placeholder="Bairro"

          error={
            errors.bairro
          }

          required

        />





        <Input

          label="Cidade"

          name="cidade"

          value={
            values.cidade || ""
          }

          onChange={
            handleChange
          }

          placeholder="Cidade"

          error={
            errors.cidade
          }

          required

        />





        <Input

          label="Estado"

          name="estado"

          value={
            values.estado || ""
          }

          onChange={
            handleChange
          }

          placeholder="UF"

          maxLength={2}

          error={
            errors.estado
          }

          required

        />



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