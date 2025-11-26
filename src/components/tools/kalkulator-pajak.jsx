import React, { useState, useEffect } from "react";

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

const ChevronRightIcon = ({ rotate }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: rotate ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// --- DATA TARIF TER (PP 58/2023) ---
const TER_A_LAYERS = [[5400000, 0], [5650000, 0.0025], [5950000, 0.005], [6300000, 0.0075], [6750000, 0.01], [7500000, 0.0125], [8550000, 0.015], [9650000, 0.0175], [10050000, 0.02], [10350000, 0.0225], [10700000, 0.025], [11050000, 0.03], [11600000, 0.035], [12500000, 0.04], [13750000, 0.05], [15100000, 0.06], [16950000, 0.07], [19750000, 0.08], [24150000, 0.09], [26450000, 0.1], [28000000, 0.11], [30050000, 0.12], [32400000, 0.13], [35400000, 0.14], [39100000, 0.15], [43850000, 0.16], [47800000, 0.17], [51400000, 0.18], [56300000, 0.19], [62200000, 0.2], [68600000, 0.21], [77500000, 0.22], [89000000, 0.23], [103000000, 0.24], [125000000, 0.25], [157000000, 0.26], [206000000, 0.27], [337000000, 0.28], [454000000, 0.29], [550000000, 0.3], [695000000, 0.31], [910000000, 0.32], [1400000000, 0.33], [Infinity, 0.34]];
const TER_B_LAYERS = [[6200000, 0], [6500000, 0.0025], [6850000, 0.005], [7300000, 0.0075], [9200000, 0.01], [10750000, 0.015], [11250000, 0.02], [11600000, 0.025], [12600000, 0.03], [13600000, 0.04], [14950000, 0.05], [16400000, 0.06], [18450000, 0.07], [21850000, 0.08], [26000000, 0.09], [27700000, 0.1], [29350000, 0.11], [31450000, 0.12], [33950000, 0.13], [37100000, 0.14], [41100000, 0.15], [45800000, 0.16], [49500000, 0.17], [53800000, 0.18], [58500000, 0.19], [64000000, 0.2], [71000000, 0.21], [80000000, 0.22], [93000000, 0.23], [109000000, 0.24], [129000000, 0.25], [163000000, 0.26], [211000000, 0.27], [374000000, 0.28], [459000000, 0.29], [555000000, 0.3], [704000000, 0.31], [957000000, 0.32], [1405000000, 0.33], [Infinity, 0.34]];
const TER_C_LAYERS = [[6600000, 0], [6950000, 0.0025], [7350000, 0.005], [7800000, 0.0075], [8850000, 0.01], [9800000, 0.0125], [10950000, 0.015], [11200000, 0.0175], [12050000, 0.02], [12950000, 0.03], [14150000, 0.04], [15550000, 0.05], [17050000, 0.06], [19500000, 0.07], [22700000, 0.08], [26600000, 0.09], [28100000, 0.1], [30100000, 0.11], [32600000, 0.12], [35400000, 0.13], [38900000, 0.14], [43000000, 0.15], [47400000, 0.16], [51200000, 0.17], [55800000, 0.18], [60400000, 0.19], [66700000, 0.2], [74500000, 0.21], [83200000, 0.22], [95600000, 0.23], [110000000, 0.24], [134000000, 0.25], [169000000, 0.26], [221000000, 0.27], [390000000, 0.28], [463000000, 0.29], [561000000, 0.3], [709000000, 0.31], [965000000, 0.32], [1419000000, 0.33], [Infinity, 0.34]];

const PTKP_LIST = {
  'TK/0': 54000000, 'TK/1': 58500000, 'TK/2': 63000000, 'TK/3': 67500000,
  'K/0': 58500000, 'K/1': 63000000, 'K/2': 67500000, 'K/3': 72000000
};
const TER_CATEGORY_MAP = {
  'TK/0': 'A', 'TK/1': 'A', 'K/0': 'A', 'TK/2': 'B', 'TK/3': 'B', 'K/1': 'B', 'K/2': 'B', 'K/3': 'C'
};
const TARIF_PASAL_17 = [
  { min: 0, max: 60000000, rate: 0.05 },
  { min: 60000000, max: 250000000, rate: 0.15 },
  { min: 250000000, max: 500000000, rate: 0.25 },
  { min: 500000000, max: 5000000000, rate: 0.30 },
  { min: 5000000000, max: Infinity, rate: 0.35 }
];

// --- UTILS ---
const formatNumber = (num) => num ? new Intl.NumberFormat('id-ID').format(num) : '';
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
}).format(num);

