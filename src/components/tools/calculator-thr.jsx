import React, { useState, useMemo } from "react";

// --- Icons (Safety sized for Astro/Tailwind) ---
const GiftIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header Gradient */}
      <div className="w-full bg-[#1E0137] pb-32 pt-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#28024B] to-[#5E0DC6] opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm mb-6">
            <GiftIcon />
            <span className="text-xs font-medium text-white">Kantorku.id Tool</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kalkulator THR Keagamaan</h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Hitung estimasi Tunjangan Hari Raya (THR) Anda secara otomatis, baik untuk masa kerja penuh maupun pro-rata (proporsional) sesuai aturan pemerintah.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <span>📝</span> Data Dasar
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Upah */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MoneyIcon /> Komponen Upah
                  </label>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Gaji Pokok + Tunjangan Tetap</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                      <input 
                        type="number" 
                        value={salary} 
                        onChange={(e)=>setSalary(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        placeholder="Contoh: 5000000"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      *Tunjangan tidak tetap (makan/transport kehadiran) tidak ikut dihitung.
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Masa Kerja */}
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <CalendarIcon /> Masa Kerja
                  </label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Tahun</label>
                      <input 
                        type="number" 
                        value={years} 
                        onChange={(e)=>setYears(Math.max(0, e.target.value))} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-slate-700"
                        placeholder="0"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Bulan</label>
                      <input 
                        type="number" 
                        value={months} 
                        onChange={(e)=>setMonths(Math.max(0, e.target.value))} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-slate-700"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Total masa kerja terhitung: <strong>{calculation.totalTenureMonths} Bulan</strong>
                  </p>
                </div>

              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                <svg width="16" height="16" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/></svg>
                Tahukah Anda?
              </h4>
              <p className="text-xs text-purple-800 leading-relaxed">
                THR wajib dibayarkan oleh pengusaha paling lambat <strong>7 hari sebelum</strong> Hari Raya Keagamaan.
              </p>
            </div>
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-7 lg:sticky lg:top-8 space-y-6">
            
            {/* Main Result Card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-purple-900/10 border border-slate-100 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
               
               <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                    Status: {calculation.status}
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">Estimasi Diterima</p>
                    <div className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                      {fmt(calculation.thrAmount)}
                    </div>
                  </div>

                  <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4">
                     <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-slate-500">Rumus Perhitungan</span>
                        <span className="font-mono text-slate-700 font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">{calculation.formula}</span>
                     </div>
                     <p className="text-xs text-slate-500 text-left leading-relaxed">
                       {calculation.description}
                     </p>
                  </div>
               </div>

               {/* Breakdown Table */}
               <div className="border-t border-slate-100">
                  <table className="w-full text-sm text-left">
                     <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                           <td className="px-6 py-3 text-slate-500">Dasar Upah (Pokok + Tetap)</td>
                           <td className="px-6 py-3 text-right font-medium text-slate-900">{fmt(calculation.monthlySalary)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                           <td className="px-6 py-3 text-slate-500">Masa Kerja</td>
                           <td className="px-6 py-3 text-right font-medium text-slate-900">{calculation.totalTenureMonths} Bulan</td>
                        </tr>
                         <tr className="bg-purple-50/50">
                           <td className="px-6 py-3 text-purple-700 font-bold">Total THR</td>
                           <td className="px-6 py-3 text-right font-bold text-purple-700">{fmt(calculation.thrAmount)}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Regulation Reference */}
             <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Dasar Hukum (Permenaker No. 6/2016)</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">1</div>
                    <p>Pekerja yang telah mempunyai masa kerja <strong>12 bulan secara terus menerus atau lebih</strong>, diberikan sebesar 1 (satu) bulan upah.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">2</div>
                    <p>Pekerja yang mempunyai masa kerja <strong>1 bulan secara terus menerus tetapi kurang dari 12 bulan</strong>, diberikan secara proporsional sesuai masa kerja dengan perhitungan: (Masa kerja x 1 bulan upah) : 12.</p>
                  </div>
                </div>
             </div>

          </div>
        </div>

      </main>
    </div>
  );
}