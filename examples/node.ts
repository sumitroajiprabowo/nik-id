/**
 * Contoh penggunaan nik-id di Node.js / TypeScript.
 *
 * Mendemonstrasikan semua fitur utama:
 * - validateNIK() — validasi format NIK
 * - parseNIK() — parse NIK ke komponen
 * - generateNIK() — generate NIK untuk testing
 *
 * Jalankan:
 *   npx tsx examples/node.ts
 */

import { generateNIK, parseNIK, validateNIK } from "../src";

// ============================================================
// 1. Validasi NIK
// ============================================================
console.log("=== Validasi NIK ===\n");

// NIK valid
const valid1 = validateNIK("3204071508850001");
console.log("NIK valid (laki-laki):", valid1);
// → { valid: true }

const valid2 = validateNIK("3204076508850001");
console.log("NIK valid (perempuan):", valid2);
// → { valid: true }

// Berbagai jenis error
const errors = [
	{ input: 12345 as unknown as string, desc: "Input bukan string" },
	{ input: "123", desc: "Panjang salah" },
	{ input: "320407650885000A", desc: "Mengandung huruf" },
	{ input: "0004076508850001", desc: "Kode provinsi 00" },
	{ input: "3204073102850001", desc: "31 Februari (invalid)" },
	{ input: "3204076508850000", desc: "Sequence number 0000" },
];

for (const { input, desc } of errors) {
	const result = validateNIK(input);
	if (!result.valid) {
		console.log(`${desc}: "${result.error}"`);
	}
}

// ============================================================
// 2. Parse NIK
// ============================================================
console.log("\n=== Parse NIK ===\n");

// Parse NIK perempuan
const parsed = parseNIK("3204076508850001");
if (parsed.valid) {
	console.log("NIK asli:        ", parsed.nik);
	console.log("Kode provinsi:   ", parsed.provinceCode);
	console.log("Kode kabupaten:  ", parsed.regencyCode);
	console.log("Kode kecamatan:  ", parsed.districtCode);
	console.log("Tanggal lahir:   ", parsed.birthDate.toLocaleDateString("id-ID"));
	console.log("Gender:          ", parsed.gender === "F" ? "Perempuan" : "Laki-laki");
	console.log("Nomor urut:      ", parsed.sequenceNumber);
}

// Parse NIK laki-laki
const parsedMale = parseNIK("1101011508900123");
if (parsedMale.valid) {
	console.log("\nNIK dari Aceh:");
	console.log("  Provinsi:      ", parsedMale.provinceCode, "(Aceh)");
	console.log("  Gender:        ", parsedMale.gender === "M" ? "Laki-laki" : "Perempuan");
	console.log("  Lahir:         ", parsedMale.birthDate.toLocaleDateString("id-ID"));
}

// Parse NIK invalid — langsung return error
const invalidParsed = parseNIK("bukan-nik");
if (!invalidParsed.valid) {
	console.log("\nParse NIK invalid:", invalidParsed.error);
}

// ============================================================
// 3. Generate NIK
// ============================================================
console.log("\n=== Generate NIK ===\n");

// Full random
console.log("Random:          ", generateNIK());

// Gender spesifik
console.log("Laki-laki:       ", generateNIK({ gender: "M" }));
console.log("Perempuan:       ", generateNIK({ gender: "F" }));

// Tanggal lahir spesifik
const nikBirthDate = generateNIK({
	birthDate: new Date(1985, 7, 25),
});
console.log("Lahir 25/08/1985:", nikBirthDate);

// Gender + tanggal lahir
const nikFemale = generateNIK({
	gender: "F",
	birthDate: new Date(1985, 7, 25),
});
console.log("Perempuan 1985:  ", nikFemale);

// Wilayah spesifik (Jawa Barat, Kab. Bandung, Nagreg)
const nikWilayah = generateNIK({
	provinceCode: "32",
	regencyCode: "3204",
	districtCode: "320407",
});
console.log("Wilayah spesifik:", nikWilayah);

// Semua opsi
const nikFull = generateNIK({
	provinceCode: "32",
	regencyCode: "3204",
	districtCode: "320407",
	gender: "F",
	birthDate: new Date(1985, 7, 25),
});
console.log("Full opsi:       ", nikFull);

// ============================================================
// 4. Roundtrip: Generate → Parse → Validate
// ============================================================
console.log("\n=== Roundtrip Test ===\n");

for (let i = 0; i < 5; i++) {
	const nik = generateNIK();
	const parseResult = parseNIK(nik);
	const validateResult = validateNIK(nik);

	if (parseResult.valid && validateResult.valid) {
		const gender = parseResult.gender === "M" ? "L" : "P";
		const lahir = parseResult.birthDate.toLocaleDateString("id-ID");
		console.log(`  ${nik} → ${gender}, ${lahir}, seq ${parseResult.sequenceNumber}`);
	}
}

// ============================================================
// 5. Batch validation
// ============================================================
console.log("\n=== Batch Validation ===\n");

const nikList = [
	"3204076508850001",
	"1101011508900123",
	"3175015012000456",
	"0000000000000000", // invalid: provinsi 00
	"9999999999999999", // invalid: provinsi 99
	"3204073102850001", // invalid: 31 Februari
];

let validCount = 0;
let invalidCount = 0;

for (const nik of nikList) {
	const result = validateNIK(nik);
	if (result.valid) {
		validCount++;
	} else {
		invalidCount++;
		console.log(`  ❌ ${nik}: ${result.error}`);
	}
}

console.log(`\nTotal: ${validCount} valid, ${invalidCount} invalid dari ${nikList.length} NIK`);

// ============================================================
// 6. Error handling untuk generateNIK
// ============================================================
console.log("\n=== Error Handling Generate ===\n");

const errorCases = [
	{ opts: { provinceCode: "99" }, desc: "Provinsi di luar range" },
	{ opts: { provinceCode: "32", regencyCode: "3301" }, desc: "Kabupaten tidak cocok" },
	{
		opts: { provinceCode: "32", regencyCode: "3204", districtCode: "320501" },
		desc: "Kecamatan tidak cocok",
	},
];

for (const { opts, desc } of errorCases) {
	try {
		generateNIK(opts);
	} catch (err) {
		if (err instanceof Error) {
			console.log(`  ${desc}: "${err.message}"`);
		}
	}
}
