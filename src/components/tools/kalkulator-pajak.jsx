import React, { useState, useEffect } from 'react';

// --- ICONS ---
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const ChevronRightIcon = ({rotate}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: rotate ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}><path d="m9 18 6-6-6-6"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>;

// --- DATA ---
const PTKP_LIST = { 
    'TK/0': 54000000, 'TK/1': 58500000, 'TK/2': 63000000, 'TK/3': 67500000,
    'K/0': 58500000, 'K/1': 63000000, 'K/2': 67500000, 'K/3': 72000000
};

const TER_CATEGORY_MAP = { 
    'TK/0': 'A', 'TK/1': 'A', 'K/0': 'A',
    'TK/2': 'B', 'TK/3': 'B', 'K/1': 'B', 'K/2': 'B',
    'K/3': 'C'
};

const TARIF_PASAL_17 = [
    {min:0,max:60000000,rate:0.05},
    {min:60000000,max:250000000,rate:0.15},
    {min:250000000,max:500000000,rate:0.25},
    {min:500000000,max:5000000000,rate:0.30},
    {min:5000000000,max:Infinity,rate:0.35}
];

// Simplified TER Logic
const getTerRate = (grossIncome, category) => {
    if (grossIncome <= 0 || !category) return 0; 
    if (category === 'A') {
        if (grossIncome <= 5400000) return 0;
        if (grossIncome <= 5650000) return 0.0025;
        if (grossIncome <= 5950000) return 0.005;
        if (grossIncome <= 6300000) return 0.0075;
        if (grossIncome <= 6750000) return 0.01;
        if (grossIncome <= 7500000) return 0.0125;
        if (grossIncome <= 8550000) return 0.015;
        if (grossIncome <= 9650000) return 0.0175;
        if (grossIncome <= 10050000) return 0.02;
        if (grossIncome <= 11050000) return 0.03;
        if (grossIncome <= 12500000) return 0.04;
        if (grossIncome <= 13750000) return 0.05;
        if (grossIncome <= 15100000) return 0.06;
        if (grossIncome <= 16950000) return 0.07;
        if (grossIncome <= 19750000) return 0.08;
        if (grossIncome <= 24150000) return 0.09;
        return 0.10; 
    }
    if (category === 'B') {
        if (grossIncome <= 6200000) return 0;
        if (grossIncome <= 6500000) return 0.0025;
        if (grossIncome <= 6850000) return 0.005;
        if (grossIncome <= 7300000) return 0.0075;
        if (grossIncome <= 9200000) return 0.01;
        if (grossIncome <= 10750000) return 0.015;
        if (grossIncome <= 11250000) return 0.02;
        if (grossIncome <= 11600000) return 0.025;
        if (grossIncome <= 12600000) return 0.03;
        if (grossIncome <= 13600000) return 0.04;
        if (grossIncome <= 14950000) return 0.05;
        if (grossIncome <= 16400000) return 0.06;
        if (grossIncome <= 18450000) return 0.07;
        if (grossIncome <= 21850000) return 0.08;
        if (grossIncome <= 26000000) return 0.09;
        return 0.10; 
    }
    if (category === 'C') {
        if (grossIncome <= 6600000) return 0;
        if (grossIncome <= 6950000) return 0.0025;
        if (grossIncome <= 7350000) return 0.005;
        if (grossIncome <= 7800000) return 0.0075;
        if (grossIncome <= 8850000) return 0.01;
        if (grossIncome <= 9800000) return 0.0125;
        if (grossIncome <= 10950000) return 0.015;
        if (grossIncome <= 11200000) return 0.0175;
        if (grossIncome <= 12050000) return 0.02;
        if (grossIncome <= 12950000) return 0.03;
        if (grossIncome <= 14150000) return 0.04;
        if (grossIncome <= 15550000) return 0.05;
        if (grossIncome <= 17050000) return 0.06;
        if (grossIncome <= 19500000) return 0.07;
        if (grossIncome <= 22700000) return 0.08;
        if (grossIncome <= 26600000) return 0.09;
        return 0.10; 
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

const formatNumber = (num) => num ? new Intl.NumberFormat('id-ID').format(num) : '';
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

// --- COMPONENTS ---

const FormattedInput = ({ label, value, onChange, placeholder, disabled, subtext }) => {
    const [displayValue, setDisplayValue] = useState('');
    useEffect(() => setDisplayValue(formatNumber(value)), [value]);
    const handleChange = (e) => {
        const raw = e.target.value.replace(/\./g, '');
        if (!isNaN(raw)) { setDisplayValue(formatNumber(raw)); onChange(raw); }
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
    <button onClick={onClick} className={`px-3 py-3 rounded-xl text-xs md:text-sm font-bold transition-all border border-transparent shadow-sm ${active ? 'bg-[#6d4afe] text-white shadow-purple-500/30 transform scale-[1.02]' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}>{label}</button>
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

// --- APP ---
export default function KalkulatorPajak() {
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
    
    const [showTunjangan, setShowTunjangan] = useState(false);
    const [tunjanganTransport, setTunjanganTransport] = useState('');
    const [tunjanganLembur, setTunjanganLembur] = useState('');
    const [tunjanganMakan, setTunjanganMakan] = useState('');
    const [tunjanganLain, setTunjanganLain] = useState('');
    const [totalTunjanganManual, setTotalTunjanganManual] = useState('');
    
    const [iuranPensiun, setIuranPensiun] = useState('');
    const [zakat, setZakat] = useState('');
    
    const [result, setResult] = useState(null);

    // Handle Main Category Change
    const handleCategoryChange = (cat) => {
        setModeCategory(cat);
        setSubMode(cat); 
        setResult(null);
        setGajiPokok(''); setPenghasilanBruto(''); setPenghasilanBrutoSetahun('');
        setIsGrossUp(false);
    };

    const getPtkpKey = () => `${statusKawin}/${tanggungan}`;

    const calculate = () => {
        const num = (v) => parseFloat(v) || 0;
        const ptkpKey = getPtkpKey();
        const ptkpVal = PTKP_LIST[ptkpKey] || 54000000;
        const terCat = TER_CATEGORY_MAP[ptkpKey] || 'A';
        
        let res = {};

        if (subMode === 1) { // Pegawai Tetap Bulanan
            let grossSalary = num(gajiPokok) + num(tunjanganTransport) + num(tunjanganLembur) + num(tunjanganMakan) + num(tunjanganLain);
            let tunjanganPajak = 0;
            let rate = getTerRate(grossSalary, terCat);
            
            if (isGrossUp) {
                let currentGross = grossSalary;
                for(let i=0; i<5; i++){
                   let r = getTerRate(currentGross, terCat);
                   tunjanganPajak = (grossSalary * r) / (1 - r); 
                   currentGross = grossSalary + tunjanganPajak;
                }
                grossSalary = currentGross;
                rate = getTerRate(grossSalary, terCat);
            }
            
            const pph = grossSalary * rate;
            res = { 
                title: `PPh 21 Bulanan ${isGrossUp?'(Gross Up)':''}`, 
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
        else if (subMode === 2) { // Pegawai Tidak Tetap Bulanan
            let grossSalary = num(gajiPokok);
            let tunjanganPajak = 0;
            let rate = getTerRate(grossSalary, terCat);
            
            if (isGrossUp) {
                tunjanganPajak = (grossSalary * rate) / (1 - rate);
                grossSalary += tunjanganPajak;
                rate = getTerRate(grossSalary, terCat);
            }

            const pph = grossSalary * rate;
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
        else if (subMode === 3) { // Pensiunan Bulanan
            const grossSalary = num(gajiPokok) + num(totalTunjanganManual);
            const rate = getTerRate(grossSalary, terCat);
            const pph = grossSalary * rate;
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

        else if (subMode === 4) { // Harian Freelance
            const dailyGross = num(penghasilanBruto);
            let tax = 0; let rateDisplay = "";
            if (dailyGross <= 2500000) {
                if (dailyGross <= 450000) { tax = 0; rateDisplay = "TER Harian 0%"; }
                else { tax = dailyGross * 0.005; rateDisplay = "TER Harian 0.5%"; }
            } else {
                const dpp = dailyGross * 0.5; 
                tax = calculatePasal17(dpp); 
                rateDisplay = "Pasal 17 x 50% Ph. Bruto";
            }
            res = { title: 'PPh 21 Harian', gross: dailyGross, terInfo: rateDisplay, pph: tax, net: dailyGross - tax, desc: dailyGross > 2500000 ? "Perhitungan menggunakan tarif progresif Pasal 17." : "Perhitungan menggunakan TER Harian." };
        }
        else if (subMode === 5) { // Bukan Pegawai
            const gross = num(penghasilanBruto);
            const pkp = gross * 0.5; 
            const tax = calculatePasal17(pkp);
            res = { title: 'PPh 21 Bukan Pegawai', gross: gross, terInfo: 'Tarif Pasal 17 x 50% Ph. Bruto', pph: tax, net: gross - tax, desc: "Perhitungan menggunakan tarif progresif Pasal 17." };
        }

        else if (subMode === 6 || subMode === 7) { 
            const isPegawai = subMode === 6;
            let grossYear = num(penghasilanBrutoSetahun);
            
            const maxBiaya = isPegawai ? 6000000 : 2400000;
            const otherDeductions = (isPegawai ? num(iuranPensiun) : 0) + num(zakat);
            
            let tunjanganPajak = 0;
            if (isGrossUp) {
                let basePKP = Math.max(0, grossYear - Math.min(grossYear*0.05, maxBiaya) - otherDeductions - ptkpVal);
                let baseTax = calculatePasal17(basePKP);
                tunjanganPajak = baseTax; 
                
                let gross2 = grossYear + tunjanganPajak;
                let biaya2 = Math.min(gross2*0.05, maxBiaya);
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
                desc: "Perhitungan ulang setahun menggunakan tarif Pasal 17 dikurangi pajak yang sudah dibayar."
            };
        }
        setResult(res);
    };

    return (
        <div className="min-h-screen bg-[#0f0e17] text-white"> {/* Added Wrapper with BG */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4">
                            <span>KANTORKU HRIS TOOLS V2.2</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                            Kalkulator <span className="text-[#FACC15]">PPh 21</span> <br/>
                            untuk HR & Karyawan
                        </h1>
                        <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
                            Hitung pajak penghasilan karyawan secara otomatis sesuai regulasi terbaru PP 58/2023 & PMK 168/2023.
                        </p>
                    </div>

                    {/* INTEGRATION CARD - Updated Design */}
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

                        {/* 1. JENIS PERHITUNGAN */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">Jenis Perhitungan</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <SelectionButton label="Bulanan (TER)" active={modeCategory === 1} onClick={() => handleCategoryChange(1)} />
                                <SelectionButton label="Harian / Freelance" active={modeCategory === 4} onClick={() => handleCategoryChange(4)} />
                                <SelectionButton label="Masa Pajak Terakhir" active={modeCategory === 6} onClick={() => handleCategoryChange(6)} />
                            </div>
                        </div>

                        {/* 2. KODE OBJEK PAJAK */}
                        <div className="mb-8 animate-fade-in">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">Kode Objek Pajak</label>
                            <div className="space-y-2">
                                {modeCategory === 1 && (
                                    <>
                                        <RadioOption label="21-100-01 — Pegawai Tetap" active={subMode === 1} onClick={() => setSubMode(1)} />
                                        <RadioOption label="21-100-02 — Penerima Pensiun Berkala" active={subMode === 3} onClick={() => setSubMode(3)} />
                                        <RadioOption label="21-100-03 — Pegawai Tidak Tetap (Bulanan)" active={subMode === 2} onClick={() => setSubMode(2)} />
                                    </>
                                )}
                                {modeCategory === 4 && (
                                    <>
                                        <RadioOption label="21-100-03 — Pegawai Tidak Tetap (Harian)" active={subMode === 4} onClick={() => setSubMode(4)} />
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

                        {/* STATUS KAWIN & TANGGUNGAN (Hidden for Mode 4) */}
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
                                    {[0,1,2,3].map(t => (
                                        <button key={t} onClick={() => setTanggungan(t)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tanggungan === t ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>
                                            {t === 3 ? '>= 3' : t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* INFO BOX PTKP */}
                            <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-purple-100 flex items-center gap-4 animate-fade-in">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Status PTKP: {`${statusKawin}/${tanggungan}`}</p>
                                    <p className="text-sm text-gray-500">Penghasilan Tidak Kena Pajak: <span className="font-semibold text-gray-700">{formatRupiah(PTKP_LIST[`${statusKawin}/${tanggungan}`] || 0)}</span></p>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* INPUT FIELDS */}
                        <div className="space-y-4">
                            {/* BULANAN PEGAWAI TETAP & TIDAK TETAP */}
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
                                                <ChevronRightIcon rotate={showTunjangan} />
                                                <span className="ml-2">{showTunjangan ? 'Sembunyikan Komponen Lain' : 'Tambah Tunjangan / Lembur'}</span>
                                            </button>
                                            {showTunjangan && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100 animate-fade-in">
                                                    <FormattedInput label="Tunjangan Transport" value={tunjanganTransport} onChange={setTunjanganTransport} />
                                                    <FormattedInput label="Uang Lembur" value={tunjanganLembur} onChange={setTunjanganLembur} />
                                                    <FormattedInput label="Tunjangan Makan" value={tunjanganMakan} onChange={setTunjanganMakan} />
                                                    <FormattedInput label="Pendapatan Lainnya" value={tunjanganLain} onChange={setTunjanganLain} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {/* BULANAN PENSIUN */}
                            {subMode === 3 && (
                                <>
                                    <FormattedInput label="Uang Pensiun Pokok" value={gajiPokok} onChange={setGajiPokok} />
                                    <FormattedInput label="Total Tunjangan (jika ada)" value={totalTunjanganManual} onChange={setTotalTunjanganManual} />
                                </>
                            )}
                            
                            {/* HARIAN / FREELANCE */}
                            {(subMode === 4 || subMode === 5) && (
                                <>
                                        <FormattedInput label="Penghasilan Bruto / Harian" value={penghasilanBruto} onChange={setPenghasilanBruto} />
                                        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mt-2 border border-blue-100">
                                        ℹ️ Perhitungan ini menggunakan tarif progresif Pasal 17 atau TER Harian sesuai regulasi.
                                        </div>
                                </>
                            )}
                            
                            {/* TAHUNAN */}
                            {(subMode === 6 || subMode === 7) && (
                                <>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-800">Skema Perhitungan Gaji</label>
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 px-1">
                                            <button onClick={() => setIsGrossUp(false)} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${!isGrossUp ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Gross</button>
                                            <button onClick={() => setIsGrossUp(true)} className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${isGrossUp ? 'bg-purple-600 shadow text-white' : 'text-gray-500'}`}>Gross Up</button>
                                        </div>
                                    </div>

                                    <FormattedInput label="Penghasilan Bruto Setahun" value={penghasilanBrutoSetahun} onChange={setPenghasilanBrutoSetahun} />
                                    
                                    {/* Auto Generated Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormattedInput 
                                            label={subMode === 6 ? "Biaya Jabatan" : "Biaya Pensiun"} 
                                            value={Math.min((parseFloat(penghasilanBrutoSetahun)||0) * 0.05, subMode===6 ? 6000000 : 2400000)} 
                                            disabled={true} 
                                            subtext={subMode === 6 ? "5% dari Bruto, Max 6jt/thn" : "5% dari Bruto, Max 2.4jt/thn"}
                                            onChange={()=>{}}
                                        />
                                        {subMode === 6 && <FormattedInput label="Iuran Pensiun Setahun" value={iuranPensiun} onChange={setIuranPensiun} subtext="Jika ada, misal JHT/JP" />}
                                    </div>

                                    <FormattedInput label="Zakat/Sumbangan Keagamaan Wajib" value={zakat} onChange={setZakat} />
                                    <FormattedInput label="PPh 21 Sudah Dipotong (Jan-Nov)" value={pphJanNov} onChange={setPphJanNov} />
                                </>
                            )}
                        </div>

                        <button onClick={calculate} className="w-full mt-8 bg-[#FACC15] hover:bg-[#EAB308] text-[#0f0e17] text-lg font-bold py-4 rounded-xl shadow-xl shadow-yellow-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                            <div className="p-1 bg-black/10 rounded-full"><CalculatorIcon /></div>
                            Hitung PPh 21
                        </button>
                    </div>

                    {/* OUTPUT CARD */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden sticky top-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-bold text-white mb-1">Ringkasan Perhitungan</h3>
                            <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">
                                Mode: {result ? result.title : 'Menunggu Input...'}
                            </p>
                            {result ? (
                                <div className="space-y-2 animate-fade-in">
                                    {/* BRUTO */}
                                    <ResultRow label={result.isPensiun ? "Manfaat Pensiun Bruto" : "Gaji Bruto"} value={formatRupiah(result.gross)} />
                                    
                                    {/* TER INFO */}
                                    {result.terCategory && <ResultRow label="Kategori TER & Tarif" value={`Kategori ${result.terCategory} • ${(result.terRate * 100).toFixed(2)}%`} />}
                                    {result.terInfo && <ResultRow label="Tarif / Kategori" value={result.terInfo} />}

                                    {/* ANNUAL DETAILS */}
                                    {result.isAnnual && (
                                        <>
                                            <ResultRow label={result.isPensiun ? "Manfaat Pensiun Neto Setahun" : "Penghasilan Neto Setahun"} value={formatRupiah(result.net)} />
                                            <ResultRow label="Status PTKP" value={`${result.ptkpCode} (${formatRupiah(result.ptkpNominal)})`} />
                                            <ResultRow label="PKP Setahun" value={formatRupiah(result.pkp)} />
                                            <ResultRow label="PPh 21 Terutang Setahun" value={formatRupiah(result.pphYear)} highlight={true} />
                                        </>
                                    )}

                                    {/* GROSS UP INFO */}
                                    {result.isGrossUp && <ResultRow label="Tunjangan Pajak (Gross Up)" value={formatRupiah(result.tunjanganPajak)} highlight={true} />}

                                    {/* MAIN HIGHLIGHT */}
                                    <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mb-3 mt-2 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                        <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">{result.isAnnual ? 'PPh 21 Kurang Bayar (Masa Terakhir)' : 'PPh 21 Per Bulan'}</p>
                                        <p className="text-2xl md:text-3xl font-bold text-[#FACC15]">{result.isAnnual ? formatRupiah(result.pphDec) : formatRupiah(result.pph)}</p>
                                    </div>
                                    
                                    {/* NET PAY */}
                                    {!result.isAnnual && (
                                            <ResultRow label={result.isPensiun ? "Manfaat Pensiun Bersih (Netto)" : "Take Home Pay"} value={formatRupiah(result.net)} />
                                    )}

                                    {/* FOOTER INFO */}
                                    <div className="mt-6 flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                                        <BuildingIcon />
                                        <div>
                                            <p className="text-[10px] text-purple-300 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis setiap bulan?</p>
                                            <p className="text-[10px] text-purple-300 leading-relaxed">
                                                Gunakan <strong>KantorKu HRIS</strong> untuk integrasi payroll, absensi, dan pajak yang akurat.
                                            </p>
                                            {result.desc && <p className="text-[9px] text-purple-400 mt-2 pt-2 border-t border-purple-500/30 italic">{result.desc}</p>}
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