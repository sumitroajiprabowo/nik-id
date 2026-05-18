# Changelog

Semua perubahan penting pada package ini didokumentasikan di sini.
Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [1.0.1] - 2026-05-18

### Ditambahkan

- Unit test untuk `disambiguateYear` (14 test cases baru, total 126 tests)
- Badge npm monthly downloads di README
- Badge Codecov coverage di README
- GitHub repository topics (nik, ktp, indonesia, validator, parser, dll.)
- Coverage reporter lcov untuk upload ke Codecov
- Upload coverage ke Codecov di CI workflow
- Workflow publish npm otomatis saat GitHub release (`publish.yml`)
- Script `audit` di package.json
- File `.editorconfig`, `CONTRIBUTING.md`, `SECURITY.md`

### Diubah

- CI workflow diperkuat: 5 job terpisah (lint, typecheck, test matrix Node 20+22, build + smoke test, audit)
- Ekstrak `disambiguateYear` ke `src/utils.ts` — eliminasi duplikasi dari validate.ts dan parse.ts

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
