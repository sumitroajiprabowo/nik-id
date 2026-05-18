import { describe, expect, it } from "vitest";
import { generateNIK } from "../src/generate";
import { parseNIK } from "../src/parse";
import { validateNIK } from "../src/validate";

describe("generateNIK", () => {
	// ==========================================
	// Format dasar
	// ==========================================
	describe("format dasar", () => {
		it("menghasilkan string 16 digit", () => {
			const nik = generateNIK();
			expect(nik).toHaveLength(16);
			expect(/^\d{16}$/.test(nik)).toBe(true);
		});

		it("NIK yang dihasilkan lolos validasi", () => {
			for (let i = 0; i < 50; i++) {
				const nik = generateNIK();
				const result = validateNIK(nik);
				expect(result).toEqual({ valid: true });
			}
		});

		it("NIK yang dihasilkan bisa di-parse", () => {
			for (let i = 0; i < 50; i++) {
				const nik = generateNIK();
				const result = parseNIK(nik);
				expect(result.valid).toBe(true);
			}
		});
	});

	// ==========================================
	// Opsi gender
	// ==========================================
	describe("opsi gender", () => {
		it("generate NIK laki-laki (DD ≤ 31)", () => {
			for (let i = 0; i < 30; i++) {
				const nik = generateNIK({ gender: "M" });
				const result = parseNIK(nik);
				expect(result.valid).toBe(true);
				if (result.valid) {
					expect(result.gender).toBe("M");
				}
			}
		});

		it("generate NIK perempuan (DD > 40)", () => {
			for (let i = 0; i < 30; i++) {
				const nik = generateNIK({ gender: "F" });
				const result = parseNIK(nik);
				expect(result.valid).toBe(true);
				if (result.valid) {
					expect(result.gender).toBe("F");
				}
			}
		});
	});

	// ==========================================
	// Opsi tanggal lahir
	// ==========================================
	describe("opsi tanggal lahir", () => {
		it("generate NIK dengan tanggal lahir spesifik", () => {
			const birthDate = new Date(1985, 7, 25); // 25 Agustus 1985
			const nik = generateNIK({ birthDate });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(1985);
				expect(result.birthDate.getMonth()).toBe(7);
				expect(result.birthDate.getDate()).toBe(25);
			}
		});

		it("generate NIK perempuan dengan tanggal lahir spesifik", () => {
			const birthDate = new Date(1985, 7, 25);
			const nik = generateNIK({ gender: "F", birthDate });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("F");
				expect(result.birthDate.getFullYear()).toBe(1985);
				expect(result.birthDate.getMonth()).toBe(7);
				expect(result.birthDate.getDate()).toBe(25);
			}
		});

		it("generate NIK laki-laki dengan tanggal lahir spesifik", () => {
			const birthDate = new Date(1990, 0, 1); // 1 Januari 1990
			const nik = generateNIK({ gender: "M", birthDate });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("M");
				expect(result.birthDate.getFullYear()).toBe(1990);
				expect(result.birthDate.getMonth()).toBe(0);
				expect(result.birthDate.getDate()).toBe(1);
			}
		});

		it("generate NIK dengan 29 Februari di tahun kabisat", () => {
			const birthDate = new Date(2000, 1, 29); // 29 Feb 2000
			const nik = generateNIK({ birthDate, gender: "M" });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(2000);
				expect(result.birthDate.getMonth()).toBe(1);
				expect(result.birthDate.getDate()).toBe(29);
			}
		});
	});

	// ==========================================
	// Opsi kode wilayah
	// ==========================================
	describe("opsi kode wilayah", () => {
		it("generate NIK dengan kode provinsi spesifik", () => {
			const nik = generateNIK({ provinceCode: "32" });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("32");
			}
		});

		it("generate NIK dengan kode kabupaten/kota spesifik", () => {
			const nik = generateNIK({ provinceCode: "32", regencyCode: "3204" });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("32");
				expect(result.regencyCode).toBe("3204");
			}
		});

		it("generate NIK dengan kode kecamatan spesifik", () => {
			const nik = generateNIK({
				provinceCode: "32",
				regencyCode: "3204",
				districtCode: "320407",
			});
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("32");
				expect(result.regencyCode).toBe("3204");
				expect(result.districtCode).toBe("320407");
			}
		});

		it("generate NIK dari Aceh (provinsi 11)", () => {
			const nik = generateNIK({ provinceCode: "11" });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("11");
			}
		});

		it("generate NIK dari Papua Barat Daya (provinsi 97)", () => {
			const nik = generateNIK({ provinceCode: "97" });
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("97");
			}
		});
	});

	// ==========================================
	// Validasi opsi (error handling)
	// ==========================================
	describe("validasi opsi", () => {
		it("throw error jika kode provinsi di bawah 11", () => {
			expect(() => generateNIK({ provinceCode: "10" })).toThrow(
				"Kode provinsi tidak valid (harus 11-97)",
			);
		});

		it("throw error jika kode provinsi di atas 97", () => {
			expect(() => generateNIK({ provinceCode: "98" })).toThrow(
				"Kode provinsi tidak valid (harus 11-97)",
			);
		});

		it("throw error jika kode provinsi 00", () => {
			expect(() => generateNIK({ provinceCode: "00" })).toThrow(
				"Kode provinsi tidak valid (harus 11-97)",
			);
		});

		it("throw error jika kode provinsi bukan angka", () => {
			expect(() => generateNIK({ provinceCode: "ab" })).toThrow(
				"Kode provinsi tidak valid (harus 11-97)",
			);
		});

		it("throw error jika kode kabupaten tidak cocok dengan provinsi", () => {
			expect(() => generateNIK({ provinceCode: "32", regencyCode: "3301" })).toThrow(
				'Kode kabupaten/kota "3301" tidak sesuai dengan kode provinsi "32"',
			);
		});

		it("throw error jika kode kecamatan tidak cocok dengan kabupaten", () => {
			expect(() =>
				generateNIK({
					provinceCode: "32",
					regencyCode: "3204",
					districtCode: "320501",
				}),
			).toThrow('Kode kecamatan "320501" tidak sesuai dengan kode kabupaten/kota "3204"');
		});
	});

	// ==========================================
	// Opsi gabungan
	// ==========================================
	describe("opsi gabungan", () => {
		it("generate NIK lengkap: wilayah + gender + tanggal lahir", () => {
			const birthDate = new Date(1985, 7, 25);
			const nik = generateNIK({
				provinceCode: "32",
				regencyCode: "3204",
				districtCode: "320407",
				gender: "F",
				birthDate,
			});
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("32");
				expect(result.regencyCode).toBe("3204");
				expect(result.districtCode).toBe("320407");
				expect(result.gender).toBe("F");
				expect(result.birthDate.getFullYear()).toBe(1985);
				expect(result.birthDate.getMonth()).toBe(7);
				expect(result.birthDate.getDate()).toBe(25);
			}
		});

		it("generate NIK tanpa opsi (full random) — tetap valid", () => {
			for (let i = 0; i < 20; i++) {
				const nik = generateNIK();
				const result = validateNIK(nik);
				expect(result).toEqual({ valid: true });
			}
		});

		it("generate NIK dengan opsi kosong (sama seperti tanpa opsi)", () => {
			const nik = generateNIK({});
			const result = validateNIK(nik);
			expect(result).toEqual({ valid: true });
		});
	});

	// ==========================================
	// Randomness dan variasi
	// ==========================================
	describe("randomness", () => {
		it("generate NIK berbeda pada panggilan berurutan", () => {
			const niks = new Set<string>();
			for (let i = 0; i < 20; i++) {
				niks.add(generateNIK());
			}
			// Seharusnya menghasilkan setidaknya beberapa NIK unik
			// (probabilitas semua sama sangat kecil)
			expect(niks.size).toBeGreaterThan(1);
		});

		it("sequence number random antara 0001-9999", () => {
			const seqs = new Set<string>();
			for (let i = 0; i < 100; i++) {
				const nik = generateNIK();
				const seq = nik.substring(12, 16);
				seqs.add(seq);
				// Pastikan tidak pernah 0000
				expect(seq).not.toBe("0000");
				// Pastikan selalu 4 digit
				expect(seq).toHaveLength(4);
			}
			// Seharusnya ada variasi
			expect(seqs.size).toBeGreaterThan(1);
		});
	});
});
