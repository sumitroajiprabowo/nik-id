/**
 * Contoh penggunaan nik-id di Deno.
 *
 * Native Deno HTTP server untuk validasi dan parsing NIK.
 * Menggunakan Deno.serve() tanpa framework tambahan.
 *
 * Catatan: di Deno, install nik-id via npm specifier:
 *   import { validateNIK } from "npm:nik-id";
 *
 * Jalankan:
 *   deno run --allow-net examples/deno.ts
 *
 * Test:
 *   curl -X POST http://localhost:3000/api/nik/validate \
 *     -H "Content-Type: application/json" \
 *     -d '{"nik": "3204076508850001"}'
 */

// Di Deno, gunakan npm: specifier
// import { validateNIK, parseNIK, generateNIK } from "npm:nik-id";
// Untuk contoh ini kita pakai path relatif:
import { generateNIK, parseNIK, validateNIK } from "nik-id";

const PORT = Number(Deno.env.get("PORT")) || 3000;

Deno.serve({ port: PORT }, async (req) => {
	const url = new URL(req.url);

	// POST /api/nik/validate
	if (url.pathname === "/api/nik/validate" && req.method === "POST") {
		const { nik } = await req.json();
		const result = validateNIK(nik);

		return Response.json(result, {
			status: result.valid ? 200 : 400,
		});
	}

	// POST /api/nik/parse
	if (url.pathname === "/api/nik/parse" && req.method === "POST") {
		const { nik } = await req.json();
		const result = parseNIK(nik);

		if (!result.valid) {
			return Response.json(result, { status: 400 });
		}

		return Response.json({
			valid: true,
			nik: result.nik,
			provinceCode: result.provinceCode,
			regencyCode: result.regencyCode,
			districtCode: result.districtCode,
			birthDate: result.birthDate.toISOString(),
			gender: result.gender,
			sequenceNumber: result.sequenceNumber,
		});
	}

	// GET /api/nik/generate
	if (url.pathname === "/api/nik/generate" && req.method === "GET") {
		const gender = url.searchParams.get("gender");
		const provinceCode = url.searchParams.get("provinceCode");

		try {
			const nik = generateNIK({
				...(gender === "M" || gender === "F" ? { gender } : {}),
				...(provinceCode ? { provinceCode } : {}),
			});

			return Response.json({ nik });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Gagal generate NIK";
			return Response.json({ error: message }, { status: 400 });
		}
	}

	// 404
	return Response.json({ error: "Not found" }, { status: 404 });
});

console.log(`Deno server berjalan di http://localhost:${PORT}`);
