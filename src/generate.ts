/**
 * Modul generator NIK (Nomor Induk Kependudukan).
 *
 * Menyediakan fungsi {@link generateNIK} untuk membuat NIK yang valid
 * secara format, baik full random maupun dengan parameter tertentu
 * (wilayah, gender, tanggal lahir).
 *
 * NIK yang dihasilkan valid secara **format** — semua aturan digit terpenuhi —
 * tapi **bukan** NIK asli milik orang sungguhan. Cocok untuk testing,
 * seeding database, atau demo.
 *
 * @module generate
 *
 * @example
 * ```typescript
 * import { generateNIK } from 'nik-id/generate';
 *
 * // Full random
 * const nik1 = generateNIK();
 *
 * // Perempuan lahir 25 Agustus 1985
 * const nik2 = generateNIK({ gender: "F", birthDate: new Date("1985-08-25") });
 *
 * // Wilayah spesifik
 * const nik3 = generateNIK({
 *   provinceCode: "32",
 *   regencyCode: "3204",
 *   districtCode: "320407",
 * });
 * ```
 */

import type { GenerateOptions } from "./types";

/**
 * Range kode provinsi Kemendagri yang valid untuk generator.
 * Digunakan saat men-generate kode provinsi random.
 */
const MIN_PROVINCE_CODE = 11;
const MAX_PROVINCE_CODE = 97;

/**
 * Batas bawah dan atas tahun lahir untuk generate random.
 * Range 1950-2005 dipilih agar hasil terlihat realistis
 * (tidak terlalu tua dan tidak terlalu muda).
 */
const MIN_BIRTH_YEAR = 1950;
const MAX_BIRTH_YEAR = 2005;

/**
 * Generate angka random dalam range inklusif [min, max].
 *
 * @param min - Batas bawah (inklusif)
 * @param max - Batas atas (inklusif)
 * @returns Angka random dalam range
 */
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pad angka menjadi string dengan leading zero.
 *
 * @param num - Angka yang akan di-pad
 * @param length - Panjang string hasil
 * @returns String dengan leading zero
 *
 * @example
 * ```typescript
 * padZero(5, 2);   // "05"
 * padZero(12, 4);  // "0012"
 * padZero(1, 4);   // "0001"
 * ```
 */
function padZero(num: number, length: number): string {
	return String(num).padStart(length, "0");
}

/**
 * Ambil jumlah hari dalam bulan tertentu.
 *
 * Menggunakan trik JavaScript: `new Date(year, month, 0).getDate()`
 * mengembalikan hari terakhir bulan sebelumnya, yang sama dengan
 * jumlah hari di bulan tersebut.
 *
 * @param year - Tahun penuh (4 digit)
 * @param month - Bulan 1-12
 * @returns Jumlah hari dalam bulan tersebut
 *
 * @example
 * ```typescript
 * getDaysInMonth(2024, 2);  // 29 (tahun kabisat)
 * getDaysInMonth(2023, 2);  // 28
 * getDaysInMonth(2024, 1);  // 31
 * ```
 */
function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

/**
 * Generate tanggal lahir random dalam range 1950-2005.
 *
 * Memastikan tanggal yang dihasilkan valid secara kalender
 * (misal tidak akan menghasilkan 31 Februari).
 *
 * @returns Date object dengan tanggal lahir random
 */
function randomBirthDate(): Date {
	const year = randomInt(MIN_BIRTH_YEAR, MAX_BIRTH_YEAR);
	const month = randomInt(1, 12);
	const maxDay = getDaysInMonth(year, month);
	const day = randomInt(1, maxDay);
	return new Date(year, month - 1, day);
}

