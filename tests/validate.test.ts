import { describe, expect, it } from "vitest";
import { validateNIK } from "../src/validate";

describe("validateNIK", () => {
	// ==========================================
	// Validasi tipe data
	// ==========================================
	describe("validasi tipe data", () => {
		it("mengembalikan error jika input bukan string", () => {
			const result = validateNIK(12345 as unknown as string);
			expect(result).toEqual({ valid: false, error: "NIK harus berupa string" });
		});

		it("mengembalikan error jika input null", () => {
			const result = validateNIK(null as unknown as string);
			expect(result).toEqual({ valid: false, error: "NIK harus berupa string" });
		});

		it("mengembalikan error jika input undefined", () => {
			const result = validateNIK(undefined as unknown as string);
			expect(result).toEqual({ valid: false, error: "NIK harus berupa string" });
		});

		it("mengembalikan error jika input boolean", () => {
			const result = validateNIK(true as unknown as string);
			expect(result).toEqual({ valid: false, error: "NIK harus berupa string" });
		});

		it("mengembalikan error jika input object", () => {
			const result = validateNIK({} as unknown as string);
			expect(result).toEqual({ valid: false, error: "NIK harus berupa string" });
		});

		it("mengembalikan error jika input array", () => {
			const result = validateNIK([] as unknown as string);
			expect(result).toEqual({ valid: false, error: "NIK harus berupa string" });
		});
	});

	// ==========================================
	// Validasi panjang
	// ==========================================
	describe("validasi panjang", () => {
		it("mengembalikan error jika string kosong", () => {
			const result = validateNIK("");
			expect(result).toEqual({ valid: false, error: "NIK harus 16 digit" });
		});

		it("mengembalikan error jika kurang dari 16 digit", () => {
			const result = validateNIK("320407650885000");
			expect(result).toEqual({ valid: false, error: "NIK harus 16 digit" });
		});

		it("mengembalikan error jika lebih dari 16 digit", () => {
			const result = validateNIK("32040765088500011");
			expect(result).toEqual({ valid: false, error: "NIK harus 16 digit" });
		});

		it("mengembalikan error jika 1 digit saja", () => {
			const result = validateNIK("3");
			expect(result).toEqual({ valid: false, error: "NIK harus 16 digit" });
		});
	});

	// ==========================================
	// Validasi format (hanya digit)
	// ==========================================
	describe("validasi format digit", () => {
		it("mengembalikan error jika mengandung huruf", () => {
			const result = validateNIK("320407650885000A");
			expect(result).toEqual({ valid: false, error: "NIK hanya boleh berisi angka" });
		});

		it("mengembalikan error jika mengandung spasi", () => {
			const result = validateNIK("3204 76508850001");
			expect(result).toEqual({ valid: false, error: "NIK hanya boleh berisi angka" });
		});

		it("mengembalikan error jika mengandung tanda hubung", () => {
			const result = validateNIK("3204-076508-8500");
			expect(result).toEqual({ valid: false, error: "NIK hanya boleh berisi angka" });
		});

		it("mengembalikan error jika mengandung karakter khusus", () => {
			const result = validateNIK("320407650885!001");
			expect(result).toEqual({ valid: false, error: "NIK hanya boleh berisi angka" });
		});
	});

	// ==========================================
	// Validasi kode provinsi
	// ==========================================
	describe("validasi kode provinsi", () => {
		it("mengembalikan error jika kode provinsi 00", () => {
			const result = validateNIK("0004076508850001");
			expect(result).toEqual({ valid: false, error: "Kode provinsi tidak valid" });
		});

		it("mengembalikan error jika kode provinsi 10 (di bawah minimum 11)", () => {
			const result = validateNIK("1004076508850001");
			expect(result).toEqual({ valid: false, error: "Kode provinsi tidak valid" });
		});

		it("mengembalikan error jika kode provinsi 98 (di atas maksimum 97)", () => {
			const result = validateNIK("9804076508850001");
			expect(result).toEqual({ valid: false, error: "Kode provinsi tidak valid" });
		});

		it("mengembalikan error jika kode provinsi 99", () => {
			const result = validateNIK("9904076508850001");
			expect(result).toEqual({ valid: false, error: "Kode provinsi tidak valid" });
		});

		it("menerima kode provinsi 11 (batas bawah, Aceh)", () => {
			const result = validateNIK("1104071508850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima kode provinsi 97 (batas atas, Papua Barat Daya)", () => {
			const result = validateNIK("9704071508850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima kode provinsi 32 (Jawa Barat)", () => {
			const result = validateNIK("3204071508850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima kode provinsi 51 (Bali)", () => {
			const result = validateNIK("5104071508850001");
			expect(result).toEqual({ valid: true });
		});
	});

	// ==========================================
	// Validasi tanggal lahir
	// ==========================================
	describe("validasi tanggal lahir", () => {
		it("mengembalikan error jika hari 00 (laki-laki)", () => {
			const result = validateNIK("3204070008850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika hari 40 (antara 31 dan 41 — gap invalid)", () => {
			const result = validateNIK("3204074008850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika hari 32 (gap antara laki-laki dan perempuan)", () => {
			const result = validateNIK("3204073208850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika hari 39 (masih di gap)", () => {
			const result = validateNIK("3204073908850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika bulan 00", () => {
			const result = validateNIK("3204071500850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika bulan 13", () => {
			const result = validateNIK("3204071513850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika 31 Februari (tanggal invalid di kalender)", () => {
			const result = validateNIK("3204073102850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika 30 Februari (tanggal invalid di kalender)", () => {
			const result = validateNIK("3204073002850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika 29 Februari di tahun bukan kabisat", () => {
			// YY = 01 → 2001 (bukan kabisat)
			const result = validateNIK("3204072902010001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika 31 April (bulan dengan 30 hari)", () => {
			const result = validateNIK("3204073104850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika 31 Juni", () => {
			const result = validateNIK("3204073106850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("mengembalikan error jika perempuan 72 (31+40+1, melebihi 71)", () => {
			const result = validateNIK("3204077208850001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});

		it("menerima hari 01 laki-laki (batas bawah)", () => {
			const result = validateNIK("3204070108850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima hari 31 laki-laki (batas atas, bulan Januari)", () => {
			const result = validateNIK("3204073101850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima hari 41 perempuan (batas bawah, DD=01+40)", () => {
			const result = validateNIK("3204074108850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima hari 71 perempuan (batas atas, DD=31+40, bulan Januari)", () => {
			const result = validateNIK("3204077101850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima 29 Februari di tahun kabisat", () => {
			// YY = 00 → 2000 (kabisat)
			const result = validateNIK("3204072902000001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima 28 Februari di tahun bukan kabisat", () => {
			// YY = 01 → 2001 (bukan kabisat)
			const result = validateNIK("3204072802010001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima bulan 12 (batas atas)", () => {
			const result = validateNIK("3204071512850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima perempuan 29 Februari kabisat (DD=69, 29+40)", () => {
			// YY = 00 → 2000 (kabisat)
			const result = validateNIK("3204076902000001");
			expect(result).toEqual({ valid: true });
		});

		it("mengembalikan error jika perempuan 30 Februari (DD=70, 30+40)", () => {
			const result = validateNIK("3204077002000001");
			expect(result).toEqual({ valid: false, error: "Tanggal lahir tidak valid" });
		});
	});

	// ==========================================
	// Validasi sequence number
	// ==========================================
	describe("validasi sequence number", () => {
		it("mengembalikan error jika sequence number 0000", () => {
			const result = validateNIK("3204071508850000");
			expect(result).toEqual({ valid: false, error: "Nomor urut tidak valid" });
		});

		it("menerima sequence number 0001 (minimum valid)", () => {
			const result = validateNIK("3204071508850001");
			expect(result).toEqual({ valid: true });
		});

		it("menerima sequence number 9999 (maximum valid)", () => {
			const result = validateNIK("3204071508859999");
			expect(result).toEqual({ valid: true });
		});

		it("menerima sequence number 5000 (tengah)", () => {
			const result = validateNIK("3204071508855000");
			expect(result).toEqual({ valid: true });
		});
	});

	// ==========================================
	// NIK valid (happy path)
	// ==========================================
	describe("NIK valid", () => {
		it("memvalidasi NIK laki-laki Jawa Barat", () => {
			const result = validateNIK("3204071508850001");
			expect(result).toEqual({ valid: true });
		});

		it("memvalidasi NIK perempuan Jawa Barat", () => {
			const result = validateNIK("3204076508850001");
			expect(result).toEqual({ valid: true });
		});

		it("memvalidasi NIK dari Aceh (provinsi 11)", () => {
			const result = validateNIK("1101011508850001");
			expect(result).toEqual({ valid: true });
		});

		it("memvalidasi NIK dari DKI Jakarta (provinsi 31)", () => {
			const result = validateNIK("3175011508850001");
			expect(result).toEqual({ valid: true });
		});

		it("memvalidasi NIK dengan YY = 00 (tahun 2000)", () => {
			const result = validateNIK("3204071508000001");
			expect(result).toEqual({ valid: true });
		});

		it("memvalidasi NIK dengan YY = 99 (tahun 1999)", () => {
			const result = validateNIK("3204071508990001");
			expect(result).toEqual({ valid: true });
		});

		it("narrowing type benar untuk valid result", () => {
			const result = validateNIK("3204071508850001");
			if (result.valid) {
				// TypeScript harus bisa narrow ke ValidationValid
				const _valid: true = result.valid;
				expect(_valid).toBe(true);
			}
		});

		it("narrowing type benar untuk invalid result", () => {
			const result = validateNIK("123");
			if (!result.valid) {
				// TypeScript harus bisa narrow ke ValidationInvalid
				const _error: string = result.error;
				expect(_error).toBe("NIK harus 16 digit");
			}
		});
	});
});
