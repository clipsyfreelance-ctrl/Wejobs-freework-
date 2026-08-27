# WEJOBS — Panduan Build APK dari Termux (Lengkap)

## 0. Yang perlu kamu tahu dulu (PENTING, baca sebelum mulai)

Aplikasi WEJOBS ini punya **2 bagian**:

1. **Frontend** (React + Vite) — ini yang dibungkus jadi APK.
2. **Backend** (`server.ts`, Express + database in-memory) — ini **server Node.js**
   yang menyimpan user, task, saldo, dll.

APK yang dihasilkan Capacitor hanyalah **WebView** (browser mini). WebView **tidak bisa**
menjalankan server Node.js di dalamnya. Jadi backend **wajib jalan online** (hosting),
lalu APK memanggil backend itu lewat internet — persis seperti aplikasi mobile pada
umumnya (mis. Instagram) yang selalu terhubung ke server.

➡️ **Tidak ada fitur yang hilang** — semua endpoint API, semua halaman, semua fitur admin
tetap sama persis. Yang berubah cuma cara frontend memanggil API: dari path relatif
(`/api/...`) menjadi URL lengkap ke backend online (`https://domain-kamu.com/api/...`),
lewat variabel `VITE_API_BASE_URL`.

⚠️ Catatan tambahan: database di `server/database.ts` adalah **in-memory (Map)** — artinya
semua data hilang setiap kali server backend di-restart. Ini sudah begitu dari awal
(bukan kesalahan yang saya buat), tapi wajib kamu tahu untuk produksi jangka panjang
(idealnya nanti diganti ke database sungguhan seperti PostgreSQL/SQLite).

### Ringkasan alur:
1. Deploy folder backend (`server.ts` + `server/`) ke hosting Node.js (Render/Railway/VPS).
2. Build frontend di Termux dengan `VITE_API_BASE_URL` mengarah ke backend itu.
3. `npx cap add android` → hasilkan project Android.
4. Build APK pakai Gradle di Termux.

---

## 1. Deploy Backend Dulu (paling gampang: Render.com, gratis)

1. Buka https://render.com → daftar/login.
2. Push repo kamu (hasil zip ini) ke GitHub dulu (lihat bagian 2 di bawah).
3. Di Render: **New +** → **Web Service** → hubungkan ke repo GitHub kamu.
4. Isi:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Deploy. Setelah selesai kamu akan dapat URL, misal:
   `https://wejobs-xxxx.onrender.com`
6. Tes: buka `https://wejobs-xxxx.onrender.com/api/health` di browser → harus muncul JSON `{"status":"ok",...}`.

Simpan URL ini, dipakai di langkah 5 (build APK).

*(Alternatif: Railway.app, Fly.io, atau VPS sendiri dengan `pm2 start dist/server.cjs` — caranya mirip.)*

---

## 2. Push Repo ke GitHub Lewat Termux

```bash
pkg update -y && pkg upgrade -y
pkg install -y git
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"

cd ~
mkdir -p wejobs && cd wejobs
# Extract dulu isi zip WEJOBS-FIXED.zip ke folder ini (lewat Termux:API storage,
# atau `unzip` kalau file zip sudah kamu taruh di ~/storage/downloads/)
termux-setup-storage
unzip ~/storage/downloads/WEJOBS-FIXED.zip -d ~/wejobs
cd ~/wejobs

git init
git add .
git commit -m "Initial commit - WEJOBS fixed for Capacitor APK"
git branch -M main
git remote add origin https://github.com/USERNAME/Wejobs-freework-.git
git push -u origin main --force
```

> Ganti `USERNAME` dan nama repo sesuai punyamu. Kalau repo lama masih ada isinya,
> `--force` akan menimpa semuanya dengan versi yang sudah diperbaiki ini.

---

## 3. Install Node.js, JDK, dan Android SDK di Termux

```bash
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git wget unzip openjdk-17 gradle

node -v
npm -v
javac -version
```

### Install Android SDK Command-line Tools