const getTerRate = (grossIncome, category) => {
  if (grossIncome <= 0 || !category) return 0;
  let table = [];
  if (category === 'A') table = TER_A_LAYERS;
  else if (category === 'B') table = TER_B_LAYERS;
  else if (category === 'C') table = TER_C_LAYERS;
  for (let i = 0; i < table.length; i++) {
    if (grossIncome <= table[i][0]) return table[i][1];
  }
  return 0;
};

const calculatePasal17 = (pkp) => {
  if (pkp <= 0) return 0;
  let tax = 0;
  let remainingPkp = pkp;
  for (const tier of TARIF_PASAL_17) {
    const range = tier.max - tier.min;
    const taxableAmount = Math.min(remainingPkp, range);
    if (taxableAmount > 0) {
      tax += taxableAmount * tier.rate;
      remainingPkp -= taxableAmount;
    } else break;
  }
  return tax;
};

// --- COMPONENTS ---
const FormattedInput = ({ label, value, onChange, placeholder, disabled, subtext }) => {
  const [displayValue, setDisplayValue] = useState('');
  useEffect(() => setDisplayValue(formatNumber(value)), [value]);
  const handleChange = (e) => {
    const raw = e.target.value.replace(/\./g, '');
    if (!isNaN(raw)) {
      setDisplayValue(formatNumber(raw));
      onChange(raw);
    }
  };
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <div className={`relative group ${disabled ? 'opacity-70' : ''}`}>
        <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600 pointer-events-none">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none ${disabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : 'bg-gray-50 border-transparent focus:bg-white focus:border-purple-500'}`}
          placeholder={placeholder || "0"}
          value={displayValue}
          onChange={handleChange}
        />
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
};

const SelectionButton = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-3 py-3 rounded-xl text-xs md:text-sm font-bold transition-all border border-transparent shadow-sm ${active ? 'bg-[#6d4afe] text-white shadow-purple-500/30 transform scale-[1.02]' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}>
    {label}
  </button>
);

