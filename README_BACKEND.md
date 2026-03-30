# MercadoTCG - Front + Back integrados

## 1) Instalar dependências

Na raiz do projeto:

```bash
npm install
npm --prefix server install
```

## 2) Subir o backend

```bash
npm run dev:server
```

Backend: `http://localhost:3001`

## 3) Subir o frontend

Em outro terminal:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## Rotas principais da API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (JWT + multipart/form-data)
- `GET /api/orders` (JWT)
- `POST /api/orders` (JWT)

## Observações

- O banco SQLite é criado automaticamente em `server/database.sqlite`.
- Imagens enviadas ficam em `server/uploads`.
- O backend já faz seed inicial de produtos.
