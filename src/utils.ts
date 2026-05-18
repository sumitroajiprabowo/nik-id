/**
 * Utilitas internal untuk modul nik-id.
 *
 * Berisi fungsi-fungsi helper yang dipakai bersama oleh beberapa modul,
 * seperti disambiguasi tahun 2 digit. Modul ini **tidak** di-export
 * ke consumer — hanya digunakan secara internal.
 *
 * @internal
 * @module utils
 */

/**
 * Disambiguasi tahun 2 digit menjadi tahun penuh 4 digit.
 *
 * Aturan:
 * - Kalau YY lebih besar dari 2 digit terakhir tahun sekarang → 1900 + YY
 * - Kalau YY lebih kecil atau sama → 2000 + YY
 *
 * Contoh (asumsi tahun sekarang 2026):
 * - YY = 85 → 1985 (karena 85 > 26)
 * - YY = 02 → 2002 (karena 02 ≤ 26)
 * - YY = 26 → 2026 (karena 26 ≤ 26)
 * - YY = 27 → 1927 (karena 27 > 26)
 *
 * @param yy - Tahun 2 digit (0-99)
 * @returns Tahun penuh 4 digit
 *
 * @internal
 */
export function disambiguateYear(yy: number): number {
	const currentYY = new Date().getFullYear() % 100;
	return yy > currentYY ? 1900 + yy : 2000 + yy;
}