/**
 * Generate NIK (Nomor Induk Kependudukan) yang valid secara format.
 *
 * Semua parameter opsional — yang tidak diisi akan di-random.
 * NIK yang dihasilkan memenuhi semua aturan format:
 * - Kode provinsi dalam range 11-97
 * - Tanggal lahir valid secara kalender
 * - Gender tercermin di encoding DD (perempuan: DD + 40)
 * - Sequence number dalam range 0001-9999
 *
 * **Catatan:** NIK ini bukan data asli — hanya valid secara format,
 * cocok untuk testing dan demo.
 *
 * @param options - Opsi untuk men-generate NIK (semua opsional)
 * @returns String NIK 16 digit yang valid secara format
 * @throws {Error} Jika `provinceCode` di luar range 11-97
 * @throws {Error} Jika `regencyCode` tidak diawali `provinceCode`
 * @throws {Error} Jika `districtCode` tidak diawali `regencyCode`
 *
 * @example
 * ```typescript
 * // Full random
 * generateNIK();
 * // "3204071508900123"
 *
 * // Gender spesifik
 * generateNIK({ gender: "F" });
 * // "xxxxxx5508900456" (DD + 40 untuk perempuan)
 *
 * // Tanggal lahir spesifik
 * generateNIK({ birthDate: new Date("1985-08-25") });
 * // "xxxxxx2508850789"
 *
 * // Gender dan tanggal lahir
 * generateNIK({ gender: "F", birthDate: new Date("1985-08-25") });
 * // "xxxxxx6508850234" (25 + 40 = 65 untuk perempuan)
 *
 * // Wilayah lengkap
 * generateNIK({
 *   provinceCode: "32",
 *   regencyCode: "3204",
 *   districtCode: "320407",
 * });
 * // "3204071508900001"
 * ```
 *
 * @since 1.0.0
 */
export function generateNIK(options: GenerateOptions = {}): string {
	const { gender, birthDate } = options;

	// === Kode wilayah ===

	// Province code
	let provinceCode: string;
	if (options.provinceCode !== undefined) {
		const pc = Number.parseInt(options.provinceCode, 10);
		if (Number.isNaN(pc) || pc < MIN_PROVINCE_CODE || pc > MAX_PROVINCE_CODE) {
			throw new Error("Kode provinsi tidak valid (harus 11-97)");
		}
		provinceCode = padZero(pc, 2);
	} else {
		provinceCode = padZero(randomInt(MIN_PROVINCE_CODE, MAX_PROVINCE_CODE), 2);
	}

	// Regency code (2 digit setelah provinsi)
	let regencyCode: string;
	if (options.regencyCode !== undefined) {
		if (!options.regencyCode.startsWith(provinceCode)) {
			throw new Error(
				`Kode kabupaten/kota "${options.regencyCode}" tidak sesuai dengan kode provinsi "${provinceCode}"`,
			);
		}
		regencyCode = options.regencyCode;
	} else {
		regencyCode = provinceCode + padZero(randomInt(1, 99), 2);
	}

	// District code (2 digit setelah kabupaten)
	let districtCode: string;
	if (options.districtCode !== undefined) {
		if (!options.districtCode.startsWith(regencyCode)) {
			throw new Error(
				`Kode kecamatan "${options.districtCode}" tidak sesuai dengan kode kabupaten/kota "${regencyCode}"`,
			);
		}
		districtCode = options.districtCode;
	} else {
		districtCode = regencyCode + padZero(randomInt(1, 99), 2);
	}

	// === Tanggal lahir ===
	const birth = birthDate ?? randomBirthDate();
	const day = birth.getDate();
	const month = birth.getMonth() + 1;
	const year = birth.getFullYear();

	// Gender: perempuan DD + 40, laki-laki DD apa adanya
	const selectedGender = gender ?? (Math.random() < 0.5 ? "M" : "F");
	const encodedDay = selectedGender === "F" ? day + 40 : day;

	// Format DDMMYY
	const ddStr = padZero(encodedDay, 2);
	const mmStr = padZero(month, 2);
	const yyStr = padZero(year % 100, 2);

	// === Sequence number (0001-9999) ===
	const seq = padZero(randomInt(1, 9999), 4);

	return districtCode + ddStr + mmStr + yyStr + seq;
}
