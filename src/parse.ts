/**
 * Modul parsing NIK (Nomor Induk Kependudukan).
 *
 * Menyediakan fungsi {@link parseNIK} yang memvalidasi dan mengekstrak
 * semua komponen dari NIK: kode wilayah (provinsi, kabupaten/kota, kecamatan),
 * tanggal lahir, jenis kelamin, dan nomor urut registrasi.
 *
 * Kode wilayah yang dikembalikan menggunakan format **Kemendagri** (bukan BPS).
 * Untuk resolve ke nama wilayah, gunakan package `kode-wilayah-id` dengan
 * fungsi `getProvinceByKemendagriCode()`, `getRegencyByKemendagriCode()`, dll.
 *
 * @module parse
 *
 * @example
 * ```typescript
 * import { parseNIK } from 'nik-id/parse';
 *
 * const result = parseNIK("3204076508850001");
 * if (result.valid) {
 *   console.log(result.provinceCode);    // "32"
 *   console.log(result.regencyCode);     // "3204"
 *   console.log(result.districtCode);    // "320407"
 *   console.log(result.gender);          // "F"
 *   console.log(result.birthDate);       // Date: 1985-08-25
 *   console.log(result.sequenceNumber);  // "0001"
 * }
 * ```
 */

import type { NIKResult } from "./types";
import { disambiguateYear } from "./utils";
import { validateNIK } from "./validate";

/**
 * Parse NIK menjadi komponen-komponennya.
 *
 * Fungsi ini pertama memvalidasi NIK menggunakan {@link validateNIK},
 * kemudian mengekstrak setiap komponen ke dalam object {@link NIKResult}.
 *
 * Komponen yang diekstrak:
 * - **provinceCode** — kode provinsi Kemendagri (2 digit)
 * - **regencyCode** — kode kabupaten/kota Kemendagri (4 digit)
 * - **districtCode** — kode kecamatan Kemendagri (6 digit)
 * - **birthDate** — tanggal lahir sebagai `Date` object
 * - **gender** — jenis kelamin (`"M"` atau `"F"`)
 * - **sequenceNumber** — nomor urut registrasi (4 digit)
 *
 * @param nik - String NIK 16 digit yang akan di-parse
 * @returns {@link NIKResult} — discriminated union yang bisa di-narrow
 *          menggunakan `result.valid`
 *
 * @example
 * ```typescript
 * const result = parseNIK("3204076508850001");
 * if (result.valid) {
 *   // result bertipe NIKValid — semua field tersedia
 *   console.log(result.provinceCode);    // "32"
 *   console.log(result.regencyCode);     // "3204"
 *   console.log(result.districtCode);    // "320407"
 *   console.log(result.birthDate);       // Date: 1985-08-25
 *   console.log(result.gender);          // "F"
 *   console.log(result.sequenceNumber);  // "0001"
 * } else {
 *   // result bertipe NIKInvalid — ada error
 *   console.log(result.error); // "NIK harus 16 digit"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Integrasi dengan kode-wilayah-id
 * import { getProvinceByKemendagriCode } from 'kode-wilayah-id';
 *
 * const result = parseNIK("3204076508850001");
 * if (result.valid) {
 *   const prov = getProvinceByKemendagriCode(result.provinceCode);
 *   console.log(prov?.name); // "JAWA BARAT"
 * }
 * ```
 */
export function parseNIK(nik: string): NIKResult {
	const validation = validateNIK(nik);
	if (!validation.valid) {
		return { valid: false, error: validation.error };
	}

	// Ekstrak komponen wilayah
	const provinceCode = nik.substring(0, 2);
	const regencyCode = nik.substring(0, 4);
	const districtCode = nik.substring(0, 6);

	// Ekstrak dan parse tanggal lahir
	const dd = Number.parseInt(nik.substring(6, 8), 10);
	const mm = Number.parseInt(nik.substring(8, 10), 10);
	const yy = Number.parseInt(nik.substring(10, 12), 10);

	// Tentukan gender dan hari sebenarnya
	const isFemale = dd > 40;
	const actualDay = isFemale ? dd - 40 : dd;
	const gender = isFemale ? "F" : "M";

	// Konstruksi tanggal lahir
	const fullYear = disambiguateYear(yy);
	const birthDate = new Date(fullYear, mm - 1, actualDay);

	// Nomor urut
	const sequenceNumber = nik.substring(12, 16);

	return {
		valid: true,
		nik,
		provinceCode,
		regencyCode,
		districtCode,
		birthDate,
		gender,
		sequenceNumber,
	};
}
