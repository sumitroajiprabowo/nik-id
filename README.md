# nik-id

[![npm version](https://img.shields.io/npm/v/nik-id.svg)](https://www.npmjs.com/package/nik-id)
[![CI](https://github.com/sumitroajiprabowo/nik-id/actions/workflows/ci.yml/badge.svg)](https://github.com/sumitroajiprabowo/nik-id/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/nik-id)
[![codecov](https://codecov.io/gh/sumitroajiprabowo/nik-id/graph/badge.svg?token=FZXXOCKZY1)](https://codecov.io/gh/sumitroajiprabowo/nik-id)

Parser, validator, dan generator **NIK** (Nomor Induk Kependudukan) Indonesia.

TypeScript-first, zero dependencies, 100% test coverage, dual ESM+CJS, tree-shakeable.

```bash
npm install nik-id
```

Tidak perlu database, API call, atau file eksternal. Cukup install dan langsung pakai.

## Fitur

- **Validasi format** -- cek apakah NIK valid (panjang, digit, provinsi, tanggal lahir, nomor urut)
- **Parse komponen** -- ekstrak kode wilayah, tanggal lahir, gender, dan nomor urut dari NIK
- **Generate NIK** -- buat NIK yang valid secara format untuk testing, seeding, atau demo
- **Discriminated union** -- return type aman di-narrow pakai `result.valid` (TypeScript-friendly)
- **Error bahasa Indonesia** -- semua pesan error dalam bahasa Indonesia
- **Tree-shakeable** -- import hanya fungsi yang dibutuhkan via sub-path
- **TypeScript-first** -- strict types, auto-complete di IDE
- **Dual ESM + CJS** -- support semua environment (browser, Node.js, Bun, Deno)
- **Zero dependencies** -- tidak ada dependency runtime sama sekali
- **100% coverage** -- statements, branches, functions, lines

## Struktur NIK

NIK (Nomor Induk Kependudukan) adalah nomor identitas penduduk Indonesia yang terdiri dari **16 digit angka**:

```
3204 07 650885 0001
│    │  │      └── Nomor urut registrasi (4 digit, 0001-9999)
│    │  └── Tanggal lahir DDMMYY — perempuan: DD + 40 (jadi 41-71)
│    └── Kode kecamatan (2 digit, format Kemendagri)
└── Kode kabupaten/kota (4 digit, format Kemendagri)
```

| Posisi | Digit | Keterangan | Contoh |
|--------|-------|------------|--------|
| 1-2 | 2 digit | Kode provinsi Kemendagri (11-97) | `32` = Jawa Barat |
| 3-4 | 2 digit | Kode kabupaten/kota | `04` = Kab. Bandung |
| 5-6 | 2 digit | Kode kecamatan | `07` = Nagreg |
| 7-8 | 2 digit | Tanggal lahir (DD), perempuan +40 | `65` = tanggal 25 (perempuan) |
| 9-10 | 2 digit | Bulan lahir (MM) | `08` = Agustus |
| 11-12 | 2 digit | Tahun lahir (YY) | `85` = 1985 |
| 13-16 | 4 digit | Nomor urut registrasi | `0001` |

**Catatan penting:**
- NIK menggunakan kode **Kemendagri** (Kementerian Dalam Negeri), bukan BPS
- Perempuan: tanggal lahir ditambah 40 (DD 01-31 → DD 41-71)
- Tahun 2 digit: disambiguasi berdasarkan tahun sekarang (YY > sekarang → 1900+YY, else 2000+YY)

## Quick Start

```typescript
import { validateNIK, parseNIK, generateNIK } from 'nik-id';

// Validasi — cek apakah NIK valid
const valid = validateNIK("3204076508850001");
console.log(valid); // { valid: true }

// Parse — ekstrak semua komponen
const parsed = parseNIK("3204076508850001");
if (parsed.valid) {
  console.log(parsed.provinceCode);    // "32"
  console.log(parsed.regencyCode);     // "3204"
  console.log(parsed.districtCode);    // "320407"
  console.log(parsed.gender);          // "F"
  console.log(parsed.birthDate);       // Date: 1985-08-25
  console.log(parsed.sequenceNumber);  // "0001"
}

// Generate — buat NIK untuk testing
const nik = generateNIK({ gender: "F", birthDate: new Date("1985-08-25") });
console.log(nik); // "xxxxxx6508850001" (wilayah random)
```

## API Reference

### `validateNIK(nik: string): ValidationResult`

Validasi format NIK secara bertahap (fail-fast). Return discriminated union:

```typescript
import { validateNIK } from 'nik-id';
// atau: import { validateNIK } from 'nik-id/validate';

// NIK valid
validateNIK("3204076508850001");
// → { valid: true }

// Panjang salah
validateNIK("123");
// → { valid: false, error: "NIK harus 16 digit" }

// Mengandung huruf
validateNIK("320407650885000A");
// → { valid: false, error: "NIK hanya boleh berisi angka" }

// Kode provinsi di luar range
validateNIK("0004076508850001");
// → { valid: false, error: "Kode provinsi tidak valid" }

// Tanggal tidak ada di kalender (31 Februari)
validateNIK("3204073102850001");
// → { valid: false, error: "Tanggal lahir tidak valid" }

// Nomor urut 0000
validateNIK("3204076508850000");
// → { valid: false, error: "Nomor urut tidak valid" }
```

### `parseNIK(nik: string): NIKResult`

Parse NIK menjadi komponen-komponennya. Memvalidasi terlebih dahulu — kalau tidak valid, return error.

```typescript
import { parseNIK } from 'nik-id';
// atau: import { parseNIK } from 'nik-id/parse';

const result = parseNIK("3204076508850001");
if (result.valid) {
  console.log(result.nik);             // "3204076508850001"
  console.log(result.provinceCode);    // "32"       — Jawa Barat
  console.log(result.regencyCode);     // "3204"     — Kab. Bandung
  console.log(result.districtCode);    // "320407"   — Nagreg
  console.log(result.gender);          // "F"        — Perempuan
  console.log(result.birthDate);       // Date: 1985-08-25
  console.log(result.sequenceNumber);  // "0001"
} else {
  console.log(result.error);
}
```

**Komponen yang diekstrak:**

| Field | Tipe | Keterangan | Contoh |
|-------|------|------------|--------|
| `nik` | `string` | NIK asli yang di-parse | `"3204076508850001"` |
| `provinceCode` | `string` | Kode provinsi Kemendagri (2 digit) | `"32"` |
| `regencyCode` | `string` | Kode kabupaten/kota Kemendagri (4 digit) | `"3204"` |
| `districtCode` | `string` | Kode kecamatan Kemendagri (6 digit) | `"320407"` |
| `birthDate` | `Date` | Tanggal lahir (object Date) | `Date(1985-08-25)` |
| `gender` | `"M" \| "F"` | Jenis kelamin | `"F"` |
| `sequenceNumber` | `string` | Nomor urut registrasi (4 digit) | `"0001"` |

### `generateNIK(options?: GenerateOptions): string`

Generate NIK yang valid secara format. Semua parameter opsional — yang tidak diisi akan di-random.

```typescript
import { generateNIK } from 'nik-id';
// atau: import { generateNIK } from 'nik-id/generate';

// Full random
generateNIK();

// Gender spesifik
generateNIK({ gender: "F" });
generateNIK({ gender: "M" });

// Tanggal lahir spesifik
generateNIK({ birthDate: new Date("1985-08-25") });

// Gender + tanggal lahir
generateNIK({ gender: "F", birthDate: new Date("1985-08-25") });

// Wilayah spesifik (harus konsisten dari provinsi ke kecamatan)
generateNIK({
  provinceCode: "32",
  regencyCode: "3204",
  districtCode: "320407",
});

// Semua opsi sekaligus
generateNIK({
  provinceCode: "32",
  regencyCode: "3204",
  districtCode: "320407",
  gender: "F",
  birthDate: new Date("1985-08-25"),
});
```

**Opsi yang tersedia:**

| Opsi | Tipe | Keterangan |
|------|------|------------|
| `provinceCode` | `string?` | Kode provinsi Kemendagri (2 digit, 11-97) |
| `regencyCode` | `string?` | Kode kabupaten/kota (4 digit, harus match provinsi) |
| `districtCode` | `string?` | Kode kecamatan (6 digit, harus match kabupaten) |
| `gender` | `"M" \| "F"?` | Jenis kelamin |
| `birthDate` | `Date?` | Tanggal lahir (kalau tidak diisi, random 1950-2005) |

**Error yang di-throw:**

```typescript
// Kode provinsi di luar range
generateNIK({ provinceCode: "99" });
// → Error: "Kode provinsi tidak valid (harus 11-97)"

// Kode kabupaten tidak cocok dengan provinsi
generateNIK({ provinceCode: "32", regencyCode: "3301" });
// → Error: 'Kode kabupaten/kota "3301" tidak sesuai dengan kode provinsi "32"'

// Kode kecamatan tidak cocok dengan kabupaten
generateNIK({ provinceCode: "32", regencyCode: "3204", districtCode: "320501" });
// → Error: 'Kode kecamatan "320501" tidak sesuai dengan kode kabupaten/kota "3204"'
```

> **Catatan:** NIK yang dihasilkan valid secara **format** tapi **bukan** NIK asli milik orang sungguhan. Cocok untuk testing, seeding database, atau demo.

## Validasi yang Dilakukan

`validateNIK` dan `parseNIK` melakukan pengecekan bertahap (fail-fast — berhenti di error pertama):

| # | Pengecekan | Detail |
|---|-----------|--------|
| 1 | **Tipe data** | Input harus bertipe `string` |
| 2 | **Panjang** | Harus tepat 16 karakter |
| 3 | **Format** | Harus semua digit angka (0-9) |
| 4 | **Kode provinsi** | 2 digit pertama harus dalam range 11-97 |
| 5 | **Tanggal lahir** | DD (01-31 atau 41-71), MM (01-12), valid di kalender |
| 6 | **Nomor urut** | Digit 13-16 tidak boleh `0000` |

> **Catatan:** Validasi bersifat **format-only**. Package ini tidak mengecek apakah kode wilayah benar-benar terdaftar di database Kemendagri. Untuk lookup nama wilayah, gunakan package [`kode-wilayah-id`](https://www.npmjs.com/package/kode-wilayah-id).

### Error Messages

Semua pesan error dalam Bahasa Indonesia:

| Error | Penyebab | Contoh Input |
|-------|----------|-------------|
| `NIK harus berupa string` | Input bukan bertipe string | `12345`, `null`, `undefined` |
| `NIK harus 16 digit` | Panjang bukan 16 karakter | `"123"`, `""` |
| `NIK hanya boleh berisi angka` | Mengandung karakter non-digit | `"320407650885000A"` |
| `Kode provinsi tidak valid` | 2 digit pertama di luar range 11-97 | `"0004076508850001"` |
| `Tanggal lahir tidak valid` | Tanggal/bulan invalid atau tidak ada di kalender | `"3204073102850001"` |
| `Nomor urut tidak valid` | 4 digit terakhir adalah `0000` | `"3204076508850000"` |

## Tree-shaking / Sub-path Imports

Import hanya fungsi yang dibutuhkan — bundler hanya include kode yang di-import:

```typescript
// Hanya validasi
import { validateNIK } from 'nik-id/validate';

// Hanya parsing
import { parseNIK } from 'nik-id/parse';

// Hanya generator
import { generateNIK } from 'nik-id/generate';

// Types only (zero runtime)
import type { NIKResult, ValidationResult, GenerateOptions } from 'nik-id/types';

// Atau import semua sekaligus
import { validateNIK, parseNIK, generateNIK } from 'nik-id';
```

### Bundle Size

Package ini sangat ringan karena zero dependencies dan hanya berisi logika validasi:

| Import | Ukuran (minified) |
|--------|-------------------|
| `nik-id/validate` | ~1.8 KB |
| `nik-id/parse` | ~2.8 KB |
| `nik-id/generate` | ~2.3 KB |
| `nik-id` (full) | ~5.2 KB |

## Integrasi dengan kode-wilayah-id

Package ini **tidak** menyertakan data wilayah — hanya mengembalikan kode Kemendagri. Untuk resolve ke nama wilayah, gunakan package [`kode-wilayah-id`](https://www.npmjs.com/package/kode-wilayah-id):

```bash
npm install kode-wilayah-id
```

```typescript
import { parseNIK } from 'nik-id';
import {
  getProvinceByKemendagriCode,
  getRegencyByKemendagriCode,
  getDistrictByKemendagriCode,
} from 'kode-wilayah-id';

const result = parseNIK("3204076508850001");
if (result.valid) {
  const province = getProvinceByKemendagriCode(result.provinceCode);
  const regency = getRegencyByKemendagriCode(result.regencyCode);
  const district = getDistrictByKemendagriCode(result.districtCode);

  console.log(province?.name); // "JAWA BARAT"
  console.log(regency?.name);  // "KAB. BANDUNG"
  console.log(district?.name); // "NAGREG"
}
```

## Discriminated Union Pattern

Return type `parseNIK` dan `validateNIK` menggunakan discriminated union — TypeScript bisa narrow type otomatis berdasarkan `result.valid`:

```typescript
import { parseNIK } from 'nik-id';
import type { NIKResult, NIKValid, NIKInvalid } from 'nik-id/types';

const result: NIKResult = parseNIK(input);

if (result.valid) {
  // TypeScript tahu ini NIKValid — semua field tersedia
  console.log(result.provinceCode);  // ✅ string
  console.log(result.gender);        // ✅ "M" | "F"
  console.log(result.birthDate);     // ✅ Date
} else {
  // TypeScript tahu ini NIKInvalid — hanya error
  console.log(result.error);         // ✅ string
  // console.log(result.gender);     // ❌ compile error!
}
```

Pattern yang sama berlaku untuk `validateNIK`:

```typescript
import { validateNIK } from 'nik-id';

const result = validateNIK(input);
if (result.valid) {
  // ValidationValid — tidak ada field lain
  console.log("NIK valid!");
} else {
  // ValidationInvalid — ada field error
  console.log(result.error);
}
```

## Contoh Penggunaan

Lihat folder [`examples/`](examples/) untuk contoh lengkap di berbagai framework dan runtime:

| Framework | File | Fitur |
|-----------|------|-------|
| **Node.js** | [`node.ts`](examples/node.ts) | Basic usage — validasi, parse, generate |
| **React** | [`react.tsx`](examples/react.tsx) | Form validasi KTP dengan feedback real-time |
| **Next.js** | [`nextjs.tsx`](examples/nextjs.tsx) | API route + server component |
| **Express** | [`express.ts`](examples/express.ts) | REST API endpoint validasi NIK |
| **Hono** | [`hono.ts`](examples/hono.ts) | Lightweight REST API validasi NIK |
| **Bun** | [`bun.ts`](examples/bun.ts) | Native Bun HTTP server |
| **Deno** | [`deno.ts`](examples/deno.ts) | Native Deno server |

```bash
# Jalankan contoh Node.js
npx tsx examples/node.ts
```

## Types

Semua type tersedia di `nik-id/types`:

```typescript
import type {
  NIKValid,
  NIKInvalid,
  NIKResult,
  ValidationValid,
  ValidationInvalid,
  ValidationResult,
  GenerateOptions,
} from 'nik-id/types';
```

### NIKResult (parseNIK)

```typescript
// Hasil valid
interface NIKValid {
  valid: true;
  nik: string;              // "3204076508850001"
  provinceCode: string;     // "32"
  regencyCode: string;      // "3204"
  districtCode: string;     // "320407"
  birthDate: Date;          // Date(1985-08-25)
  gender: "M" | "F";       // "F"
  sequenceNumber: string;   // "0001"
}

// Hasil invalid
interface NIKInvalid {
  valid: false;
  error: string;            // "NIK harus 16 digit"
}

type NIKResult = NIKValid | NIKInvalid;
```

### ValidationResult (validateNIK)

```typescript
interface ValidationValid {
  valid: true;
}

interface ValidationInvalid {
  valid: false;
  error: string;
}

type ValidationResult = ValidationValid | ValidationInvalid;
```

### GenerateOptions (generateNIK)

```typescript
interface GenerateOptions {
  provinceCode?: string;    // "32" (2 digit, 11-97)
  regencyCode?: string;     // "3204" (4 digit, harus match provinsi)
  districtCode?: string;    // "320407" (6 digit, harus match kabupaten)
  gender?: "M" | "F";      // Jenis kelamin
  birthDate?: Date;         // Tanggal lahir (default: random 1950-2005)
}
```

## Encoding Tanggal Lahir

NIK meng-encode tanggal lahir dalam 6 digit (posisi 7-12) dengan format DDMMYY:

### Gender dan DD

| Gender | Range DD | Contoh | Arti |
|--------|----------|--------|------|
| Laki-laki | 01-31 | DD=`15` | Lahir tanggal 15 |
| Perempuan | 41-71 | DD=`65` | Lahir tanggal 25 (65-40=25) |
| Invalid | 00, 32-40, 72-99 | -- | Tidak valid |

### Disambiguasi Tahun (YY)

Karena NIK hanya menyimpan 2 digit tahun, perlu disambiguasi:

| YY | Tahun sekarang (2 digit) | Hasil | Logika |
|----|--------------------------|-------|--------|
| 85 | 26 | 1985 | 85 > 26 → 1900 + 85 |
| 02 | 26 | 2002 | 02 ≤ 26 → 2000 + 02 |
| 26 | 26 | 2026 | 26 ≤ 26 → 2000 + 26 |
| 27 | 26 | 1927 | 27 > 26 → 1900 + 27 |
| 00 | 26 | 2000 | 00 ≤ 26 → 2000 + 00 |
| 99 | 26 | 1999 | 99 > 26 → 1900 + 99 |

## Kode Wilayah Kemendagri

NIK menggunakan kode wilayah format Kemendagri (bukan BPS):

| Level | Panjang | Contoh | Keterangan |
|-------|---------|--------|------------|
| Provinsi | 2 digit | `"32"` | Jawa Barat |
| Kabupaten/Kota | 4 digit | `"3204"` | Kab. Bandung |
| Kecamatan | 6 digit | `"320407"` | Nagreg |

Range kode provinsi yang valid: **11** (Aceh) sampai **97** (Papua Barat Daya).

> Package ini hanya memvalidasi **range** kode provinsi (11-97), tidak mengecek apakah kode spesifik benar-benar ada. Untuk lookup nama wilayah, gunakan [`kode-wilayah-id`](https://www.npmjs.com/package/kode-wilayah-id).

## Contributing

Kontribusi sangat diterima!

```bash
git clone https://github.com/sumitroajiprabowo/nik-id.git
cd nik-id
npm install
npm run lint          # Lint check (Biome)
npm run format:check  # Format check
npm run typecheck     # TypeScript check
npm run test:coverage # Test dengan coverage (harus 100%)
npm run build         # Build ESM + CJS
```

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan.

## Lisensi

[MIT](LICENSE) (c) [Sumitro Aji Prabowo](https://github.com/sumitroajiprabowo)
