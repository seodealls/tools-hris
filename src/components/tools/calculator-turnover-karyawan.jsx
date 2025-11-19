import React, { useState, useMemo } from "react";

// --- Icons (Safety sized) ---
const UsersIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserMinusIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
  </svg>
);

const CalculatorIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const TrendIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function TurnoverCalculator() {
  // --- STATE ---
  const [startHeadcount, setStartHeadcount] = useState(100); // Jumlah karyawan awal periode
  const [endHeadcount, setEndHeadcount] = useState(110);     // Jumlah karyawan akhir periode
  const [separations, setSeparations] = useState(5);         // Jumlah yang keluar (Resign + PHK)
  
  // --- CALCULATIONS ---
  const calculation = useMemo(() => {
    // 1. Average Headcount = (Awal + Akhir) / 2
    const avgHeadcount = (Number(startHeadcount) + Number(endHeadcount)) / 2;

    // 2. Turnover Rate = (Jumlah Keluar / Rata-rata Karyawan) * 100
    let rate = 0;
    if (avgHeadcount > 0) {
      rate = (Number(separations) / avgHeadcount) * 100;
    }

    // Status Kesehatan Turnover (Benchmark umum)
    let status = "";
    let statusColor = "";
    let advice = "";

    if (rate <= 10) {
      status = "Sehat (Healthy)";
      statusColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
      advice = "Tingkat retensi Anda sangat baik. Pertahankan budaya kerja ini.";
    } else if (rate <= 15) {
      status = "Wajar (Normal)";
      statusColor = "text-blue-600 bg-blue-50 border-blue-100";
      advice = "Masih dalam batas wajar industri, namun tetap pantau kepuasan karyawan.";
    } else if (rate <= 25) {
      status = "Perlu Perhatian (High)";
      statusColor = "text-orange-600 bg-orange-50 border-orange-100";
      advice = "Cukup tinggi. Evaluasi strategi kompensasi dan manajemen beban kerja.";
    } else {
      status = "Kritis (Critical)";
      statusColor = "text-red-600 bg-red-50 border-red-100";
      advice = "Sangat tinggi. Segera investigasi penyebab utama (exit interview) untuk mencegah kerugian lebih besar.";
    }

    return {
      avgHeadcount,
      rate: rate.toFixed(2), // Ambil 2 desimal
      status,
      statusColor,
      advice
    };
  }, [startHeadcount, endHeadcount, separations]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Kalkulator Turnover Rate</h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Hitung persentase pergantian karyawan (Turnover Rate) dalam periode tertentu untuk mengukur efektivitas retensi SDM perusahaan Anda.
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
                  <span>📊</span> Data Periode (Bulanan/Tahunan)
                </h2>
              </div>
              
              <div className="p-6 space-y-8">
                
                {/* Headcount Input */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <UsersIcon /> Jumlah Karyawan
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Awal Periode (Start)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={startHeadcount} 
                          onChange={(e)=>setStartHeadcount(Math.max(0, e.target.value))} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Akhir Periode (End)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={endHeadcount} 
                          onChange={(e)=>setEndHeadcount(Math.max(0, e.target.value))} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                   <p className="text-[10px] text-slate-400">
                    *Rata-rata karyawan: <strong>{calculation.avgHeadcount}</strong> (Digunakan sebagai pembagi dalam rumus)
                  </p>
                </div>

                <hr className="border-slate-100" />

                {/* Separations Input */}
                <div className="space-y-4">
                   <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <UserMinusIcon /> Karyawan Keluar
                  </label>
                  
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="group">
                        <label className="block text-xs font-medium text-purple-900 mb-1">Total Keluar (Separations)</label>
                        <input 
                          type="number" 
                          value={separations} 
                          onChange={(e)=>setSeparations(Math.max(0, e.target.value))} 
                          className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 text-lg font-bold text-purple-900"
                        />
                        <p className="text-[10px] text-purple-600 mt-1">*Masukkan total karyawan yang keluar (Resign sukarela + PHK) selama periode ini.</p>
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
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
               
               <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hasil Analisa</p>
                  <div className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Turnover Rate <TrendIcon />
                  </div>
               </div>

               <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tighter">
                    {calculation.rate}%
                  </div>
                  
                  {/* Dynamic Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${calculation.statusColor}`}>
                    Status: {calculation.status}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto pt-2">
                    {calculation.advice}
                  </p>
               </div>

               {/* Formula Hint */}
               <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <p className="text-[10px] font-mono text-slate-400">
                    Rumus: (Jumlah Keluar / Rata-rata Karyawan) x 100
                  </p>
               </div>
            </div>

            {/* Info Card */}
             <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Standar Industri (Benchmark)</h3>
                
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-medium">{"< 10%"}</span>
                      <span className="text-slate-600">Sangat Sehat</span>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[25%]"></div>
                   </div>

                   <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-blue-600 font-medium">10% - 15%</span>
                      <span className="text-slate-600">Wajar / Rata-rata</span>
                   </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-1.5 rounded-full w-[50%]"></div>
                   </div>

                   <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-red-600 font-medium">{"> 15%"}</span>
                      <span className="text-slate-600">Perlu Evaluasi</span>
                   </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-1.5 rounded-full w-[85%]"></div>
                   </div>
                </div>
                
                <p className="text-[10px] text-slate-400 italic mt-2">
                   *Benchmark dapat bervariasi tergantung industri (misal: Retail/F&B biasanya memiliki standar turnover yang lebih tinggi).
                </p>
             </div>

          </div>
        </div>

      </main>
    </div>
  );
}