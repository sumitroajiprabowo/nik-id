/**
 * Contoh penggunaan nik-id di Express.js.
 *
 * REST API sederhana untuk validasi dan parsing NIK.
 *
 * Endpoints:
 *   POST /api/nik/validate    — validasi format NIK
 *   POST /api/nik/parse       — parse NIK ke komponen
 *   GET  /api/nik/generate    — generate NIK random
 *
 * Jalankan:
 *   npx tsx examples/express.ts
 *
 * Test:
 *   curl -X POST http://localhost:3000/api/nik/validate \
 *     -H "Content-Type: application/json" \
 *     -d '{"nik": "3204076508850001"}'
 */

import express from "express";
import { generateNIK, parseNIK, validateNIK } from "nik-id";

const app = express();
app.use(express.json());

/**
 * POST /api/nik/validate
 *
 * Validasi format NIK.
 *
 * Request body:
 *   { "nik": "3204076508850001" }
 *
 * Response 200 (valid):
 *   { "valid": true }
 *
 * Response 400 (invalid):
 *   { "valid": false, "error": "NIK harus 16 digit" }
 */
app.post("/api/nik/validate", (req, res) => {
	const { nik } = req.body;
	const result = validateNIK(nik);

	if (!result.valid) {
		res.status(400).json(result);
		return;
	}

	res.json(result);
});

/**
 * POST /api/nik/parse
 *
 * Parse NIK menjadi komponen-komponennya.
 *
 * Request body:
 *   { "nik": "3204076508850001" }
 *
 * Response 200 (valid):
 *   {
 *     "valid": true,
 *     "nik": "3204076508850001",
 *     "provinceCode": "32",
 *     "regencyCode": "3204",
 *     "districtCode": "320407",
 *     "birthDate": "1985-08-25T00:00:00.000Z",
 *     "gender": "F",
 *     "sequenceNumber": "0001"
 *   }
 *
 * Response 400 (invalid):
 *   { "valid": false, "error": "NIK harus 16 digit" }
 */
app.post("/api/nik/parse", (req, res) => {
	const { nik } = req.body;
	const result = parseNIK(nik);

	if (!result.valid) {
		res.status(400).json(result);
		return;
	}

	res.json({
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
 *
 * Generate NIK random. Mendukung query params:
 *   ?gender=M|F
 *   ?provinceCode=32
 *   ?regencyCode=3204
 *   ?districtCode=320407
 *   ?birthDate=1985-08-25
 *   ?count=5 (generate beberapa sekaligus, max 100)
 *
 * Response 200:
 *   { "nik": "3204071508900001" }
 * atau dengan count:
 *   { "niks": ["3204071508900001", "1101015508850002", ...] }
 */
app.get("/api/nik/generate", (req, res) => {
	const { gender, provinceCode, regencyCode, districtCode, birthDate, count } =
		req.query;

	const options: Record<string, unknown> = {};

	if (gender === "M" || gender === "F") {
		options.gender = gender;
	}
	if (typeof provinceCode === "string") {
		options.provinceCode = provinceCode;
	}
	if (typeof regencyCode === "string") {
		options.regencyCode = regencyCode;
	}
	if (typeof districtCode === "string") {
		options.districtCode = districtCode;
	}
	if (typeof birthDate === "string") {
		options.birthDate = new Date(birthDate);
	}

	try {
		const n = Math.min(Number(count) || 1, 100);

		if (n === 1) {
			const nik = generateNIK(options);
			res.json({ nik });
		} else {
			const niks: string[] = [];
			for (let i = 0; i < n; i++) {
				niks.push(generateNIK(options));
			}
			res.json({ niks });
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "Gagal generate NIK";
		res.status(400).json({ error: message });
	}
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
	console.log("");
	console.log("Endpoints:");
	console.log("  POST /api/nik/validate    — validasi format NIK");
	console.log("  POST /api/nik/parse       — parse NIK ke komponen");
	console.log("  GET  /api/nik/generate    — generate NIK random");
	console.log("");
	console.log("Contoh:");
	console.log(`  curl -X POST http://localhost:${PORT}/api/nik/validate \\`);
	console.log('    -H "Content-Type: application/json" \\');
	console.log("    -d '{\"nik\": \"3204076508850001\"}'");
});
