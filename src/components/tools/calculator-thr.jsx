import React, { useState, useMemo } from "react";

// --- Icons (Safety sized for Astro/Tailwind) ---
const GiftIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-[#FACC15]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MoneyIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

export default function ThrCalculator() {
  // --- STATE ---
  const [salary, setSalary] = useState(6000000); // Gaji Pokok + Tunjangan Tetap
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(6);

  // --- CALCULATIONS ---
  const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(v || 0));

  const calculation = useMemo(() => {
    const monthlySalary = Number(salary);
    const totalTenureMonths = (Number(years) * 12) + Number(months);
    
    let thrAmount = 0;
    let status = "";
    let description = "";
    let formula = "";

    if (totalTenureMonths < 1) {
      thrAmount = 0;
      status = "Belum Berhak";
      description = "Sesuai Permenaker No. 6/2016, pekerja dengan masa kerja kurang dari 1 bulan belum berhak mendapatkan THR Keagamaan.";
      formula = "Masa kerja < 1 bulan = 0";
    } else if (totalTenureMonths >= 12) {
      thrAmount = monthlySalary;
      status = "Full 1 Bulan Upah";
      description = "Pekerja dengan masa kerja 12 bulan atau lebih berhak mendapatkan THR sebesar 1 bulan upah.";
      formula = "1 x Upah Sebulan";
    } else {
      // Pro-rate: (Masa Kerja / 12) * Upah
      thrAmount = (totalTenureMonths / 12) * monthlySalary;
      status = "Proporsional (Pro-rata)";
      description = `Karena masa kerja kurang dari 12 bulan (${totalTenureMonths} bulan), THR dihitung secara proporsional.`;
      formula = `(${totalTenureMonths} bulan / 12) x Upah Sebulan`;
    }

    return {
      totalTenureMonths,
      monthlySalary,
      thrAmount,
      status,
      description,
      formula
    };
  }, [salary, years, months]);

  return (
    <div className="w-full min-h-screen bg-[#0f0e17]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
              <GiftIcon />
              <span>KANTORKU HRIS TOOLS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Kalkulator <span className="text-[#FACC15]">THR Keagamaan</span>
            </h1>
            <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
              Hitung estimasi Tunjangan Hari Raya (THR) Anda secara otomatis, baik untuk masa kerja penuh maupun pro-rata (proporsional) sesuai aturan pemerintah.
            </p>
          </div>
          <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">Terintegrasi Dengan</div>
            <div className="flex items-center gap-3 mb-3">
              <BuildingIcon />
              <span className="text-2xl font-bold text-white">KantorKu HRIS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Otomatisasi hitung payroll, BPJS, dan PPh 21 langsung dari sistem HR Anda.</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
            
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <span className="text-sm font-bold">1</span>
              </div>
              Data Dasar
            </h2>
            
            <div className="pl-10 space-y-6">
              
              {/* Upah */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <MoneyIcon /> Komponen Upah
                </label>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Gaji Pokok + Tunjangan Tetap</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600 pointer-events-none">Rp</span>
                    <input 
                      type="number" 
                      value={salary} 
                      onChange={(e)=>setSalary(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                      placeholder="Contoh: 5000000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    *Tunjangan tidak tetap (makan/transport kehadiran) tidak ikut dihitung.
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Masa Kerja */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon /> Masa Kerja
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tahun</label>
                    <input 
                      type="number" 
                      value={years} 
                      onChange={(e)=>setYears(Math.max(0, e.target.value))} 
                      className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bulan</label>
                    <input 
                      type="number" 
                      value={months} 
                      onChange={(e)=>setMonths(Math.max(0, e.target.value))} 
                      className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Total masa kerja terhitung: <strong>{calculation.totalTenureMonths} Bulan</strong>
                </p>
              </div>
              
              {/* Quick Tips */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <svg width="16" height="16" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/></svg>
                  Tahukah Anda?
                </h4>
                <p className="text-xs text-purple-800 leading-relaxed">
                  THR wajib dibayarkan oleh pengusaha paling lambat <strong>7 hari sebelum</strong> Hari Raya Keagamaan.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Purple Glow Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
              
              <h3 className="text-xl font-bold text-white mb-1">Rincian Perhitungan</h3>
              <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">THR Keagamaan</p>

              <div className="space-y-3">
                
                {/* Status Badge */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold">Status</p>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold uppercase tracking-wide">
                      {calculation.status}
                    </span>
                  </div>
                </div>

                {/* Dasar Upah */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Dasar Upah (Pokok + Tetap)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{fmt(calculation.monthlySalary)}</p>
                    </div>
                  </div>
                </div>

                {/* Masa Kerja */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Masa Kerja</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{calculation.totalTenureMonths} Bulan</p>
                    </div>
                  </div>
                </div>

                {/* Formula */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 border-l-4 border-l-purple-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold">Rumus Perhitungan</p>
                    <span className="font-mono text-purple-300 font-medium bg-white/10 px-2 py-0.5 rounded text-xs">{calculation.formula}</span>
                  </div>
                  <p className="text-xs text-gray-400 italic">{calculation.description}</p>
                </div>

                {/* Main Result - THR Amount */}
                <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mt-2 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                  <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Total THR Diterima</p>
                  <p className="text-3xl font-bold text-[#FACC15]">{fmt(calculation.thrAmount)}</p>
                </div>

                {/* Regulation Reference */}
                <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-xs font-bold text-purple-300 uppercase mb-3 flex items-center gap-2">
                    <InfoIcon /> Dasar Hukum
                  </p>
                  <div className="space-y-3 text-xs text-gray-400">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-purple-300 font-bold text-[10px]">1</div>
                      <p>Pekerja dengan masa kerja <strong className="text-white">12 bulan atau lebih</strong> berhak mendapatkan 1 bulan upah.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-purple-300 font-bold text-[10px]">2</div>
                      <p>Pekerja dengan masa kerja <strong className="text-white">1-12 bulan</strong> diberikan secara proporsional.</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-purple-400 mt-3 pt-3 border-t border-purple-500/30 italic">Berdasarkan Permenaker No. 6/2016</p>
                </div>

                {/* KantorKu CTA */}
                <div className="mt-6 flex items-start gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20">
                  <BuildingIcon />
                  <div>
                    <p className="text-[11px] text-purple-200 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis setiap bulan?</p>
                    <p className="text-[11px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk integrasi payroll, absensi, dan pajak yang akurat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8">
          <p>Disclaimer: Kalkulator ini adalah alat simulasi. Perhitungan THR menggunakan aturan Permenaker No. 6/2016. Angka aktual dapat berbeda tergantung kebijakan perusahaan.</p>
        </div>
      </div>
    </div>
  );
}
