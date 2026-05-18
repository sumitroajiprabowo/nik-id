/**
 * Contoh penggunaan nik-id di Next.js.
 *
 * Mendemonstrasikan dua pola:
 * 1. API Route (Route Handler) — endpoint REST untuk validasi NIK
 * 2. Server Component — parse NIK di server, render di client
 *
 * Catatan: file ini berisi contoh terpisah untuk masing-masing pola.
 * Di project nyata, pisahkan ke file masing-masing sesuai konvensi Next.js.
 */

// ============================================================
// 1. API Route — app/api/nik/validate/route.ts
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { parseNIK, validateNIK } from "nik-id";

/**
 * POST /api/nik/validate
 *
 * Body: { "nik": "3204076508850001" }
 * Response: { "valid": true, "data": { ... } } atau { "valid": false, "error": "..." }
 */
export async function POST(request: NextRequest) {
	const body = await request.json();
	const { nik } = body;

	// Validasi dulu
	const validation = validateNIK(nik);
	if (!validation.valid) {
		return NextResponse.json(
			{ valid: false, error: validation.error },
			{ status: 400 },
		);
	}

	// Parse kalau valid
	const parsed = parseNIK(nik);
	if (!parsed.valid) {
		return NextResponse.json(
			{ valid: false, error: parsed.error },
			{ status: 400 },
		);
	}

	return NextResponse.json({
		valid: true,
		data: {
			nik: parsed.nik,
			provinceCode: parsed.provinceCode,
			regencyCode: parsed.regencyCode,
			districtCode: parsed.districtCode,
			birthDate: parsed.birthDate.toISOString(),
			gender: parsed.gender,
			sequenceNumber: parsed.sequenceNumber,
		},
	});
}

// ============================================================
// 2. Server Component — app/nik/[nik]/page.tsx
// ============================================================

/**
 * Halaman detail NIK — render di server.
 *
 * URL: /nik/3204076508850001
 * Langsung parse NIK di server dan tampilkan hasilnya.
 */
export default function NIKDetailPage({
	params,
}: {
	params: { nik: string };
}) {
	const result = parseNIK(params.nik);

	if (!result.valid) {
		return (
			<div>
				<h1>NIK Tidak Valid</h1>
				<p>{result.error}</p>
			</div>
		);
	}

	return (
		<div>
			<h1>Detail NIK</h1>
			<dl>
				<dt>NIK</dt>
				<dd>{result.nik}</dd>

				<dt>Kode Provinsi</dt>
				<dd>{result.provinceCode}</dd>

				<dt>Kode Kabupaten/Kota</dt>
				<dd>{result.regencyCode}</dd>

				<dt>Kode Kecamatan</dt>
				<dd>{result.districtCode}</dd>

				<dt>Tanggal Lahir</dt>
				<dd>
					{result.birthDate.toLocaleDateString("id-ID", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
				</dd>

				<dt>Jenis Kelamin</dt>
				<dd>{result.gender === "M" ? "Laki-laki" : "Perempuan"}</dd>

				<dt>Nomor Urut</dt>
				<dd>{result.sequenceNumber}</dd>
			</dl>
		</div>
	);
}