```bash
cd ~
mkdir -p android-sdk/cmdline-tools
cd android-sdk/cmdline-tools

wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip
unzip cmdline-tools.zip
mv cmdline-tools latest
rm cmdline-tools.zip

echo 'export ANDROID_HOME=$HOME/android-sdk' >> ~/.bashrc
echo 'export ANDROID_SDK_ROOT=$HOME/android-sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

> Jika `sdkmanager` gagal karena butuh JDK yang cocok, pastikan `openjdk-17` sudah
> terpasang (`pkg install openjdk-17`) dan `JAVA_HOME` mengarah ke situ:
> ```bash
> echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which javac))))' >> ~/.bashrc
> source ~/.bashrc
> ```

---

## 4. Install Dependency Project

```bash
cd ~/wejobs
npm install
```

Kalau ada error terkait native module / sharp / dsb saat `npm install` di Termux,
biasanya karena paket tersebut butuh kompilasi C++. Package.json WEJOBS ini
**tidak** memakai paket berat semacam itu, jadi seharusnya aman.

---

## 5. Build Frontend (arahkan ke backend online kamu)

```bash
cd ~/wejobs
export VITE_API_BASE_URL="https://wejobs-xxxx.onrender.com"
npm run build:web
```

Ini akan membuat folder `dist/` berisi hasil build React (HTML/JS/CSS statis)
yang sudah "tahu" harus memanggil API ke URL backend kamu.

---

## 6. Tambahkan Capacitor Android

```bash
cd ~/wejobs
npx cap add android
npx cap sync android
```

Ini membuat folder `android/` (project Android native lengkap dengan Gradle).

---

## 7. Build APK Lewat Gradle (di Termux)

```bash
cd ~/wejobs/android
chmod +x gradlew
./gradlew assembleDebug
```

Jika sukses, APK ada di:
```
~/wejobs/android/app/build/outputs/apk/debug/app-debug.apk
```

Pindahkan ke folder Download supaya gampang diinstall:
```bash
cp ~/wejobs/android/app/build/outputs/apk/debug/app-debug.apk ~/storage/downloads/WEJOBS.apk
```

Buka file manager Chrome/Android → folder Download → tap `WEJOBS.apk` → Install
(aktifkan dulu "Install from unknown sources" jika diminta).

### Build versi Release (APK final, lebih kecil & di-minify)

```bash
cd ~/wejobs/android
./gradlew assembleRelease
```
Hasil ada di `android/app/build/outputs/apk/release/app-release-unsigned.apk`.
APK release butuh **signing** (tanda tangan) sebelum bisa diinstal/dipublikasikan —
untuk pemakaian pribadi, `assembleDebug` di atas sudah cukup dan langsung bisa diinstal.

---

## 8. Update APK Setelah Ubah Kode

Setiap kali kamu mengubah kode frontend:
```bash
cd ~/wejobs
npm run build:web
npx cap sync android
cd android && ./gradlew assembleDebug
```

---

## Ringkasan Perbaikan yang Sudah Saya Lakukan di Repo Ini

1. **Sentralisasi URL API** — dibuat `src/apiConfig.ts` dan semua pemanggilan
   `fetch('/api/...')` di 8 file (`App.tsx`, `AdminDashboard.tsx`,
   `AdminChallengeManager.tsx`, `AuthModals.tsx`, `CaptchaWidget.tsx`,
   `ChallengePage.tsx`, `ChallengeRegisterModal.tsx`,
   `PaymentVerificationManager.tsx`) diubah jadi `fetch(\`${API_BASE}/api/...\`)`
   supaya APK bisa memanggil backend meski beda origin. **Tidak ada endpoint atau
   fitur yang dihapus/diubah perilakunya** — hanya prefix URL-nya.
2. **CORS ditambahkan** di `server.ts` supaya backend bisa diakses dari APK/WebView.
3. **`capacitor.config.ts`** ditambahkan (konfigurasi dasar untuk build Android).
4. **`package.json`**: ditambah dependency `@capacitor/core`, `@capacitor/android`,
   `@capacitor/cli`, serta script `build:web`, `cap:add:android`, `cap:sync`, `cap:open`.
5. **`.env.example`** ditambah `VITE_API_BASE_URL` dengan penjelasan.
6. **`.gitignore`** ditambah exclude untuk build artifact Android/Gradle & file `.apk`.

Tidak ada file/komponen/fitur yang dihapus dari kode aslimu — semua halaman
(Landing, Tasks, Categories, About, FAQ, Legal, Dashboard, MyTasks, Balance,
Profile, AdminDashboard, AdminChallengeManager, PaymentVerificationManager,
ChallengePage, dst) dan semua endpoint backend tetap ada persis seperti semula.
