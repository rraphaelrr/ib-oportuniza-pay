import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute, {
  PublicOnlyRoute,
} from "./ProtectedRoute";

// =========================================================
// PÁGINAS GERAIS
// =========================================================

import LoginScreen from "../pages/Login/LoginScreen";
import Home from "../pages/Home/Home";
import Cadastro from "../pages/cadastro/Cadastro";
import Extrato from "../pages/Extrato/Extrato";
import Pix from "../pages/Pix/Pix";

// =========================================================
// BOLETOS
// =========================================================

import BoletosDashboard from "../pages/Boletos/BoletosDashboard";
import BoletosLista from "../pages/Boletos/BoletosLista";
import BoletoDetalhes from "../pages/Boletos/BoletoDetalhes";

import GerarBoleto from "../pages/Boletos/GerarBoleto";
import GerarBoletosLote from "../pages/Boletos/GerarBoletosLote";

import Clientes from "../pages/Boletos/Clientes";
import ClienteDetalhes from "../pages/Boletos/ClienteDetalhes";

import ContratoDetalhes from "../pages/Boletos/ContratoDetalhes";

import Inadimplencia from "../pages/Boletos/Inadimplencia";
import Pagamentos from "../pages/Boletos/Pagamentos";

// =========================================================
// ANTECIPAÇÃO DE RECEBÍVEIS
// =========================================================

import Antecipacao from "../pages/Antecipacao/Antecipacao";

import Simulacao from "../pages/Antecipacao/Simulacao/Simulacao";
import Solicitar from "../pages/Antecipacao/Solicitar/Solicitar";
import Recebiveis from "../pages/Antecipacao/Recebiveis/Recebiveis";
import Documentos from "../pages/Antecipacao/Documentos/Documentos";
import Revisao from "../pages/Antecipacao/Revisao/Revisao";
import Ofertas from "../pages/Antecipacao/Ofertas/Ofertas";

export default function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          RAIZ
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />

      {/* =====================================================
          AUTENTICAÇÃO
      ===================================================== */}

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginScreen />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/cadastro"
        element={
          <PublicOnlyRoute>
            <Cadastro />
          </PublicOnlyRoute>
        }
      />

      {/* =====================================================
          HOME
      ===================================================== */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          EXTRATO
      ===================================================== */}

      <Route
        path="/extrato"
        element={
          <ProtectedRoute>
            <Extrato />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PIX
      ===================================================== */}

      <Route
        path="/pix"
        element={
          <ProtectedRoute>
            <Pix />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          BOLETOS
      ===================================================== */}

      <Route
        path="/boletos"
        element={
          <ProtectedRoute>
            <BoletosDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/boletos/lista"
        element={
          <ProtectedRoute>
            <BoletosLista />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          GERAÇÃO DE BOLETO
      ===================================================== */}

      <Route
        path="/boletos/gerar"
        element={
          <ProtectedRoute>
            <GerarBoleto />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          GERAÇÃO EM LOTE
      ===================================================== */}

      <Route
        path="/boletos/gerar-lote"
        element={
          <ProtectedRoute>
            <GerarBoletosLote />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          COMPATIBILIDADE
      ===================================================== */}

      <Route
        path="/boletos/emitir"
        element={
          <Navigate
            to="/boletos/gerar"
            replace
          />
        }
      />

      <Route
        path="/boletos/lote"
        element={
          <Navigate
            to="/boletos/gerar-lote"
            replace
          />
        }
      />

      {/* =====================================================
          CLIENTES
      ===================================================== */}

      <Route
        path="/boletos/clientes"
        element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/boletos/clientes/:id"
        element={
          <ProtectedRoute>
            <ClienteDetalhes />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          CONTRATOS
      ===================================================== */}

      <Route
        path="/boletos/contratos/:id"
        element={
          <ProtectedRoute>
            <ContratoDetalhes />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          INADIMPLÊNCIA
      ===================================================== */}

      <Route
        path="/boletos/inadimplencia"
        element={
          <ProtectedRoute>
            <Inadimplencia />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PAGAMENTOS
      ===================================================== */}

      <Route
        path="/boletos/pagamentos"
        element={
          <ProtectedRoute>
            <Pagamentos />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          DETALHES DO BOLETO
      ===================================================== */}

      <Route
        path="/boletos/:id"
        element={
          <ProtectedRoute>
            <BoletoDetalhes />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          ANTECIPAÇÃO DE RECEBÍVEIS
      ===================================================== */}

      {/* -----------------------------------------------------
          Dashboard / entrada do produto
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao"
        element={
          <ProtectedRoute>
            <Antecipacao />
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------------------
          Simulação
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao/simulacao"
        element={
          <ProtectedRoute>
            <Simulacao />
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------------------
          Nova solicitação
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao/solicitar"
        element={
          <ProtectedRoute>
            <Solicitar />
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------------------
          Recebíveis
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao/recebiveis"
        element={
          <ProtectedRoute>
            <Recebiveis />
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------------------
          Documentos
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao/documentos"
        element={
          <ProtectedRoute>
            <Documentos />
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------------------
          Revisão da solicitação
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao/revisao"
        element={
          <ProtectedRoute>
            <Revisao />
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------------------
          Ofertas dos fundos
      ----------------------------------------------------- */}

      <Route
        path="/antecipacao/ofertas"
        element={
          <ProtectedRoute>
            <Ofertas />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          ROTA DESCONHECIDA
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />

    </Routes>
  );
}