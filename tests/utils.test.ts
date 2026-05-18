import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { disambiguateYear } from "../src/utils";

describe("disambiguateYear", () => {
	// ==========================================
	// Setup: mock Date untuk kontrol tahun sekarang
	// ==========================================
	// Tahun sekarang diset ke 2026 (currentYY = 26)
	// agar test konsisten tanpa tergantung waktu nyata.
	const MOCKED_YEAR = 2026;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(MOCKED_YEAR, 0, 1));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	// ==========================================
	// Tahun 1900-an (YY > currentYY)
	// ==========================================
	describe("YY > currentYY → 1900 + YY", () => {
		it("YY = 27 (satu di atas currentYY) → 1927", () => {
			expect(disambiguateYear(27)).toBe(1927);
		});

		it("YY = 50 → 1950", () => {
			expect(disambiguateYear(50)).toBe(1950);
		});

		it("YY = 85 → 1985", () => {
			expect(disambiguateYear(85)).toBe(1985);
		});

		it("YY = 99 (batas atas) → 1999", () => {
			expect(disambiguateYear(99)).toBe(1999);
		});
	});

	// ==========================================
	// Tahun 2000-an (YY <= currentYY)
	// ==========================================
	describe("YY <= currentYY → 2000 + YY", () => {
		it("YY = 0 (batas bawah) → 2000", () => {
			expect(disambiguateYear(0)).toBe(2000);
		});

		it("YY = 1 → 2001", () => {
			expect(disambiguateYear(1)).toBe(2001);
		});

		it("YY = 15 → 2015", () => {
			expect(disambiguateYear(15)).toBe(2015);
		});

		it("YY = 25 (satu di bawah currentYY) → 2025", () => {
			expect(disambiguateYear(25)).toBe(2025);
		});

		it("YY = 26 (sama dengan currentYY) → 2026", () => {
			expect(disambiguateYear(26)).toBe(2026);
		});
	});

	// ==========================================
	// Boundary: persis di titik batas
	// ==========================================
	describe("boundary currentYY", () => {
		it("YY = currentYY → 2000 + YY (inklusif)", () => {
			// currentYY = 26, jadi 26 ≤ 26 → 2026
			expect(disambiguateYear(26)).toBe(2026);
		});

		it("YY = currentYY + 1 → 1900 + YY (eksklusif)", () => {
			// currentYY = 26, jadi 27 > 26 → 1927
			expect(disambiguateYear(27)).toBe(1927);
		});
	});

	// ==========================================
	// Dengan tahun sekarang berbeda
	// ==========================================
	describe("bergantung pada tahun berjalan", () => {
		it("di tahun 2050, YY=50 → 2050 dan YY=51 → 1951", () => {
			vi.setSystemTime(new Date(2050, 0, 1));
			expect(disambiguateYear(50)).toBe(2050);
			expect(disambiguateYear(51)).toBe(1951);
		});

		it("di tahun 2000, YY=0 → 2000 dan YY=1 → 1901", () => {
			vi.setSystemTime(new Date(2000, 0, 1));
			expect(disambiguateYear(0)).toBe(2000);
			expect(disambiguateYear(1)).toBe(1901);
		});

		it("di tahun 2099, YY=99 → 2099 dan YY=0 → 2000", () => {
			vi.setSystemTime(new Date(2099, 0, 1));
			expect(disambiguateYear(99)).toBe(2099);
			expect(disambiguateYear(0)).toBe(2000);
		});
	});
});
