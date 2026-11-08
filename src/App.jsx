import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator, Building2, Briefcase, TrendingUp, DollarSign,
  Plus, Copy, Trash2, Download, Upload, Moon, Sun,
  Search, ExternalLink, ArrowLeftRight, RefreshCw,
  Check, Settings, BarChart2, PieChart, Layers, Edit3, X, Sliders, GripVertical, History, Palette, MessageSquare, Pin, ArrowUpDown, Eye, EyeOff, Globe, AlertCircle, CheckCircle2, PanelLeftClose, PanelLeftOpen, ArrowLeft, Mail, Phone, MapPin, Clock
} from 'lucide-react';

const STORAGE_KEY = 'job_salary_tracker_data_v17';
const SETTINGS_KEY = 'job_salary_tracker_settings_v12';
const THEME_KEY = 'job_salary_tracker_theme';
const COLOR_THEME_KEY = 'job_salary_tracker_color_theme';
const CURRENCY_KEY = 'job_salary_tracker_currency';

const DEFAULT_CURRENCY = { symbol: '₱', code: 'PHP' };

const CURRENCIES = [
  { symbol: '₱', code: 'PHP' },
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '¥', code: 'JPY' },
  { symbol: '₹', code: 'INR' },
  { symbol: 'A$', code: 'AUD' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'S$', code: 'SGD' },
];

const DEFAULT_STATUSES = ['Applied', 'Interviewing', 'Offer Received', 'Offer Accepted', 'Rejected'];

