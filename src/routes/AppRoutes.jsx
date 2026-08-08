import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute, {
  PublicOnlyRoute,
} from "./ProtectedRoute";

import LoginScreen from "../pages/Login/LoginScreen";
import Home from "../pages/Home/Home";
import Cadastro from "../pages/cadastro/Cadastro";
import Extrato from "../pages/Extrato/Extrato";
import Pix from "../pages/Pix/Pix";

/* =========================
   BOLETOS
========================= */

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

/**
 * Todas as rotas da aplicação ficam centralizadas aqui.
 *
 * Rotas públicas:
 * - /login
 * - /cadastro
 *
 * Rotas protegidas:
 * - /home
 * - /extrato
 * - /pix
 * - /boletos/*
 */
export default function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          RAIZ
      ========================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />

      {/* =========================
          AUTENTICAÇÃO
      ========================= */}

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

      {/* =========================
          HOME
      ========================= */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* =========================
          EXTRATO
      ========================= */}

      <Route
        path="/extrato"
        element={
          <ProtectedRoute>
            <Extrato />
          </ProtectedRoute>
        }
      />

      {/* =========================
          PIX
      ========================= */}

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

      {/* Dashboard */}

      <Route
        path="/boletos"
        element={
          <ProtectedRoute>
            <BoletosDashboard />
          </ProtectedRoute>
        }
      />

      {/* Lista de boletos */}

      <Route
        path="/boletos/lista"
        element={
          <ProtectedRoute>
            <BoletosLista />
          </ProtectedRoute>
        }
      />

      {/* Gerar boleto */}

      <Route
        path="/boletos/gerar"
        element={
          <ProtectedRoute>
            <GerarBoleto />
          </ProtectedRoute>
        }
      />

      {/* Gerar boletos em lote */}

      <Route
        path="/boletos/gerar-lote"
        element={
          <ProtectedRoute>
            <GerarBoletosLote />
          </ProtectedRoute>
        }
      />

      {/* Clientes */}

      <Route
        path="/boletos/clientes"
        element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        }
      />

      {/* Detalhes do cliente */}

      <Route
        path="/boletos/clientes/:id"
        element={
          <ProtectedRoute>
            <ClienteDetalhes />
          </ProtectedRoute>
        }
      />

      {/* Detalhes do contrato */}

      <Route
        path="/boletos/contratos/:id"
        element={
          <ProtectedRoute>
            <ContratoDetalhes />
          </ProtectedRoute>
        }
      />

      {/* Inadimplência */}

      <Route
        path="/boletos/inadimplencia"
        element={
          <ProtectedRoute>
            <Inadimplencia />
          </ProtectedRoute>
        }
      />

      {/* Pagamentos */}

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
          
          IMPORTANTE:
          Deve ficar depois das rotas específicas.
      ===================================================== */}

      <Route
        path="/boletos/:id"
        element={
          <ProtectedRoute>
            <BoletoDetalhes />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ROTA DESCONHECIDA
      ========================= */}

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
