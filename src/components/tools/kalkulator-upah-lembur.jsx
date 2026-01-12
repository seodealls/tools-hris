import React, { useState, useMemo } from "react";

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

const ClockIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MoneyIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="20" height="20" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

// --- COMPONENTS ---
const FormattedInput = ({ label, value, onChange, placeholder, prefix = "Rp" }) => {
  const [displayValue, setDisplayValue] = useState("");

  React.useEffect(() => {
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

export default function OvertimeCalculatorWithBreakdown() {
  // --- STATE ---
  const [salaryType, setSalaryType] = useState("monthly");
  const [monthlySalary, setMonthlySalary] = useState(5000000);
  const [dailySalary, setDailySalary] = useState(250000);
  const [pieceworkSalary, setPieceworkSalary] = useState(100000);
  const [overtimeHours, setOvertimeHours] = useState(1);
  const [workType, setWorkType] = useState("weekday");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState(5);

  // --- FORMATTING ---
  const fmt = (v) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(v || 0));

  // --- CALCULATIONS ---
  const calculation = useMemo(() => {
    let baseSalary = 0;
    let dailyWage = 0;

    if (salaryType === "monthly") {
      baseSalary = Number(monthlySalary);
      dailyWage = baseSalary / 25;
    } else if (salaryType === "daily") {
      dailyWage = Number(dailySalary);
      baseSalary = dailyWage * 25;
    } else if (salaryType === "piecework") {
      dailyWage = Number(pieceworkSalary);
      baseSalary = dailyWage * 25;
    }

    const hourlyWage = baseSalary / 173;
    let overtimePay = 0;
    let multiplier = 1;

    if (workType === "weekday") {
      // Weekday: 1.5x for 1st hour, 2x for rest
      if (overtimeHours >= 1) {
        overtimePay += hourlyWage * 1.5;
      }
      if (overtimeHours > 1) {
        overtimePay += hourlyWage * 2 * (overtimeHours - 1);
      }
    } else if (workType === "holiday") {
      // Holiday: 2x
      overtimePay = hourlyWage * 2 * overtimeHours;
    } else if (workType === "restDay") {
      // Rest day: 3x
      overtimePay = hourlyWage * 3 * overtimeHours;
    }

    // Breakdown by day
    const breakdown = [];
    const dayLabels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    for (let i = 0; i < 7; i++) {
      const dayName = dayLabels[i];
      let dayMultiplier = 1;
      let dayOvertimePay = 0;

      if (i < workDaysPerWeek) {
        if (workType === "weekday") {
          dayOvertimePay = hourlyWage * (1.5 + (overtimeHours - 1) * 2);
          dayMultiplier = overtimeHours * 2 - 0.5;
        } else {
          dayOvertimePay = hourlyWage * 2 * overtimeHours;
          dayMultiplier = 2;
        }
      } else {
        if (workType === "restDay") {
          dayOvertimePay = hourlyWage * 3 * overtimeHours;
          dayMultiplier = 3;
        } else if (workType === "holiday") {
          dayOvertimePay = hourlyWage * 2 * overtimeHours;
          dayMultiplier = 2;
        }
      }

      if (dayOvertimePay > 0) {
        breakdown.push({
          day: dayName,
          rate: fmt(hourlyWage),
          multiplier: `${dayMultiplier}x`,
          total: fmt(dayOvertimePay),
        });
      }
    }

    return {
      baseSalary,
      dailyWage,
      hourlyWage,
      overtimePay,
      breakdown,
    };
  }, [salaryType, monthlySalary, dailySalary, pieceworkSalary, overtimeHours, workType, workDaysPerWeek]);

  const { baseSalary, dailyWage, hourlyWage, overtimePay, breakdown } = calculation;

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
              Kalkulator <span className="text-[#FACC15]">Upah Lembur</span>
            </h1>
            <p className="text-purple-200/80 text-lg mb-6 leading-relaxed">
              Hitung otomatis upah lembur karyawan sesuai regulasi pemerintah (Permenaker No. 102/2004).
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
              Otomatisasi hitung payroll, lembur, dan absensi langsung dari sistem HR Anda.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl text-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Input Data Lembur
            </h2>

            <div className="space-y-6">
              {/* Salary Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MoneyIcon /> Jenis Upah
                </label>
                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  {[
                    { value: "monthly", label: "Bulanan" },
                    { value: "daily", label: "Harian" },
                    { value: "piecework", label: "Satuan" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSalaryType(option.value)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${salaryType === option.value
                          ? "bg-white text-purple-700 shadow-sm ring-1 ring-purple-100"
                          : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Input */}
              <div>
                <FormattedInput
                  label={salaryType === "monthly" ? "Gaji Bulanan" : salaryType === "daily" ? "Upah Harian" : "Upah Satuan"}
                  value={
                    salaryType === "monthly"
                      ? monthlySalary
                      : salaryType === "daily"
                        ? dailySalary
                        : pieceworkSalary
                  }
                  onChange={(val) => {
                    if (salaryType === "monthly") setMonthlySalary(val);
                    else if (salaryType === "daily") setDailySalary(val);
                    else setPieceworkSalary(val);
                  }}
                />
              </div>

              {/* Overtime Hours & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2"><ClockIcon /> Jam Lembur</label>
                  <input
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Math.max(1, Number(e.target.value)))}
                    min="1"
                    className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2"><TrendingUpIcon /> Jenis Hari</label>
                  <div className="relative">
                    <select
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      className="w-full px-4 py-3.5 border rounded-xl text-gray-900 font-bold focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 appearance-none"
                    >
                      <option value="weekday">Hari Kerja Biasa</option>
                      <option value="restDay">Hari Istirahat</option>
                      <option value="holiday">Hari Libur Nasional</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Hari Kerja Per Minggu</label>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                  <span className="text-purple-900 font-medium text-sm">Jumlah hari kerja (1-7)</span>
                  <input
                    type="number"
                    value={workDaysPerWeek}
                    onChange={(e) => setWorkDaysPerWeek(Math.max(1, Math.min(7, Number(e.target.value))))}
                    min="1" max="7"
                    className="w-20 px-3 py-2 text-center font-bold text-purple-900 bg-white border border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: RESULTS (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-[#1e1b4b] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

              <h3 className="text-xl font-bold text-white mb-6">Hitungan Upah Lembur</h3>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Upah Per Jam (1/173)</p>
                    <p className="text-lg font-bold text-white">{fmt(hourlyWage)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Total Jam</p>
                    <p className="text-lg font-bold text-[#FACC15]">{overtimeHours} Jam</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                <p className="text-[10px] uppercase tracking-wider text-purple-200/80 font-bold mb-1">Skema Pengganda</p>
                <p className="text-sm font-medium text-white">
                  {workType === "weekday"
                    ? "1.5x (jam pertama) + 2x (jam berikutnya)"
                    : workType === "restDay"
                      ? "3x (jam istirahat)"
                      : "2x (hari libur)"}
                </p>
              </div>

              <div className="bg-white/10 border border-[#FACC15]/30 rounded-xl p-5 shadow-[0_0_15px_rgba(250,204,21,0.1)] mt-6">
                <p className="text-[10px] uppercase tracking-wider text-purple-200 mb-1">Total Upah Lembur</p>
                <p className="text-3xl font-bold text-[#FACC15]">{fmt(overtimePay)}</p>
              </div>

              <div className="mt-6 flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                <BuildingIcon />
                <div>
                  <p className="text-[10px] text-purple-300 leading-relaxed mb-1 font-bold">Lembur sering salah hitung?</p>
                  <p className="text-[10px] text-purple-300 leading-relaxed">Gunakan <strong>KantorKu HRIS</strong> untuk tracking jam lembur & payroll otomatis 100% akurat.</p>
                </div>
              </div>

              {/* Breakdown Table Mini */}
              {breakdown.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-purple-200/60 font-bold mb-3">Simulasi Mingguan</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
                    {breakdown.map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-purple-200/80 border-b border-white/5 pb-1 last:border-0">
                        <span>{row.day}</span>
                        <span className="font-mono">{row.multiplier}</span>
                        <span className="text-white font-bold">{row.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center text-xs text-gray-600 max-w-2xl mx-auto pb-8">
          <p>Disclaimer: Perhitungan mengacu pada Kepmenaker No. 102/2004. Nilai 1/173 adalah standar pembagi upah sejam.</p>
        </div>

      </div>
    </div>
  );
}