const STATUS_COLORS = {
  'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Interviewing': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Offer Received': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Offer Accepted': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Rejected': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

const COLOR_THEMES = [
  { id: 'blue', name: 'Ocean Blue', primary: 'bg-blue-600', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/40 hover:border-blue-500', activeBorder: 'border-blue-600 ring-2 ring-blue-500/20', headerGradient: 'from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400' },
  { id: 'emerald', name: 'Emerald Mint', primary: 'bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/40 hover:border-emerald-500', activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20', headerGradient: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400' },
  { id: 'violet', name: 'Royal Violet', primary: 'bg-violet-600', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/40 hover:border-violet-500', activeBorder: 'border-violet-600 ring-2 ring-violet-500/20', headerGradient: 'from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400' },
  { id: 'amber', name: 'Sunset Amber', primary: 'bg-amber-600', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/40 hover:border-amber-500', activeBorder: 'border-amber-600 ring-2 ring-amber-500/20', headerGradient: 'from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400' },
  { id: 'rose', name: 'Crimson Rose', primary: 'bg-rose-600', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/40 hover:border-rose-500', activeBorder: 'border-rose-600 ring-2 ring-rose-500/20', headerGradient: 'from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400' },
];

const DEFAULT_COMPANY = {
  id: 'comp_1',
  companyName: 'Tech Global Systems',
  jobTitle: 'Senior Software Developer',
  contactEmail: 'hr@techglobalsystems.com',
  contactPhone: '+1 (555) 019-2834',
  locationType: 'Remote',
  employmentType: 'Full Time',
  jobUrl: 'https://example.com/job/1',
  status: 'Offer Received',
  dateApplied: '2026-03-01',
  remarks: 'Strong interest in system architecture and Server-Driven UI.',
  pinned: true,
  daysPerWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  hoursPerDay: 8,
  overtimeHoursPerWeek: 5,
  overtimeMultiplier: 1.5,
  taxMode: 'percent',
  taxValue: 15,
  rates: {
    hourly: 576.92,
    daily: 4615.38,
    weekly: 23076.92,
    biWeekly: 46153.85,
    semiMonthly: 50000.0,
    monthly: 100000.0,
    annual: 1200000.0
  },
  statusHistory: [
    { id: 'hist_1', date: '2026-03-01', status: 'Applied', remarks: 'Initial application submitted via portal.' },
    { id: 'hist_2', date: '2026-03-10', status: 'Offer Received', remarks: 'Received formal offer package.' }
  ]
};

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {
      defaultCurrency: 'PHP',
      defaultConversionTarget: 'USD',
      defaultConversionTarget2: 'EUR',
      defaultDate: new Date().toISOString().split('T')[0],
      defaultDarkMode: true,
      statuses: DEFAULT_STATUSES
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== null ? JSON.parse(saved) : settings.defaultDarkMode;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem(COLOR_THEME_KEY);
    return saved || 'blue';
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (saved) return JSON.parse(saved);
    return CURRENCIES.find(c => c.code === settings.defaultCurrency) || DEFAULT_CURRENCY;
  });

  const [conversionTarget1, setConversionTarget1] = useState(settings.defaultConversionTarget || 'USD');
  const [conversionTarget2, setConversionTarget2] = useState(settings.defaultConversionTarget2 || 'EUR');

  const [dashboardFromCurrency, setDashboardFromCurrency] = useState('PHP');
  const [dashboardToCurrency, setDashboardToCurrency] = useState('USD');

  const [compareCurrency1, setCompareCurrency1] = useState('PHP');
  const [compareCurrency2, setCompareCurrency2] = useState('USD');

  // Compare Tab State for Base Offer vs Multiple Offers
  const [compareBaseId, setCompareBaseId] = useState('');
  const [compareBaseSearch, setCompareBaseSearch] = useState('');
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [compareSearch, setCompareSearch] = useState('');

  const [exchangeRate, setExchangeRate] = useState(57.50);
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [DEFAULT_COMPANY];
  });

  const [activeId, setActiveId] = useState(companies[0]?.id || DEFAULT_COMPANY.id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [navHistory, setNavHistory] = useState(['dashboard']);

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);

  const [compareDetailId, setCompareDetailId] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatusValue, setNewStatusValue] = useState('');
  const [newStatusRemarks, setNewStatusRemarks] = useState('');
  const [customStatusInput, setCustomStatusInput] = useState('');
  const [isAddingNewStatus, setIsAddingNewStatus] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState(null);

  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  const [dashboardLayout, setDashboardLayout] = useState(['topOffers', 'charts', 'statusBreakdown', 'table']);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [tableSortConfig, setTableSortConfig] = useState({ key: 'companyName', direction: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState({
    company: true,
    jobTitle: true,
    locationType: true,
    employmentType: true,
    status: true,
    hourly: true,
    daily: true,
    weekly: true,
    monthly: true,
    annualNet: true,
    actions: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newStatusManagerInput, setNewStatusManagerInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFieldInput = () => {
    setIsTypingActive(true);
    if (typingTimer) clearTimeout(typingTimer);
    const timer = setTimeout(() => {
      setIsTypingActive(false);
    }, 1400);
    setTypingTimer(timer);
  };

  const navigateToTab = (tabName, companyId = null) => {
    if (companyId) setActiveId(companyId);
    setNavHistory(prev => [...prev, activeTab]);
    setActiveTab(tabName);
  };

  const goBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory(navHistory.slice(0, -1));
      setActiveTab(prev);
    }
  };

  const fetchGoogleFinanceRates = () => {
    setIsFetchingRate(true);
    fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency.code}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates[currency.code]) {
          setExchangeRate(data.rates[currency.code]);
        }
      })
      .catch(err => {
        console.warn('Google Finance fetch fallback:', err);
      })
      .finally(() => setIsFetchingRate(false));
  };

  useEffect(() => {
    fetchGoogleFinanceRates();
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(COLOR_THEME_KEY, colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const activeCompany = companies.find(c => c.id === activeId) || companies[0] || DEFAULT_COMPANY;
  const currentThemeObj = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const calculateMetrics = (comp, sourceFreq, val) => {
    const daysCount = comp.daysPerWeek ? comp.daysPerWeek.length : 5;
    const hoursPerDay = Number(comp.hoursPerDay) || 8;
    const otHours = Number(comp.overtimeHoursPerWeek) || 0;
    const otMult = Number(comp.overtimeMultiplier) || 1.5;
    const taxVal = Number(comp.taxValue) || 0;

    let annualGross = 0;
    let hourlyRate = 0;
    const weeklyRegularHours = daysCount * hoursPerDay;
    const baseRate = Number(val !== undefined ? val : comp.rates[sourceFreq]) || 0;

    switch (sourceFreq) {
      case 'hourly':
        hourlyRate = baseRate;
        annualGross = (weeklyRegularHours * baseRate * 52) + (otHours * (baseRate * otMult) * 52);
        break;
      case 'daily':
        hourlyRate = baseRate / hoursPerDay;
        annualGross = (baseRate * daysCount + otHours * (hourlyRate * otMult)) * 52;
        break;
      case 'weekly':
        hourlyRate = baseRate / weeklyRegularHours;
        annualGross = (baseRate * 52) + (otHours * (hourlyRate * otMult) * 52);
        break;
      case 'bi-weekly':
        hourlyRate = baseRate / (weeklyRegularHours * 2);
        annualGross = (baseRate * 26) + (otHours * (hourlyRate * otMult) * 52);
        break;
      case 'semi-monthly':
        annualGross = baseRate * 24;
        hourlyRate = annualGross / (52 * weeklyRegularHours);
        break;
      case 'monthly':
        annualGross = baseRate * 12;
        hourlyRate = annualGross / (52 * weeklyRegularHours);
        break;
      case 'annual':
      default:
        annualGross = baseRate;
        hourlyRate = annualGross / (52 * weeklyRegularHours);
        break;
    }

    let annualTax = comp.taxMode === 'percent' ? annualGross * (taxVal / 100) : taxVal * 12;
    const annualNet = Math.max(0, annualGross - annualTax);

    return {
      hourlyRate,
      dailyGross: annualGross / 52 / daysCount,
      dailyNet: (annualNet / 52) / daysCount,
      weeklyGross: annualGross / 52,
      weeklyNet: annualNet / 52,
      biWeeklyGross: annualGross / 26,
      biWeeklyNet: annualNet / 26,
      semiMonthlyGross: annualGross / 24,
      semiMonthlyNet: annualNet / 24,
      monthlyGross: annualGross / 12,
      monthlyNet: annualNet / 12,
      annualGross,
      annualTax,
      annualNet,
      calculatedRates: {
        hourly: Number(hourlyRate.toFixed(2)),
        daily: Number((annualGross / 52 / daysCount).toFixed(2)),
        weekly: Number((annualGross / 52).toFixed(2)),
        biWeekly: Number((annualGross / 26).toFixed(2)),
        semiMonthly: Number((annualGross / 24).toFixed(2)),
        monthly: Number((annualGross / 12).toFixed(2)),
        annual: Number(annualGross.toFixed(2))
      }
    };
  };

  const handleRateChange = (freqKey, val) => {
    handleFieldInput();
    const numVal = Number(val) || 0;
    const metrics = calculateMetrics(activeCompany, freqKey, numVal);
    setCompanies(prev => prev.map(c => c.id === activeId ? { ...c, rates: metrics.calculatedRates } : c));
  };

  const updateActiveCompany = (key, value) => {
    handleFieldInput();
    setCompanies(prev => prev.map(c => {
      if (c.id === activeId) {
        const updated = { ...c, [key]: value };
        if (key === 'daysPerWeek' || key === 'hoursPerDay') {
          const metrics = calculateMetrics(updated, 'annual', updated.rates.annual);
          updated.rates = metrics.calculatedRates;
        }
        return updated;
      }
      return c;
    }));
  };

  const togglePinCompany = (id, e) => {
    e.stopPropagation();
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
    showToast("Pin status updated.");
  };

  const handleSaveStatusChange = (e) => {
    e.preventDefault();
    let targetStatus = newStatusValue;

    if (isAddingNewStatus && customStatusInput.trim()) {
      targetStatus = customStatusInput.trim();
      if (!settings.statuses.includes(targetStatus)) {
        setSettings(prev => ({ ...prev, statuses: [...prev.statuses, targetStatus] }));
      }
    }

    if (!targetStatus) return;

    setCompanies(prev => prev.map(c => {
      if (c.id === activeId) {
        let updatedHistory = [...(c.statusHistory || [])];
        if (editingHistoryId) {
          updatedHistory = updatedHistory.map(h => h.id === editingHistoryId ? { ...h, status: targetStatus, remarks: newStatusRemarks } : h);
        } else {
          updatedHistory.push({
            id: 'hist_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            status: targetStatus,
            remarks: newStatusRemarks || 'Status updated.'
          });
        }
        return {
          ...c,
          status: targetStatus,
          statusHistory: updatedHistory
        };
      }
      return c;
    }));

    setIsStatusModalOpen(false);
    setIsAddingNewStatus(false);
    setCustomStatusInput('');
    setEditingHistoryId(null);
    setNewStatusValue('');
    setNewStatusRemarks('');
    showToast("Status updated successfully!");
  };

  const openEditHistory = (hist) => {
    setEditingHistoryId(hist.id);
    setNewStatusValue(hist.status);
    setNewStatusRemarks(hist.remarks);
    setIsAddingNewStatus(false);
    setIsStatusModalOpen(true);
  };

  const deleteHistoryItem = (histId) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === activeId) {
        return { ...c, statusHistory: (c.statusHistory || []).filter(h => h.id !== histId) };
      }
      return c;
    }));
    showToast("History item deleted.");
  };

  const addCompany = () => {
    const newId = 'comp_' + Date.now();
    const newComp = {
      ...DEFAULT_COMPANY,
      id: newId,
      companyName: `New Company ${companies.length + 1}`,
      jobTitle: 'Software Engineer',
      contactEmail: '',
      contactPhone: '',
      locationType: 'Remote',
      employmentType: 'Full Time',
      status: settings.statuses[0] || 'Applied',
      dateApplied: settings.defaultDate,
      remarks: 'Newly added offer.',
      jobUrl: '',
      pinned: false,
      rates: { ...DEFAULT_COMPANY.rates, annual: 950000, monthly: 79166.67 },
      statusHistory: [{ id: 'hist_' + Date.now(), date: settings.defaultDate, status: settings.statuses[0] || 'Applied', remarks: 'Application created.' }]
    };
    setCompanies([...companies, newComp]);
    navigateToTab('calculator', newId);
    showToast("New offer added successfully!");
  };

  const duplicateCompany = (compToDup, e) => {
    e.stopPropagation();
    const newId = 'comp_' + Date.now();
    const duplicated = {
      ...compToDup,
      id: newId,
      companyName: `${compToDup.companyName} (Copy)`
    };
    setCompanies([...companies, duplicated]);
    navigateToTab('calculator', newId);
    showToast("Offer duplicated!");
  };

  const deleteCompany = (id, e) => {
    e.stopPropagation();
    if (companies.length <= 1) return alert("You must keep at least one company entry.");
    const filtered = companies.filter(c => c.id !== id);
    setCompanies(filtered);
    setSelectedCompareIds(prev => prev.filter(i => i !== id));
    if (compareBaseId === id) {
      setCompareBaseId('');
      setCompareBaseSearch('');
      setSelectedCompareIds([]);
    }
    if (activeId === id) setActiveId(filtered[0].id);
    showToast("Offer deleted.");
  };

  const formatCurrency = (val, customCurr = currency) => `${customCurr.symbol}${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const convertAmount = (amount, fromCurrCode, toCurrCode) => {
    if (fromCurrCode === toCurrCode) return amount;
    let amountInUSD = fromCurrCode === 'USD' ? amount : fromCurrCode === 'PHP' ? amount / exchangeRate : amount / 58.0;
    if (toCurrCode === 'USD') return amountInUSD;
    if (toCurrCode === 'PHP') return amountInUSD * exchangeRate;
    return amountInUSD * 60.0;
  };

  const formatConverted = (amount, fromCurrCode, targetCurrCode) => {
    if (fromCurrCode === targetCurrCode) return null;
    const targetObj = CURRENCIES.find(c => c.code === targetCurrCode);
    if (!targetObj) return null;
    const converted = convertAmount(amount, fromCurrCode, targetCurrCode);
    return `${formatCurrency(converted, targetObj)} ${targetCurrCode}`;
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ currency, settings, companies }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `job_salary_tracker_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Data exported successfully!");
  };

  const importData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.companies && Array.isArray(parsed.companies)) {
            setCompanies(parsed.companies);
            setActiveId(parsed.companies[0].id);
            if (parsed.currency) setCurrency(parsed.currency);
            if (parsed.settings) setSettings(parsed.settings);
            showToast("Data imported successfully!");
          }
        } catch (err) { alert("Error parsing JSON file."); }
      };
    }
  };

  const enhancedCompanies = useMemo(() => companies.map(c => ({
    ...c,
    locationType: c.locationType || 'Remote',
    employmentType: c.employmentType || 'Full Time',
    metrics: calculateMetrics(c, 'annual', c.rates.annual)
  })), [companies]);

  const sortedSidebarCompanies = useMemo(() => {
    return [...enhancedCompanies].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }, [enhancedCompanies]);

  const filteredCompareList = useMemo(() => {
    return enhancedCompanies.filter(c => c.companyName.toLowerCase().includes(compareSearch.toLowerCase()) || c.jobTitle.toLowerCase().includes(compareSearch.toLowerCase()));
  }, [enhancedCompanies, compareSearch]);

  const filteredBaseList = useMemo(() => {
    if (!compareBaseSearch.trim()) return [];
    return enhancedCompanies.filter(c => c.companyName.toLowerCase().includes(compareBaseSearch.toLowerCase()) || c.jobTitle.toLowerCase().includes(compareBaseSearch.toLowerCase()));
  }, [enhancedCompanies, compareBaseSearch]);

  const topThreeOffers = useMemo(() => [...enhancedCompanies].sort((a, b) => b.metrics.annualNet - a.metrics.annualNet).slice(0, 3), [enhancedCompanies]);

  // Removed automatic default pre-selection so base offer can remain blank (None) upon opening

  const statusCounts = useMemo(() => {
    const counts = {};
    settings.statuses.forEach(st => { counts[st] = 0; });
    enhancedCompanies.forEach(c => {
      if (counts[c.status] !== undefined) counts[c.status]++;
      else counts[c.status] = 1;
    });
    return Object.entries(counts).filter(([st, count]) => count > 0);
  }, [enhancedCompanies, settings.statuses]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (tableSortConfig.key === key && tableSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setTableSortConfig({ key, direction });
  };

  const sortedTableCompanies = useMemo(() => {
    let list = enhancedCompanies.filter(c => c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return list.sort((a, b) => {
      let aVal, bVal;
      if (tableSortConfig.key === 'companyName') {
        aVal = a.companyName; bVal = b.companyName;
      } else if (tableSortConfig.key === 'jobTitle') {
        aVal = a.jobTitle; bVal = b.jobTitle;
      } else if (tableSortConfig.key === 'locationType') {
        aVal = a.locationType; bVal = b.locationType;
      } else if (tableSortConfig.key === 'employmentType') {
        aVal = a.employmentType; bVal = b.employmentType;
      } else if (tableSortConfig.key === 'status') {
        aVal = a.status; bVal = b.status;
      } else if (tableSortConfig.key === 'hourly') {
        aVal = a.metrics.hourlyRate; bVal = a.metrics.hourlyRate;
      } else if (tableSortConfig.key === 'daily') {
        aVal = a.metrics.dailyNet; bVal = a.metrics.dailyNet;
      } else if (tableSortConfig.key === 'weekly') {
        aVal = a.metrics.weeklyNet; bVal = a.metrics.weeklyNet;
      } else if (tableSortConfig.key === 'monthly') {
        aVal = a.metrics.monthlyNet; bVal = a.metrics.monthlyNet;
      } else if (tableSortConfig.key === 'annualNet') {
        aVal = a.metrics.annualNet; bVal = a.metrics.annualNet;
      } else {
        aVal = a.companyName; bVal = a.companyName;
      }

      if (aVal < bVal) return tableSortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return tableSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [enhancedCompanies, searchQuery, tableSortConfig]);

  const handleDragStart = (index) => { setDraggedItemIndex(index); };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const updated = [...dashboardLayout];
    const dragged = updated.splice(draggedItemIndex, 1)[0];
    updated.splice(index, 0, dragged);
    setDraggedItemIndex(index);
    setDashboardLayout(updated);
  };

  const dashboardConversionRate = useMemo(() => {
    const baseUnit = 1;
    return convertAmount(baseUnit, dashboardFromCurrency, dashboardToCurrency);
  }, [dashboardFromCurrency, dashboardToCurrency, exchangeRate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative pb-16">

      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.5); }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        .animate-dot-1 { animation: dotPulse 1.2s infinite ease-in-out; animation-delay: 0s; }
        .animate-dot-2 { animation: dotPulse 1.2s infinite ease-in-out; animation-delay: 0.2s; }
        .animate-dot-3 { animation: dotPulse 1.2s infinite ease-in-out; animation-delay: 0.4s; }
      `}</style>

      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className={`fixed bottom-6 left-6 z-40 p-3.5 rounded-full ${currentThemeObj.primary} text-white shadow-2xl hover:scale-105 transition flex items-center justify-center border-2 border-white dark:border-slate-900`}
        title={isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        {isSidebarVisible ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
      </button>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isTypingActive && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-blue-400 animate-fadeIn">
          <Edit3 className="w-4 h-4" />
          <span>Editing &quot;{activeCompany.companyName}&quot;</span>
          <span className="flex items-center space-x-1 ml-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-dot-1"></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-dot-2"></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-dot-3"></span>
          </span>
        </div>
      )}

      <header className={`bg-white dark:bg-slate-900 border-b ${currentThemeObj.border} sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 ${currentThemeObj.primary} rounded-xl text-white shadow-md`}>
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight bg-gradient-to-r ${currentThemeObj.headerGradient} bg-clip-text text-transparent`}>
              Job Offer & Salary Tracker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Google Finance FX Live • Embedded Job Links & Card Comparisons
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {navHistory.length > 0 && (
            <button
              onClick={goBack}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${currentThemeObj.primary} text-white text-xs font-bold hover:opacity-95 transition shadow`}
              title="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <nav className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button onClick={() => navigateToTab('dashboard')} className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? `bg-white dark:bg-slate-900 ${currentThemeObj.text} shadow-sm` : 'text-slate-600 dark:text-slate-400'}`}>
              <TrendingUp className={`w-4 h-4 ${activeTab === 'dashboard' ? currentThemeObj.text : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => navigateToTab('calculator')} className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'calculator' ? `bg-white dark:bg-slate-900 ${currentThemeObj.text} shadow-sm` : 'text-slate-600 dark:text-slate-400'}`}>
              <Calculator className={`w-4 h-4 ${activeTab === 'calculator' ? currentThemeObj.text : 'text-slate-400'}`} />
              <span>Offer Editor</span>
            </button>
            <button onClick={() => navigateToTab('compare')} className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'compare' ? `bg-white dark:bg-slate-900 ${currentThemeObj.text} shadow-sm` : 'text-slate-600 dark:text-slate-400'}`}>
              <Building2 className={`w-4 h-4 ${activeTab === 'compare' ? currentThemeObj.text : 'text-slate-400'}`} />
              <span>Compare Offers</span>
            </button>
            <button onClick={() => navigateToTab('settings')} className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? `bg-white dark:bg-slate-900 ${currentThemeObj.text} shadow-sm` : 'text-slate-600 dark:text-slate-400'}`}>
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? currentThemeObj.text : 'text-slate-400'}`} />
              <span>Settings</span>
            </button>
          </nav>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <DollarSign className={`w-4 h-4 ${currentThemeObj.text}`} />
            <select
              value={currency.code}
              onChange={(e) => {
                const found = CURRENCIES.find(c => c.code === e.target.value);
                if (found) setCurrency(found);
              }}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900">{c.symbol} ({c.code})</option>
              ))}
            </select>
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">

        {isSidebarVisible && (
          <aside className={`w-full lg:w-80 bg-white dark:bg-slate-900 border-r ${currentThemeObj.border} p-4 flex flex-col gap-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xs font-semibold uppercase tracking-wider ${currentThemeObj.text} px-2`}>Job Applications ({companies.length})</h2>
              <button onClick={addCompany} className={`flex items-center space-x-1 text-xs font-medium text-white ${currentThemeObj.primary} px-2.5 py-1.5 rounded-lg transition shadow`}>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Offer</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
              {sortedSidebarCompanies.map((comp) => {
                const metrics = calculateMetrics(comp, 'annual', comp.rates.annual);
                const isActive = comp.id === activeId;
                return (
                  <div
                    key={comp.id}
                    onClick={() => { navigateToTab('calculator', comp.id); }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${isActive ? `${currentThemeObj.activeBorder} bg-slate-50 dark:bg-slate-800/80` : `${currentThemeObj.border} bg-white dark:bg-slate-900/50`
                      }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className={`w-4 h-4 flex-shrink-0 ${isActive ? currentThemeObj.text : 'text-slate-400'}`} />
                        <h3 className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">{comp.companyName}</h3>
                        {comp.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {comp.jobTitle}
                      </p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {formatCurrency(metrics.annualGross)}/yr
                      </p>
                      <div className="mt-2 flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[comp.status] || 'bg-slate-100 text-slate-700'}`}>{comp.status}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">{comp.locationType || 'Remote'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => togglePinCompany(comp.id, e)} className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${comp.pinned ? 'text-amber-500' : 'text-slate-400'}`} title={comp.pinned ? 'Unpin' : 'Pin to top'}><Pin className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => duplicateCompany(comp, e)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => deleteCompany(comp.id, e)} className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">

          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">

              <div className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border ${currentThemeObj.border} shadow-sm flex flex-wrap items-center justify-between gap-4`}>
                <div>
                  <h2 className={`text-base font-bold bg-gradient-to-r ${currentThemeObj.headerGradient} bg-clip-text text-transparent flex items-center space-x-2`}>
                    <TrendingUp className={`w-5 h-5 ${currentThemeObj.text}`} />
                    <span>Executive Compensation Dashboard</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live FX: 1 {dashboardFromCurrency} = {dashboardConversionRate.toFixed(4)} {dashboardToCurrency}
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2 text-sm">
                  <span className={`text-xs font-semibold ${currentThemeObj.text} uppercase`}>Convert:</span>
                  <select
                    value={dashboardFromCurrency}
                    onChange={(e) => setDashboardFromCurrency(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold focus:outline-none"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>
                    ))}
                  </select>
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={dashboardToCurrency}
                    onChange={(e) => setDashboardToCurrency(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold focus:outline-none"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>
                    ))}
                  </select>
                  <button onClick={fetchGoogleFinanceRates} disabled={isFetchingRate} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200" title="Refresh Rates">
                    <RefreshCw className={`w-4 h-4 ${isFetchingRate ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardLayout.map((sectionId, index) => {

                  if (sectionId === 'topOffers') {
                    return (
                      <div key="topOffers" draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border ${currentThemeObj.border} shadow-sm relative group cursor-move md:col-span-2`}>
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 z-10"><GripVertical className="w-5 h-5" /></div>
                        <h3 className={`text-xs font-bold ${currentThemeObj.text} uppercase tracking-wider mb-3`}>Top 3 Highest-Paying Offers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {topThreeOffers.map((item, idx) => {
                            const targetObj = CURRENCIES.find(c => c.code === dashboardToCurrency) || currency;
                            const convertedNet = convertAmount(item.metrics.annualNet, currency.code, dashboardToCurrency);
                            return (
                              <div key={item.id} onClick={() => { navigateToTab('calculator', item.id); }} className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border ${currentThemeObj.border} cursor-pointer hover:shadow transition`}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                                  <span className="font-bold text-sm text-slate-400">#{idx + 1}</span>
                                </div>
                                <h4 className="font-bold text-base">{item.companyName}</h4>
                                <p className="text-xs text-slate-500 mb-1">{item.jobTitle}</p>
                                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-3">
                                  <span>{item.locationType}</span>
                                  <span>•</span>
                                  <span>{item.employmentType}</span>
                                </div>
                                <div className="pt-2 border-t flex justify-between text-sm">
                                  <span className="text-slate-500">Annual Net:</span>
                                  <span className="font-bold text-emerald-600">{formatCurrency(convertedNet, targetObj)} {dashboardToCurrency}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'charts') {
                    return (
                      <div key="charts" draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-4 relative group cursor-move ${dashboardLayout.includes('statusBreakdown') ? 'md:col-span-1' : 'md:col-span-2'}`}>
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 z-10"><GripVertical className="w-5 h-5" /></div>
                        <h3 className="text-base font-bold flex items-center space-x-2">
                          <BarChart2 className={`w-5 h-5 ${currentThemeObj.text}`} />
                          <span>Annual Gross vs Net Comparison ({dashboardToCurrency})</span>
                        </h3>
                        <div className="space-y-4 pt-2 max-h-[350px] overflow-y-auto pr-1">
                          {enhancedCompanies.map((comp) => {
                            const targetObj = CURRENCIES.find(c => c.code === dashboardToCurrency) || currency;
                            const convGross = convertAmount(comp.metrics.annualGross, currency.code, dashboardToCurrency);
                            const convNet = convertAmount(comp.metrics.annualNet, currency.code, dashboardToCurrency);
                            const maxGross = Math.max(...enhancedCompanies.map(c => convertAmount(c.metrics.annualGross, currency.code, dashboardToCurrency)), 1);
                            return (
                              <div key={comp.id} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span>{comp.companyName}</span>
                                  <span className="text-slate-500">Gross: {formatCurrency(convGross, targetObj)} | Net: <strong className="text-emerald-600">{formatCurrency(convNet, targetObj)}</strong></span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                  <div className={`h-full ${currentThemeObj.primary}`} style={{ width: `${(convGross / maxGross) * 100}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'statusBreakdown') {
                    return (
                      <div key="statusBreakdown" draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-4 flex flex-col justify-between relative group cursor-move md:col-span-1`}>
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 z-10"><GripVertical className="w-5 h-5" /></div>
                        <div>
                          <h3 className="text-base font-bold flex items-center space-x-2 mb-2">
                            <PieChart className={`w-5 h-5 ${currentThemeObj.text}`} />
                            <span>Application Status Breakdown</span>
                          </h3>
                          <p className="text-xs text-slate-500 mb-2">Distribution of active job applications by status.</p>
                        </div>

                        <div className="flex flex-col items-center justify-center my-auto py-2">
                          <div className="relative w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-inner">
                            <div className="text-center">
                              <span className="text-2xl font-black">{enhancedCompanies.length}</span>
                              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Total Offers</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t">
                          {statusCounts.map(([status, count]) => {
                            const pct = Math.round((count / enhancedCompanies.length) * 100) || 0;
                            return (
                              <div key={status} className="flex items-center justify-between text-xs font-semibold">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${STATUS_COLORS[status]}`}>{status}</span>
                                <span>{count} ({pct}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (sectionId === 'table') {
                    return (
                      <div key="table" draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} className={`bg-white dark:bg-slate-900 rounded-2xl border ${currentThemeObj.border} shadow-sm overflow-hidden relative group cursor-move md:col-span-2`}>
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 z-10"><GripVertical className="w-5 h-5" /></div>

                        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                          <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                          </div>

                          <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentThemeObj.text}`}>Columns:</span>
                            {Object.keys(visibleColumns).map(col => (
                              <label key={col} className="flex items-center space-x-1.5 text-xs cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={visibleColumns[col]}
                                  onChange={() => setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                                  className="rounded text-blue-600 focus:ring-0"
                                />
                                <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-500 text-xs uppercase">
                                {visibleColumns.company && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('companyName')}><div className="flex items-center space-x-1"><span>Company</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.jobTitle && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('jobTitle')}><div className="flex items-center space-x-1"><span>Job Title</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.locationType && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('locationType')}><div className="flex items-center space-x-1"><span>Location</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.employmentType && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('employmentType')}><div className="flex items-center space-x-1"><span>Type</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.status && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('status')}><div className="flex items-center space-x-1"><span>Status</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.hourly && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('hourly')}><div className="flex items-center space-x-1"><span>Hourly</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.daily && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('daily')}><div className="flex items-center space-x-1"><span>Daily</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.weekly && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('weekly')}><div className="flex items-center space-x-1"><span>Weekly</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.monthly && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('monthly')}><div className="flex items-center space-x-1"><span>Monthly</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.annualNet && <th className="p-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort('annualNet')}><div className="flex items-center space-x-1"><span>Annual Net</span><ArrowUpDown className="w-3 h-3" /></div></th>}
                                {visibleColumns.actions && <th className="p-3.5 text-right">Actions</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {sortedTableCompanies.map(comp => {
                                const targetObj = CURRENCIES.find(c => c.code === dashboardToCurrency) || currency;
                                const convHourly = convertAmount(comp.metrics.hourlyRate, currency.code, dashboardToCurrency);
                                const convDaily = convertAmount(comp.metrics.dailyNet, currency.code, dashboardToCurrency);
                                const convWeekly = convertAmount(comp.metrics.weeklyNet, currency.code, dashboardToCurrency);
                                const convMonthly = convertAmount(comp.metrics.monthlyNet, currency.code, dashboardToCurrency);
                                const convAnnual = convertAmount(comp.metrics.annualNet, currency.code, dashboardToCurrency);

                                return (
                                  <tr key={comp.id} className="hover:bg-slate-50/50">
                                    {visibleColumns.company && <td className="p-3.5 font-semibold">{comp.companyName}</td>}
                                    {visibleColumns.jobTitle && <td className="p-3.5 text-slate-600">{comp.jobTitle}</td>}
                                    {visibleColumns.locationType && <td className="p-3.5"><span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">{comp.locationType}</span></td>}
                                    {visibleColumns.employmentType && <td className="p-3.5"><span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">{comp.employmentType}</span></td>}
                                    {visibleColumns.status && <td className="p-3.5"><span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[comp.status]}`}>{comp.status}</span></td>}
                                    {visibleColumns.hourly && <td className="p-3.5 font-medium"><div>{formatCurrency(comp.metrics.hourlyRate)}</div>{dashboardToCurrency !== currency.code && <div className={`text-[11px] ${currentThemeObj.text}`}>≈ {formatCurrency(convHourly, targetObj)}</div>}</td>}
                                    {visibleColumns.daily && <td className="p-3.5 font-medium"><div>{formatCurrency(comp.metrics.dailyNet)}</div>{dashboardToCurrency !== currency.code && <div className={`text-[11px] ${currentThemeObj.text}`}>≈ {formatCurrency(convDaily, targetObj)}</div>}</td>}
                                    {visibleColumns.weekly && <td className="p-3.5 font-medium"><div>{formatCurrency(comp.metrics.weeklyNet)}</div>{dashboardToCurrency !== currency.code && <div className={`text-[11px] ${currentThemeObj.text}`}>≈ {formatCurrency(convWeekly, targetObj)}</div>}</td>}
                                    {visibleColumns.monthly && <td className="p-3.5 font-medium"><div>{formatCurrency(comp.metrics.monthlyNet)}</div>{dashboardToCurrency !== currency.code && <div className={`text-[11px] ${currentThemeObj.text}`}>≈ {formatCurrency(convMonthly, targetObj)}</div>}</td>}
                                    {visibleColumns.annualNet && <td className="p-3.5 font-bold text-emerald-600"><div>{formatCurrency(comp.metrics.annualNet)}</div>{dashboardToCurrency !== currency.code && <div className={`text-[11px] text-emerald-700`}>≈ {formatCurrency(convAnnual, targetObj)}</div>}</td>}
                                    {visibleColumns.actions && (
                                      <td className="p-3.5 text-right space-x-2">
                                        <button onClick={() => { navigateToTab('calculator', comp.id); }} className={`px-3 py-1.5 ${currentThemeObj.primary} text-white text-xs font-bold rounded-xl shadow hover:opacity-95 transition inline-flex items-center space-x-1`}>
                                          <Edit3 className="w-3.5 h-3.5" />
                                          <span>Edit</span>
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="max-w-7xl mx-auto space-y-6">

              <div className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border ${currentThemeObj.border} shadow-sm flex flex-wrap items-center justify-between gap-4`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${currentThemeObj.primary} text-white rounded-xl shadow`}><Edit3 className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-base font-bold flex items-center space-x-2">
                      <span>Editing Offer: {activeCompany.companyName}</span>
                    </h2>
                    <p className={`text-xs ${currentThemeObj.text} font-semibold flex items-center space-x-1 mt-0.5`}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                      <span>Active Editor Mode</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${STATUS_COLORS[activeCompany.status]}`}>{activeCompany.status}</span>
                  <button
                    onClick={() => {
                      setEditingHistoryId(null);
                      setNewStatusValue(activeCompany.status);
                      setNewStatusRemarks('');
                      setIsAddingNewStatus(false);
                      setIsStatusModalOpen(true);
                    }}
                    className={`px-4 py-2 ${currentThemeObj.primary} text-white text-xs font-bold rounded-xl shadow hover:opacity-95 transition inline-flex items-center space-x-1.5`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Change Status</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                  <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-4`}>
                    <h3 className={`text-base font-bold flex items-center space-x-2 ${currentThemeObj.text}`}>
                      <Sliders className="w-4 h-4" />
                      <span>Job Position, Contact & Schedule</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Company Name</label>
                        <input type="text" value={activeCompany.companyName} onChange={(e) => updateActiveCompany('companyName', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Job Title</label>
                        <input type="text" value={activeCompany.jobTitle} onChange={(e) => updateActiveCompany('jobTitle', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Date Applied</label>
                        <input type="date" value={activeCompany.dateApplied} onChange={(e) => updateActiveCompany('dateApplied', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center space-x-1.5">
                          <Mail className={`w-3.5 h-3.5 ${currentThemeObj.text}`} />
                          <span>Contact Email</span>
                        </label>
                        <input type="email" placeholder="recruiter@company.com" value={activeCompany.contactEmail || ''} onChange={(e) => updateActiveCompany('contactEmail', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center space-x-1.5">
                          <Phone className={`w-3.5 h-3.5 ${currentThemeObj.text}`} />
                          <span>Contact Phone</span>
                        </label>
                        <input type="tel" placeholder="+1 (555) 000-0000" value={activeCompany.contactPhone || ''} onChange={(e) => updateActiveCompany('contactPhone', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center space-x-1.5">
                          <MapPin className={`w-3.5 h-3.5 ${currentThemeObj.text}`} />
                          <span>Location Type</span>
                        </label>
                        <select value={activeCompany.locationType || 'Remote'} onChange={(e) => updateActiveCompany('locationType', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold focus:outline-none cursor-pointer">
                          <option value="Remote">Remote</option>
                          <option value="Onsite">Onsite</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center space-x-1.5">
                          <Clock className={`w-3.5 h-3.5 ${currentThemeObj.text}`} />
                          <span>Employment Type</span>
                        </label>
                        <select value={activeCompany.employmentType || 'Full Time'} onChange={(e) => updateActiveCompany('employmentType', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold focus:outline-none cursor-pointer">
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center space-x-1.5`}>
                        <Globe className={`w-3.5 h-3.5 ${currentThemeObj.text}`} />
                        <span>Job Offer URL / Link</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input type="url" placeholder="https://company.com/careers/job-posting" value={activeCompany.jobUrl || ''} onChange={(e) => updateActiveCompany('jobUrl', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                        {activeCompany.jobUrl && (
                          <button type="button" onClick={() => { setEmbedUrl(activeCompany.jobUrl); setIsEmbedModalOpen(true); }} className={`px-4 py-2.5 text-white ${currentThemeObj.primary} rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow hover:opacity-95 flex-shrink-0`}>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Embed View</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center space-x-1.5">
                        <MessageSquare className={`w-3.5 h-3.5 ${currentThemeObj.text}`} />
                        <span>Offer Remarks & Notes</span>
                      </label>
                      <textarea rows="2" placeholder="Enter offer-specific remarks, perks, or negotiation details..." value={activeCompany.remarks || ''} onChange={(e) => updateActiveCompany('remarks', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
                    </div>
                  </div>

                  <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className={`text-base font-bold ${currentThemeObj.text}`}>Multiple Pay Frequency Fields & Dual Currency Conversions</h3>
                        <p className="text-xs font-semibold mt-0.5 text-slate-500">Edit any frequency field below. Annual Gross is fully editable and synchronized.</p>
                      </div>

                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-semibold text-slate-500 uppercase">Convert 1:</span>
                        <select value={conversionTarget1} onChange={(e) => setConversionTarget1(e.target.value)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border font-bold focus:outline-none">
                          {CURRENCIES.map(c => (<option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>))}
                        </select>
                        <span className="font-semibold text-slate-500 uppercase ml-1">Convert 2:</span>
                        <select value={conversionTarget2} onChange={(e) => setConversionTarget2(e.target.value)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border font-bold focus:outline-none">
                          {CURRENCIES.map(c => (<option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries({
                        hourly: 'Hourly Rate',
                        daily: 'Daily Gross',
                        weekly: 'Weekly Gross',
                        biWeekly: 'Bi-Weekly',
                        semiMonthly: 'Semi-Monthly',
                        monthly: 'Monthly Salary',
                        annual: 'Annual Gross'
                      }).map(([key, label]) => {
                        const rawVal = activeCompany.rates[key];
                        const conv1 = formatConverted(rawVal, currency.code, conversionTarget1);
                        const conv2 = formatConverted(rawVal, currency.code, conversionTarget2);
                        const isAnnual = key === 'annual';
                        return (
                          <div key={key} className={isAnnual ? 'sm:col-span-2 lg:col-span-3' : ''}>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">{label} ({currency.symbol})</label>
                            <input type="number" step="0.01" value={rawVal} onChange={(e) => handleRateChange(key, e.target.value)} className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold focus:outline-none ${isAnnual ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-black' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`} />
                            <div className="flex flex-wrap gap-x-3 mt-1">
                              {conv1 && <span className={`text-[11px] ${currentThemeObj.text} font-semibold`}>≈ {conv1}</span>}
                              {conv2 && <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">≈ {conv2}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                <div className="space-y-6">
                  <div className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-4 sticky top-24`}>
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className={`text-sm font-bold flex items-center space-x-2 ${currentThemeObj.text}`}>
                        <History className="w-4 h-4" />
                        <span>Status History Log</span>
                      </h3>
                      <button onClick={() => { setEditingHistoryId(null); setNewStatusValue(activeCompany.status); setNewStatusRemarks(''); setIsAddingNewStatus(false); setIsStatusModalOpen(true); }} className={`px-3 py-1 ${currentThemeObj.primary} text-white text-xs font-bold rounded-lg shadow hover:opacity-95 inline-flex items-center space-x-1`}>
                        <Plus className="w-3 h-3" />
                        <span>Add Status</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b text-slate-400 uppercase text-[10px]">
                            <th className="py-2 px-2">Status</th>
                            <th className="py-2 px-2">Date</th>
                            <th className="py-2 px-2">Remarks</th>
                            <th className="py-2 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {(activeCompany.statusHistory || []).map(hist => (
                            <tr key={hist.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${STATUS_COLORS[hist.status]}`}>{hist.status}</span></td>
                              <td className="py-3 px-2 text-slate-500 whitespace-nowrap">{hist.date}</td>
                              <td className="py-3 px-2 text-slate-700 dark:text-slate-300 max-w-[120px] truncate" title={hist.remarks}>{hist.remarks}</td>
                              <td className="py-3 px-2 text-right space-x-1 whitespace-nowrap">
                                <button onClick={() => openEditHistory(hist)} className={`p-1.5 ${currentThemeObj.primary} text-white rounded-lg shadow hover:opacity-95 inline-flex items-center`} title="Edit history"><Edit3 className="w-3 h-3" /></button>
                                <button onClick={() => deleteHistoryItem(hist.id)} className="p-1.5 bg-rose-600 text-white rounded-lg shadow hover:opacity-95 inline-flex items-center" title="Delete history"><Trash2 className="w-3 h-3" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'compare' && (
            <div className="max-w-[1600px] mx-auto space-y-6">

              <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-6`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">Compare Offers & Side-by-Side Analysis</h2>
                    <p className="text-xs text-slate-500">Select a primary Base Offer (or None) and up to 4 comparison offers to evaluate percentage differences.</p>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Currency 1:</span>
                      <select value={compareCurrency1} onChange={(e) => setCompareCurrency1(e.target.value)} className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border font-bold focus:outline-none">
                        {CURRENCIES.map(c => (<option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Currency 2:</span>
                      <select value={compareCurrency2} onChange={(e) => setCompareCurrency2(e.target.value)} className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border font-bold focus:outline-none">
                        {CURRENCIES.map(c => (<option key={c.code} value={c.code}>{c.symbol} ({c.code})</option>))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                  <div className="space-y-2.5 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase text-slate-500">1. Select Base Offer (Benchmark)</label>
                      {compareBaseId && (
                        <button
                          onClick={() => {
                            setCompareBaseId('');
                            setCompareBaseSearch('');
                          }}
                          className="text-[11px] font-bold text-rose-500 hover:underline"
                        >
                          Set to None
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search base company or leave blank for None..."
                        value={compareBaseSearch}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCompareBaseSearch(val);
                          if (!val.trim()) {
                            setCompareBaseId('');
                          }
                        }}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-900 border text-sm font-semibold focus:outline-none shadow-sm"
                      />
                      {compareBaseSearch && (
                        <button
                          onClick={() => {
                            setCompareBaseSearch('');
                            setCompareBaseId('');
                          }}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Suggestions:</span>
                      <button
                        onClick={() => {
                          setCompareBaseId('');
                          setCompareBaseSearch('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${!compareBaseId ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        None (No Base)
                      </button>
                      {topThreeOffers.map((topComp, idx) => {
                        const isBaseSelected = compareBaseId === topComp.id;
                        return (
                          <button
                            key={topComp.id}
                            onClick={() => {
                              setCompareBaseId(topComp.id);
                              setCompareBaseSearch(topComp.companyName);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border flex items-center space-x-1 ${isBaseSelected ? `${currentThemeObj.primary} text-white border-transparent` : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                              }`}
                          >
                            <span>#{idx + 1} {topComp.companyName}</span>
                          </button>
                        );
                      })}
                    </div>

                    {compareBaseSearch.trim() && !compareBaseId && filteredBaseList.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                        {filteredBaseList.map(comp => (
                          <div
                            key={comp.id}
                            onClick={() => {
                              setCompareBaseId(comp.id);
                              setCompareBaseSearch(comp.companyName);
                            }}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs border-b last:border-0 flex justify-between items-center"
                          >
                            <span className="font-bold">{comp.companyName}</span>
                            <span className="text-slate-400">{comp.jobTitle}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-semibold uppercase text-slate-500">2. Select Offers to Compare (Max 4)</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search comparison offers..."
                        value={compareSearch}
                        onChange={(e) => setCompareSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border text-sm focus:outline-none shadow-sm"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {filteredCompareList.map(comp => {
                        if (comp.id === compareBaseId) return null;
                        const isSelected = selectedCompareIds.includes(comp.id);
                        return (
                          <button
                            key={comp.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCompareIds(selectedCompareIds.filter(id => id !== comp.id));
                                if (compareDetailId === comp.id) setCompareDetailId(null);
                              } else {
                                if (selectedCompareIds.length >= 4) return alert("You can compare at most 4 offers simultaneously.");
                                setSelectedCompareIds([...selectedCompareIds, comp.id]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center space-x-1.5 ${isSelected ? `${currentThemeObj.primary} text-white border-transparent shadow-sm` : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-700'
                              }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{comp.companyName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {compareBaseId && (() => {
                const baseComp = enhancedCompanies.find(c => c.id === compareBaseId);
                if (!baseComp) return null;
                const curr1Obj = CURRENCIES.find(c => c.code === compareCurrency1) || currency;
                const baseConv1Hourly = convertAmount(baseComp.metrics.hourlyRate, currency.code, compareCurrency1);
                const baseConv1Daily = convertAmount(baseComp.metrics.dailyNet, currency.code, compareCurrency1);
                const baseConv1Monthly = convertAmount(baseComp.metrics.monthlyNet, currency.code, compareCurrency1);
                const baseConv1Annual = convertAmount(baseComp.metrics.annualNet, currency.code, compareCurrency1);

                return (
                  <div className={`bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border ${currentThemeObj.border} shadow-lg space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">Benchmark Base Offer</span>
                        <h3 className="text-lg font-bold">{baseComp.companyName} - {baseComp.jobTitle}</h3>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[baseComp.status]}`}>{baseComp.status}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hourly Rate</span>
                        <span className="font-bold text-sm">{formatCurrency(baseConv1Hourly, curr1Obj)}</span>
                      </div>
                      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Daily Net</span>
                        <span className="font-bold text-sm">{formatCurrency(baseConv1Daily, curr1Obj)}</span>
                      </div>
                      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Monthly Net</span>
                        <span className="font-bold text-sm">{formatCurrency(baseConv1Monthly, curr1Obj)}</span>
                      </div>
                      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Annual Net</span>
                        <span className="font-bold text-sm text-emerald-400">{formatCurrency(baseConv1Annual, curr1Obj)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {selectedCompareIds.length > 0 ? (
                (() => {
                  const baseComp = compareBaseId ? enhancedCompanies.find(c => c.id === compareBaseId) : null;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {enhancedCompanies.filter(c => selectedCompareIds.includes(c.id)).map((comp) => {
                        const curr1Obj = CURRENCIES.find(c => c.code === compareCurrency1) || currency;

                        const conv1Hourly = convertAmount(comp.metrics.hourlyRate, currency.code, compareCurrency1);
                        const conv1Daily = convertAmount(comp.metrics.dailyNet, currency.code, compareCurrency1);
                        const conv1Monthly = convertAmount(comp.metrics.monthlyNet, currency.code, compareCurrency1);
                        const conv1Annual = convertAmount(comp.metrics.annualNet, currency.code, compareCurrency1);

                        let annualDiffPct = 0;
                        if (baseComp) {
                          const baseConv1Annual = convertAmount(baseComp.metrics.annualNet, currency.code, compareCurrency1);
                          annualDiffPct = baseConv1Annual > 0 ? ((conv1Annual - baseConv1Annual) / baseConv1Annual) * 100 : 0;
                        }

                        const isDetailOpen = compareDetailId === comp.id;

                        return (
                          <div key={comp.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border ${isDetailOpen ? currentThemeObj.activeBorder : currentThemeObj.border} shadow-sm flex flex-col justify-between space-y-4`}>
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[comp.status]}`}>{comp.status}</span>
                                <button
                                  onClick={() => {
                                    setSelectedCompareIds(selectedCompareIds.filter(id => id !== comp.id));
                                    if (compareDetailId === comp.id) setCompareDetailId(null);
                                  }}
                                  className="text-slate-400 hover:text-rose-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <h3 className="text-base font-bold">{comp.companyName}</h3>
                              <p className="text-xs text-slate-500">{comp.jobTitle}</p>
                              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{comp.locationType || 'Remote'}</span>
                                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{comp.employmentType || 'Full Time'}</span>
                              </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t">
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-500">Hourly:</span>
                                  <span className="font-semibold">{formatCurrency(conv1Hourly, curr1Obj)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-500">Daily:</span>
                                  <span className="font-semibold">{formatCurrency(conv1Daily, curr1Obj)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-500">Monthly:</span>
                                  <span className="font-semibold">{formatCurrency(conv1Monthly, curr1Obj)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1 border-t">
                                  <span className="text-slate-500">Annual Net:</span>
                                  <span className="font-bold text-emerald-600">{formatCurrency(conv1Annual, curr1Obj)}</span>
                                </div>
                              </div>

                              {baseComp && (
                                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${annualDiffPct >= 0
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200'
                                  }`}>
                                  <span>Diff vs Base ({baseComp.companyName}):</span>
                                  <span>{annualDiffPct >= 0 ? `+${annualDiffPct.toFixed(1)}%` : `${annualDiffPct.toFixed(1)}%`}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setCompareDetailId(isDetailOpen ? null : comp.id)}
                                className={`flex-1 py-2.5 ${isDetailOpen ? 'bg-slate-700 text-white' : currentThemeObj.primary + ' text-white'} rounded-xl text-xs font-bold shadow hover:opacity-95 transition inline-flex items-center justify-center space-x-1.5`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isDetailOpen ? 'Close View' : 'View'}</span>
                              </button>
                              <button
                                onClick={() => { navigateToTab('calculator', comp.id); }}
                                className="px-3 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-300 transition"
                                title="Go to Full Editor"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h3 className="text-base font-bold">No Comparison Offers Selected</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">Please select at least one offer in field 2 above to view side-by-side comparisons.</p>
                </div>
              )}

            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${currentThemeObj.border} shadow-sm space-y-6`}>
                <div>
                  <h2 className="text-lg font-bold">Application Settings & Configuration</h2>
                  <p className="text-xs text-slate-500">Customize application statuses, default currencies, color themes, and data backups.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Manage Application Statuses</label>
                  <div className="flex flex-wrap gap-2">
                    {settings.statuses.map((st, idx) => (
                      <div key={st} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-semibold">
                        <span>{st}</span>
                        {settings.statuses.length > 1 && (
                          <button onClick={() => { const updated = settings.statuses.filter((_, i) => i !== idx); setSettings(prev => ({ ...prev, statuses: updated })); }} className="text-rose-500 hover:text-rose-700 ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input type="text" placeholder="Add new status category..." value={newStatusManagerInput} onChange={(e) => setNewStatusManagerInput(e.target.value)} className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm flex-1 focus:outline-none" />
                    <button onClick={() => { if (newStatusManagerInput.trim()) { const val = newStatusManagerInput.trim(); if (!settings.statuses.includes(val)) { setSettings(prev => ({ ...prev, statuses: [...prev.statuses, val] })); setNewStatusManagerInput(''); } } }} className={`px-4 py-2 ${currentThemeObj.primary} text-white rounded-xl text-xs font-bold shadow`}>
                      Add Status
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <label className="block text-xs font-semibold uppercase text-slate-500 flex items-center space-x-1.5">
                    <Palette className={`w-4 h-4 ${currentThemeObj.text}`} />
                    <span>Theme Accent (Affects Headers, Titles, Icons & Borders)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {COLOR_THEMES.map(theme => (
                      <button key={theme.id} onClick={() => setColorTheme(theme.id)} className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition ${colorTheme === theme.id ? `${theme.activeBorder} bg-slate-50 dark:bg-slate-800/80` : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-3 h-3 rounded-full ${theme.primary}`}></span>
                          <span>{theme.name}</span>
                        </div>
                        <span className={`text-[11px] font-semibold bg-gradient-to-r ${theme.headerGradient} bg-clip-text text-transparent`}>Preview</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Data Backup & Restore (JSON)</h4>
                    <p className="text-xs text-slate-500">Export or import your job applications and tracker settings.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={exportData} className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-200 transition">
                      <Download className="w-4 h-4" />
                      <span>Export JSON</span>
                    </button>
                    <label className={`flex items-center space-x-1.5 px-4 py-2 ${currentThemeObj.primary} text-white text-sm font-semibold rounded-xl cursor-pointer transition shadow`}>
                      <Upload className="w-4 h-4" />
                      <span>Import JSON</span>
                      <input type="file" accept=".json" onChange={importData} className="hidden" />
                    </label>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border ${currentThemeObj.border} shadow-xl space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{editingHistoryId ? 'Edit Status History' : 'Change Offer Status'}</h3>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveStatusChange} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Status</label>
                  <button type="button" onClick={() => setIsAddingNewStatus(!isAddingNewStatus)} className={`text-xs font-bold ${currentThemeObj.text} hover:underline`}>{isAddingNewStatus ? 'Select from list' : '+ Add New Status'}</button>
                </div>

                {!isAddingNewStatus ? (
                  <select value={newStatusValue} onChange={(e) => setNewStatusValue(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold focus:outline-none">
                    {settings.statuses.map(st => (<option key={st} value={st}>{st}</option>))}
                  </select>
                ) : (
                  <input type="text" placeholder="Enter new status name..." value={customStatusInput} onChange={(e) => setCustomStatusInput(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold focus:outline-none" />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status Change Remarks</label>
                <textarea rows="3" placeholder="Enter remarks for this status change..." value={newStatusRemarks} onChange={(e) => setNewStatusRemarks(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm focus:outline-none" />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className={`px-4 py-2 ${currentThemeObj.primary} text-white rounded-xl text-xs font-bold shadow`}>Save Status Change</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEmbedModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col border ${currentThemeObj.border} shadow-2xl overflow-hidden`}>
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <Globe className={`w-5 h-5 ${currentThemeObj.text}`} />
                <h3 className="text-sm font-bold truncate max-w-lg">Job Posting Embed View: {embedUrl}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <a href={embedUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
                <button onClick={() => setIsEmbedModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 flex flex-col">
              <iframe src={embedUrl} title="Job Posting Embed" className="w-full h-full rounded-xl border bg-white" onError={() => alert("Unable to embed URL directly due to security policies. Use 'Open in Tab'.")} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}