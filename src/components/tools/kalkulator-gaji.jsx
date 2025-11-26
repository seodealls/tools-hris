import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * ------------------------------------------------------------------
 * UTILITIES & DATA CONSTANTS
 * ------------------------------------------------------------------
 */

const FORMAT_CURRENCY = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const FORMAT_NUMBER_INPUT = (value) => {
  if (value === 0 || value === '') return '';
  return new Intl.NumberFormat('id-ID').format(value);
};

const CAP_BPJS_KESEHATAN = 12000000;
const CAP_BPJS_JP = 10547400;

const JKK_RATES = [
  { label: 'Sangat Rendah', value: 0.10 },
  { label: 'Rendah', value: 0.40 },
  { label: 'Sedang', value: 0.75 },
  { label: 'Tinggi', value: 1.13 },
  { label: 'Sangat Tinggi', value: 1.60 },
];

const PTKP_VALUES = { 
  'TK/0': 54000000, 'TK/1': 58500000, 'K/0': 58500000, 
  'TK/2': 63000000, 'TK/3': 67500000, 'K/1': 63000000, 'K/2': 67500000, 
  'K/3': 72000000 
};

// --- TER LAYERS (PP 58/2023) ---
const TER_A_LAYERS = [{max:5400000,rate:0},{max:5650000,rate:0.0025},{max:5950000,rate:0.005},{max:6300000,rate:0.0075},{max:6750000,rate:0.01},{max:7500000,rate:0.0125},{max:8550000,rate:0.015},{max:9650000,rate:0.0175},{max:10050000,rate:0.02},{max:10350000,rate:0.0225},{max:10700000,rate:0.025},{max:11050000,rate:0.03},{max:11600000,rate:0.035},{max:12500000,rate:0.04},{max:13750000,rate:0.05},{max:15100000,rate:0.06},{max:16950000,rate:0.07},{max:19750000,rate:0.08},{max:24150000,rate:0.09},{max:26450000,rate:0.1},{max:28000000,rate:0.11},{max:30050000,rate:0.12},{max:32400000,rate:0.13},{max:35400000,rate:0.14},{max:39100000,rate:0.15},{max:43850000,rate:0.16},{max:47800000,rate:0.17},{max:51400000,rate:0.18},{max:56300000,rate:0.19},{max:62200000,rate:0.2},{max:68600000,rate:0.21},{max:77500000,rate:0.22},{max:89000000,rate:0.23},{max:103000000,rate:0.24},{max:125000000,rate:0.25},{max:157000000,rate:0.26},{max:206000000,rate:0.27},{max:337000000,rate:0.28},{max:454000000,rate:0.29},{max:550000000,rate:0.3},{max:695000000,rate:0.31},{max:910000000,rate:0.32},{max:1400000000,rate:0.33},{max:Infinity,rate:0.34}];
const TER_B_LAYERS = [{max:6200000,rate:0},{max:6500000,rate:0.0025},{max:6850000,rate:0.005},{max:7300000,rate:0.0075},{max:9200000,rate:0.01},{max:10750000,rate:0.015},{max:11250000,rate:0.02},{max:11600000,rate:0.025},{max:12600000,rate:0.03},{max:13600000,rate:0.04},{max:14950000,rate:0.05},{max:16400000,rate:0.06},{max:18450000,rate:0.07},{max:21850000,rate:0.08},{max:26000000,rate:0.09},{max:27700000,rate:0.1},{max:29350000,rate:0.11},{max:31450000,rate:0.12},{max:33950000,rate:0.13},{max:37100000,rate:0.14},{max:41100000,rate:0.15},{max:45800000,rate:0.16},{max:49500000,rate:0.17},{max:53800000,rate:0.18},{max:58500000,rate:0.19},{max:64000000,rate:0.2},{max:71000000,rate:0.21},{max:80000000,rate:0.22},{max:93000000,rate:0.23},{max:109000000,rate:0.24},{max:129000000,rate:0.25},{max:163000000,rate:0.26},{max:211000000,rate:0.27},{max:374000000,rate:0.28},{max:459000000,rate:0.29},{max:555000000,rate:0.3},{max:704000000,rate:0.31},{max:957000000,rate:0.32},{max:1405000000,rate:0.33},{max:Infinity,rate:0.34}];
const TER_C_LAYERS = [{max:6600000,rate:0},{max:6950000,rate:0.0025},{max:7350000,rate:0.005},{max:7800000,rate:0.0075},{max:8850000,rate:0.01},{max:9800000,rate:0.0125},{max:10950000,rate:0.015},{max:11200000,rate:0.0175},{max:12050000,rate:0.02},{max:12950000,rate:0.03},{max:14150000,rate:0.04},{max:15550000,rate:0.05},{max:17050000,rate:0.06},{max:19500000,rate:0.07},{max:22700000,rate:0.08},{max:26600000,rate:0.09},{max:28100000,rate:0.1},{max:30100000,rate:0.11},{max:32600000,rate:0.12},{max:35400000,rate:0.13},{max:38900000,rate:0.14},{max:43000000,rate:0.15},{max:47400000,rate:0.16},{max:51200000,rate:0.17},{max:55800000,rate:0.18},{max:60400000,rate:0.19},{max:66700000,rate:0.2},{max:74500000,rate:0.21},{max:83200000,rate:0.22},{max:95600000,rate:0.23},{max:110000000,rate:0.24},{max:134000000,rate:0.25},{max:169000000,rate:0.26},{max:221000000,rate:0.27},{max:390000000,rate:0.28},{max:463000000,rate:0.29},{max:561000000,rate:0.3},{max:709000000,rate:0.31},{max:965000000,rate:0.32},{max:1419000000,rate:0.33},{max:Infinity,rate:0.34}];

