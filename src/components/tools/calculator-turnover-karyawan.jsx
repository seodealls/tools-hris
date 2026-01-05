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
  <svg width="20" height="20" className="w-5 h-5 text-[#FACC15]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
      statusColor = "text-emerald-400 border-emerald-500/30";
      advice = "Tingkat retensi Anda sangat baik. Pertahankan budaya kerja ini.";
    } else if (rate <= 15) {
      status = "Wajar (Normal)";
      statusColor = "text-blue-400 border-blue-500/30";
      advice = "Masih dalam batas wajar industri, namun tetap pantau kepuasan karyawan.";
    } else if (rate <= 25) {
      status = "Perlu Perhatian (High)";
      statusColor = "text-orange-400 border-orange-500/30";
      advice = "Cukup tinggi. Evaluasi strategi kompensasi dan manajemen beban kerja.";
    } else {
      status = "Kritis (Critical)";
      statusColor = "text-red-400 border-red-500/30";
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
    <div className="w-full min-h-screen bg-[#0f0e17]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
              <CalculatorIcon />
              <span>KANTORKU HRIS TOOLS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">Kalkulator <span className="text-[#FACC15]">Turnover Karyawan</span></h1>
            <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
              Hitung persentase pergantian karyawan (Turnover Rate) dalam periode tertentu untuk mengukur efektivitas retensi SDM perusahaan Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <span className="text-sm font-bold">📊</span>
                </div>
                Data Periode (Bulanan/Tahunan)
              </h2>
              
              <div className="space-y-8 pl-10">
                
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <UsersIcon /> Jumlah Karyawan
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Awal Periode (Start)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={startHeadcount} 
                          onChange={(e)=>setStartHeadcount(Math.max(0, e.target.value))} 
                          className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Akhir Periode (End)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={endHeadcount} 
                          onChange={(e)=>setEndHeadcount(Math.max(0, e.target.value))} 
                          className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                   <p className="text-xs text-gray-500">
                    *Rata-rata karyawan: <strong>{calculation.avgHeadcount}</strong> (Digunakan sebagai pembagi dalam rumus)
                  </p>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-4">
                   <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <UserMinusIcon /> Karyawan Keluar
                  </label>
                  
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div className="group">
                        <label className="block text-xs font-medium text-purple-900 mb-1">Total Keluar (Separations)</label>
                        <input 
                          type="number" 
                          value={separations} 
                          onChange={(e)=>setSeparations(Math.max(0, e.target.value))} 
                          className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white border-purple-200 focus:border-purple-500"
                        />
                        <p className="text-xs text-purple-600 mt-1">*Masukkan total karyawan yang keluar (Resign sukarela + PHK) selama periode ini.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
               
               <h3 className="text-xl font-bold text-white mb-1">Hasil Analisa</h3>
               <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                 Turnover Rate <TrendIcon />
               </p>

               <div className="space-y-4">
                 <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)] text-center">
                   <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Turnover Rate</p>
                   <p className="text-4xl sm:text-5xl font-extrabold text-[#FACC15] tracking-tighter">
                     {calculation.rate}%
                   </p>
                 </div>
                 
                 <div className={`bg-white/5 border border-white/10 rounded-xl p-4 ${calculation.statusColor}`}>
                   <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-2">Status</p>
                   <p className="text-lg font-bold">{calculation.status}</p>
                   <p className="text-xs text-purple-200/70 mt-2 leading-relaxed">
                     {calculation.advice}
                   </p>
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                   <p className="text-[10px] font-mono text-purple-200/60 text-center">
                     Rumus: (Jumlah Keluar / Rata-rata Karyawan) x 100
                   </p>
                 </div>
               </div>
            </div>

            <div className="mt-6 bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-4">Standar Industri (Benchmark)</h3>
                
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-medium">{"< 10%"}</span>
                      <span className="text-purple-200/70">Sangat Sehat</span>
                   </div>
                   <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[25%]"></div>
                   </div>

                   <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-blue-400 font-medium">10% - 15%</span>
                      <span className="text-purple-200/70">Wajar / Rata-rata</span>
                   </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-1.5 rounded-full w-[50%]"></div>
                   </div>

                   <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-red-400 font-medium">{"> 15%"}</span>
                      <span className="text-purple-200/70">Perlu Evaluasi</span>
                   </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-1.5 rounded-full w-[85%]"></div>
                   </div>
                </div>
                
                <p className="text-[10px] text-purple-200/50 italic mt-4">
                   *Benchmark dapat bervariasi tergantung industri (misal: Retail/F&B biasanya memiliki standar turnover yang lebih tinggi).
                </p>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}