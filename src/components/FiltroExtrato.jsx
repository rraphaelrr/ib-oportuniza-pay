import React, { useState } from "react";
import "./FiltroExtrato.css";

export default function FiltroExtrato({ onFilter, onClear }) {
  const [filtros, setFiltros] = useState({
    periodo: "7",
    tipo: "todos",
    busca: "",
    dataInicio: "",
    dataFim: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function aplicarFiltro() {
    onFilter?.(filtros);
  }

  function limparFiltros() {
    const vazio = {
      periodo: "7",
      tipo: "todos",
      busca: "",
      dataInicio: "",
      dataFim: "",
    };

    setFiltros(vazio);

    onClear?.();
  }

  return (
    <div className="filtro-extrato">
      
      <div className="filtro-group">
        <label style={{ color: "white" }}>Período</label>

        <select
          name="periodo"
          value={filtros.periodo}
          onChange={handleChange}
           style={{ backgroundColor: "white" }}
        >
          <option value="7">Últimos 7 dias</option>
          <option value="15">Últimos 15 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>


      {/* Datas personalizadas */}
      {filtros.periodo === "custom" && (
        <>
          <div className="filtro-group">
            <label style={{ color: "white" }}>Data inicial</label>

            <input
              type="date"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleChange}
               style={{ backgroundColor: "white" }}
            />
          </div>

          <div className="filtro-group">
            <label style={{ color: "white" }}>Data final</label>

            <input
              type="date"
              name="dataFim"
              value={filtros.dataFim}
              min={filtros.dataInicio}
              onChange={handleChange}
               style={{ backgroundColor: "white" }}
            />
          </div>
        </>
      )}


      <div className="filtro-group">
        <label style={{ color: "white" }}>Tipo</label>

        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleChange}
           style={{ backgroundColor: "white" }}
        >
          <option value="todos">Todas movimentações</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
          <option value="pix">Pix</option>
          <option value="boleto">Boletos</option>
          <option value="tarifa">Tarifas</option>
        </select>
      </div>


      <div className="filtro-group busca">
        <label style={{ color: "white" }}>Buscar</label>

        <input
          type="text"
          name="busca"
          value={filtros.busca}
          onChange={handleChange}
          placeholder="Descrição ou nome"
           style={{ backgroundColor: "white" }}
        />
      </div>


      <div className="filtro-actions">
        <button 
          className="btn-filtrar" 
          onClick={aplicarFiltro}
        >
          Filtrar
        </button>


        <button
          className="btn-limpar"
          onClick={limparFiltros}
          style={{ backgroundColor: "red", border: "none", color: "white" }}
        >
          Limpar
        </button>
      </div>

    </div>
  );
}