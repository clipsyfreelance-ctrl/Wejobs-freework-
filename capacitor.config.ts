import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wejobs.app',
  appName: 'WEJOBS',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    // Jika ingin APK langsung memuat WEJOBS versi ONLINE (bukan file statis
    // yang dibundel di dalam APK), aktifkan 2 baris di bawah ini dan isi
    // dengan URL hosting kamu. Ini opsional — default-nya APK memuat file
    // statis dari folder dist/ (hasil `npm run build`) dan tetap memanggil
    // API ke VITE_API_BASE_URL yang dikonfigurasi lewat apiConfig.ts.
    // url: 'https://wejobs-api.onrender.com',
    // cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
