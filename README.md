# nik-id

Parser, validator, dan generator **NIK** (Nomor Induk Kependudukan) Indonesia.

TypeScript-first, zero dependencies, 100% test coverage, dual ESM+CJS, tree-shakeable.

## Instalasi

```bash
npm install nik-id
```

## Struktur NIK

NIK terdiri dari 16 digit angka:

```
3204 07 650885 0001
│    │  │      └── Nomor urut registrasi (4 digit, 0001-9999)
│    │  └── Tanggal lahir DDMMYY — perempuan: DD + 40 (jadi 41-71)
│    └── Kode kecamatan (2 digit, format Kemendagri)
└── Kode kabupaten/kota (4 digit, format Kemendagri)
```

- **Digit 1-2:** kode provinsi Kemendagri (11-97)
- **Digit 3-4:** kode kabupaten/kota
- **Digit 5-6:** kode kecamatan
- **Digit 7-12:** tanggal lahir format DDMMYY (perempuan: DD + 40)
- **Digit 13-16:** nomor urut registrasi (0001-9999)

## Penggunaan

### Validasi NIK

```typescript
import { validateNIK } from 'nik-id';
// atau: import { validateNIK } from 'nik-id/validate';

validateNIK("3204076508850001");
// { valid: true }

validateNIK("123");
// { valid: false, error: "NIK harus 16 digit" }

validateNIK("3204073102850001");  // 31 Februari
// { valid: false, error: "Tanggal lahir tidak valid" }
```

### Parse NIK

```typescript
import { parseNIK } from 'nik-id';
// atau: import { parseNIK } from 'nik-id/parse';

const result = parseNIK("3204076508850001");
if (result.valid) {
  console.log(result.provinceCode);    // "32"
  console.log(result.regencyCode);     // "3204"
  console.log(result.districtCode);    // "320407"
  console.log(result.gender);          // "F"
  console.log(result.birthDate);       // Date: 1985-08-25
  console.log(result.sequenceNumber);  // "0001"
}
```

### Generate NIK

```typescript
import { generateNIK } from 'nik-id';
// atau: import { generateNIK } from 'nik-id/generate';

// Full random
generateNIK();

// Gender spesifik
generateNIK({ gender: "F" });

// Tanggal lahir spesifik
generateNIK({ birthDate: new Date("1985-08-25") });

// Gender + tanggal lahir
generateNIK({ gender: "F", birthDate: new Date("1985-08-25") });

// Wilayah spesifik
generateNIK({
  provinceCode: "32",
  regencyCode: "3204",
  districtCode: "320407",
});

// Semua opsi
generateNIK({
  provinceCode: "32",
  regencyCode: "3204",
  districtCode: "320407",
  gender: "F",
  birthDate: new Date("1985-08-25"),
});
```

## Sub-path Imports

Setiap fungsi bisa diimpor langsung dari sub-path masing-masing untuk tree-shaking optimal:

```typescript
import { validateNIK } from 'nik-id/validate';
import { parseNIK } from 'nik-id/parse';
import { generateNIK } from 'nik-id/generate';
import type { NIKResult, ValidationResult, GenerateOptions } from 'nik-id/types';
```

## Integrasi dengan kode-wilayah-id

Package ini **tidak** menyertakan data wilayah — hanya mengembalikan kode Kemendagri.
Untuk resolve ke nama wilayah, gunakan package [`kode-wilayah-id`](https://www.npmjs.com/package/kode-wilayah-id):

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

## Validasi yang Dilakukan

`validateNIK` dan `parseNIK` melakukan pengecekan bertahap (fail-fast):

1. **Tipe data** — input harus `string`
2. **Panjang** — harus tepat 16 karakter
3. **Format** — harus semua digit angka (0-9)
4. **Kode provinsi** — 2 digit pertama harus dalam range 11-97
5. **Tanggal lahir** — harus valid secara kalender (DD, MM, YY)
6. **Nomor urut** — digit 13-16 tidak boleh `0000`

> **Catatan:** Validasi bersifat format-only. Package ini tidak mengecek apakah kode wilayah benar-benar terdaftar di database Kemendagri.

## Error Messages

Semua pesan error dalam Bahasa Indonesia:

| Error | Penyebab |
|-------|----------|
| `NIK harus berupa string` | Input bukan bertipe string |
| `NIK harus 16 digit` | Panjang bukan 16 karakter |
| `NIK hanya boleh berisi angka` | Mengandung karakter non-digit |
| `Kode provinsi tidak valid` | 2 digit pertama di luar range 11-97 |
| `Tanggal lahir tidak valid` | Tanggal, bulan, atau tahun invalid |
| `Nomor urut tidak valid` | 4 digit terakhir adalah `0000` |

## Types

```typescript
interface NIKValid {
  valid: true;
  nik: string;
  provinceCode: string;       // "32"
  regencyCode: string;        // "3204"
  districtCode: string;       // "320407"
  birthDate: Date;
  gender: "M" | "F";
  sequenceNumber: string;     // "0001"
}

interface NIKInvalid {
  valid: false;
  error: string;
}

type NIKResult = NIKValid | NIKInvalid;

interface ValidationValid {
  valid: true;
}

interface ValidationInvalid {
  valid: false;
  error: string;
}

type ValidationResult = ValidationValid | ValidationInvalid;

interface GenerateOptions {
  provinceCode?: string;
  regencyCode?: string;
  districtCode?: string;
  gender?: "M" | "F";
  birthDate?: Date;
}
```

## Persyaratan

- Node.js >= 20

## Lisensi

[MIT](LICENSE)
