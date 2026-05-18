/**
 * `nik-id` — Parser, validator, dan generator NIK (Nomor Induk Kependudukan) Indonesia.
 *
 * Package ini menyediakan tiga fungsi utama untuk bekerja dengan NIK:
 *
 * - {@link validateNIK} — validasi format NIK (return `{ valid: true/false }`)
 * - {@link parseNIK} — parse NIK menjadi komponen (wilayah, tanggal lahir, gender, dll.)
 * - {@link generateNIK} — generate NIK yang valid secara format (untuk testing/demo)
 *
 * Semua kode wilayah menggunakan format **Kemendagri** (bukan BPS).
 * Untuk resolve ke nama wilayah, gunakan package `kode-wilayah-id`.
 *
 * Zero dependencies, TypeScript-first, dual ESM+CJS.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { validateNIK, parseNIK, generateNIK } from 'nik-id';
 *
 * // Validasi
 * const valid = validateNIK("3204076508850001");
 * console.log(valid); // { valid: true }
 *
 * // Parse
 * const parsed = parseNIK("3204076508850001");
 * if (parsed.valid) {
 *   console.log(parsed.provinceCode);  // "32"
 *   console.log(parsed.gender);        // "F"
 *   console.log(parsed.birthDate);     // Date: 1985-08-25
 * }
 *
 * // Generate (untuk testing)
 * const nik = generateNIK({ gender: "M" });
 * console.log(nik); // "3204071508900123"
 * ```
 *
 * @example
 * ```typescript
 * // Sub-path imports (tree-shakeable)
 * import { validateNIK } from 'nik-id/validate';
 * import { parseNIK } from 'nik-id/parse';
 * import { generateNIK } from 'nik-id/generate';
 * import type { NIKResult } from 'nik-id/types';
 * ```
 */

export { generateNIK } from "./generate";
export { parseNIK } from "./parse";
export type {
	GenerateOptions,
	NIKInvalid,
	NIKResult,
	NIKValid,
	ValidationInvalid,
	ValidationResult,
	ValidationValid,
} from "./types";
export { validateNIK } from "./validate";
