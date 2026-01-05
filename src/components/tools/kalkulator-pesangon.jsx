import React, { useState, useMemo, useEffect } from "react";

// --- Icon Components ---
const MoneyIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- DATA: Jenis PHK Sesuai PP Nomor 35 Tahun 2021 ---
const TERMINATION_REASONS = [
  // Pasal 41 - Penggabungan/Peleburan/Pemisahan
  {
    value: "41_peleburan_pekerja_tolak",
    label: "Penggabungan/Peleburan/Pemisahan (Pekerja Tidak Bersedia)",
    up: 1, upmk: 1,
    info: "Pasal 41: Pekerja/buruh tidak bersedia melanjutkan Hubungan Kerja."
  },
  {
    value: "41_peleburan_pengusaha_tolak",
    label: "Penggabungan/Peleburan/Pemisahan (Pengusaha Tidak Bersedia)",
    up: 1, upmk: 1,
    info: "Pasal 41: Pengusaha tidak bersedia menerima Pekerja/buruh."
  },

  // Pasal 42 - Pengambilalihan
  {
    value: "42_1_ambilalih_pekerja_tolak",
    label: "Pengambilalihan (Pekerja Tidak Bersedia - Perubahan Syarat)",
    up: 0.5, upmk: 1,
    info: "Pasal 42 Ayat (1): Ada perubahan syarat kerja & pekerja tidak bersedia melanjutkan."
  },
  {
    value: "42_2_ambilalih_pengusaha_tolak",
    label: "Pengambilalihan (Pengusaha Tidak Bersedia)",
    up: 1, upmk: 1,
    info: "Pasal 42 Ayat (2): Pengusaha tidak bersedia melanjutkan Hubungan Kerja."
  },

  // Pasal 43 - Efisiensi
  {
    value: "43_1_efisiensi_rugi",
    label: "Efisiensi (Karena Kerugian)",
    up: 0.5, upmk: 1,
    info: "Pasal 43 Ayat (1): Perusahaan mengalami kerugian."
  },
  {
    value: "43_2_efisiensi_mencegah",
    label: "Efisiensi (Mencegah Kerugian)",
    up: 1, upmk: 1,
    info: "Pasal 43 Ayat (2): Efisiensi untuk mencegah kerugian (Perusahaan belum rugi)."
  },

  // Pasal 44 & 45 - Tutup / Force Majeure
  {
    value: "44_1_tutup_rugi",
    label: "Tutup (Karena Rugi / Force Majeure)",
    up: 0.5, upmk: 1,
    info: "Pasal 44 Ayat (1) / Pasal 45 Ayat (1): Perusahaan tutup karena rugi terus menerus atau Force Majeure."
  },
  {
    value: "44_2_tutup_efisiensi",
    label: "Tutup (Bukan Karena Rugi)",
    up: 1, upmk: 1,
    info: "Pasal 44 Ayat (2): Perusahaan tutup melakukan efisiensi (bukan karena rugi)."
  },
  {
    value: "45_2_force_majeure_tidak_tutup",
    label: "Force Majeure (Tidak Tutup)",
    up: 0.75, upmk: 1,
    info: "Pasal 45 Ayat (2): Keadaan memaksa tetapi perusahaan tidak tutup."
  },

  // Pasal Lainnya
  {
    value: "46_pkpu",
    label: "PKPU (Penundaan Kewajiban Pembayaran Utang)",
    up: 0.5, upmk: 1,
    info: "Pasal 46: Perusahaan dalam keadaan PKPU."
  },
  {
    value: "47_pailit",
    label: "Pailit",
    up: 0.5, upmk: 1,
    info: "Pasal 47: Perusahaan dinyatakan pailit."
  },
  {
    value: "52_1_pelanggaran",
    label: "Pelanggaran Perjanjian Kerja (SP3)",
    up: 0.5, upmk: 1,
    info: "Pasal 52 Ayat (1): Melakukan pelanggaran setelah SP3."
  },
  {
     value: "52_2_pelanggaran_mendesak",
     label: "Pelanggaran Bersifat Mendesak",
     up: 0, upmk: 0,
     info: "Pasal 52 Ayat (2): Pelanggaran berat. Tidak dapat UP/UPMK, hanya Uang Pisah & UPH."
  },
  {
    value: "50_resign",
    label: "Mengundurkan Diri (Resign)",
    up: 0, upmk: 0,
    info: "Pasal 50: Atas kemauan sendiri. Hanya UPH & Uang Pisah."
  },
  {
    value: "51_mangkir",
    label: "Mangkir (5 Hari+)",
    up: 0, upmk: 0,
    info: "Pasal 51: Mangkir 5 hari berturut-turut. Hanya UPH & Uang Pisah."
  },
  {
    value: "55_sakit",
    label: "Sakit Berkepanjangan (>12 Bulan)",
    up: 2, upmk: 1,
    info: "Pasal 55: Sakit berkepanjangan / cacat akibat kecelakaan kerja."
  },
  {
    value: "56_pensiun",
    label: "Pensiun",
    up: 1.75, upmk: 1,
    info: "Pasal 56: Memasuki usia pensiun."
  },
  {
    value: "57_meninggal",
    label: "Meninggal Dunia",
    up: 2, upmk: 1,
    info: "Pasal 57: Pekerja meninggal dunia."
  }
];

