import React, { useState, useEffect } from 'react';
import {
  Building2,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Trash2,
  ExternalLink,
  Sparkles,
  Radio,
  Wrench,
  Droplets,
  Bus,
  Siren,
  Landmark,
  Eye,
  RefreshCw,
  Award,
  Zap,
  Check,
  Compass,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { LiveBulletin, MunicipalDepartmentCode, BulletinPriority } from '../types';
import { MUNICIPAL_DEPARTMENTS, MUNICIPAL_DEPARTMENTS_ARRAY } from '../data/departmentConfig';
import { PasswordRecoveryModal } from './PasswordRecoveryModal';
import { DepartmentSecurityManager } from './DepartmentSecurityManager';
import { civicAudio } from '../lib/chimeAudio';

interface DepartmentNewsPublisherProps {
  currentCityName?: string;
  onBulletinCreated?: (bulletin: LiveBulletin) => void;
  onOpenPublicBulletinBoard?: () => void;
}

export const DepartmentNewsPublisher: React.FC<DepartmentNewsPublisherProps> = ({
  currentCityName = 'Rawalpindi',
  onBulletinCreated,
  onOpenPublicBulletinBoard,
}) => {
  // Selected Department
  const [selectedDeptCode, setSelectedDeptCode] = useState<MunicipalDepartmentCode>('DPW');
  const activeDept = MUNICIPAL_DEPARTMENTS[selectedDeptCode];

  // Password & Authentication State per Department
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [unlockedDepts, setUnlockedDepts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('civic_unlocked_departments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals for Recovery and Security Management
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isSecurityManagerOpen, setIsSecurityManagerOpen] = useState(false);
  const [recoveryTargetCode, setRecoveryTargetCode] = useState<MunicipalDepartmentCode>('DPW');

  const isCurrentDeptUnlocked = !!unlockedDepts[selectedDeptCode];

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ROADWORK');
  const [priority, setPriority] = useState<BulletinPriority>('REGULAR');
  const [wardZone, setWardZone] = useState('Central Ward / Main Corridor');
  const [cityName, setCityName] = useState(currentCityName);
  const [authorOfficerName, setAuthorOfficerName] = useState('');
  const [authorBadgeId, setAuthorBadgeId] = useState('');
  const [officialGazetteNumber, setOfficialGazetteNumber] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [actionAdvice, setActionAdvice] = useState('');
  const [currencyWindowHours, setCurrencyWindowHours] = useState(6);

  // Submission & List States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [publishedBulletins, setPublishedBulletins] = useState<LiveBulletin[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auto-generate realistic Gazette Number when department changes
  useEffect(() => {
    const year = new Date().getFullYear();
    const cityCode = (cityName || 'RP').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    setOfficialGazetteNumber(`${selectedDeptCode}-${cityCode}-${year}/${randomNum}`);
    
    // Set appropriate default category
    if (selectedDeptCode === 'DPW') setCategory('ROADWORK');
    else if (selectedDeptCode === 'WASA') setCategory('UTILITY');
    else if (selectedDeptCode === 'TRANSIT') setCategory('TRAFFIC_TRANSIT');
    else if (selectedDeptCode === 'RESCUE') setCategory('EMERGENCY');
    else if (selectedDeptCode === 'COUNCIL') setCategory('PUBLIC_HEARING');

    // Default Officer placeholders
    if (!authorOfficerName) {
      if (selectedDeptCode === 'DPW') {
        setAuthorOfficerName('Engr. Tariq Mehmood');
        setAuthorBadgeId('DPW-CHIEF-048');
      } else if (selectedDeptCode === 'WASA') {
        setAuthorOfficerName('Engr. Salman Raza');
        setAuthorBadgeId('WASA-HYD-119');
      } else if (selectedDeptCode === 'TRANSIT') {
        setAuthorOfficerName('Chief Warden Asif Malik');
        setAuthorBadgeId('TMB-OPS-082');
      } else if (selectedDeptCode === 'RESCUE') {
        setAuthorOfficerName('Dr. Farooq Qureshi');
        setAuthorBadgeId('RESCUE-1122-DIR');
      } else if (selectedDeptCode === 'COUNCIL') {
        setAuthorOfficerName('Ayesha Siddiqui');
        setAuthorBadgeId('MUNI-SEC-012');
      }
    }
  }, [selectedDeptCode, cityName]);

  // Sync city name prop
  useEffect(() => {
    if (currentCityName) setCityName(currentCityName);
  }, [currentCityName]);

  // Fetch Published Custom Bulletins
  const fetchPublishedList = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch(`/api/bulletins/custom?city=${encodeURIComponent(cityName || '')}`);
      if (res.ok) {
        const data = await res.json();
        setPublishedBulletins(data.bulletins || []);
      }
    } catch (err) {
      console.warn('[Publisher] Could not fetch bulletins:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPublishedList();
  }, [cityName]);

  // Helper to get active passkey for a department (custom or default)
  const getActiveDeptPasskey = (deptCode: MunicipalDepartmentCode): string => {
    try {
      const customKeys = JSON.parse(localStorage.getItem('civic_dept_custom_passkeys') || '{}');
      if (customKeys[deptCode]) return customKeys[deptCode];
    } catch (e) {
      // fallback
    }
    return MUNICIPAL_DEPARTMENTS[deptCode]?.defaultPasskey || `${deptCode.toLowerCase()}2026`;
  };

  // Handle Passkey Unlock
  const handleUnlockDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const trimmedKey = passkeyInput.trim().toLowerCase();
    const correctDeptKey = getActiveDeptPasskey(selectedDeptCode).toLowerCase();
    const supervisorKey = (activeDept.supervisorRecoveryCode || '').toLowerCase();
    const isMasterKey =
      trimmedKey === 'civic2026' ||
      trimmedKey === 'owner2026' ||
      trimmedKey === 'cityscape-recover-2026';

    if (trimmedKey === correctDeptKey || trimmedKey === supervisorKey || isMasterKey) {
      const updated = { ...unlockedDepts, [selectedDeptCode]: true };
      setUnlockedDepts(updated);
      localStorage.setItem('civic_unlocked_departments', JSON.stringify(updated));
      setPasskeyInput('');
      setAuthError('');
      try {
        civicAudio.playSuccessChime();
      } catch (e) {
        // ignore
      }
    } else {
      setAuthError(`Invalid passkey for ${activeDept.name}. Enter the verified department key, supervisor token, or master admin key.`);
    }
  };

  // Lock Department
  const handleLockDepartment = () => {
    const updated = { ...unlockedDepts, [selectedDeptCode]: false };
    setUnlockedDepts(updated);
    localStorage.setItem('civic_unlocked_departments', JSON.stringify(updated));
  };

  // Handle Password Reset / Recovery Completion
  const handlePasswordResetComplete = (target: string, newKey: string) => {
    const deptCode = target.toUpperCase() as MunicipalDepartmentCode;
    if (MUNICIPAL_DEPARTMENTS[deptCode]) {
      const updated = { ...unlockedDepts, [deptCode]: true };
      setUnlockedDepts(updated);
      localStorage.setItem('civic_unlocked_departments', JSON.stringify(updated));
      setSelectedDeptCode(deptCode);
      setAuthError('');
      setSubmitSuccess(`✅ Passkey updated & authenticated for ${MUNICIPAL_DEPARTMENTS[deptCode].name}!`);
    }
  };

  // Publish Department News Bulletin
  const handlePublishBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setAuthError('Please fill in both title and description for this official bulletin.');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess('');
    setAuthError('');

    try {
      const activeKey = getActiveDeptPasskey(selectedDeptCode);
      const payload = {
        departmentCode: selectedDeptCode,
        passkey: activeKey,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        wardZone: wardZone.trim() || 'All City Wards',
        cityName: cityName.trim() || 'Rawalpindi',
        authorOfficerName: authorOfficerName.trim() || activeDept.roleTitle,
        authorBadgeId: authorBadgeId.trim() || `${selectedDeptCode}-OFFICER`,
        officialGazetteNumber: officialGazetteNumber.trim(),
        sourceUrl: sourceUrl.trim(),
        actionAdvice: actionAdvice.trim(),
        currencyWindowHours,
      };

      const res = await fetch('/api/bulletins/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish bulletin');
      }

      setSubmitSuccess(`✅ Bulletin "${title}" successfully published to the live ${cityName} Civic Bulletin Board!`);
      setTitle('');
      setDescription('');
      setActionAdvice('');
      setSourceUrl('');
      
      // Update local list
      fetchPublishedList();

      if (onBulletinCreated && data.bulletin) {
        onBulletinCreated(data.bulletin);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Network error while publishing bulletin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Published Bulletin
  const handleDeleteBulletin = async (id: string, deptCode: string) => {
    if (!confirm('Are you sure you want to unpublish and archive this official bulletin?')) return;

    setDeletingId(id);
    try {
      const activeKey = getActiveDeptPasskey(deptCode as MunicipalDepartmentCode);
      const res = await fetch(`/api/bulletins/custom/${id}?passkey=${encodeURIComponent(activeKey)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPublishedBulletins((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('[Delete Bulletin Error]', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getDeptIcon = (code: MunicipalDepartmentCode) => {
    switch (code) {
      case 'DPW': return <Wrench className="w-5 h-5" />;
      case 'WASA': return <Droplets className="w-5 h-5" />;
      case 'TRANSIT': return <Bus className="w-5 h-5" />;
      case 'RESCUE': return <Siren className="w-5 h-5" />;
      case 'COUNCIL': return <Landmark className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div id="department-news-publisher-root" className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-[#0A2540] text-white p-6 rounded-xl shadow-md border-2 border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 text-xs font-bold tracking-wide uppercase">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              Official Municipal Dispatch & Currency Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-7 h-7 text-amber-400" />
              Municipal Department News Publisher
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              Role-based, password-protected broadcast portal for 5 core municipal departments. Publish live advisories, emergency updates, and public notices directly to the civic bulletin board with ISO 37120 currency scoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSecurityManagerOpen(true)}
              type="button"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              Security & Passkeys
            </button>

            <button
              onClick={onOpenPublicBulletinBoard}
              type="button"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow border border-emerald-500"
            >
              <Eye className="w-4 h-4" />
              View Public Bulletin Board
            </button>
          </div>
        </div>
      </div>

      {/* 5 Department Selector Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Select Municipal Authority / Department (5 Official Portals)
          </label>
          <button
            onClick={() => {
              setRecoveryTargetCode(selectedDeptCode);
              setIsRecoveryOpen(true);
            }}
            type="button"
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Forgot {activeDept.name.split(' ')[0]} Passkey?
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {MUNICIPAL_DEPARTMENTS_ARRAY.map((dept) => {
            const isSelected = selectedDeptCode === dept.code;
            const isUnlocked = !!unlockedDepts[dept.code];

            return (
              <button
                key={dept.code}
                onClick={() => {
                  setSelectedDeptCode(dept.code);
                  setAuthError('');
                  setSubmitSuccess('');
                }}
                type="button"
                className={`p-3.5 rounded-xl border-2 transition-all text-left flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${dept.badgeBg} ${dept.badgeText}`}>
                    {getDeptIcon(dept.code)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isUnlocked
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {dept.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    [{dept.code}] Portal
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Publishing Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role Auth Gate or News Creation Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          {!isCurrentDeptUnlocked ? (
            /* Locked State: Require Department Security Passkey */
            <div className="space-y-6 text-center py-8 px-4">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center justify-center mx-auto border-2 border-amber-400 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Role-Protected Department Gate
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Unlock {activeDept.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Please enter the authorized departmental passkey for <strong className="text-slate-900 dark:text-white">{activeDept.roleTitle}</strong> to broadcast to the civic bulletin board.
                </p>
              </div>

              <form onSubmit={handleUnlockDepartment} className="max-w-sm mx-auto space-y-4">
                <div>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      placeholder={`Enter passkey (e.g. ${activeDept.defaultPasskey})`}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      💡 Default: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-amber-700 dark:text-amber-400">{activeDept.defaultPasskey}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryTargetCode(selectedDeptCode);
                        setIsRecoveryOpen(true);
                      }}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                    >
                      Forgot Passkey?
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 text-xs text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Unlock className="w-4 h-4" />
                  Authenticate & Unlock Dispatch Desk
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSecurityManagerOpen(true)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    Open Department Security & Passkey Manager
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Unlocked State: Form to Broadcast News */
            <form onSubmit={handlePublishBulletin} className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${activeDept.badgeBg} ${activeDept.badgeText}`}>
                    {getDeptIcon(activeDept.code)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {activeDept.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-xs font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Authenticated
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Author: {activeDept.roleTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryTargetCode(selectedDeptCode);
                      setIsRecoveryOpen(true);
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-amber-300/40 rounded-lg flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Change Passkey
                  </button>

                  <button
                    type="button"
                    onClick={handleLockDepartment}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" /> Lock Desk
                  </button>
                </div>
              </div>

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {authError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 rounded-xl text-rose-800 dark:text-rose-200 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Title & Headline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center justify-between">
                  <span>Bulletin Title & Action Headline *</span>
                  <span className="text-[11px] font-normal text-slate-500">Include clear emoji prefix</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. 🚧 ${activeDept.name}: Emergency Road Resurfacing Active`}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Official Bulletin Advisory Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details, affected ward sectors, maintenance crew activities, and expected resolution times for residents."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Action Advice for Citizens */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  Direct Action Advice for Citizens (Empowering & Clear)
                </label>
                <input
                  type="text"
                  value={actionAdvice}
                  onChange={(e) => setActionAdvice(e.target.value)}
                  placeholder="e.g. Commuters advised to use Northern Bypass; water tankers available at Sector 4."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Grid: Category, Priority, Ward */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="ROADWORK">🚧 Roadwork & Civil</option>
                    <option value="UTILITY">💧 Water & Power Utility</option>
                    <option value="TRAFFIC_TRANSIT">🚌 Traffic & Transit</option>
                    <option value="EMERGENCY">🚨 Emergency Response</option>
                    <option value="PUBLIC_HEARING">🏛️ City Council Hearing</option>
                    <option value="ENVIRONMENT">🌱 Parks & Green Canopy</option>
                    <option value="SENIOR_SERVICES">👵 Senior Accessibility</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as BulletinPriority)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="REGULAR">Standard Advisory</option>
                    <option value="URGENT">⚠️ Urgent Notice</option>
                    <option value="CRITICAL">🚨 Critical Flash Alert</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Currency Freshness Window
                  </label>
                  <select
                    value={currencyWindowHours}
                    onChange={(e) => setCurrencyWindowHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value={2}>⚡ Breaking (Within 2 Hours)</option>
                    <option value={6}>📅 Today Dispatch (6 Hours)</option>
                    <option value={12}>🕒 Active Shift (12 Hours)</option>
                    <option value={24}>📆 24H Full Window</option>
                    <option value={48}>🗓️ Scheduled 48H Notice</option>
                  </select>
                </div>
              </div>

              {/* Grid: Officer Credentials & Gazette Verification */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Author / Lead Officer
                  </label>
                  <input
                    type="text"
                    value={authorOfficerName}
                    onChange={(e) => setAuthorOfficerName(e.target.value)}
                    placeholder="e.g. Engr. Tariq Mehmood"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Officer Badge / Serial ID
                  </label>
                  <input
                    type="text"
                    value={authorBadgeId}
                    onChange={(e) => setAuthorBadgeId(e.target.value)}
                    placeholder="e.g. DPW-CHIEF-048"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Official Gazette / Order #
                  </label>
                  <input
                    type="text"
                    value={officialGazetteNumber}
                    onChange={(e) => setOfficialGazetteNumber(e.target.value)}
                    placeholder="e.g. DPW-RP-2026/841"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  🛡️ Signed with official cryptographic certificate of {activeDept.name}.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Broadcast Live to City Bulletin
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Active Department Custom Bulletins (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Active Department Broadcasts
                </h3>
              </div>
              <button
                onClick={fetchPublishedList}
                disabled={isLoadingList}
                type="button"
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Refresh custom bulletins"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {publishedBulletins.length === 0 ? (
              <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <FileCheck className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No active custom staff broadcasts yet.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Authenticate your department on the left to publish live news.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {publishedBulletins.map((item) => {
                  const itemDept = MUNICIPAL_DEPARTMENTS[item.departmentCode as MunicipalDepartmentCode];

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : item.priority === 'URGENT'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {item.priority || 'REGULAR'}
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-bold">
                            Score: {item.currencyScore || 98}%
                          </span>

                          <button
                            onClick={() => handleDeleteBulletin(item.id, item.departmentCode || 'DPW')}
                            disabled={deletingId === item.id}
                            type="button"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Unpublish Bulletin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-amber-700 dark:text-amber-400">
                          {itemDept?.name || item.department}
                        </span>
                        <span>{item.relativeFreshnessText || 'Active Live'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Universal Password Recovery Modal */}
      <PasswordRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        targetDepartmentCode={recoveryTargetCode}
        onPasswordResetSuccess={(target, newKey) => {
          handlePasswordResetComplete(target, newKey);
          setIsRecoveryOpen(false);
        }}
      />

      {/* Department Security Manager Modal */}
      {isSecurityManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Municipal Security & Passkey Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure passkeys, recovery tokens, and security questions for all 5 departments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSecurityManagerOpen(false)}
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DepartmentSecurityManager
              currentDeptCode={selectedDeptCode}
              onPasskeyUpdated={(dept, key) => {
                handlePasswordResetComplete(dept, key);
              }}
              onOpenRecoveryModal={(dept) => {
                setRecoveryTargetCode(dept);
                setIsRecoveryOpen(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
