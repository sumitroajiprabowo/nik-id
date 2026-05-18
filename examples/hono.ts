/**
 * Contoh penggunaan nik-id di Hono.
 *
 * REST API ringan untuk validasi dan parsing NIK.
 * Hono cocok untuk edge runtime (Cloudflare Workers, Vercel Edge, dll).
 *
 * Endpoints:
 *   POST /api/nik/validate    — validasi format NIK
 *   POST /api/nik/parse       — parse NIK ke komponen
 *   GET  /api/nik/generate    — generate NIK random
 *
 * Jalankan:
 *   npx tsx examples/hono.ts
 *
 * Test:
 *   curl -X POST http://localhost:3000/api/nik/validate \
 *     -H "Content-Type: application/json" \
 *     -d '{"nik": "3204076508850001"}'
 */

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { generateNIK, parseNIK, validateNIK } from "nik-id";

const app = new Hono();

/**
 * POST /api/nik/validate
 * Validasi format NIK.
 */
app.post("/api/nik/validate", async (c) => {
	const { nik } = await c.req.json();
	const result = validateNIK(nik);

	if (!result.valid) {
		return c.json(result, 400);
	}

	return c.json(result);
});

/**
 * POST /api/nik/parse
 * Parse NIK menjadi komponen.
 */
app.post("/api/nik/parse", async (c) => {
	const { nik } = await c.req.json();
	const result = parseNIK(nik);

	if (!result.valid) {
		return c.json(result, 400);
	}

	return c.json({
		valid: true,
		nik: result.nik,
		provinceCode: result.provinceCode,
		regencyCode: result.regencyCode,
		districtCode: result.districtCode,
		birthDate: result.birthDate.toISOString(),
		gender: result.gender,
		sequenceNumber: result.sequenceNumber,
	});
});

/**
 * GET /api/nik/generate
 * Generate NIK random dengan query params opsional.
 */
app.get("/api/nik/generate", (c) => {
	const gender = c.req.query("gender");
	const provinceCode = c.req.query("provinceCode");

	try {
		const nik = generateNIK({
			...(gender === "M" || gender === "F" ? { gender } : {}),
			...(provinceCode ? { provinceCode } : {}),
		});

		return c.json({ nik });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Gagal generate NIK";
		return c.json({ error: message }, 400);
	}
});

// Start server
const PORT = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port: PORT }, () => {
	console.log(`Hono server berjalan di http://localhost:${PORT}`);
});