const GET_TER_RATE = (bruto, category) => {
    let layers = [];
    if (category === 'A') layers = TER_A_LAYERS;
    else if (category === 'B') layers = TER_B_LAYERS;
    else if (category === 'C') layers = TER_C_LAYERS;
    else return 0;
    const match = layers.find(layer => bruto <= layer.max);
    return match ? match.rate : 0;
};

const DETERMINE_TER_CATEGORY = (ptkp) => {
    const map = { 'TK/0':'A', 'TK/1':'A', 'K/0':'A', 'TK/2':'B', 'TK/3':'B', 'K/1':'B', 'K/2':'B', 'K/3':'C' };
    return map[ptkp] || 'A';
};

/**
 * ------------------------------------------------------------------
 * ICONS
 * ------------------------------------------------------------------
 */
const Icons = {
    Calculator: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
    Building: () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
    ChevronDown: ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>,
    Check: ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    Info: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
};

/**
 * ------------------------------------------------------------------
 * SUB-COMPONENTS
 * ------------------------------------------------------------------
 */

const TunjanganInput = ({ label, value, onChange, isFixed, onToggleFixed }) => {
    const [displayValue, setDisplayValue] = useState(FORMAT_NUMBER_INPUT(value));
    useEffect(() => { setDisplayValue(FORMAT_NUMBER_INPUT(value)); }, [value]);
    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/\./g, ''); 
        if (!/^\d*$/.test(rawValue)) return; 
        const numValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
        setDisplayValue(FORMAT_NUMBER_INPUT(numValue));
        onChange(numValue);
    };
    return (
        <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-800">{label}</label>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleFixed(!isFixed)}>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isFixed ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                        {isFixed ? 'Tetap' : 'Tdk Tetap'}
                    </span>
                    <div className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${isFixed ? 'bg-purple-600' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform ${isFixed ? 'translate-x-4' : ''}`}></div>
                    </div>
                </div>
            </div>
            <div className="relative group">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600 pointer-events-none">Rp</span>
                <input type="text" inputMode="numeric" className="w-full pl-10 pr-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500" placeholder="0" value={displayValue} onChange={handleChange} />
            </div>
        </div>
    );
};

const FormattedInput = ({ label, value, onChange, placeholder, disabled, subtext, className }) => {
    const [displayValue, setDisplayValue] = useState(FORMAT_NUMBER_INPUT(value));
    useEffect(() => { setDisplayValue(FORMAT_NUMBER_INPUT(value)); }, [value]);
    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/\./g, ''); 
        if (!/^\d*$/.test(rawValue)) return; 
        const numValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
        setDisplayValue(FORMAT_NUMBER_INPUT(numValue));
        onChange(numValue);
    };
    return (
        <div className={`mb-5 ${className}`}>
            {label && <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>}
            <div className={`relative group ${disabled ? 'opacity-70' : ''}`}>
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold group-focus-within:text-purple-600 pointer-events-none">Rp</span>
                <input type="text" inputMode="numeric" disabled={disabled} className={`w-full pl-10 pr-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none ${disabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : 'bg-gray-50 border-transparent focus:bg-white focus:border-purple-500'}`} placeholder={placeholder || "0"} value={displayValue} onChange={handleChange} />
            </div>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
    );
};

const RegularInput = ({ label, value, onChange, type="text", subtext, placeholder }) => (
    <div className="mb-5">
        {label && <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>}
        <input type={type} className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500" placeholder={placeholder} value={value} onChange={onChange} />
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

const SelectInput = ({ label, value, onChange, options, subtext }) => (
    <div className="mb-5">
        {label && <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>}
        <div className="relative">
            <select value={value} onChange={onChange} className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 appearance-none">
                {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><Icons.ChevronDown className="w-4 h-4" /></div>
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

const SelectionButton = ({ label, active, onClick, icon: Icon }) => (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs md:text-sm font-bold transition-all border border-transparent shadow-sm w-full ${active ? 'bg-[#6d4afe] text-white shadow-purple-500/30 transform scale-[1.02]' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}>
        {Icon && <Icon />} {label}
    </button>
);

const ToggleSwitch = ({ label, checked, onChange, colorClass = 'bg-green-500' }) => (
    <div className="flex items-center justify-between py-2 cursor-pointer group" onClick={() => onChange(!checked)}>
        <label className="text-sm font-semibold text-gray-800 cursor-pointer group-hover:text-purple-700 transition-colors flex items-center gap-2">{label}</label>
        <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${checked ? colorClass : 'bg-gray-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    </div>
);

const CheckboxTile = ({ label, checked, onChange }) => (
    <div onClick={() => onChange(!checked)} className={`cursor-pointer border rounded-xl px-3 py-2.5 text-xs font-bold flex items-center justify-between transition-all ${checked ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
        {label} {checked && <Icons.Check className="text-purple-600"/>}
    </div>
);

const ResultRow = ({ label, value, highlight = false, isNegative = false, subtext, detailValue }) => (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-4 mb-3 ${highlight ? 'border-[#FACC15]/30 bg-[#FACC15]/5' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">{label}</p>
                {subtext && <p className="text-xs text-purple-300/70">{subtext}</p>}
            </div>
            <div className="text-right">
                <p className={`text-lg font-bold ${isNegative ? 'text-red-400' : highlight ? 'text-[#FACC15]' : 'text-white'}`}>
                    {isNegative ? '-' : ''} {FORMAT_CURRENCY(value)}
                </p>
                {detailValue && <p className="text-xs text-purple-200 mt-1">{detailValue}</p>}
            </div>
        </div>
    </div>
);

/**
 * ------------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------------
 */
export default function KalkulatorGaji() {
    const [activeTab, setActiveTab] = useState('fulltime');
    const resultsRef = useRef(null);
    
    const [kawinStatus, setKawinStatus] = useState('TK');
    const [tanggungan, setTanggungan] = useState(0);
    
    const [salaryData, setSalaryData] = useState({
        basicSalary: 0, 
        // Tunjangan (Val, IsFixed)
        tunjTransport: { val: 0, fixed: false },
        tunjMakan: { val: 0, fixed: false },
        tunjLembur: { val: 0, fixed: false }, 
        tunjBonus: { val: 0, fixed: false },
        tunjTetapLain: 0,
        tunjTidakTetapLain: 0,

        hourlyRate: 0, hoursPerDay: 8, daysPerMonth: 20,
        internStipend: 0, internMethod: 'prorata', attendanceAffectsStipend: false, internTotalDays: 20, internPresentDays: 20, internAbsentDays: 0,
        deductionOther: 0,
        unpaidLeave: false, unpaidLeaveDays: 0, unpaidLeaveTotalWorkDays: 25,
        useBpjsKesehatan: false, useBpjsKetenagakerjaan: false,
        bpjsProgram: { jht: true, jkk: true, jkm: true, jp: true, jkp: true },
        jkkRiskLevel: 0.10, 
        taxMethod: 'gross', 
    });
    
    const [showAllowances, setShowAllowances] = useState(false);
    const ptkpStatusCombined = `${kawinStatus}/${tanggungan}`;

    // Reset Logic on Tab Switch
    useEffect(() => {
        const defaultBpjsProgram = activeTab === 'intern'
            ? { jht: false, jp: false, jkp: false, jkk: true, jkm: true }
            : { jht: true, jkk: true, jkm: true, jp: true, jkp: true };

        setSalaryData(prev => ({
            ...prev,
            basicSalary: 0,
            tunjTransport: { val: 0, fixed: false },
            tunjMakan: { val: 0, fixed: false },
            tunjLembur: { val: 0, fixed: false },
            tunjBonus: { val: 0, fixed: false },
            tunjTetapLain: 0,
            tunjTidakTetapLain: 0,
            hourlyRate: 0,
            hoursPerDay: 8,
            daysPerMonth: 20,
            internStipend: 0,
            internPresentDays: 20,
            internAbsentDays: 0,
            deductionOther: 0,
            useBpjsKesehatan: false,
            useBpjsKetenagakerjaan: false,
            unpaidLeave: false,
            unpaidLeaveDays: 0,
            bpjsProgram: defaultBpjsProgram,
            jkkRiskLevel: 0.10
        }));
        setShowAllowances(false);
    }, [activeTab]);

    const updateData = (key, value) => setSalaryData(prev => ({ ...prev, [key]: value }));
    const updateTunjanganVal = (key, val) => setSalaryData(prev => ({...prev, [key]: {...prev[key], val: val}}));
    const updateTunjanganFixed = (key, fixed) => setSalaryData(prev => ({...prev, [key]: {...prev[key], fixed: fixed}}));
    const updateBpjsProgram = (key, value) => setSalaryData(prev => ({ ...prev, bpjsProgram: { ...prev.bpjsProgram, [key]: value } }));

    // Calculations
    const results = useMemo(() => {
        let grossIncome = 0; 
        let fixedWage = 0; // For BPJS Basis

        // 1. Basic & Fixed Calculation
        if (activeTab === 'fulltime') {
            grossIncome = salaryData.basicSalary; 
            fixedWage = salaryData.basicSalary;
            if (salaryData.unpaidLeave && salaryData.unpaidLeaveDays > 0) {
                const divisor = salaryData.unpaidLeaveTotalWorkDays || 25;
                const cut = (salaryData.basicSalary / divisor) * salaryData.unpaidLeaveDays;
                grossIncome -= cut;
                fixedWage -= cut; 
            }
        } else if (activeTab === 'parttime') {
            grossIncome = salaryData.hourlyRate * salaryData.hoursPerDay * salaryData.daysPerMonth;
            fixedWage = grossIncome;
        } else if (activeTab === 'intern') {
            let stipend = salaryData.internStipend;
            if (salaryData.attendanceAffectsStipend) {
                const dailyRate = salaryData.internStipend / (salaryData.internTotalDays || 20);
                if (salaryData.internMethod === 'prorata') stipend = dailyRate * salaryData.internPresentDays;
                else stipend = salaryData.internStipend - (dailyRate * salaryData.internAbsentDays);
            }
            grossIncome = stipend; fixedWage = stipend;
        }

        // 2. Process Allowances
        const tTransport = salaryData.tunjTransport.val;
        const tMakan = salaryData.tunjMakan.val;
        const tLembur = salaryData.tunjLembur.val;
        const tBonus = salaryData.tunjBonus.val;
        const tTetapLain = salaryData.tunjTetapLain;
        const tTidakTetapLain = salaryData.tunjTidakTetapLain;

        const totalAllowances = tTransport + tMakan + tLembur + tBonus + tTetapLain + tTidakTetapLain;
        grossIncome += totalAllowances;

        // Add Fixed Allowances to Fixed Wage (BPJS Basis)
        if(salaryData.tunjTransport.fixed) fixedWage += tTransport;
        if(salaryData.tunjMakan.fixed) fixedWage += tMakan;
        
        // Lembur & Bonus are assumed Variable (Not Fixed) for BPJS
        
        fixedWage += tTetapLain;

        // BPJS Basis Logic
        const bpjsKesBase = Math.min(fixedWage, CAP_BPJS_KESEHATAN);
        const bpjsJpBase = Math.min(fixedWage, CAP_BPJS_JP);
        const bpjsOtherBase = fixedWage;

        // BPJS Calc
        let bpjsKes_Comp = 0, bpjsKes_Emp = 0;
        let bpjsTk_Jht_Comp = 0, bpjsTk_Jht_Emp = 0;
        let bpjsTk_Jp_Comp = 0, bpjsTk_Jp_Emp = 0;
        let bpjsTk_Jkm_Comp = 0, bpjsTk_Jkk_Comp = 0;

        if (salaryData.useBpjsKesehatan) {
            bpjsKes_Comp = bpjsKesBase * 0.04;
            if (activeTab !== 'intern') bpjsKes_Emp = bpjsKesBase * 0.01;
        }

        if (salaryData.useBpjsKetenagakerjaan) {
            if (salaryData.bpjsProgram.jkk) bpjsTk_Jkk_Comp = bpjsOtherBase * (salaryData.jkkRiskLevel / 100);
            if (salaryData.bpjsProgram.jkm) bpjsTk_Jkm_Comp = bpjsOtherBase * 0.003;
            if (activeTab !== 'intern') {
                if (salaryData.bpjsProgram.jht) { bpjsTk_Jht_Comp = bpjsOtherBase * 0.037; bpjsTk_Jht_Emp = bpjsOtherBase * 0.02; }
                if (salaryData.bpjsProgram.jp) { bpjsTk_Jp_Comp = bpjsJpBase * 0.02; bpjsTk_Jp_Emp = bpjsJpBase * 0.01; }
            }
        }

        // Tax
        let pph21 = 0; let grossForTax = grossIncome;
        let terCategory = 'A'; let terRate = 0;
        let totalBpjsCompany = 0;

        if (activeTab !== 'intern') { 
            totalBpjsCompany = bpjsKes_Comp + bpjsTk_Jkk_Comp + bpjsTk_Jkm_Comp;
            grossForTax += totalBpjsCompany; 
            
            terCategory = DETERMINE_TER_CATEGORY(ptkpStatusCombined);
            terRate = GET_TER_RATE(grossForTax, terCategory);
            pph21 = Math.floor(grossForTax * terRate);
        }

        let taxDeduction = pph21;
        if (salaryData.taxMethod === 'net') taxDeduction = 0;

        const totalDeductions = bpjsKes_Emp + bpjsTk_Jht_Emp + bpjsTk_Jp_Emp + salaryData.deductionOther + taxDeduction;
        const takeHomePay = grossIncome - totalDeductions;
        const companyCost = grossIncome + bpjsKes_Comp + bpjsTk_Jkk_Comp + bpjsTk_Jkm_Comp + bpjsTk_Jht_Comp + bpjsTk_Jp_Comp + (salaryData.taxMethod === 'net' ? pph21 : 0);

        return { grossIncome, grossForTax, totalBpjsCompany, terCategory, terRate, pph21, taxDeduction, bpjs: { kes_comp: bpjsKes_Comp, kes_emp: bpjsKes_Emp, tk_jht_comp: bpjsTk_Jht_Comp, tk_jht_emp: bpjsTk_Jht_Emp, tk_jp_comp: bpjsTk_Jp_Comp, tk_jp_emp: bpjsTk_Jp_Emp, tk_jkk_comp: bpjsTk_Jkk_Comp, tk_jkm_comp: bpjsTk_Jkm_Comp, }, totalDeductions, takeHomePay, companyCost };
    }, [salaryData, activeTab, kawinStatus, tanggungan, ptkpStatusCombined]);

    return (
        <div className="w-full min-h-screen bg-[#0f0e17]">
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-purple-200 mb-4"><span>KANTORKU HRIS TOOLS</span></div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">Kalkulator <span className="text-[#FACC15]">Gaji, Pajak, dan BPJS Karyawan</span></h1>
                        <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">Hitung estimasi gaji bersih, pajak (TER), dan BPJS untuk karyawan Penuh Waktu, Paruh Waktu, dan Magang.</p>
                    </div>
                    <div className="hidden md:block bg-[#1e1b4b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-xs">
                        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-3">Terintegrasi Dengan</div>
                        <div className="flex items-center gap-3 mb-3"><Icons.Building /><span className="text-2xl font-bold text-white">KantorKu HRIS</span></div>
                        <p className="text-sm text-gray-400 leading-relaxed">Otomatisasi hitung payroll, BPJS, dan PPh 21 langsung dari sistem HR Anda.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <SelectionButton label="Full Time" icon={Icons.Users} active={activeTab === 'fulltime'} onClick={() => setActiveTab('fulltime')} />
                            <SelectionButton label="Part Time" icon={Icons.Clock} active={activeTab === 'parttime'} onClick={() => setActiveTab('parttime')} />
                            <SelectionButton label="Magang" icon={Icons.Briefcase} active={activeTab === 'intern'} onClick={() => setActiveTab('intern')} />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><span className="text-sm font-bold">1</span></div>Informasi Penghasilan</h2>
                        <div className="pl-10 mb-8 animate-fade-in">
                            {activeTab === 'fulltime' && <FormattedInput label="Gaji Pokok Bulanan" value={salaryData.basicSalary} onChange={(v) => updateData('basicSalary', v)} />}
                            {activeTab === 'parttime' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <FormattedInput className="col-span-2" label="Upah Per Jam" value={salaryData.hourlyRate} onChange={(v) => updateData('hourlyRate', v)} />
                                    <RegularInput label="Jam/Hari" type="number" value={salaryData.hoursPerDay} onChange={(e) => updateData('hoursPerDay', parseFloat(e.target.value))} />
                                    <RegularInput label="Hari/Bulan" type="number" value={salaryData.daysPerMonth} onChange={(e) => updateData('daysPerMonth', parseFloat(e.target.value))} />
                                </div>
                            )}
                            {activeTab === 'intern' && (
                                <div className="space-y-4">
                                    <FormattedInput label="Uang Saku Bulanan" value={salaryData.internStipend} onChange={(v) => updateData('internStipend', v)} />
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <ToggleSwitch label="Kehadiran memengaruhi uang saku?" checked={salaryData.attendanceAffectsStipend} onChange={(v) => updateData('attendanceAffectsStipend', v)} colorClass="bg-purple-600" />
                                        {salaryData.attendanceAffectsStipend && (
                                            <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Metode Hitung</label>
                                                <div className="flex gap-4 mb-4">
                                                    <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="im" checked={salaryData.internMethod === 'prorata'} onChange={() => updateData('internMethod', 'prorata')} className="accent-purple-600"/> Prorata</label>
                                                    <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="im" checked={salaryData.internMethod === 'deduction'} onChange={() => updateData('internMethod', 'deduction')} className="accent-purple-600"/> Potong Absen</label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <RegularInput label="Total Hari Kerja" type="number" value={salaryData.internTotalDays} onChange={(e) => updateData('internTotalDays', parseFloat(e.target.value))} />
                                                    {salaryData.internMethod === 'prorata' ? (<RegularInput label="Hari Hadir" type="number" value={salaryData.internPresentDays} onChange={(e) => updateData('internPresentDays', parseFloat(e.target.value))} />) : (<RegularInput label="Hari Absen" type="number" value={salaryData.internAbsentDays} onChange={(e) => updateData('internAbsentDays', parseFloat(e.target.value))} />)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                <button onClick={() => setShowAllowances(!showAllowances)} className="flex items-center text-sm font-bold text-purple-600 hover:text-purple-800 mb-2 transition-colors">
                                    <Icons.ChevronDown className={`mr-2 transform transition-transform ${showAllowances ? 'rotate-180' : ''}`} />
                                    {showAllowances ? 'Sembunyikan Tunjangan' : (activeTab === 'intern' ? 'Tambah Tunjangan / Bonus' : 'Tambah Tunjangan / Lembur / Bonus')}
                                </button>
                                {showAllowances && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 bg-purple-50/50 p-4 rounded-xl border border-purple-100 animate-fade-in mt-2">
                                        <TunjanganInput label="Transport" value={salaryData.tunjTransport.val} isFixed={salaryData.tunjTransport.fixed} onChange={(v) => updateTunjanganVal('tunjTransport', v)} onToggleFixed={(f) => updateTunjanganFixed('tunjTransport', f)} />
                                        <TunjanganInput label="Makan" value={salaryData.tunjMakan.val} isFixed={salaryData.tunjMakan.fixed} onChange={(v) => updateTunjanganVal('tunjMakan', v)} onToggleFixed={(f) => updateTunjanganFixed('tunjMakan', f)} />
                                        
                                        {activeTab !== 'intern' && <FormattedInput className="mb-5" label="Lembur" value={salaryData.tunjLembur.val} onChange={(v) => updateTunjanganVal('tunjLembur', v)} />}
                                        <FormattedInput className="mb-5" label={activeTab === 'intern' ? "Bonus" : "Bonus/THR"} value={salaryData.tunjBonus.val} onChange={(v) => updateTunjanganVal('tunjBonus', v)} />
                                        
                                        <FormattedInput label="Tunjangan Tetap Lainnya" value={salaryData.tunjTetapLain} onChange={(v) => updateData('tunjTetapLain', v)} />
                                        <FormattedInput label="Tunjangan Tidak Tetap Lainnya" value={salaryData.tunjTidakTetapLain} onChange={(v) => updateData('tunjTidakTetapLain', v)} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><span className="text-sm font-bold">2</span></div>Konfigurasi BPJS & Pajak</h2>
                        <div className="pl-10 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><ToggleSwitch label="BPJS Kesehatan" checked={salaryData.useBpjsKesehatan} onChange={(v) => updateData('useBpjsKesehatan', v)} /></div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <ToggleSwitch label="BPJS Ketenagakerjaan" checked={salaryData.useBpjsKetenagakerjaan} onChange={(v) => updateData('useBpjsKetenagakerjaan', v)} />
                                {salaryData.useBpjsKetenagakerjaan && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Program Terpilih</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                            {activeTab !== 'intern' && (<><CheckboxTile label="JHT" checked={salaryData.bpjsProgram.jht} onChange={(v) => updateBpjsProgram('jht', v)} /><CheckboxTile label="JP" checked={salaryData.bpjsProgram.jp} onChange={(v) => updateBpjsProgram('jp', v)} /><CheckboxTile label="JKP" checked={salaryData.bpjsProgram.jkp} onChange={(v) => updateBpjsProgram('jkp', v)} /></>)}
                                            <CheckboxTile label="JKK" checked={salaryData.bpjsProgram.jkk} onChange={(v) => updateBpjsProgram('jkk', v)} /><CheckboxTile label="JKM" checked={salaryData.bpjsProgram.jkm} onChange={(v) => updateBpjsProgram('jkm', v)} />
                                        </div>
                                        {salaryData.bpjsProgram.jkk && <SelectInput label="Risiko Kecelakaan Kerja (JKK)" value={salaryData.jkkRiskLevel} onChange={(e) => updateData('jkkRiskLevel', parseFloat(e.target.value))} options={JKK_RATES.map(r => ({label: `${r.label} (${r.value}%)`, value: r.value}))} />}
                                    </div>
                                )}
                            </div>

                            {activeTab === 'fulltime' && (
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <ToggleSwitch label="Cuti Tidak Berbayar (Unpaid Leave)" checked={salaryData.unpaidLeave} onChange={(v) => updateData('unpaidLeave', v)} colorClass="bg-orange-500" />
                                    {salaryData.unpaidLeave && (
                                        <div className="flex gap-4 mt-3 animate-fade-in">
                                            <RegularInput label="Jml Hari Cuti" type="number" value={salaryData.unpaidLeaveDays} onChange={(e) => updateData('unpaidLeaveDays', parseFloat(e.target.value))} placeholder="0" />
                                            <RegularInput label="Hari Kerja/Bln" type="number" value={salaryData.unpaidLeaveTotalWorkDays} onChange={(e) => updateData('unpaidLeaveTotalWorkDays', parseFloat(e.target.value))} placeholder="25" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab !== 'intern' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-3">Status Kawin</label>
                                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                                            <button onClick={() => setKawinStatus('TK')} className={`py-3 rounded-xl text-sm font-bold transition-all ${kawinStatus === 'TK' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>Tidak Kawin</button>
                                            <button onClick={() => setKawinStatus('K')} className={`py-3 rounded-xl text-sm font-bold transition-all ${kawinStatus === 'K' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>Kawin</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-3">Jumlah Tanggungan</label>
                                        <div className="flex gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                                            {[0, 1, 2, 3].map(t => (<button key={t} onClick={() => setTanggungan(t)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tanggungan === t ? 'bg-white text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}>{t === 3 ? '>= 3' : t}</button>))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-purple-100 flex items-center gap-4 animate-fade-in">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600"><Icons.Check className="w-5 h-5"/></div>
                                        <div><p className="text-sm font-bold text-gray-900">Status PTKP: {ptkpStatusCombined}</p><p className="text-sm text-gray-500">Penghasilan Tidak Kena Pajak: <span className="font-semibold text-gray-700">{FORMAT_CURRENCY(PTKP_VALUES[ptkpStatusCombined] || 0)}</span></p></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-gray-800">Skema Perhitungan Gaji</label>
                                        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 px-1">
                                            <button onClick={() => updateData('taxMethod', 'gross')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${salaryData.taxMethod === 'gross' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Gross</button>
                                            <button onClick={() => updateData('taxMethod', 'net')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${salaryData.taxMethod === 'net' ? 'bg-purple-600 shadow text-white' : 'text-gray-500'}`}>Net</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <FormattedInput label="Potongan Lainnya (Opsional)" value={salaryData.deductionOther} onChange={(v) => updateData('deductionOther', v)} />
                        </div>
                    </div>

                    <div ref={resultsRef} className="lg:col-span-5">
                        <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden sticky top-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-bold text-white mb-1">Rincian Perhitungan</h3>
                            <p className="text-purple-300 text-sm mb-6 border-b border-white/10 pb-4">Mode: {activeTab === 'fulltime' ? 'Karyawan Tetap' : activeTab === 'parttime' ? 'Paruh Waktu' : 'Magang'}</p>

                            <div className="space-y-2 animate-fade-in">
                                <ResultRow label="Gaji Bruto / Gross" value={results.grossIncome} />
                                
                                {activeTab !== 'intern' && results.totalBpjsCompany > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 border-l-4 border-l-purple-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold">Objek Pajak (Gross + BPJS)</p>
                                            <p className="text-lg font-bold text-purple-300">{FORMAT_CURRENCY(results.grossForTax)}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 italic">Termasuk BPJS dibayar Perusahaan (JKK, JKM, BPJS Kes) sebagai penambah penghasilan kena pajak.</p>
                                    </div>
                                )}

                                {activeTab !== 'intern' && (
                                    <ResultRow label="PPh 21 (TER Bulanan)" value={results.taxMethod === 'net' ? 0 : results.pph21} isNegative subtext={`Kat. ${results.terCategory} (${(results.terRate*100).toFixed(2)}%) dari Objek Pajak`} />
                                )}
                                
                                {salaryData.useBpjsKesehatan && activeTab !== 'intern' && <ResultRow label="BPJS Kesehatan" value={results.bpjs.kes_emp} isNegative subtext="1% dari Gaji Pokok + Tunjangan Tetap" />}
                                {salaryData.useBpjsKetenagakerjaan && activeTab !== 'intern' && (<>{salaryData.bpjsProgram.jht && <ResultRow label="JHT Karyawan" value={results.bpjs.tk_jht_emp} isNegative subtext="2% dari Gaji Pokok + Tunjangan Tetap" />}{salaryData.bpjsProgram.jp && <ResultRow label="JP Karyawan" value={results.bpjs.tk_jp_emp} isNegative subtext="1% dari Gaji Pokok + Tunjangan Tetap" />}</>)}
                                {salaryData.deductionOther > 0 && <ResultRow label="Potongan Lain" value={salaryData.deductionOther} isNegative />}

                                <div className="py-2 border-t border-white/10 flex justify-between text-purple-200 text-sm font-semibold"><span>Total Potongan</span><span>- {FORMAT_CURRENCY(results.totalDeductions)}</span></div>
                                <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 mb-3 mt-2 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                    <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Take Home Pay (Bersih)</p>
                                    <p className="text-3xl font-bold text-[#FACC15]">{FORMAT_CURRENCY(results.takeHomePay)}</p>
                                </div>

                                <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs font-bold text-purple-300 uppercase mb-2 flex items-center gap-2"><Icons.Info /> Biaya Perusahaan</p>
                                    <div className="space-y-1 text-sm text-gray-400">
                                        <div className="flex justify-between"><span>Gaji Bruto</span><span>{FORMAT_CURRENCY(results.grossIncome)}</span></div>
                                        {salaryData.useBpjsKesehatan && <div className="flex justify-between"><span>BPJS Kes (4%)</span><span>{FORMAT_CURRENCY(results.bpjs.kes_comp)}</span></div>}
                                        {salaryData.useBpjsKetenagakerjaan && salaryData.bpjsProgram.jkk && <div className="flex justify-between"><span>JKK ({salaryData.jkkRiskLevel}%)</span><span>{FORMAT_CURRENCY(results.bpjs.tk_jkk_comp)}</span></div>}
                                        {salaryData.useBpjsKetenagakerjaan && salaryData.bpjsProgram.jkm && <div className="flex justify-between"><span>JKM (0.3%)</span><span>{FORMAT_CURRENCY(results.bpjs.tk_jkm_comp)}</span></div>}
                                        {activeTab !== 'intern' && salaryData.bpjsProgram.jht && <div className="flex justify-between"><span>JHT (3.7%)</span><span>{FORMAT_CURRENCY(results.bpjs.tk_jht_comp)}</span></div>}
                                        {activeTab !== 'intern' && salaryData.bpjsProgram.jp && <div className="flex justify-between"><span>JP (2%)</span><span>{FORMAT_CURRENCY(results.bpjs.tk_jp_comp)}</span></div>}
                                        {results.taxMethod === 'net' && <div className="flex justify-between text-purple-300"><span>Tunjangan PPh 21</span><span>{FORMAT_CURRENCY(results.pph21)}</span></div>}
                                        <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold text-white"><span>Total Cost</span><span>{FORMAT_CURRENCY(results.companyCost)}</span></div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-start gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-500/20">
                                    <Icons.Building />
                                    <div>
                                        <p className="text-[11px] text-purple-200 leading-relaxed mb-1 font-bold">Ingin proses ini otomatis setiap bulan?</p>
                                        <p className="text-[11px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk integrasi payroll, absensi, dan pajak yang akurat.</p>
                                        <p className="text-[10px] text-purple-400 mt-3 pt-3 border-t border-purple-500/30 italic">Perhitungan menggunakan tarif efektif rata-rata (TER) PP 58/2023.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8"><p>Disclaimer: Kalkulator ini adalah alat simulasi. Perhitungan PPh 21 menggunakan metode TER bulanan (PMK 168/2023). Angka aktual dapat berbeda tergantung kebijakan perusahaan.</p></div>
            </div>
        </div>
    );
}