const RadioOption = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${active ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
    <div className="flex items-center">
      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${active ? 'border-purple-600' : 'border-gray-400'}`}>
        {active && <div className="w-2 h-2 rounded-full bg-purple-600" />}
      </div>
      {label}
    </div>
  </button>
);

const ResultRow = ({ label, value, highlight = false, subtext }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">{label}</p>
    <p className={`text-lg font-bold ${highlight ? 'text-[#FACC15]' : 'text-white'}`}>{value}</p>
    {subtext && <p className="text-xs text-purple-300/70 mt-1">{subtext}</p>}
  </div>
);

// --- MAIN CALCULATOR COMPONENT ---
const CalculatorPPh21 = () => {
  // States
  const [modeCategory, setModeCategory] = useState(1);
  const [subMode, setSubMode] = useState(1);
  const [statusKawin, setStatusKawin] = useState('TK');
  const [tanggungan, setTanggungan] = useState(0);
  const [isGrossUp, setIsGrossUp] = useState(false);

  // Inputs
  const [gajiPokok, setGajiPokok] = useState('');
  const [penghasilanBruto, setPenghasilanBruto] = useState('');
  const [penghasilanBrutoSetahun, setPenghasilanBrutoSetahun] = useState('');
  const [pphJanNov, setPphJanNov] = useState('');

  // Tunjangan
  const [showTunjangan, setShowTunjangan] = useState(false);
  const [tunjanganTransport, setTunjanganTransport] = useState('');
  const [tunjanganLembur, setTunjanganLembur] = useState('');
  const [tunjanganMakan, setTunjanganMakan] = useState('');
  const [tunjanganLain, setTunjanganLain] = useState(''); // Termasuk Natura
  const [totalTunjanganManual, setTotalTunjanganManual] = useState('');

  // Potongan
  const [iuranPensiun, setIuranPensiun] = useState('');
  const [zakat, setZakat] = useState('');

  const [result, setResult] = useState(null);

  const handleCategoryChange = (cat) => {
    setModeCategory(cat);
    setSubMode(cat);
    setResult(null);
    setGajiPokok('');
    setPenghasilanBruto('');
    setPenghasilanBrutoSetahun('');
    setIsGrossUp(false);
  };

  const getPtkpKey = () => `${statusKawin}/${tanggungan}`;

  // Realtime Calculation
  useEffect(() => {
    calculate();
  }, [
    gajiPokok, tunjanganTransport, tunjanganLembur, tunjanganMakan, tunjanganLain,
    totalTunjanganManual, penghasilanBruto, penghasilanBrutoSetahun,
    pphJanNov, iuranPensiun, zakat, modeCategory, subMode, statusKawin, tanggungan, isGrossUp
  ]);

  const calculate = () => {
    const num = (v) => parseFloat(v) || 0;
    const ptkpKey = getPtkpKey();
    const ptkpVal = PTKP_LIST[ptkpKey] || 54000000;
    const terCat = TER_CATEGORY_MAP[ptkpKey] || 'A';

    let res = {};

    if (subMode === 1) { // Bulanan Pegawai Tetap
      const basicSalary = num(gajiPokok);
      const allowances = num(tunjanganTransport) + num(tunjanganLembur) + num(tunjanganMakan) + num(tunjanganLain);
      let grossSalary = basicSalary + allowances;
      let tunjanganPajak = 0;
      let rate = getTerRate(grossSalary, terCat);

      if (isGrossUp) {
        let currentGross = grossSalary;
        for (let i = 0; i < 5; i++) {
          let r = getTerRate(currentGross, terCat);
          tunjanganPajak = (grossSalary * r) / (1 - r);
          currentGross = grossSalary + tunjanganPajak;
        }
        grossSalary = currentGross;
        rate = getTerRate(grossSalary, terCat);
      }

      const pph = Math.floor(grossSalary * rate);
      if (grossSalary > 0) {
        res = {
          title: `PPh 21 Bulanan ${isGrossUp ? '(Gross Up)' : ''}`,
          gross: grossSalary,
          terCategory: terCat,
          terRate: rate,
          pph: pph,
          net: grossSalary - pph,
          isGrossUp: isGrossUp,
          tunjanganPajak: tunjanganPajak,
          desc: "Perhitungan menggunakan tarif efektif rata-rata (TER) PP 58/2023."
        };
      }
    }
    else if (subMode === 2) { // Pegawai Tidak Tetap Bulanan
      let grossSalary = num(gajiPokok);
      if (grossSalary > 0) {
        let tunjanganPajak = 0;
        let rate = getTerRate(grossSalary, terCat);
        if (isGrossUp) {
          tunjanganPajak = (grossSalary * rate) / (1 - rate);
          grossSalary += tunjanganPajak;
          rate = getTerRate(grossSalary, terCat);
        }
        const pph = Math.floor(grossSalary * rate);
        res = {
          title: 'PPh 21 Tidak Tetap (Bulanan)',
          gross: grossSalary,
          terCategory: terCat,
          terRate: rate,
          pph: pph,
          net: grossSalary - pph,
          isGrossUp: isGrossUp,
          tunjanganPajak: tunjanganPajak,
          desc: "Perhitungan menggunakan tarif efektif rata-rata (TER) PP 58/2023."
        };
      }
    }
    else if (subMode === 3) { // Pensiunan Bulanan
      const grossSalary = num(gajiPokok) + num(totalTunjanganManual);
      if (grossSalary > 0) {
        const rate = getTerRate(grossSalary, terCat);
        const pph = Math.floor(grossSalary * rate);
        res = {
          title: 'PPh 21 Pensiunan (Bulanan)',
          gross: grossSalary,
          terCategory: terCat,
          terRate: rate,
          pph: pph,
          net: grossSalary - pph,
          isPensiun: true,
          desc: "Perhitungan menggunakan tarif efektif rata-rata (TER) PP 58/2023."
        };
      }
    }
    else if (subMode === 4) { // Harian
      const dailyGross = num(penghasilanBruto);
      if (dailyGross > 0) {
        let tax = 0;
        let rateDisplay = "";
        if (dailyGross <= 2500000) {
          if (dailyGross <= 450000) {
            tax = 0;
            rateDisplay = "TER Harian 0%";
          } else {
            tax = dailyGross * 0.005;
            rateDisplay = "TER Harian 0.5%";
          }
        } else {
          const dpp = dailyGross * 0.5;
          tax = calculatePasal17(dpp);
          rateDisplay = "Pasal 17 x 50% Ph. Bruto";
        }
        res = {
          title: 'PPh 21 Harian',
          gross: dailyGross,
          terInfo: rateDisplay,
          pph: tax,
          net: dailyGross - tax,
          desc: dailyGross > 2500000 ? "Perhitungan menggunakan tarif progresif Pasal 17." : "Perhitungan menggunakan TER Harian."
        };
      }
    }
    else if (subMode === 5) { // Bukan Pegawai
      const gross = num(penghasilanBruto);
      if (gross > 0) {
        const pkp = gross * 0.5;
        const tax = calculatePasal17(pkp);
        res = {
          title: 'PPh 21 Bukan Pegawai',
          gross: gross,
          terInfo: 'Tarif Pasal 17 x 50% Ph. Bruto',
          pph: tax,
          net: gross - tax,
          desc: "Perhitungan menggunakan tarif progresif Pasal 17."
        };
      }
    }
    else if (subMode === 6 || subMode === 7) { // Tahunan
      const isPegawai = subMode === 6;
      let grossYear = num(penghasilanBrutoSetahun);
      if (grossYear > 0) {
        const maxBiaya = isPegawai ? 6000000 : 2400000;
        const otherDeductions = (isPegawai ? num(iuranPensiun) : 0) + num(zakat);
        let tunjanganPajak = 0;
        if (isGrossUp) {
          let basePKP = Math.max(0, grossYear - Math.min(grossYear * 0.05, maxBiaya) - otherDeductions - ptkpVal);
          let baseTax = calculatePasal17(basePKP);
          tunjanganPajak = baseTax;
          let gross2 = grossYear + tunjanganPajak;
          let biaya2 = Math.min(gross2 * 0.05, maxBiaya);
          let pkp2 = Math.max(0, gross2 - biaya2 - otherDeductions - ptkpVal);
          tunjanganPajak = calculatePasal17(pkp2);
          grossYear += tunjanganPajak;
        }
        const biayaPengurang = Math.min(grossYear * 0.05, maxBiaya);
        const deduction = biayaPengurang + otherDeductions;
        const netYear = grossYear - deduction;
        const pkp = Math.max(0, netYear - ptkpVal);
        const pkpRounded = Math.floor(pkp / 1000) * 1000;
        const taxYearly = calculatePasal17(pkpRounded);
        const taxDec = Math.max(0, taxYearly - num(pphJanNov));
        res = {
          title: isPegawai ? 'PPh 21 Masa Pajak Terakhir' : 'PPh 21 Masa Terakhir (Pensiun)',
          gross: grossYear,
          net: netYear,
          pkp: pkpRounded,
          ptkpCode: ptkpKey,
          ptkpNominal: ptkpVal,
          pphYear: taxYearly,
          pphDec: taxDec,
          isGrossUp: isGrossUp,
          tunjanganPajak: tunjanganPajak,
          isAnnual: true,
          isPensiun: !isPegawai,
          desc: "Perhitungan masa pajak setahun menggunakan tarif Pasal 17 dikurangi pajak yang sudah dibayar."
        };
      }
    }
    if (res.gross) setResult(res); else setResult(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0e17] relative z-10 py-12">
      {/* CSS for animations and input hiding - scoped to this component's usage */}
      <style>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
              <span>KANTORKU HRIS TOOLS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Kalkulator Pajak Penghasilan <span className="text-[#FACC15]">(PPh 21)</span>
            </h1>
            <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
              Hitung pajak penghasilan karyawan secara otomatis sesuai regulasi terbaru PP 58/2023 & PMK 168/2023.
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
              Otomatisasi hitung payroll, BPJS, dan PPh 21 langsung dari sistem HR Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* INPUT CARD */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Input Data Penghasilan</h2>
            <p className="text-gray-500 text-sm mb-8">Lengkapi data di bawah untuk simulasi perhitungan.</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Jenis Perhitungan</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <SelectionButton label="Bulanan (TER)" active={modeCategory === 1} onClick={() => handleCategoryChange(1)} />
                <SelectionButton label="Harian / Freelance" active={modeCategory === 4} onClick={() => handleCategoryChange(4)} />
                <SelectionButton label="Masa Pajak Terakhir" active={modeCategory === 6} onClick={() => handleCategoryChange(6)} />
              </div>
            </div>

            <div className="mb-8 animate-fade-in">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Kode Objek Pajak</label>
              <div className="space-y-2">
                {modeCategory === 1 && (
                  <>
                    <RadioOption label="21-100-01 — Pegawai Tetap" active={subMode === 1} onClick={() => setSubMode(1)} />
                    <RadioOption label="21-100-02 — Penerima Pensiun Berkala" active={subMode === 3} onClick={() => setSubMode(3)} />
                    <RadioOption label="21-100-03 — Pegawai Tidak Tetap (Dibayar Bulanan)" active={subMode === 2} onClick={() => setSubMode(2)} />
                  </>
                )}
                {modeCategory === 4 && (
                  <>
                    <RadioOption label="21-100-03 — Pegawai Tidak Tetap (Harian)/Freelance" active={subMode === 4} onClick={() => setSubMode(4)} />
                    <RadioOption label="21-100-09 — Bukan Pegawai (Honorarium)" active={subMode === 5} onClick={() => setSubMode(5)} />
                  </>
                )}
                {modeCategory === 6 && (
                  <>
                    <RadioOption label="21-100-01 — Pegawai Tetap" active={subMode === 6} onClick={() => setSubMode(6)} />
                    <RadioOption label="21-100-02 — Pensiunan Berkala" active={subMode === 7} onClick={() => setSubMode(7)} />
                  </>
                )}
              </div>
            </div>

            {modeCategory !== 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Status Kawin</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-2xl">
                    <button onClick={() => setStatusKawin('TK')} className={`py-2 rounded-xl text-sm font-bold transition-all ${statusKawin === 'TK' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>Tidak Kawin</button>
                    <button onClick={() => setStatusKawin('K')} className={`py-2 rounded-xl text-sm font-bold transition-all ${statusKawin === 'K' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>Kawin</button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Jumlah Tanggungan</label>
                  <div className="flex gap-2 bg-gray-50 p-1 rounded-2xl">
                    {[0, 1, 2, 3].map(t => (
                      <button key={t} onClick={() => setTanggungan(t)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tanggungan === t ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>
                        {t === 3 ? '>= 3' : t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-purple-100 flex items-center gap-4 animate-fade-in">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Status PTKP: {`${statusKawin}/${tanggungan}`}</p>
                    <p className="text-sm text-gray-500">Penghasilan Tidak Kena Pajak: <span className="font-semibold text-gray-700">{formatRupiah(PTKP_LIST[`${statusKawin}/${tanggungan}`] || 0)}</span></p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {(subMode === 1 || subMode === 2) && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-800">Skema Perhitungan Gaji</label>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 px-1">
                      <button onClick={() => setIsGrossUp(false)} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${!isGrossUp ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Gross</button>
                      <button onClick={() => setIsGrossUp(true)} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${isGrossUp ? 'bg-purple-600 shadow text-white' : 'text-gray-500'}`}>Gross Up</button>
                    </div>
                  </div>
                  <FormattedInput label={subMode === 1 ? "Gaji Pokok Bulanan" : "Upah Bulanan"} value={gajiPokok} onChange={setGajiPokok} />

                  {subMode === 1 && (
                    <div className="border-t border-gray-100 pt-4">
                      <button onClick={() => setShowTunjangan(!showTunjangan)} className="flex items-center text-sm font-bold text-purple-600 hover:text-purple-800 mb-4">
                        <ChevronRightIcon rotate={showTunjangan} /> <span className="ml-2">{showTunjangan ? 'Sembunyikan Komponen Lain' : 'Tambah Tunjangan / Lembur'}</span>
                      </button>
                      {showTunjangan && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100 animate-fade-in">
                          <FormattedInput label="Tunjangan Transport" value={tunjanganTransport} onChange={setTunjanganTransport} />
                          <FormattedInput label="Uang Lembur" value={tunjanganLembur} onChange={setTunjanganLembur} />
                          <FormattedInput label="Tunjangan Makan" value={tunjanganMakan} onChange={setTunjanganMakan} />
                          <FormattedInput label="Pendapatan Lainnya (Termasuk Natura)" value={tunjanganLain} onChange={setTunjanganLain} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {subMode === 3 && (
                <>
                  <FormattedInput label="Uang Pensiun Pokok" value={gajiPokok} onChange={setGajiPokok} />
                  <FormattedInput label="Total Tunjangan (jika ada)" value={totalTunjanganManual} onChange={setTotalTunjanganManual} />
                </>
              )}

              {(subMode === 4 || subMode === 5) && (
                <>
                  <FormattedInput label="Penghasilan Bruto / Harian" value={penghasilanBruto} onChange={setPenghasilanBruto} />
                  <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mt-2 border border-blue-100">ℹ️ Perhitungan ini menggunakan tarif progresif Pasal 17 atau TER Harian sesuai regulasi.</div>
                </>
              )}

              {(subMode === 6 || subMode === 7) && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-800">Skema Perhitungan Gaji</label>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 px-1">
                      <button onClick={() => setIsGrossUp(false)} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${!isGrossUp ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Gross</button>
                      <button onClick={() => setIsGrossUp(true)} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${isGrossUp ? 'bg-purple-600 shadow text-white' : 'text-gray-500'}`}>Gross Up</button>
                    </div>
                  </div>
                  <FormattedInput label="Penghasilan Bruto Setahun (Termasuk THR)" value={penghasilanBrutoSetahun} onChange={setPenghasilanBrutoSetahun} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormattedInput label={subMode === 6 ? "Biaya Jabatan" : "Biaya Pensiun"} value={Math.min((parseFloat(penghasilanBrutoSetahun) || 0) * 0.05, subMode === 6 ? 6000000 : 2400000)} disabled={true} subtext={subMode === 6 ? "5% dari Bruto, Max 6jt/thn" : "5% dari Bruto, Max 2.4jt/thn"} onChange={() => { }} />
                    {subMode === 6 && <FormattedInput label="Iuran Pensiun Setahun" value={iuranPensiun} onChange={setIuranPensiun} subtext="Jika ada, misal JHT/JP" />}
                  </div>
                  <FormattedInput label="Zakat/Sumbangan Keagamaan Wajib" value={zakat} onChange={setZakat} />
                  <FormattedInput label="PPh 21 Sudah Dipotong (Jan-Nov)" value={pphJanNov} onChange={setPphJanNov} />
                </>
              )}
            </div>
          </div>

          {/* OUTPUT CARD */}
          <div className="lg:col-span-5">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden sticky top-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
              <h3 className="text-xl font-bold text-white mb-1">Ringkasan Perhitungan</h3>
              <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">Mode: {result ? result.title : 'Menunggu Input...'}</p>
              {result ? (
                <div className="space-y-2 animate-fade-in">

                  {/* CARD OBJEK PAJAK (NEW STYLE) */}
                  <div className="bg-[#4C4578] rounded-2xl p-5 mb-4 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-[10px] font-bold text-purple-200/70 uppercase tracking-wider mb-1">Objek Pajak (Penghasilan Bruto)</p>
                    <p className="text-3xl font-extrabold text-white mb-3">{formatRupiah(result.gross)}</p>
                    <div className="text-[10px] text-purple-200/60 leading-relaxed border-t border-white/10 pt-3">
                      Total penghasilan kotor termasuk Gaji Pokok, Tunjangan, Lembur, dan Natura (BPJS Perusahaan dll) yang Anda input.
                    </div>
                  </div>

                  {/* CARD PPH 21 */}
                  <div className="bg-[#1e1b2e] rounded-2xl p-5 border border-gray-700/50 mb-4">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PPh 21 (TER Bulanan)</p>
                      {result.terCategory && <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Kat. {result.terCategory}</span>}
                    </div>
                    <p className="text-3xl font-extrabold text-[#FACC15] mb-2">{result.isAnnual ? formatRupiah(result.pphDec) : formatRupiah(result.pph)}</p>
                    <p className="text-xs text-gray-500">Tarif {(result.terRate * 100).toFixed(2)}% dari Objek Pajak</p>
                  </div>

                  {/* DETAILS */}
                  {result.isAnnual && (
                    <>
                      <ResultRow label={result.isPensiun ? "Manfaat Pensiun Neto Setahun" : "Penghasilan Neto Setahun"} value={formatRupiah(result.net)} />
                      <ResultRow label="PKP Setahun" value={formatRupiah(result.pkp)} />
                    </>
                  )}

                  {result.isGrossUp && <ResultRow label="Tunjangan Pajak (Gross Up)" value={formatRupiah(result.tunjanganPajak)} highlight={true} />}

                  {!result.isAnnual && (
                    <ResultRow label={result.isPensiun ? "Manfaat Pensiun Bersih" : "Take Home Pay (Est)"} value={formatRupiah(result.net)} subtext="Belum termasuk potongan iuran karyawan (JHT/JP/BPJS)" />
                  )}

                  <div className="mt-6 flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                    <BuildingIcon />
                    <div>
                      <p className="text-[10px] text-purple-300 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis setiap bulan?</p>
                      <p className="text-[10px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk integrasi payroll, absensi, dan pajak yang akurat.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 text-purple-300">?</div>
                  <p className="text-white font-medium mb-1">Belum ada perhitungan</p>
                  <p className="text-sm text-purple-300/70">Masukkan data gaji di panel kiri.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPPh21;