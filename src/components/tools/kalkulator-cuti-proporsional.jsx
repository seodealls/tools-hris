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
  <svg width="20" height="20" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const formatRupiah = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(v || 0));


export default function cutiproporsional() { // Component must be named App and exported default
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
  const calculation = useMemo(() => {
    const totalExternal = Number(adsCost) + Number(agencyFees) + Number(eventsCost) + Number(backgroundCheck) + Number(otherExternal);
    const totalInternal = Number(recruiterSalary) + Number(referralBonus) + Number(softwareCost) + Number(otherInternal);
    const totalCost = totalExternal + totalInternal;
    
    // Ensure hires is at least 1 to prevent division by zero
    const hires = Math.max(1, Number(totalHires)); 
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
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header Gradient */}
      <div className="w-full bg-[#1E0137] pb-32 pt-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#28024B] to-[#5E0DC6] opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm mb-6">
            <CalculatorIcon />
            <span className="text-xs font-medium text-white">Kantorku.id Tool</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kalkulator Cost Per Hire</h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Hitung rata-rata biaya yang dikeluarkan perusahaan untuk merekrut satu karyawan baru. Metrik penting untuk efisiensi rekrutmen.
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
                  <span>📊</span> Komponen Biaya
                </h2>
              </div>
              
              <div className="p-6 space-y-8">
                
                {/* External Costs */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <BriefcaseIcon /> Biaya Eksternal
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="adsCost" className="block text-xs font-medium text-slate-500 mb-1">Iklan Lowongan (Job Boards)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="adsCost"
                          type="number" 
                          value={adsCost} 
                          onChange={(e)=>setAdsCost(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="agencyFees" className="block text-xs font-medium text-slate-500 mb-1">Agensi / Headhunter</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="agencyFees"
                          type="number" 
                          value={agencyFees} 
                          onChange={(e)=>setAgencyFees(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="eventsCost" className="block text-xs font-medium text-slate-500 mb-1">Job Fair / Event Kampus</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="eventsCost"
                          type="number" 
                          value={eventsCost} 
                          onChange={(e)=>setEventsCost(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="backgroundCheck" className="block text-xs font-medium text-slate-500 mb-1">Psikotes / Medical Check</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="backgroundCheck"
                          type="number" 
                          value={backgroundCheck} 
                          onChange={(e)=>setBackgroundCheck(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    {/* Input for other external costs added for completeness */}
                    <div className="group">
                      <label htmlFor="otherExternal" className="block text-xs font-medium text-slate-500 mb-1">Biaya Eksternal Lainnya</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="otherExternal"
                          type="number" 
                          value={otherExternal} 
                          onChange={(e)=>setOtherExternal(e.target.value)} 
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
                      <label htmlFor="recruiterSalary" className="block text-xs font-medium text-slate-500 mb-1">Gaji Tim Rekrutmen (Alokasi)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="recruiterSalary"
                          type="number" 
                          value={recruiterSalary} 
                          onChange={(e)=>setRecruiterSalary(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="referralBonus" className="block text-xs font-medium text-slate-500 mb-1">Bonus Referral Karyawan</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="referralBonus"
                          type="number" 
                          value={referralBonus} 
                          onChange={(e)=>setReferralBonus(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="softwareCost" className="block text-xs font-medium text-slate-500 mb-1">Software / ATS / Tools</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="softwareCost"
                          type="number" 
                          value={softwareCost} 
                          onChange={(e)=>setSoftwareCost(e.target.value)} 
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                     <div className="group">
                      <label htmlFor="otherInternal" className="block text-xs font-medium text-slate-500 mb-1">Lainnya (Overhead)</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
                        <input 
                          id="otherInternal"
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
                        <label htmlFor="totalHires" className="block text-xs font-medium text-purple-900 mb-1">Total Karyawan Diterima (Hires)</label>
                        <input 
                          id="totalHires"
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
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            
            {/* Main Result Card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-purple-900/10 border border-slate-100 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
               
               <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Metric Utama</p>
                  <div className="text-xl font-bold text-slate-800">
                    Cost Per Hire (CPH)
                  </div>
               </div>

               <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                    {formatRupiah(calculation.cph)}
                  </div>
                  <p className="text-sm text-slate-500">Rata-rata biaya per 1 karyawan</p>
               </div>

               {/* Breakdown Table */}
               <div className="border-t border-slate-100">
                  <div className="grid grid-cols-2 divide-x divide-slate-100">
                     <div className="p-4 text-center hover:bg-slate-50 transition">
                        <p className="text-xs text-slate-500 mb-1">Total Eksternal</p>
                        <p className="font-bold text-slate-800">{formatRupiah(calculation.totalExternal)}</p>
                     </div>
                     <div className="p-4 text-center hover:bg-slate-50 transition">
                        <p className="text-xs text-slate-500 mb-1">Total Internal</p>
                        <p className="font-bold text-slate-800">{formatRupiah(calculation.totalInternal)}</p>
                     </div>
                  </div>
                  <div className="p-4 bg-purple-50 border-t border-purple-100 flex justify-between items-center">
                     <span className="text-sm font-bold text-purple-900">Total Pengeluaran</span>
                     <span className="text-sm font-bold text-purple-900">{formatRupiah(calculation.totalCost)}</span>
                  </div>
               </div>
            </div>

            {/* Info Card */}
             <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Tentang Cost Per Hire</h3>
                
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    <strong>Cost Per Hire (CPH)</strong> adalah salah satu metrik HR terpenting untuk mengukur efisiensi biaya dalam proses akuisisi talenta.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px]">
                    Rumus = (Biaya Eksternal + Biaya Internal) / Total Hires
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Biaya Eksternal:</strong> Pengeluaran untuk vendor luar (iklan, agensi, background check).</li>
                    <li><strong>Biaya Internal:</strong> Pengeluaran internal (gaji rekruter, biaya sistem, referral).</li>
                  </ul>
                  <p className="text-slate-500 italic pt-2">
                    Semakin rendah CPH dengan kualitas kandidat yang tetap tinggi, semakin efisien proses rekrutmen Anda.
                  </p>
                </div>
             </div>

          </div>
        </div>

      </main>
    </div>
  );
}