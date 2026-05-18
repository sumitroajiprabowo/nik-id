# Contributing to nik-id

Terima kasih atas ketertarikan Anda untuk berkontribusi! Berikut panduan untuk membantu Anda memulai.

## Cara Berkontribusi

### Melaporkan Bug

- Gunakan [GitHub Issues](https://github.com/sumitroajiprabowo/nik-id/issues) untuk melaporkan bug
- Sertakan langkah-langkah reproduksi yang jelas
- Sertakan versi Node.js dan package yang digunakan
- Lampirkan error message atau stack trace jika ada

### Mengusulkan Fitur

- Buka issue baru dengan label `enhancement`
- Jelaskan use case dan manfaat fitur yang diusulkan
- Diskusikan terlebih dahulu sebelum membuat PR

### Pull Request

1. Fork repository ini
2. Buat branch baru: `git checkout -b feat/fitur-baru`
3. Lakukan perubahan Anda
4. Pastikan semua checks passed:

```bash
npm run lint        # Cek lint
npm run format:check # Cek formatting
npm run typecheck   # Cek TypeScript types
npm run test:coverage # Jalankan test dengan coverage (harus 100%)
npm run build       # Build package
```

5. Commit dengan format [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: tambah fitur baru
fix: perbaiki bug pada validasi
docs: update dokumentasi API
chore: update dependencies
test: tambah test case baru
```

6. Push ke fork Anda dan buat Pull Request

## Development Setup

```bash
# Clone repository
git clone https://github.com/sumitroajiprabowo/nik-id.git
cd nik-id

# Install dependencies
npm install

# Jalankan test
npm test

# Jalankan test dengan coverage
npm run test:coverage

# Build
npm run build

# Lint & format
npm run lint
npm run format:check
```

## Struktur Proyek

```
nik-id/
├── src/                         # Source code TypeScript
│   ├── types.ts                 # Type definitions (discriminated unions)
│   ├── utils.ts                 # Utilitas internal (disambiguasi tahun, dll.)
│   ├── validate.ts              # validateNIK() — validasi format NIK
│   ├── parse.ts                 # parseNIK() — parse NIK ke komponen
│   ├── generate.ts              # generateNIK() — generate NIK untuk testing
│   └── index.ts                 # Re-export semua
├── tests/                       # Unit tests
│   ├── validate.test.ts         # Test validasi (tipe, panjang, format, provinsi, tanggal, seq)
│   ├── parse.test.ts            # Test parsing (wilayah, gender, tanggal lahir, sequence)
│   └── generate.test.ts         # Test generator (opsi, error, randomness)
├── examples/                    # Contoh penggunaan (7 framework)
├── dist/                        # Build output (generated)
└── ...
```

## Standar Kualitas

- **TypeScript strict** — tidak boleh ada `any` type
- **Lint clean** — Biome lint tanpa error
- **Format consistent** — Biome format sesuai konfigurasi
- **100% test coverage** — semua statements, branches, functions, dan lines harus tercakup
- **Semua test pass** — pastikan tidak ada test yang gagal
- **Zero dependencies** — tidak boleh menambah runtime dependency
- **JSDoc lengkap** — semua fungsi dan type yang di-export harus punya JSDoc

## Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi [MIT](LICENSE).
