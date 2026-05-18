# Changelog

Semua perubahan penting pada package ini didokumentasikan di sini.
Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [1.0.0] - 2026-05-18

### Ditambahkan

- `validateNIK(nik)` — validasi format NIK (16 digit, kode provinsi, tanggal lahir, nomor urut)
- `parseNIK(nik)` — parse NIK menjadi komponen (provinceCode, regencyCode, districtCode, birthDate, gender, sequenceNumber)
- `generateNIK(options?)` — generate NIK yang valid secara format (untuk testing/demo)
- Discriminated union types (`NIKResult`, `ValidationResult`)
- Sub-path imports (`nik-id/validate`, `nik-id/parse`, `nik-id/generate`, `nik-id/types`)
- Dual ESM + CJS output dengan TypeScript declarations
- 100% test coverage (statements, branches, functions, lines)
- Error messages dalam Bahasa Indonesia
