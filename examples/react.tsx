/**
 * Contoh penggunaan nik-id di React.
 *
 * Form validasi NIK dengan feedback real-time.
 * Saat user mengetik NIK, langsung dicek apakah valid,
 * dan kalau valid ditampilkan detail parsing-nya.
 *
 * Catatan: contoh ini menggunakan import dari 'nik-id' — di project nyata
 * pastikan sudah `npm install nik-id`.
 */

import { useState } from "react";
import { parseNIK, validateNIK } from "nik-id";
import type { NIKValid, ValidationResult } from "nik-id/types";

/**
 * Komponen form validasi NIK.
 *
 * Menampilkan input field untuk NIK, dengan feedback real-time:
 * - Saat input kurang dari 16 digit, tampilkan hint
 * - Saat input tepat 16 digit, tampilkan hasil validasi + parsing
 * - Warna border berubah sesuai status (merah = error, hijau = valid)
 */
export function NIKValidator() {
	const [nik, setNik] = useState("");
	const [result, setResult] = useState<ValidationResult | null>(null);
	const [parsed, setParsed] = useState<NIKValid | null>(null);

	function handleChange(value: string) {
		// Hanya izinkan digit
		const cleaned = value.replace(/\D/g, "").slice(0, 16);
		setNik(cleaned);

		if (cleaned.length === 0) {
			setResult(null);
			setParsed(null);
			return;
		}

		// Validasi real-time
		const validation = validateNIK(cleaned);
		setResult(validation);

		// Parse kalau valid
		if (validation.valid) {
			const parseResult = parseNIK(cleaned);
			if (parseResult.valid) {
				setParsed(parseResult);
			}
		} else {
			setParsed(null);
		}
	}

	return (
		<div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "system-ui" }}>
			<h1>Validasi NIK</h1>

			{/* Input NIK */}
			<div style={{ marginBottom: "1rem" }}>
				<label htmlFor="nik-input" style={{ display: "block", marginBottom: 4 }}>
					Masukkan NIK (16 digit):
				</label>
				<input
					id="nik-input"
					type="text"
					inputMode="numeric"
					value={nik}
					onChange={(e) => handleChange(e.target.value)}
					placeholder="Contoh: 3204076508850001"
					maxLength={16}
					style={{
						width: "100%",
						padding: "0.75rem",
						fontSize: "1.25rem",
						letterSpacing: "0.1em",
						border: `2px solid ${
							result === null ? "#ccc" : result.valid ? "#22c55e" : "#ef4444"
						}`,
						borderRadius: 8,
						outline: "none",
					}}
				/>
				<div style={{ fontSize: "0.875rem", color: "#888", marginTop: 4 }}>
					{nik.length}/16 digit
				</div>
			</div>

			{/* Feedback error */}
			{result && !result.valid && (
				<div
					style={{
						padding: "0.75rem",
						background: "#fef2f2",
						border: "1px solid #fecaca",
						borderRadius: 8,
						color: "#dc2626",
						marginBottom: "1rem",
					}}
				>
					{result.error}
				</div>
			)}

			{/* Detail parsing kalau valid */}
			{parsed && (
				<div
					style={{
						padding: "1rem",
						background: "#f0fdf4",
						border: "1px solid #bbf7d0",
						borderRadius: 8,
					}}
				>
					<h3 style={{ margin: "0 0 0.75rem 0", color: "#16a34a" }}>NIK Valid</h3>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<tbody>
							<Row label="Kode Provinsi" value={parsed.provinceCode} />
							<Row label="Kode Kabupaten/Kota" value={parsed.regencyCode} />
							<Row label="Kode Kecamatan" value={parsed.districtCode} />
							<Row
								label="Tanggal Lahir"
								value={parsed.birthDate.toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							/>
							<Row
								label="Jenis Kelamin"
								value={parsed.gender === "M" ? "Laki-laki" : "Perempuan"}
							/>
							<Row label="Nomor Urut" value={parsed.sequenceNumber} />
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

/** Baris tabel key-value */
function Row({ label, value }: { label: string; value: string }) {
	return (
		<tr>
			<td style={{ padding: "4px 8px 4px 0", color: "#666", whiteSpace: "nowrap" }}>
				{label}
			</td>
			<td style={{ padding: "4px 0", fontWeight: 600 }}>{value}</td>
		</tr>
	);
}
