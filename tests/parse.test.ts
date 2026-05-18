import { describe, expect, it } from "vitest";
import { parseNIK } from "../src/parse";

describe("parseNIK", () => {
	// ==========================================
	// Delegasi validasi ke validateNIK
	// ==========================================
	describe("delegasi validasi", () => {
		it("mengembalikan error jika input bukan string", () => {
			const result = parseNIK(12345 as unknown as string);
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("NIK harus berupa string");
			}
		});

		it("mengembalikan error jika panjang bukan 16", () => {
			const result = parseNIK("123");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("NIK harus 16 digit");
			}
		});

		it("mengembalikan error jika mengandung huruf", () => {
			const result = parseNIK("320407650885000A");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("NIK hanya boleh berisi angka");
			}
		});

		it("mengembalikan error jika kode provinsi tidak valid", () => {
			const result = parseNIK("0004076508850001");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("Kode provinsi tidak valid");
			}
		});

		it("mengembalikan error jika tanggal lahir tidak valid", () => {
			const result = parseNIK("3204073102850001");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("Tanggal lahir tidak valid");
			}
		});

		it("mengembalikan error jika sequence number 0000", () => {
			const result = parseNIK("3204071508850000");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("Nomor urut tidak valid");
			}
		});
	});

	// ==========================================
	// Ekstraksi kode wilayah
	// ==========================================
	describe("ekstraksi kode wilayah", () => {
		it("mengekstrak kode provinsi 2 digit", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("32");
			}
		});

		it("mengekstrak kode kabupaten/kota 4 digit", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.regencyCode).toBe("3204");
			}
		});

		it("mengekstrak kode kecamatan 6 digit", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.districtCode).toBe("320407");
			}
		});

		it("mengekstrak kode wilayah dari Aceh (11)", () => {
			const result = parseNIK("1101011508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("11");
				expect(result.regencyCode).toBe("1101");
				expect(result.districtCode).toBe("110101");
			}
		});

		it("mengekstrak kode wilayah dari DKI Jakarta (31)", () => {
			const result = parseNIK("3175011508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.provinceCode).toBe("31");
				expect(result.regencyCode).toBe("3175");
				expect(result.districtCode).toBe("317501");
			}
		});

		it("menyertakan NIK asli di hasil", () => {
			const nik = "3204071508850001";
			const result = parseNIK(nik);
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.nik).toBe(nik);
			}
		});
	});

	// ==========================================
	// Ekstraksi gender
	// ==========================================
	describe("ekstraksi gender", () => {
		it("mendeteksi laki-laki (DD ≤ 31)", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("M");
			}
		});

		it("mendeteksi perempuan (DD > 40)", () => {
			const result = parseNIK("3204076508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("F");
			}
		});

		it("laki-laki hari 01 (DD=01)", () => {
			const result = parseNIK("3204070108850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("M");
			}
		});

		it("laki-laki hari 31 (DD=31)", () => {
			const result = parseNIK("3204073101850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("M");
			}
		});

		it("perempuan hari 01 (DD=41)", () => {
			const result = parseNIK("3204074108850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("F");
			}
		});

		it("perempuan hari 31 (DD=71, bulan Januari)", () => {
			const result = parseNIK("3204077101850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.gender).toBe("F");
			}
		});
	});

	// ==========================================
	// Ekstraksi tanggal lahir
	// ==========================================
	describe("ekstraksi tanggal lahir", () => {
		it("parse tanggal lahir laki-laki 15 Agustus 1985", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(1985);
				expect(result.birthDate.getMonth()).toBe(7); // 0-indexed, Agustus = 7
				expect(result.birthDate.getDate()).toBe(15);
			}
		});

		it("parse tanggal lahir perempuan 25 Agustus 1985 (DD=65)", () => {
			const result = parseNIK("3204076508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(1985);
				expect(result.birthDate.getMonth()).toBe(7);
				expect(result.birthDate.getDate()).toBe(25);
			}
		});

		it("parse 29 Februari di tahun kabisat (YY=00 → 2000)", () => {
			const result = parseNIK("3204072902000001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(2000);
				expect(result.birthDate.getMonth()).toBe(1); // Februari = 1
				expect(result.birthDate.getDate()).toBe(29);
			}
		});

		it("disambiguasi tahun: YY=85 → 1985 (> tahun sekarang)", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(1985);
			}
		});

		it("disambiguasi tahun: YY=02 → 2002 (≤ tahun sekarang)", () => {
			const result = parseNIK("3204071508020001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(2002);
			}
		});

		it("disambiguasi tahun: YY=99 → 1999", () => {
			const result = parseNIK("3204071508990001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getFullYear()).toBe(1999);
			}
		});

		it("parse 1 Januari (batas bawah)", () => {
			const result = parseNIK("3204070101850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getMonth()).toBe(0); // Januari = 0
				expect(result.birthDate.getDate()).toBe(1);
			}
		});

		it("parse 31 Desember (batas atas)", () => {
			const result = parseNIK("3204073112850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.birthDate.getMonth()).toBe(11); // Desember = 11
				expect(result.birthDate.getDate()).toBe(31);
			}
		});
	});

	// ==========================================
	// Ekstraksi sequence number
	// ==========================================
	describe("ekstraksi sequence number", () => {
		it("mengekstrak sequence number 0001", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.sequenceNumber).toBe("0001");
			}
		});

		it("mengekstrak sequence number 9999", () => {
			const result = parseNIK("3204071508859999");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.sequenceNumber).toBe("9999");
			}
		});

		it("mengekstrak sequence number 0123", () => {
			const result = parseNIK("3204071508850123");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.sequenceNumber).toBe("0123");
			}
		});

		it("sequence number disimpan sebagai string (preserve leading zero)", () => {
			const result = parseNIK("3204071508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(typeof result.sequenceNumber).toBe("string");
				expect(result.sequenceNumber).toBe("0001");
			}
		});
	});

	// ==========================================
	// Discriminated union dan narrowing
	// ==========================================
	describe("discriminated union", () => {
		it("result valid memiliki semua field NIKValid", () => {
			const result = parseNIK("3204076508850001");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.nik).toBe("3204076508850001");
				expect(result.provinceCode).toBe("32");
				expect(result.regencyCode).toBe("3204");
				expect(result.districtCode).toBe("320407");
				expect(result.gender).toBe("F");
				expect(result.birthDate).toBeInstanceOf(Date);
				expect(result.sequenceNumber).toBe("0001");
			}
		});

		it("result invalid memiliki field error", () => {
			const result = parseNIK("123");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toBe("NIK harus 16 digit");
			}
		});
	});
});