// --- DATA: FAQ Items ---
const FAQ_ITEMS = [
  {
    question: "1. Apa itu Kalkulator Pesangon?",
    answer: "Kalkulator Pesangon adalah alat untuk menghitung estimasi hak karyawan ketika terjadi pemutusan hubungan kerja (PHK), berdasarkan ketentuan PP No. 35 Tahun 2021. Hasilnya mencakup Uang Pesangon (UP), Uang Penghargaan Masa Kerja (UPMK), dan Uang Penggantian Hak (UPH)."
  },
  {
    question: "2. Apa saja komponen pesangon yang dihitung?",
    answer: (
      <>
        <p>Kalkulator ini menghitung tiga komponen utama:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Uang Pesangon (UP)</strong> – berdasarkan masa kerja.</li>
          <li><strong>Uang Penghargaan Masa Kerja (UPMK)</strong> – diberikan untuk masa kerja ≥3 tahun.</li>
          <li><strong>Uang Penggantian Hak (UPH)</strong> – termasuk cuti yang belum diambil, biaya pulang, hingga ketentuan lain dari PP/PKB perusahaan.</li>
        </ul>
      </>
    )
  },
  {
    question: "3. Dasar hukum perhitungan ini apa?",
    answer: "Perhitungan mengikuti PP No. 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja, Waktu Istirahat, dan PHK."
  },
  {
    question: "4. Apakah hasil kalkulator ini pasti sama seperti perhitungan perusahaan?",
    answer: "Tidak selalu. Kalkulator ini memberi estimasi standar, sedangkan perusahaan bisa memiliki aturan tambahan dalam Peraturan Perusahaan (PP), Perjanjian Kerja Bersama (PKB), atau Kontrak Kerja."
  },
  {
    question: "5. Apakah semua jenis PHK menggunakan rumus yang sama?",
    answer: "Tidak. Setiap alasan PHK mempunyai koefisien berbeda (misalnya 0.5×, 1×, 1.75×, hingga 2×), tergantung penyebabnya seperti efisiensi, pensiun, pengunduran diri, kesalahan berat, atau perusahaan tutup/pailit. Tools akan menyesuaikan koefisien berdasarkan jenis PHK yang dipilih."
  },
  {
    question: "6. Apakah kalkulator ini bisa menghitung pesangon karyawan kontrak (PKWT)?",
    answer: "Tidak. PKWT tidak menerima pesangon, namun mendapatkan uang kompensasi sebesar 1 bulan upah per 12 bulan masa kerja. Kalkulator ini fokus untuk karyawan PKWTT (tetap)."
  },
  {
    question: "7. Apa yang harus saya siapkan sebelum menghitung pesangon?",
    answer: "Gunakan data berikut: gaji pokok + tunjangan tetap, masa kerja, jenis PHK, dan hak lain seperti cuti yang belum diambil."
  },
  {
    question: "8. Apa perbedaan tunjangan tetap dan tunjangan tidak tetap?",
    answer: "Tunjangan tetap: dibayarkan rutin setiap bulan (contoh: tunjangan jabatan, tunjangan transport tetap). Masuk ke komponen perhitungan. Tunjangan tidak tetap: seperti uang makan harian atau insentif kehadiran. Umumnya tidak dihitung sebagai komponen pesangon."
  },
  {
    question: "9. Apakah lembur, bonus, atau insentif masuk ke dalam perhitungan pesangon?",
    answer: "Tidak termasuk, kecuali perusahaan menyatakan bahwa komponen tersebut adalah bagian dari upah tetap di dalam PP/PKB atau kontrak kerja."
  },
  {
    question: "10. Bagaimana jika saya ingin menghitung pesangon banyak karyawan sekaligus?",
    answer: "Kalkulator ini menghitung satu karyawan per sesi. Untuk kebutuhan massal—misalnya saat restrukturisasi, efisiensi, atau offboarding besar—lebih efektif menggunakan HRIS seperti KantorKu."
  },
  {
    question: "11. Apakah kalkulator ini cocok untuk HR?",
    answer: "Sangat cocok untuk estimasi cepat sebelum diskusi manajemen, cross-check perhitungan manual, dan menjelaskan estimasi pesangon kepada karyawan secara transparan."
  },
  {
    question: "12. Apakah hasil kalkulator ini bisa dijadikan dokumen resmi?",
    answer: "Tidak. Hasilnya adalah estimasi, bukan dokumen final. Perusahaan tetap harus mengeluarkan dokumen resmi sesuai aturan PP/PKB."
  }
];

