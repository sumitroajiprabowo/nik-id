/**
 * Modul validasi NIK (Nomor Induk Kependudukan).
 *
 * Menyediakan fungsi {@link validateNIK} untuk mengecek apakah sebuah string
 * merupakan NIK yang valid secara format. Validasi dilakukan secara bertahap:
 * tipe data → panjang → isi digit → kode provinsi → tanggal lahir → nomor urut.
 *
 * Modul ini **tidak** memvalidasi apakah kode wilayah benar-benar terdaftar
 * di database Kemendagri — hanya format dan range yang dicek. Untuk resolve
 * nama wilayah dari kode, gunakan package `kode-wilayah-id`.
 *
 * @module validate
 *
 * @example
 * ```typescript
 * import { validateNIK } from 'nik-id/validate';
 *
 * const result = validateNIK("3204076508850001");
 * if (result.valid) {
 *   console.log("NIK valid!");
 * } else {
 *   console.log(result.error);
 * }
 * ```
 */

import type { ValidationResult } from "./types";
import { disambiguateYear } from "./utils";

/**
 * Range kode provinsi Kemendagri yang valid.
 *
 * Berdasarkan Permendagri tentang kode dan data wilayah administrasi
 * pemerintahan, kode provinsi di Indonesia berada dalam rentang 11 (Aceh)
 * sampai 97 (Papua Barat Daya). Kode di luar range ini dianggap tidak valid.
 */
const MIN_PROVINCE_CODE = 11;
const MAX_PROVINCE_CODE = 97;

/** Panjang NIK yang valid — selalu 16 digit */
const NIK_LENGTH = 16;

/** Pattern regex untuk mengecek apakah string hanya berisi digit angka */
const DIGITS_ONLY_PATTERN = /^\d{16}$/;

/**
 * Cek apakah tanggal yang diberikan valid secara kalender.
 *
 * Menggunakan trik JavaScript: buat Date dari komponen year/month/day,
 * lalu cek apakah komponen yang di-set sama dengan yang dikembalikan.
 * Kalau beda (misal 31 Februari → jadi 3 Maret), berarti tanggal asli
 * tidak valid.
 *
 * @param year - Tahun penuh (4 digit, misal 1985)
 * @param month - Bulan 1-12
 * @param day - Hari 1-31
 * @returns `true` kalau tanggal valid, `false` kalau tidak
 */
function isValidCalendarDate(year: number, month: number, day: number): boolean {
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/**
 * Validasi format NIK (Nomor Induk Kependudukan).
 *
 * Melakukan pengecekan bertahap terhadap string NIK:
 *
 * 1. **Tipe data** — input harus berupa `string`
 * 2. **Panjang** — harus tepat 16 karakter
 * 3. **Format** — harus semua digit angka (0-9)
 * 4. **Kode provinsi** — 2 digit pertama harus dalam range 11-97
 * 5. **Tanggal lahir** — digit 7-12 harus membentuk tanggal yang valid
 *    (DD 01-31 untuk laki-laki, 41-71 untuk perempuan; MM 01-12; YY 00-99)
 * 6. **Nomor urut** — digit 13-16 tidak boleh `0000`
 *
 * Validasi berhenti di error pertama yang ditemukan (fail-fast).
 *
 * @param nik - String yang akan divalidasi sebagai NIK
 * @returns {@link ValidationResult} — `{ valid: true }` kalau valid,
 *          `{ valid: false, error: "..." }` kalau tidak
 *
 * @example
 * ```typescript
 * // NIK valid
 * validateNIK("3204076508850001");
 * // { valid: true }
 *
 * // Input bukan string
 * validateNIK(12345 as any);
 * // { valid: false, error: "NIK harus berupa string" }
 *
 * // Panjang salah
 * validateNIK("123");
 * // { valid: false, error: "NIK harus 16 digit" }
 *
 * // Mengandung huruf
 * validateNIK("320407650885000A");
 * // { valid: false, error: "NIK hanya boleh berisi angka" }
 *
 * // Kode provinsi di luar range
 * validateNIK("0004076508850001");
 * // { valid: false, error: "Kode provinsi tidak valid" }
 *
 * // Tanggal tidak ada di kalender
 * validateNIK("3204073102850001");  // 31 Februari
 * // { valid: false, error: "Tanggal lahir tidak valid" }
 *
 * // Nomor urut 0000
 * validateNIK("3204076508850000");
 * // { valid: false, error: "Nomor urut tidak valid" }
 * ```
 *
 * @since 1.0.0
 */
export function validateNIK(nik: string): ValidationResult {
	// 1. Cek tipe data
	if (typeof nik !== "string") {
		return { valid: false, error: "NIK harus berupa string" };
	}

	// 2. Cek panjang
	if (nik.length !== NIK_LENGTH) {
		return { valid: false, error: "NIK harus 16 digit" };
	}

	// 3. Cek semua digit
	if (!DIGITS_ONLY_PATTERN.test(nik)) {
		return { valid: false, error: "NIK hanya boleh berisi angka" };
	}

	// 4. Cek kode provinsi (range 11-97)
	const provinceCode = Number.parseInt(nik.substring(0, 2), 10);
	if (provinceCode < MIN_PROVINCE_CODE || provinceCode > MAX_PROVINCE_CODE) {
		return { valid: false, error: "Kode provinsi tidak valid" };
	}

	// 5. Cek tanggal lahir
	const dd = Number.parseInt(nik.substring(6, 8), 10);
	const mm = Number.parseInt(nik.substring(8, 10), 10);
	const yy = Number.parseInt(nik.substring(10, 12), 10);

	// DD harus dalam range 01-31 (laki-laki) atau 41-71 (perempuan)
	// DD 00, 32-40, dan >71 tidak valid
	const isValidMaleDD = dd >= 1 && dd <= 31;
	const isValidFemaleDD = dd >= 41 && dd <= 71;
	if (!isValidMaleDD && !isValidFemaleDD) {
		return { valid: false, error: "Tanggal lahir tidak valid" };
	}

	// Bulan harus 01-12
	if (mm < 1 || mm > 12) {
		return { valid: false, error: "Tanggal lahir tidak valid" };
	}

	// Tentukan hari sebenarnya (perempuan: DD - 40)
	const actualDay = isValidFemaleDD ? dd - 40 : dd;

	// Validasi kalender (misal 31 Februari → invalid)
	const fullYear = disambiguateYear(yy);
	if (!isValidCalendarDate(fullYear, mm, actualDay)) {
		return { valid: false, error: "Tanggal lahir tidak valid" };
	}

	// 6. Cek sequence number (tidak boleh 0000)
	const seq = nik.substring(12, 16);
	if (seq === "0000") {
		return { valid: false, error: "Nomor urut tidak valid" };
	}

	return { valid: true };
}
