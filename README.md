# Oportuniza Pay — Web

Projeto React (Vite) para o internet banking **Oportuniza Pay**, com tela de
login responsiva (baseada no design do app React Native enviado) e sistema
de rotas protegidas por autenticação.

## 🧱 Stack

- **React 18** + **Vite** (build/dev server)
- **React Router DOM v6** — rotas e rotas protegidas
- **Bootstrap 5** — reset/utilitários de layout/
- Sem dependências de UI extras (ícones em SVG inline, animações em CSS puro)

## ▶️ Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento
npm run dev

# 3. Build de produção
npm run build
npm run preview
```

O projeto abre por padrão em `http://localhost:5173`.

## 📦 Libs instaladas (package.json)

| Pacote              | Função                                    |
|---------------------|--------------------------------------------|
| `react-router-dom`  | Sistema de rotas e rotas protegidas        |
| `bootstrap`         | Reset CSS e utilitários                    |
| `vite` / `@vitejs/plugin-react` | Build/dev server                |

Se quiser adicionar mais coisas depois (ícones, gráficos, requisições HTTP):

```bash
npm install axios react-icons
```

## 🗂️ Estrutura de pastas

```
src/
├── App.jsx                  # Providers + Router
├── main.jsx                 # Ponto de entrada
├── context/
│   └── AuthContext.jsx      # Login/logout/sessão (localStorage)
├── hooks/
│   └── useDarkMode.js       # Tema claro/escuro persistente
├── routes/
│   ├── AppRoutes.jsx        # Todas as rotas centralizadas aqui
│   └── ProtectedRoute.jsx   # <ProtectedRoute> e <PublicOnlyRoute>
├── pages/
│   ├── Login/
│   │   ├── LoginScreen.jsx  # Tela de login (fluxo: início → tipo → dado → PIN)
│   │   └── LoginScreen.css
│   └── Home/
│       ├── Home.jsx         # Exemplo de área logada
│       └── Home.css
└── layout/
    └── global.css
```

## 🔒 Como funciona a proteção de rotas

Toda rota que só pode ser acessada **logado** deve ser envolvida por
`<ProtectedRoute>` em `src/routes/AppRoutes.jsx`:

```jsx
<Route
  path="/extrato"
  element={
    <ProtectedRoute>
      <Extrato />
    </ProtectedRoute>
  }
/>
```

- Se o usuário **não estiver autenticado**, é redirecionado para `/login`
  (guardando a rota de origem, para retornar após o login).
- A rota `/login` usa `<PublicOnlyRoute>`: se o usuário **já estiver logado**,
  ele é redirecionado direto para `/home`.
- O estado de sessão fica em `AuthContext` (`src/context/AuthContext.jsx`),
  persistido no `localStorage` sob a chave `@op_pay_session`.

### Conectando com uma API real

Hoje o `login()` em `AuthContext.jsx` **simula** uma chamada de rede. Para
usar seu backend real:

```jsx
async function login({ tipo, usuario, senha }) {
  const res = await fetch("https://sua-api.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, usuario, senha }),
  });
  if (!res.ok) throw new Error("Credenciais inválidas");
  const data = await res.json();
  setUser(data.user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
  return data.user;
}
```

> ⚠️ Nunca guarde a senha/PIN do usuário — apenas o token retornado pela API.

## 🎨 Tela de login

Fluxo replicado do app mobile, adaptado para web responsivo:

1. **Início** — boas-vindas + botão "Entrar" / "Criar conta"
2. **Tipo de acesso** — CPF, E-mail, Telefone ou CNPJ (com máscara automática)
3. **Dado de acesso** — campo com máscara/sugestões de e-mail
4. **Senha de 6 dígitos** — teclado numérico próprio (não usa o teclado do SO)
5. **Usuário salvo** — atalho de login rápido se já houver sessão anterior salva

No mobile (`< 768px`) o card ocupa a parte inferior da tela, como no app.
A partir de `768px` (tablet/desktop) ele vira um painel central flutuante,
mantendo a identidade visual (azul `#003399` + laranja `#FF6B00`).

O tema escuro é persistido em `localStorage` (`@op_pay_dark_mode`) e pode
ser alternado no botão no canto superior direito.
