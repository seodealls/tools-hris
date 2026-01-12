import React, { useState, useEffect } from "react";

// --- COMPONENTS ---
const FormattedInput = ({ label, value, onChange, placeholder, prefix = "Rp" }) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value === "" || value === 0) setDisplayValue("");
    else setDisplayValue(new Intl.NumberFormat("id-ID").format(value));
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    if (!isNaN(raw)) {
      setDisplayValue(new Intl.NumberFormat("id-ID").format(raw));
      onChange(raw === "" ? 0 : parseFloat(raw));
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <div className="relative group">
        <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600 pointer-events-none">{prefix}</span>
        <input
          type="text"
          inputMode="numeric"
          className="w-full pl-10 pr-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
          placeholder={placeholder || "0"}
          value={displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

// --- DATA: RULES ---
const BONUS_RULES = [
  { MasaKerja: 0, Description: "Belum berhak mendapatkan bonus" },
  { MasaKerja: 3, Description: "Masa Kerja 3 - < 6 Bulan", Multiplier: 0.2 },
  { MasaKerja: 6, Description: "Masa Kerja 6 - < 9 Bulan", Multiplier: 0.5 },
  { MasaKerja: 9, Description: "Masa Kerja 9 - < 12 Bulan", Multiplier: 0.8 },
  { MasaKerja: 12, Description: "Masa Kerja >= 12 Bulan", Multiplier: 1.0 },
];

const PerformanceFactors = [
  { label: "Sangat Baik (120%)", value: 1.2 },
  { label: "Baik (100%)", value: 1.0 },
  { label: "Cukup (80%)", value: 0.8 },
  { label: "Kurang (50%)", value: 0.5 },
];

// --- ICONS ---
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

// --- MAIN COMPONENT ---
export default function BonusCalculator() {
  const [gajiPokok, setGajiPokok] = useState(0);
  const [masaKerjaBulan, setMasaKerjaBulan] = useState(0);
  const [performanceFactor, setPerformanceFactor] = useState(1.0);
  const [targetBonus, setTargetBonus] = useState(1); // 1x Gaji

  const [bonusAmount, setBonusAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [ruleDescription, setRuleDescription] = useState("");

  const calculate = () => {
    let selectedRule = BONUS_RULES[0];
    for (let i = BONUS_RULES.length - 1; i >= 0; i--) {
      if (masaKerjaBulan >= BONUS_RULES[i].MasaKerja) {
        selectedRule = BONUS_RULES[i];
        break;
      }
    }

    const masaKerjaMult = selectedRule.Multiplier || 0;
    const totalBonus = gajiPokok * targetBonus * masaKerjaMult * performanceFactor;

    setBonusAmount(totalBonus);
    setMultiplier(masaKerjaMult);
    setRuleDescription(selectedRule.Description);
  };

  useEffect(() => {
    calculate();
  }, [gajiPokok, masaKerjaBulan, performanceFactor, targetBonus]);

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div className="w-full min-h-screen bg-[#0f0e17]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
              <span>KANTORKU HRIS TOOLS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Kalkulator <span className="text-[#FACC15]">Bonus Karyawan</span>
            </h1>
            <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
              Hitung estimasi bonus tahunan atau performa karyawan berdasarkan masa kerja dan penilaian kinerja secara akurat.
            </p>
          </div>

          <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">
              Terintegrasi Dengan
            </div>
            <div className="flex items-center gap-3 mb-3">
              <BuildingIcon />
              <span className="text-2xl font-bold text-white">KantorKu HRIS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Otomatisasi hitung payroll, bonus, dan komponen gaji lainnya langsung dari sistem HR Anda.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Input Data Bonus</h2>

            <FormattedInput
              label="Gaji Pokok"
              value={gajiPokok}
              onChange={setGajiPokok}
            />

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Masa Kerja (Bulan)</label>
              <div className="relative group">
                <input
                  type="number"
                  className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                  placeholder="Contoh: 12"
                  value={masaKerjaBulan || ""}
                  onChange={(e) => setMasaKerjaBulan(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Target Bonus (x Gaji)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                  value={targetBonus}
                  onChange={(e) => setTargetBonus(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">Standar: 1x Gaji</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Faktor Performa</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 appearance-none"
                    value={performanceFactor}
                    onChange={(e) => setPerformanceFactor(parseFloat(e.target.value))}
                  >
                    {PerformanceFactors.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2">Informasi Perhitungan</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Bonus dihitung prorata berdasarkan masa kerja jika kurang dari setahun, dikalikan dengan faktor performa karyawan.
              </p>
            </div>
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

              <h3 className="text-xl font-bold text-white mb-6">Estimasi Bonus</h3>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Kategori Masa Kerja</p>
                <p className="text-lg font-bold text-white">{ruleDescription}</p>
                <p className="text-xs text-purple-300/70 mt-1">Faktor Prorata: {multiplier * 100}%</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Penilaian Kinerja</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-white">
                    {PerformanceFactors.find(p => p.value === performanceFactor)?.label || performanceFactor}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)] mt-6">
                <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Total Bonus Diterima</p>
                <p className="text-3xl font-bold text-[#FACC15]">{formatRupiah(bonusAmount)}</p>
              </div>

              <div className="mt-6 flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                <BuildingIcon />
                <div>
                  <p className="text-[10px] text-purple-300 leading-relaxed mb-1 font-bold">Butuh perhitungan lebih detail?</p>
                  <p className="text-[10px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk kelola bonus, insentif, dan payroll karyawan secara otomatis.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8">
          <p>Disclaimer: Kalkulator ini adalah alat simulasi. Besaran bonus aktual tergantung pada kebijakan perusahaan, perjanjian kerja, dan performa individu/perusahaan secara real.</p>
        </div>

      </div>
    </div>
  );
}
