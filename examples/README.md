# Contoh Penggunaan nik-id

Kumpulan contoh penggunaan package `nik-id` di berbagai framework dan runtime.

## Daftar Contoh

| Framework | File | Fitur |
|-----------|------|-------|
| **Node.js** | [`node.ts`](node.ts) | Basic usage — validasi, parse, generate, roundtrip, batch |
| **React** | [`react.tsx`](react.tsx) | Form validasi KTP dengan feedback real-time |
| **Next.js** | [`nextjs.tsx`](nextjs.tsx) | API Route (Route Handler) + Server Component |
| **Express** | [`express.ts`](express.ts) | REST API lengkap (validate, parse, generate) |
| **Hono** | [`hono.ts`](hono.ts) | Lightweight REST API (cocok untuk edge runtime) |
| **Bun** | [`bun.ts`](bun.ts) | Native Bun HTTP server |
| **Deno** | [`deno.ts`](deno.ts) | Native Deno server |

## Menjalankan Contoh

### Node.js

```bash
npx tsx examples/node.ts
```

### Express

```bash
# Install express dulu
npm install express @types/express
npx tsx examples/express.ts
```

### Hono

```bash
# Install hono dulu
npm install hono @hono/node-server
npx tsx examples/hono.ts
```

### Bun

```bash
bun run examples/bun.ts
```

### Deno

```bash
deno run --allow-net examples/deno.ts
```

## Testing API Endpoints

Semua contoh server (Express, Hono, Bun, Deno) menyediakan endpoint yang sama:

```bash
# Validasi NIK
curl -X POST http://localhost:3000/api/nik/validate \
  -H "Content-Type: application/json" \
  -d '{"nik": "3204076508850001"}'

# Parse NIK
curl -X POST http://localhost:3000/api/nik/parse \
  -H "Content-Type: application/json" \
  -d '{"nik": "3204076508850001"}'

# Generate NIK random
curl http://localhost:3000/api/nik/generate

# Generate NIK perempuan
curl "http://localhost:3000/api/nik/generate?gender=F"

# Generate NIK dari provinsi tertentu
curl "http://localhost:3000/api/nik/generate?provinceCode=32"
```
