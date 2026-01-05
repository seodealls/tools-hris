import React, { useState, useMemo } from "react";

// --- Icons (Safety sized) ---
const MoneyIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default function CostPerHireCalculator() {
  // --- STATE ---
  // External Costs
  const [adsCost, setAdsCost] = useState(5000000); // Job Boards, Social Media Ads
  const [agencyFees, setAgencyFees] = useState(0); // Headhunters
  const [eventsCost, setEventsCost] = useState(0); // Job Fairs
  const [backgroundCheck, setBackgroundCheck] = useState(0); // Assessment/Medical
  const [otherExternal, setOtherExternal] = useState(0);

  // Internal Costs
  const [recruiterSalary, setRecruiterSalary] = useState(15000000); // Allocated salary/time
  const [referralBonus, setReferralBonus] = useState(2000000);
  const [softwareCost, setSoftwareCost] = useState(1000000); // ATS/Tools monthly allocation
  const [otherInternal, setOtherInternal] = useState(0);

  // Hires
  const [totalHires, setTotalHires] = useState(5);

  // --- CALCULATIONS ---
  const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(v || 0));

  const calculation = useMemo(() => {
    const totalExternal = Number(adsCost) + Number(agencyFees) + Number(eventsCost) + Number(backgroundCheck) + Number(otherExternal);
    const totalInternal = Number(recruiterSalary) + Number(referralBonus) + Number(softwareCost) + Number(otherInternal);
    const totalCost = totalExternal + totalInternal;
    
    const hires = Math.max(1, Number(totalHires)); // Prevent division by zero
    const cph = totalCost / hires;

    return {
      totalExternal,
      totalInternal,
      totalCost,
      cph,
      hires
    };
  }, [adsCost, agencyFees, eventsCost, backgroundCheck, otherExternal, recruiterSalary, referralBonus, softwareCost, otherInternal, totalHires]);

  return (
    <div className="w-full min-h-screen bg-[#0f0e17] font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
                    <CalculatorIcon />
                    <span>KANTORKU HRIS TOOLS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                    Kalkulator <span className="text-[#FACC15]">Cost Per Hire</span>
                </h1>
                <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
                    Hitung rata-rata biaya yang dikeluarkan perusahaan untuk merekrut satu karyawan baru. Metrik penting untuk efisiensi rekrutmen.
                </p>
            </div>
            
            <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
              <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">Terintegrasi Dengan</div>
              <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><BriefcaseIcon /></div>
                  <span className="text-2xl font-bold text-white">KantorKu HRIS</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Kelola rekrutmen dan biaya karyawan dalam satu dashboard terintegrasi.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
             
             <div className="border-b border-slate-100 pb-6 mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">📊</span> Komponen Biaya
                </h2>
             </div>
              
             <div className="space-y-8">
                
                {/* External Costs */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <BriefcaseIcon /> Biaya Eksternal
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Iklan Lowongan (Job Boards)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={adsCost} 
                          onChange={(e)=>setAdsCost(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Agensi / Headhunter</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={agencyFees} 
                          onChange={(e)=>setAgencyFees(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Job Fair / Event Kampus</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={eventsCost} 
                          onChange={(e)=>setEventsCost(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Psikotes / Medical Check</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={backgroundCheck} 
                          onChange={(e)=>setBackgroundCheck(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Internal Costs */}
                <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MoneyIcon /> Biaya Internal
                  </label>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Gaji Tim Rekrutmen (Alokasi)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={recruiterSalary} 
                          onChange={(e)=>setRecruiterSalary(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Bonus Referral Karyawan</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={referralBonus} 
                          onChange={(e)=>setReferralBonus(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Software / ATS / Tools</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={softwareCost} 
                          onChange={(e)=>setSoftwareCost(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                     <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Lainnya (Overhead)</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          type="number" 
                          value={otherInternal} 
                          onChange={(e)=>setOtherInternal(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Total Hires */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <UsersIcon /> Hasil Rekrutmen
                  </label>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="group">
                        <label className="block text-xs font-medium text-purple-900 mb-1">Total Karyawan Diterima (Hires)</label>
                        <input 
                          type="number" 
                          value={totalHires} 
                          onChange={(e)=>setTotalHires(Math.max(1, e.target.value))} 
                          className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 text-lg font-bold text-purple-900"
                        />
                        <p className="text-[10px] text-purple-600 mt-1">*Masukkan jumlah kandidat yang berhasil direkrut dalam periode perhitungan ini.</p>
                    </div>
                  </div>
                </div>

              </div>
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden sticky top-8">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
               
               <h3 className="text-xl font-bold text-white mb-1">Rincian Perhitungan</h3>
               <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">Analisis Biaya Rekrutmen</p>

                {/* Main Highlight */}
               <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mb-6 shadow-[0_0_15px_rgba(250,204,21,0.1)] text-center">
                    <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Cost Per Hire (CPH)</p>
                    <p className="text-4xl sm:text-5xl font-bold text-[#FACC15] tracking-tight">{fmt(calculation.cph)}</p>
                    <p className="text-xs text-purple-200/70 mt-2">Rata-rata biaya per 1 karyawan</p>
               </div>

               <div className="space-y-3">
                   <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Total Eksternal</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">{fmt(calculation.totalExternal)}</p>
                            </div>
                        </div>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Total Internal</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">{fmt(calculation.totalInternal)}</p>
                            </div>
                        </div>
                   </div>
                   
                   <div className="p-4 bg-purple-900/30 border border-purple-500/20 rounded-xl flex justify-between items-center">
                      <span className="text-sm font-bold text-white">Total Pengeluaran</span>
                      <span className="text-sm font-bold text-purple-100">{fmt(calculation.totalCost)}</span>
                   </div>
               </div>

               {/* Info Card */}
               <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5">
                 <h3 className="text-sm font-bold text-white mb-2">Tentang Cost Per Hire</h3>
                 
                 <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
                   <p>
                     <strong className="text-purple-200">Cost Per Hire (CPH)</strong> adalah salah satu metrik HR terpenting untuk mengukur efisiensi biaya dalam proses akuisisi talenta.
                   </p>
                   <div className="bg-white/5 p-3 rounded-lg border border-white/10 font-mono text-[11px] text-purple-200">
                     Rumus = (Biaya Eksternal + Biaya Internal) / Total Hires
                   </div>
                   <ul className="list-disc pl-4 space-y-1 text-gray-400">
                     <li><strong>Biaya Eksternal:</strong> Pengeluaran untuk vendor luar (iklan, agensi, background check).</li>
                     <li><strong>Biaya Internal:</strong> Pengeluaran internal (gaji rekruter, biaya sistem, referral).</li>
                   </ul>
                   <p className="text-gray-500 italic pt-2">
                     Semakin rendah CPH dengan kualitas kandidat yang tetap tinggi, semakin efisien proses rekrutmen Anda.
                   </p>
                 </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
