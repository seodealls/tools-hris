import React, { useState, useMemo } from "react";

// Icon Components (Inline SVG for portability)
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

export default function SeveranceCalculator() {
  // --- STATE (Logic Asli) ---
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

  // --- HELPERS ---
  const parseNumber = (v) => {
    const n = Number(String(v).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const totalMonthly = useMemo(() => {
    return Math.max(0, parseNumber(baseSalary) + parseNumber(allowances));
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

  const upMonths = getUPMonths(tenureMonths);
  const upmkMonths = getUPMKMonths(tenureMonths);

  const UP = upMonths * totalMonthly;
  const UPMK = upmkMonths * totalMonthly;

  const divisor = workWeek === 6 ? 25 : 21;
  const cutiValue = (sisaCuti > 0 ? (totalMonthly / divisor) * parseNumber(sisaCuti) : 0);
  const transportValue = parseNumber(transport);
  const housingMedicalValue = includeHousingMedical ? 0.15 * (UP + UPMK) : 0;

  const UPH = cutiValue + transportValue + housingMedicalValue;
  const total = UP + UPMK + UPH;

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header Gradient Background */}
      <div className="w-full bg-[#1E0137] pb-32 pt-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#28024B] to-[#5E0DC6] opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white">Kantorku.id Tool</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kalkulator Pesangon & PHK</h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Hitung estimasi hak pesangon Anda secara akurat sesuai peraturan PP No. 35 Tahun 2021. 
            Termasuk Uang Pesangon (UP), Penghargaan Masa Kerja (UPMK), dan Penggantian Hak (UPH).
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <span>📝</span> Data Karyawan
                </h2>
              </div>
              
              <div className="p-6 space-y-8">
                
                {/* Section 1: Income */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MoneyIcon /> Komponen Upah
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Gaji Pokok + Tunjangan Tetap</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={baseSalary} 
                          onChange={(e)=>setBaseSalary(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Tunjangan Lain (Opsional)</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={allowances} 
                          onChange={(e)=>setAllowances(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 2: Tenure */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <CalendarIcon /> Masa Kerja
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Mode Manual</span>
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
                        <label className="block text-xs font-medium text-purple-900 mb-1">Total Tahun</label>
                        <input 
                          type="number" 
                          value={yearsInput} 
                          onChange={(e)=>setYearsInput(e.target.value)} 
                          className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500" 
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-purple-900 mb-1">Total Bulan</label>
                        <input 
                          type="number" 
                          value={monthsInput} 
                          onChange={(e)=>setMonthsInput(e.target.value)} 
                          className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500" 
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Mulai Bekerja</label>
                        <input 
                          type="date" 
                          value={startDate} 
                          onChange={(e)=>setStartDate(e.target.value)} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-700" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal PHK</label>
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

                {/* Section 3: Hak Lain */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Hak Lainnya</label>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Sisa Cuti (Hari)</label>
                      <input 
                        type="number" 
                        value={sisaCuti} 
                        onChange={(e)=>setSisaCuti(e.target.value)} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Hari Kerja / Minggu</label>
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
                       <label className="block text-xs font-medium text-slate-500 mb-1">Ongkos Pulang (Opsional)</label>
                        <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                          <input 
                            type="number" 
                            value={transport} 
                            onChange={(e)=>setTransport(e.target.value)} 
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
                    <label htmlFor="hm" className="text-sm text-slate-600 cursor-pointer">
                      <span className="font-medium text-slate-900">Termasuk UPH 15%?</span>
                      <p className="text-xs text-slate-500 mt-0.5">Untuk penggantian perumahan & pengobatan (dari total UP + UPMK).</p>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            
            {/* Main Result Card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-purple-900/10 border border-slate-100 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
               
               <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estimasi Masa Kerja</p>
                  <div className="text-xl font-bold text-slate-800">
                    {Math.floor(tenureMonths/12)} Tahun <span className="text-slate-400 font-normal">|</span> {tenureMonths%12} Bulan
                  </div>
               </div>

               <div className="p-6 space-y-5">
                  {/* UP */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 border-dashed">
                     <div>
                        <p className="text-sm font-medium text-slate-600">Uang Pesangon (UP)</p>
                        <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">{upMonths} x Upah</span>
                     </div>
                     <p className="text-base font-bold text-slate-800">{fmt(UP)}</p>
                  </div>

                  {/* UPMK */}
                   <div className="flex justify-between items-center pb-4 border-b border-slate-100 border-dashed">
                     <div>
                        <p className="text-sm font-medium text-slate-600">Penghargaan Masa Kerja</p>
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">{upmkMonths} x Upah</span>
                     </div>
                     <p className="text-base font-bold text-slate-800">{fmt(UPMK)}</p>
                  </div>

                  {/* UPH Breakdown */}
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Penggantian Hak (UPH)</p>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-600">Cuti ({sisaCuti} hari)</span>
                       <span className="font-medium">{fmt(cutiValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-600">Ongkos</span>
                       <span className="font-medium">{fmt(transportValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-600">Perumahan (15%)</span>
                       <span className="font-medium">{fmt(housingMedicalValue)}</span>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="bg-purple-600 rounded-xl p-5 text-white shadow-lg shadow-purple-600/30 mt-2">
                     <p className="text-sm text-purple-100 mb-1">Total Estimasi Kompensasi</p>
                     <p className="text-3xl font-bold">{fmt(total)}</p>
                  </div>
               </div>
            </div>

            {/* Disclaimer */}
             <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
                <InfoIcon />
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong>Catatan:</strong> Hasil ini adalah estimasi berdasarkan aturan normatif (PHK Biasa). 
                  Untuk kasus spesifik (Pensiun, Mengundurkan Diri, Pelanggaran Berat), faktor pengali UP/UPMK bisa berbeda (0.5x, 1x, 1.75x, 2x).
                </p>
             </div>
          </div>
        </div>

        {/* BOTTOM CONTENT: Rules Table */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Ringkasan Aturan PP 35/2021</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-3 rounded-l-lg">Komponen</th>
                    <th className="p-3 rounded-r-lg">Ketentuan Umum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-medium">Pesangon (UP)</td>
                    <td className="p-3">1 bulan upah per tahun masa kerja. Maksimal 9 bulan upah.</td>
                  </tr>
                   <tr>
                    <td className="p-3 font-medium">UPMK</td>
                    <td className="p-3">Diberikan mulai masa kerja 3 tahun. Maksimal 10 bulan upah.</td>
                  </tr>
                   <tr>
                    <td className="p-3 font-medium">UPH</td>
                    <td className="p-3">Sisa cuti belum gugur & penggantian perumahan 15% (jika berhak).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
             <h3 className="text-lg font-bold text-slate-900 mb-4">FAQ Singkat</h3>
             <div className="space-y-4">
                <div>
                   <h4 className="text-sm font-bold text-slate-800">Apakah kalkulator ini akurat?</h4>
                   <p className="text-sm text-slate-600 mt-1">Sangat akurat untuk perhitungan normatif sesuai PP 35/2021. Namun, cek Perjanjian Kerja Bersama (PKB) perusahaan Anda karena mungkin memberikan lebih besar dari aturan pemerintah.</p>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-slate-800">Apa itu faktor pengali?</h4>
                   <p className="text-sm text-slate-600 mt-1">Tergantung alasan PHK. Contoh: Efisiensi karena rugi (0.5x UP), Pensiun (1.75x UP), Meninggal Dunia (2x UP). Kalkulator ini menggunakan standar 1x.</p>
                </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}