export default function SeveranceCalculator() {
  // --- STATE ---
  const [baseSalary, setBaseSalary] = useState(6000000);
  const [allowances, setAllowances] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [yearsInput, setYearsInput] = useState(0);
  const [monthsInput, setMonthsInput] = useState(0);
  const [useDirectMasaKerja, setUseDirectMasaKerja] = useState(false);
  const [workWeek, setWorkWeek] = useState(6); // 6 or 5
  const [sisaCuti, setSisaCuti] = useState(0);
  const [transport, setTransport] = useState(0);
  const [includeHousingMedical, setIncludeHousingMedical] = useState(true);
  const [openFaq, setOpenFaq] = useState([]); // State for Accordion, now an array
  
  // STATE: Alasan PHK
  const [terminationReason, setTerminationReason] = useState(TERMINATION_REASONS[0].value);

  // --- HELPERS ---
  // Helper untuk membersihkan string input (menghapus semua selain angka)
  const parseFormattedNumber = (str) => {
    if (typeof str !== 'string') str = String(str);
    const cleaned = str.replace(/\D/g, ''); // \D cocok dengan karakter apa pun yang bukan digit
    const number = parseInt(cleaned, 10);
    return isNaN(number) ? 0 : number;
  };

  // Helper untuk memformat angka menjadi string dengan pemisah ribuan
  const formatNumberForDisplay = (num) => {
    if (num === null || num === undefined) return '';
    // Menggunakan 'id-ID' untuk format titik sebagai pemisah ribuan
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const toggleFaq = (index) => {
    setOpenFaq(prevOpenFaq => {
      if (prevOpenFaq.includes(index)) {
        return prevOpenFaq.filter(i => i !== index); // Close if already open
      } else {
        return [...prevOpenFaq, index]; // Open if closed
      }
    });
  };

  // State sekarang menyimpan angka murni, jadi kalkulasi menjadi lebih sederhana
  const totalMonthly = useMemo(() => {
    return Math.max(0, baseSalary + allowances);
  }, [baseSalary, allowances]);

  const tenureMonths = useMemo(() => {
    if (useDirectMasaKerja) {
      const y = Math.max(0, Math.floor(Number(yearsInput) || 0));
      const m = Math.max(0, Math.floor(Number(monthsInput) || 0));
      return y * 12 + m;
    }

    if (!startDate || !endDate) return 0;
    try {
      const s = new Date(startDate + "T00:00:00");
      const e = new Date(endDate + "T00:00:00");
      if (!(s instanceof Date) || !(e instanceof Date) || isNaN(s) || isNaN(e) || e <= s) return 0;
      let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
      if (e.getDate() >= s.getDate()) months += 1;
      return Math.max(0, months);
    } catch (err) {
      return 0;
    }
  }, [useDirectMasaKerja, yearsInput, monthsInput, startDate, endDate]);

  const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(v || 0));

  // Cari Data Alasan PHK
  const currentReason = useMemo(() => {
    return TERMINATION_REASONS.find(r => r.value === terminationReason) || TERMINATION_REASONS[0];
  }, [terminationReason]);

  const getUPMonths = (months) => {
    if (months < 12) return 1;
    if (months < 24) return 2;
    if (months < 36) return 3;
    if (months < 48) return 4;
    if (months < 60) return 5;
    if (months < 72) return 6;
    if (months < 84) return 7;
    if (months < 96) return 8;
    return 9; 
  };

  const getUPMKMonths = (months) => {
    if (months < 36) return 0;
    if (months < 72) return 2;
    if (months < 108) return 3;
    if (months < 144) return 4;
    if (months < 180) return 5;
    if (months < 216) return 6;
    if (months < 252) return 7;
    if (months < 288) return 8;
    return 10;
  };

  const baseUPMonths = getUPMonths(tenureMonths);
  const baseUPMKMonths = getUPMKMonths(tenureMonths);

  // Hitung UP & UPMK (Base * Koefisien)
  const UP = baseUPMonths * totalMonthly * currentReason.up;
  const UPMK = baseUPMKMonths * totalMonthly * currentReason.upmk;

  // Hitung UPH
  const divisor = workWeek === 6 ? 25 : 21;
  const cutiValue = (sisaCuti > 0 ? (totalMonthly / divisor) * sisaCuti : 0);
  const transportValue = transport;
  
  // UPH Perumahan 15% (Hanya dihitung dari total UP+UPMK yang didapat)
  const housingMedicalValue = includeHousingMedical ? 0.15 * (UP + UPMK) : 0;

  const UPH = cutiValue + transportValue + housingMedicalValue;
  const total = UP + UPMK + UPH;

  // --- RENDER ---
  useEffect(() => {
    // Set HTML lang attribute
    document.documentElement.lang = 'id';

    // Set Meta Title
    document.title = "Kalkulator Perhitungan Pesangon Gratis | KantorKu";

    // Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Hitung pesangon secara otomatis sesuai PP No. 35 Tahun 2021. Dapatkan estimasi UP, UPMK, UPH, masa kerja, hingga 15% pengganti perumahan & pengobatan. Gratis!');

    // Set Robots Tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'index, follow');

    // Set Canonical Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    // Gunakan URL saat ini sebagai canonical URL.
    // Anda bisa mengganti window.location.href dengan URL spesifik jika diperlukan.
    canonicalLink.setAttribute('href', window.location.href);

  }, []); // Efek ini hanya berjalan sekali saat komponen dimuat

  return (
    <div className="w-full min-h-screen bg-[#0f0e17]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4"><span>KANTORKU HRIS TOOLS</span></div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">Kalkulator <span className="text-[#FACC15]">Pesangon Karyawan</span></h1>
            <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">Hitung estimasi pesangon berdasarkan masa kerja dan gaji terakhir sesuai PP No. 35 Tahun 2021.</p>
          </div>
          <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">Terintegrasi Dengan</div>
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
              <span className="text-2xl font-bold text-white">KantorKu HRIS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Otomatisasi hitung pesangon, payroll, dan PHK langsung dari sistem HR Anda.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><span className="text-sm font-bold">1</span></div>Data Karyawan</h2>
              
              <div className="space-y-8">

                {/* Section 1: Alasan PHK */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                     Jenis Pemutusan Hubungan Kerja (PHK)
                  </h3>
                  <div>
                    <select 
                      value={terminationReason} 
                      onChange={(e) => setTerminationReason(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 font-medium text-base"
                    >
                      {TERMINATION_REASONS.map(reason => (
                          <option key={reason.value} value={reason.value}>
                              {reason.label}
                          </option>
                      ))}
                    </select>
                    
                    <div className={`mt-3 p-3 rounded-lg flex items-start gap-3 ${currentReason.up === 0 ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}>
                      <div className="mt-0.5">
                         {currentReason.up === 0 ? <AlertIcon /> : <InfoIcon />}
                      </div>
                      <div className="text-sm text-slate-700">
                        <p className="font-bold text-slate-800 mb-1">Dasar Hukum & Ketentuan:</p>
                        <p>{currentReason.info}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-xs font-semibold">UP: {currentReason.up}x</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-xs font-semibold">UPMK: {currentReason.upmk}x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />
                
                {/* Section 2: Income */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MoneyIcon /> Komponen Upah Bulanan
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-500 mb-1">Gaji Pokok + Tunjangan Tetap</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-base font-medium">Rp</span>
                        <input 
                          type="text"
                          inputMode="numeric"
                          value={formatNumberForDisplay(baseSalary)} 
                          onChange={(e) => setBaseSalary(parseFormattedNumber(e.target.value))} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-500 mb-1">Tunjangan Lain (Opsional)</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-base font-medium">Rp</span>
                        <input 
                          type="text"
                          inputMode="numeric"
                          value={formatNumberForDisplay(allowances)} 
                          onChange={(e) => setAllowances(parseFormattedNumber(e.target.value))} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 3: Tenure */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <CalendarIcon /> Masa Kerja
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Mode Manual</span>
                       <input 
                        type="checkbox" 
                        className="toggle toggle-primary h-5 w-9 accent-purple-600 cursor-pointer" 
                        checked={useDirectMasaKerja} 
                        onChange={(e)=>setUseDirectMasaKerja(e.target.checked)}
                      />
                    </div>
                  </div>

                  {useDirectMasaKerja ? (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-1">Total Tahun</label>
                        <input 
                          type="number" 
                          value={yearsInput} 
                          onChange={(e)=>setYearsInput(parseInt(e.target.value, 10) || 0)} 
                          className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500" 
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-900 mb-1">Total Bulan</label>
                        <input 
                          type="number" 
                          value={monthsInput} 
                          onChange={(e)=>setMonthsInput(parseInt(e.target.value, 10) || 0)} 
                          className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500" 
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Mulai Bekerja</label>
                        <input 
                          type="date" 
                          value={startDate} 
                          onChange={(e)=>setStartDate(e.target.value)} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-700" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Tanggal PHK</label>
                        <input 
                          type="date" 
                          value={endDate} 
                          onChange={(e)=>setEndDate(e.target.value)} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-700" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-slate-100" />

                {/* Section 4: Hak Lain */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider">Hak Lainnya</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Sisa Cuti (Hari)</label>
                      <input 
                        type="number" 
                        value={sisaCuti} 
                        onChange={(e)=>setSisaCuti(parseInt(e.target.value, 10) || 0)} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Hari Kerja / Minggu</label>
                      <select 
                        value={workWeek} 
                        onChange={(e)=>setWorkWeek(Number(e.target.value))} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                      >
                        <option value={6}>6 Hari (Divisor 25)</option>
                        <option value={5}>5 Hari (Divisor 21)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                       <label className="block text-sm font-medium text-slate-500 mb-1">Ongkos Pulang (Opsional)</label>
                        <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-base font-medium">Rp</span>
                          <input 
                            type="text"
                            inputMode="numeric"
                            value={formatNumberForDisplay(transport)} 
                            onChange={(e) => setTransport(parseFormattedNumber(e.target.value))} 
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                          />
                        </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                    <input 
                      id="hm" 
                      type="checkbox" 
                      checked={includeHousingMedical} 
                      onChange={(e)=>setIncludeHousingMedical(e.target.checked)} 
                      className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="hm" className="text-base text-slate-600 cursor-pointer">
                      <span className="font-medium text-slate-900">Termasuk UPH 15%?</span>
                      <p className="text-sm text-slate-500 mt-0.5">Untuk penggantian perumahan & pengobatan (dari total UP + UPMK).</p>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
              <h3 className="text-xl font-bold text-white mb-1">Rincian Perhitungan</h3>
              <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">Estimasi Masa Kerja: {Math.floor(tenureMonths/12)} Tahun, {tenureMonths%12} Bulan</p>

              <div className="space-y-3">
                {/* UP */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Uang Pesangon (UP)</p>
                      <p className="text-xs text-purple-300/70">{baseUPMonths} x Upah ({currentReason.up}x)</p>
                    </div>
                    <p className="text-lg font-bold text-white">{fmt(UP)}</p>
                  </div>
                </div>

                {/* UPMK */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Uang Penghargaan Masa Kerja (UPMK)</p>
                      <p className="text-xs text-purple-300/70">{baseUPMKMonths} x Upah ({currentReason.upmk}x)</p>
                    </div>
                    <p className="text-lg font-bold text-white">{fmt(UPMK)}</p>
                  </div>
                </div>

                {/* UPH Breakdown */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-xs font-bold text-purple-300 uppercase mb-3">Uang Penggantian Hak (UPH)</p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between"><span>Cuti ({sisaCuti} hari)</span><span>{fmt(cutiValue)}</span></div>
                    <div className="flex justify-between"><span>Ongkos Pulang</span><span>{fmt(transportValue)}</span></div>
                    <div className="flex justify-between"><span>Perumahan (15%)</span><span>{fmt(housingMedicalValue)}</span></div>
                    <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold text-white"><span>Total UPH</span><span>{fmt(UPH)}</span></div>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                  <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Total Estimasi Kompensasi</p>
                  <p className="text-3xl font-bold text-[#FACC15]">{fmt(total)}</p>
                  
                  {/* UANG PISAH NOTIFICATION */}
                  {(currentReason.up === 0 && currentReason.upmk === 0) && (
                    <div className="mt-3 pt-3 border-t border-[#FACC15]/20 text-xs text-purple-200">
                      <span className="font-bold">Catatan:</span> Karyawan mungkin berhak atas <strong>Uang Pisah</strong>. Besaran diatur dalam PP/PKB perusahaan.
                    </div>
                  )}
                </div>

                {/* CTA Section */}
                <div className="mt-6 flex items-start gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15] shrink-0"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                  <div>
                    <p className="text-[11px] text-purple-200 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis?</p>
                    <p className="text-[11px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk integrasi payroll, pesangon, dan PHK yang akurat.</p>
                    <p className="text-[10px] text-purple-400 mt-3 pt-3 border-t border-purple-500/30 italic">Perhitungan berdasarkan PP No. 35 Tahun 2021.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  {/* BOTTOM CONTENT: Rules Table & FAQ */}
  <div className="mt-20 grid md:grid-cols-1 gap-10"> 
          
          {/* Rules Table (Already correct) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Komponen dan Perhitungan Uang Pesangon</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-3 rounded-l-lg">Komponen</th>
                    <th className="p-3 rounded-r-lg">Ketentuan / Penjelasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-medium">Upah Dasar (Gaji Pokok + Tunjangan Tetap)</td>
                    <td className="p-3">Basis perhitungan UP, UPMK, dan UPH. Tidak termasuk tunjangan tidak tetap.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Uang Pesangon (UP)</td>
                    <td className="p-3">
                      <p className="font-semibold mb-1">Diberikan berdasarkan masa kerja :</p>
                      <ul className="list-disc ml-4 space-y-0.5">
                        <li>&lt; 1 tahun: 1 bln Upah</li>
                        <li>1 &le; masa kerja &lt; 2 tahun: 2 bulan Upah</li>
                        <li>2 &le; masa kerja &lt; 3 tahun: 3 bulan Upah</li>
                        <li>3 &le; masa kerja &lt; 4 tahun: 4 bulan Upah</li>
                        <li>4 &le; masa kerja &lt; 5 tahun: 5 bulan Upah</li>
                        <li>5 &le; masa kerja &lt; 6 tahun: 6 bulan Upah</li>
                        <li>6 &le; masa kerja &lt; 7 tahun: 7 bulan Upah</li>
                        <li>7 &le; masa kerja &lt; 8 tahun: 8 bulan Upah</li>
                        <li>&ge; 8 tahun: 9 bulan Upah (Maksimal)</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Uang Penghargaan Masa Kerja (UPMK)</td>
                    <td className="p-3">
                      <p className="font-semibold mb-1">Diberikan berdasarkan masa kerja :</p>
                      <ul className="list-disc ml-4 space-y-0.5">
                        <li>MK &lt; 3 tahun: 0 bln Upah</li>
                        <li>3 &le; masa kerja &lt; 6 tahun: 2 bulan Upah</li>
                        <li>6 &le; masa kerja &lt; 9 tahun: 3 bulan Upah</li>
                        <li>9 &le; masa kerja &lt; 12 tahun: 4 bulan Upah</li>
                        <li>12 &le; masa kerja &lt; 15 tahun: 5 bulan Upah</li>
                        <li>15 &le; masa kerja &lt; 18 tahun: 6 bulan Upah</li>
                        <li>18 &le; masa kerja &lt; 21 tahun: 7 bulan Upah</li>
                        <li>21 &le; masa kerja &lt; 24 tahun: 8 bulan Upah</li>
                        <li>&ge; 24 tahun: 10 bulan Upah (Maksimal)</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Koefisien PHK (Pengali)</td>
                    <td className="p-3">
                      Koefisien ditentukan berdasarkan Alasan PHK (misal: PHK Biasa = 1x UP, Pensiun = 1.75x UP).
                      Faktor ini akan mengubah nilai akhir UP dan UPMK.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Uang Pergantian Hak – Sisa Cuti</td>
                    <td className="p-3">Cuti tahunan yang belum diambil &times; nilai harian (divisor 21/25).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Uang Pergantian Hak – Ongkos Pulang</td>
                    <td className="p-3">Biaya transport pulang ke daerah asal (jika ada).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Uang Pergantian Hak – Penggantian Perumahan 15%</td>
                    <td className="p-3">15% &times; (UP + UPMK). Opsional tergantung kebijakan perusahaan.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Hak PKWT (Jika Kontrak)</td>
                    <td className="p-3">Tidak mendapatkan uang pesangon dan UPMK. Melainkan dapat kompensasi senilai 1 bulan upah &times; (masa kerja / 12).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        
          {/* Section 2: FAQ Dropdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3"> 
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left "
                  >
                    <h3 className="font-semibold text-slate-800 text-base pr-4">{item.question}</h3>
                    <ChevronDownIcon className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq.includes(index) ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq.includes(index) && (
                    <div className="p-4 pt-0 text-base text-slate-600 bg-white border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
                       <div className="pt-3">
                         {item.answer}
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8"><p>Disclaimer: Kalkulator ini adalah alat simulasi. Hasil perhitungan berdasarkan PP No. 35 Tahun 2021. Angka aktual dapat berbeda tergantung kebijakan perusahaan.</p></div>
      </div>
    </div>
  );
}