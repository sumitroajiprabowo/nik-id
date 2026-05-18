/**
 * Definisi tipe data untuk parsing dan validasi NIK (Nomor Induk Kependudukan).
 *
 * NIK adalah nomor identitas penduduk Indonesia yang terdiri dari 16 digit:
 * - Digit 1-2: kode provinsi (format Kemendagri)
 * - Digit 3-4: kode kabupaten/kota (format Kemendagri)
 * - Digit 5-6: kode kecamatan (format Kemendagri)
 * - Digit 7-12: tanggal lahir (DDMMYY, perempuan DD+40)
 * - Digit 13-16: nomor urut registrasi
 *
 * Semua kode wilayah menggunakan format **Kemendagri** (bukan BPS).
 * Kalau butuh resolve ke nama wilayah, bisa pakai package `kode-wilayah-id`
 * dengan fungsi `getProvinceByKemendagriCode()`, `getRegencyByKemendagriCode()`, dll.
 *
 * @module types
 */

/**
 * Hasil parsing NIK yang valid — berisi semua komponen NIK yang sudah diekstrak.
 *
 * @example
 * ```typescript
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
 *
 * @since 1.0.0
 */
export interface NIKValid {
	/** Selalu `true` — gunakan untuk narrowing discriminated union */
	valid: true;
	/** NIK asli yang di-parse (16 digit) */
	nik: string;
	/**
	 * Kode provinsi Kemendagri (2 digit).
	 * Contoh: `"32"` untuk Jawa Barat, `"11"` untuk Aceh.
	 *
	 * Bisa dipakai dengan `kode-wilayah-id`:
	 * ```typescript
	 * import { getProvinceByKemendagriCode } from 'kode-wilayah-id';
	 * const prov = getProvinceByKemendagriCode(result.provinceCode);
	 * ```
	 */
	provinceCode: string;
	/**
	 * Kode kabupaten/kota Kemendagri (4 digit).
	 * Contoh: `"3204"` untuk Kab. Bandung.
	 */
	regencyCode: string;
	/**
	 * Kode kecamatan Kemendagri (6 digit).
	 * Contoh: `"320407"` untuk Kec. Nagreg.
	 */
	districtCode: string;
	/**
	 * Tanggal lahir yang sudah di-parse menjadi object `Date`.
	 * Tahun 2 digit disambiguasi: `YY > tahunSekarang` → 1900+YY, else 2000+YY.
	 */
	birthDate: Date;
	/** Jenis kelamin: `"M"` (laki-laki) atau `"F"` (perempuan) */
	gender: "M" | "F";
	/** Nomor urut registrasi di kecamatan (4 digit, `"0001"`–`"9999"`) */
	sequenceNumber: string;
}

/**
 * Hasil parsing NIK yang tidak valid — berisi pesan error.
 *
 * @example
 * ```typescript
 * const result = parseNIK("123");
 * if (!result.valid) {
 *   console.log(result.error); // "NIK harus 16 digit"
 * }
 * ```
 *
 * @since 1.0.0
 */
export interface NIKInvalid {
	/** Selalu `false` — gunakan untuk narrowing discriminated union */
	valid: false;
	/** Pesan error dalam bahasa Indonesia yang menjelaskan kenapa NIK tidak valid */
	error: string;
}

/**
 * Discriminated union hasil parsing NIK.
 *
 * Gunakan `result.valid` untuk narrowing:
 *
 * @example
 * ```typescript
 * const result = parseNIK(input);
 * if (result.valid) {
 *   // result bertipe NIKValid — semua field tersedia
 *   console.log(result.gender);
 * } else {
 *   // result bertipe NIKInvalid — ada error
 *   console.log(result.error);
 * }
 * ```
 *
 * @since 1.0.0
 */
export type NIKResult = NIKValid | NIKInvalid;

/**
 * Hasil validasi NIK yang valid.
 *
 * @example
 * ```typescript
 * const result = validateNIK("3204076508850001");
 * if (result.valid) {
 *   console.log("NIK valid!");
 * }
 * ```
 *
 * @since 1.0.0
 */
export interface ValidationValid {
	/** Selalu `true` */
	valid: true;
}

/**
 * Hasil validasi NIK yang tidak valid.
 *
 * @example
 * ```typescript
 * const result = validateNIK("123");
 * if (!result.valid) {
 *   console.log(result.error); // "NIK harus 16 digit"
 * }
 * ```
 *
 * @since 1.0.0
 */
export interface ValidationInvalid {
	/** Selalu `false` */
	valid: false;
	/** Pesan error dalam bahasa Indonesia */
	error: string;
}

/**
 * Discriminated union hasil validasi NIK.
 *
 * Lebih ringan dari {@link NIKResult} — cuma cek valid/tidak tanpa parsing.
 *
 * @since 1.0.0
 */
export type ValidationResult = ValidationValid | ValidationInvalid;

/**
 * Opsi untuk men-generate NIK.
 *
 * Semua field opsional — yang tidak diisi akan di-random.
 *
 * @example
 * ```typescript
 * // Full random
 * generateNIK();
 *
 * // Perempuan lahir 25 Agustus 1985
 * generateNIK({ gender: "F", birthDate: new Date("1985-08-25") });
 *
 * // Wilayah spesifik (Kec. Nagreg, Kab. Bandung, Jawa Barat)
 * generateNIK({ provinceCode: "32", regencyCode: "3204", districtCode: "320407" });
 * ```
 *
 * @since 1.0.0
 */
export interface GenerateOptions {
	/**
	 * Kode provinsi Kemendagri (2 digit).
	 * Kalau diisi, `regencyCode` juga harus diisi.
	 */
	provinceCode?: string;
	/**
	 * Kode kabupaten/kota Kemendagri (4 digit).
	 * Kalau diisi, `provinceCode` harus match (2 digit pertama sama).
	 */
	regencyCode?: string;
	/**
	 * Kode kecamatan Kemendagri (6 digit).
	 * Kalau diisi, `regencyCode` harus match (4 digit pertama sama).
	 */
	districtCode?: string;
	/** Jenis kelamin: `"M"` (laki-laki) atau `"F"` (perempuan) */
	gender?: "M" | "F";
	/**
	 * Tanggal lahir. Kalau tidak diisi, di-random antara 1950-2005.
	 */
	birthDate?: Date;
}
