import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Shield,
  Key,
  CreditCard,
  Zap,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  QrCode,
  Send,
  UserCheck,
  Wrench,
  ChevronRight,
  Filter,
  Users,
  Search,
  PhoneCall,
  Calendar,
  Sparkles,
  ArrowRight,
  MapPin,
  Siren,
  Bell,
  X,
  FileText,
  DollarSign,
  Radio,
  Check,
  Navigation,
  Car,
  UserPlus,
  Lock,
  BadgeCheck,
  Award,
  ArrowLeft,
  History
} from 'lucide-react';
import {
  EstateContext,
  EstateAsset,
  VisitorPass,
  EstateMaintenanceBill,
  EstateStaffMember,
  Report,
  WorkOrderTier,
  EstateScope
} from '../types';
import {
  PRESET_GATED_COMMUNITIES,
  INITIAL_ESTATE_CONTEXT,
  INITIAL_ESTATE_ASSETS,
  INITIAL_VISITOR_PASSES,
  INITIAL_MAINTENANCE_BILLS,
  INITIAL_STAFF_MEMBERS,
  MOCK_ESTATE_REPORTS
} from '../data/estateData';
import { HoaTaskAssignmentHistoryView } from './HoaTaskAssignmentHistoryView';
import { GovernanceLiaisonHub } from './GovernanceLiaisonHub';

interface EstatePortalViewProps {
  onOpenPublicReportModal?: () => void;
  onSelectReportDetail?: (report: Report) => void;
}

export const EstatePortalView: React.FC<EstatePortalViewProps> = ({
  onOpenPublicReportModal,
  onSelectReportDetail,
}) => {
  // Workflow & Subscription Navigation State
  const [workflowStep, setWorkflowStep] = useState<'subscription' | 'checkout' | 'portal'>('subscription');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<'standard' | 'premier' | 'enterprise'>('premier');

  // Multi-Community State & Sync
  const [allCommunities, setAllCommunities] = useState<EstateContext[]>(PRESET_GATED_COMMUNITIES);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [selectedVisitorPass, setSelectedVisitorPass] = useState<VisitorPass | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Onboarding Form State
  const [onboardingEstateName, setOnboardingEstateName] = useState('Royal Palms Gated Community');
  const [onboardingPlot, setOnboardingPlot] = useState('Villa 142');
  const [onboardingSector, setOnboardingSector] = useState('Sector B - Phase 2');
  const [onboardingRole, setOnboardingRole] = useState<'resident' | 'board_admin'>('resident');
  
  // Payment Simulation State
  const [cardName, setCardName] = useState('Alexander Vance');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [checkoutStepStatus, setCheckoutStepStatus] = useState<string>('');

  // Core Estate State
  const [estateContext, setEstateContext] = useState<EstateContext>(INITIAL_ESTATE_CONTEXT);
  const [activePortalRole, setActivePortalRole] = useState<'resident' | 'admin' | 'technician'>('resident');
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'queue' | 'history' | 'contractors' | 'telemetry' | 'liaison'>('history');
  const [selectedScope, setSelectedScope] = useState<EstateScope>('INSIDE_ESTATE');

  // Customizer Edit Form State
  const [editBylaws, setEditBylaws] = useState(estateContext.bylawsText || '');
  const [editGatePhone, setEditGatePhone] = useState(estateContext.gateContactPhone || '');
  const [editOfficerName, setEditOfficerName] = useState(estateContext.securityDutyOfficer || '');
  const [editDuesAmount, setEditDuesAmount] = useState(estateContext.duesAmountUsd || 250);
  const [editGateHours, setEditGateHours] = useState(estateContext.gateOperatingHours || '24/7 Gate Guard');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(estateContext.emergencyHotline || '+1 (555) 911-GATE');
  const [editPoolHours, setEditPoolHours] = useState(estateContext.amenityPoolHours || '6:00 AM - 9:00 PM');
  const [editQuietHours, setEditQuietHours] = useState(estateContext.quietHoursText || '10:00 PM - 7:00 AM');
  const [editBankDetails, setEditBankDetails] = useState(estateContext.bankAccountDetails || '');
  const [editAnnouncement, setEditAnnouncement] = useState(estateContext.customAnnouncement || '');
  const [isSavingCustomizer, setIsSavingCustomizer] = useState(false);

  // Helper toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch all communities from server on mount
  React.useEffect(() => {
    fetch('/api/estates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.estates) && data.estates.length > 0) {
          setAllCommunities(data.estates);
        }
      })
      .catch(() => {});
  }, []);

  // Switch active gated community
  const handleSelectCommunity = (commId: string) => {
    if (commId === 'NEW_ONBOARDING') {
      setWorkflowStep('checkout');
      return;
    }
    const found = allCommunities.find(c => c.id === commId);
    if (found) {
      setEstateContext(found);
      setEditBylaws(found.bylawsText || '');
      setEditGatePhone(found.gateContactPhone || '');
      setEditOfficerName(found.securityDutyOfficer || '');
      setEditDuesAmount(found.duesAmountUsd || 250);
      setEditGateHours(found.gateOperatingHours || '24/7 Gate Guard');
      setEditEmergencyPhone(found.emergencyHotline || '+1 (555) 911-GATE');
      setEditPoolHours(found.amenityPoolHours || '6:00 AM - 9:00 PM');
      setEditQuietHours(found.quietHoursText || '10:00 PM - 7:00 AM');
      setEditBankDetails(found.bankAccountDetails || '');
      setEditAnnouncement(found.customAnnouncement || '');
      showToast(`Switched active community to ${found.estateName}`);
    }
  };

  // Save customized bylaws and parameters per gated community
  const handleSaveCommunityCustomizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCustomizer(true);
    try {
      const payload = {
        bylawsText: editBylaws,
        gateContactPhone: editGatePhone,
        securityDutyOfficer: editOfficerName,
        duesAmountUsd: editDuesAmount,
        gateOperatingHours: editGateHours,
        emergencyHotline: editEmergencyPhone,
        amenityPoolHours: editPoolHours,
        quietHoursText: editQuietHours,
        bankAccountDetails: editBankDetails,
        customAnnouncement: editAnnouncement,
      };

      const res = await fetch(`/api/estates/${estateContext.id}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.estate) {
          setEstateContext(data.estate);
          setAllCommunities(prev => prev.map(c => c.id === data.estate.id ? data.estate : c));
        }
      } else {
        setEstateContext(prev => ({ ...prev, ...payload }));
        setAllCommunities(prev => prev.map(c => c.id === estateContext.id ? { ...c, ...payload } : c));
      }
      showToast(`✅ Custom settings and bylaws saved for ${estateContext.estateName}!`);
      setIsCustomizerOpen(false);
    } catch (err) {
      setEstateContext(prev => ({
        ...prev,
        bylawsText: editBylaws,
        gateContactPhone: editGatePhone,
        securityDutyOfficer: editOfficerName,
        duesAmountUsd: editDuesAmount,
        gateOperatingHours: editGateHours,
        emergencyHotline: editEmergencyPhone,
        amenityPoolHours: editPoolHours,
        quietHoursText: editQuietHours,
        bankAccountDetails: editBankDetails,
        customAnnouncement: editAnnouncement,
      }));
      showToast(`✅ Custom settings updated for ${estateContext.estateName}!`);
      setIsCustomizerOpen(false);
    } finally {
      setIsSavingCustomizer(false);
    }
  };
  
  // Modals & Panels
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isDuesModalOpen, setIsDuesModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [panicAlertActive, setPanicAlertActive] = useState(false);

  // Data Collections
  const [reports, setReports] = useState<Report[]>(MOCK_ESTATE_REPORTS);
  const [assets, setAssets] = useState<EstateAsset[]>(INITIAL_ESTATE_ASSETS);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>(INITIAL_VISITOR_PASSES);
  const [maintenanceBills, setMaintenanceBills] = useState<EstateMaintenanceBill[]>(INITIAL_MAINTENANCE_BILLS);
  const [staffMembers, setStaffMembers] = useState<EstateStaffMember[]>(INITIAL_STAFF_MEMBERS);

  // Form State for New Work Order
  const [woTier, setWoTier] = useState<WorkOrderTier>('COMMUNITY_SHARED');
  const [woTitle, setWoTitle] = useState('');
  const [woCategory, setWoCategory] = useState<'WATER_LEAK' | 'LIGHTING' | 'SANITATION' | 'VANDALISM' | 'OTHER'>('WATER_LEAK');
  const [woDescription, setWoDescription] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('asset-gen-01');
  const [woPrivateRate, setWoPrivateRate] = useState<number>(15);
  const [woLocation, setWoLocation] = useState('Villa 142 Private Garden / Lane 4');

  // Form State for Visitor Pass
  const [visName, setVisName] = useState('');
  const [visPhone, setVisPhone] = useState('');
  const [visPlate, setVisPlate] = useState('');
  const [visPurpose, setVisPurpose] = useState('Personal Guest / Visitor');

  // Form State for Broadcast
  const [broadcastMessage, setBroadcastMessage] = useState('URGENT: Water supply pressure lowered in Sector B due to main pipe gasket servicing. Normal pressure restores by 4:00 PM.');
  const [broadcastTargetSector, setBroadcastTargetSector] = useState('Sector B - Royal Palms');

  // 1. Residential Units Enrolment Roster & Capacity State
  const [enrolledUnitsList, setEnrolledUnitsList] = useState<Array<{ plot: string; owner: string; status: string }>>([
    { plot: 'Villa 142', owner: 'Alexander Vance', status: 'ACTIVE_RESIDENT' },
    { plot: 'Villa 101', owner: 'Marcus Chen', status: 'ACTIVE_RESIDENT' },
    { plot: 'Villa 102', owner: 'Elena Rostova', status: 'ACTIVE_RESIDENT' },
    { plot: 'Villa 103', owner: 'David Miller', status: 'ACTIVE_RESIDENT' },
    { plot: 'Villa 104', owner: 'Priya Sharma', status: 'ACTIVE_RESIDENT' },
    { plot: 'Plot 201', owner: 'James Wilson', status: 'ACTIVE_RESIDENT' },
    { plot: 'Plot 202', owner: 'Sarah Jenkins', status: 'ACTIVE_RESIDENT' }
  ]);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [newUnitPlotName, setNewUnitPlotName] = useState('');
  const [newUnitOwnerName, setNewUnitOwnerName] = useState('');

  // 2. RFID & QR Security Barrier Control State
  const [barrierStatus, setBarrierStatus] = useState<'AUTO_ARMED' | 'MANUALLY_OPEN' | 'MANUALLY_CLOSED' | 'LOCKDOWN'>('AUTO_ARMED');
  const [rfidLogs, setRfidLogs] = useState<Array<{ id: string; time: string; tag: string; unit: string; status: string }>>([
    { id: 'LOG-891', time: '11:04 AM', tag: 'RFID-TAG-4820', unit: 'Villa 142 (A. Vance)', status: 'AUTOPASS_GRANTED' },
    { id: 'LOG-890', time: '10:48 AM', tag: 'RFID-TAG-1082', unit: 'Villa 101 (M. Chen)', status: 'AUTOPASS_GRANTED' },
    { id: 'LOG-889', time: '10:15 AM', tag: 'QR-PASS-7819', unit: 'Guest (FedEx Courier)', status: 'QR_VERIFIED_GATE' }
  ]);

  // 3. Real-Time Generator & Water Pump Telemetry State
  const [generatorFuel, setGeneratorFuel] = useState<number>(78);
  const [isGeneratorTesting, setIsGeneratorTesting] = useState<boolean>(false);
  const [waterTankLevel, setWaterTankLevel] = useState<number>(84);
  const [activePumpNumber, setActivePumpNumber] = useState<1 | 2>(1);

  // 5. Security Guard Panic Emergency Dispatch State
  const [guardDispatched, setGuardDispatched] = useState<boolean>(false);
  const [guardEtaSeconds, setGuardEtaSeconds] = useState<number>(135);
  const guardOfficerName = 'Officer Marcus Vance (Badge #SEC-402)';

  // Plan Capability Helper
  const maxAllowedUnits = selectedPlanId === 'standard' ? 100 : selectedPlanId === 'premier' ? 500 : 9999;
  
  const isPlanFeatureAllowed = (feature: 'UNITS_500' | 'RFID_BARRIER' | 'REALTIME_TELEMETRY' | 'PRIVATE_REPAIR_DESK' | 'PANIC_GUARD_DISPATCH') => {
    if (selectedPlanId === 'enterprise' || selectedPlanId === 'premier') {
      return true;
    }
    // Standard plan restricts advanced automation
    if (selectedPlanId === 'standard') {
      return false;
    }
    return true;
  };

  // Feature Action Handlers
  const handleSimulateRfidScan = () => {
    if (!isPlanFeatureAllowed('RFID_BARRIER')) {
      showToast('🔒 RFID Automated Security Barrier requires Premier Plan ($119/mo) or Enterprise Plan!');
      return;
    }
    setBarrierStatus('MANUALLY_OPEN');
    const newLog = {
      id: `LOG-${Math.floor(900 + Math.random() * 99)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: `RFID-TAG-${Math.floor(1000 + Math.random() * 8999)}`,
      unit: `${estateContext.unitPlotNumber} (${estateContext.unitPlotNumber})`,
      status: 'AUTOPASS_GRANTED'
    };
    setRfidLogs(prev => [newLog, ...prev]);
    showToast(`🚗 RFID Tag Matched! Barrier Gate lifted automatically for ${estateContext.unitPlotNumber}.`);

    setTimeout(() => {
      setBarrierStatus('AUTO_ARMED');
    }, 4000);
  };

  const handleTestRunGenerator = () => {
    if (!isPlanFeatureAllowed('REALTIME_TELEMETRY')) {
      showToast('🔒 Real-Time Generator & Water Telemetry requires Premier or Enterprise Plan!');
      return;
    }
    setIsGeneratorTesting(true);
    showToast('⚡ Backup Diesel Generator 15s Diagnostic Cycle Triggered! Output: 240V / 60Hz nominal.');
    setTimeout(() => {
      setIsGeneratorTesting(false);
      setGeneratorFuel(prev => Math.max(10, prev - 1));
      showToast('✅ Generator Diagnostic Completed. Fuel Level at 77% (338 Gallons).');
    }, 4000);
  };

  const handleCycleWaterPump = () => {
    if (!isPlanFeatureAllowed('REALTIME_TELEMETRY')) {
      showToast('🔒 Water Pump Telemetry Switchover requires Premier or Enterprise Plan!');
      return;
    }
    const nextPump = activePumpNumber === 1 ? 2 : 1;
    setActivePumpNumber(nextPump);
    showToast(`💧 Primary Water Supply Switched to Pump #${nextPump}. Line Pressure: 62 PSI.`);
  };

  const handleEnrollNewUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitPlotName.trim()) return;

    if (enrolledUnitsList.length >= maxAllowedUnits) {
      showToast(`⚠️ Plan Capacity Reached! Your current ${selectedPlanId.toUpperCase()} plan is capped at ${maxAllowedUnits} units. Please upgrade your subscription.`);
      return;
    }

    setEnrolledUnitsList(prev => [
      ...prev,
      { plot: newUnitPlotName, owner: newUnitOwnerName || 'Resident Owner', status: 'ACTIVE_RESIDENT' }
    ]);
    setNewUnitPlotName('');
    setNewUnitOwnerName('');
    setIsAddUnitModalOpen(false);
    showToast(`🎉 Residential Unit [${newUnitPlotName}] enrolled into estate database & Gate RFID system!`);
  };

  const handleTriggerPanicWithGuardDispatch = () => {
    setPanicAlertActive(true);
    if (!isPlanFeatureAllowed('PANIC_GUARD_DISPATCH')) {
      showToast('🚨 Local Panic Siren Triggered (Standard Plan). Upgrade to Premier Plan for automated Security Guard Dispatch.');
      return;
    }
    setGuardDispatched(true);
    setGuardEtaSeconds(135);
    showToast(`🚨 SECURITY GUARD DISPATCHED! ${guardOfficerName} en route to ${estateContext.unitPlotNumber}. ETA: 2m 15s.`);
  };

  // Onboarding Checkout Handler
  const handleCompleteSubscriptionCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCheckout(true);
    setCheckoutStepStatus('Authorizing 256-Bit Payment Gateway...');

    setTimeout(() => {
      setCheckoutStepStatus('Generating HOA License Code #LIC-HOA-2026-8921...');
    }, 1000);

    setTimeout(() => {
      setCheckoutStepStatus('Provisioning Gate RFID & Resident Portal...');
    }, 2000);

    setTimeout(() => {
      setIsSubmittingCheckout(false);
      setEstateContext(prev => ({
        ...prev,
        estateName: onboardingEstateName || 'Royal Palms Gated Community',
        unitPlotNumber: onboardingPlot || 'Villa 142',
        phaseSector: onboardingSector || 'Sector B - Phase 2',
        userRole: onboardingRole === 'board_admin' ? 'board_admin' : 'resident_owner',
        membershipStatus: 'VERIFIED_RESIDENT',
        duesStatus: 'PAID'
      }));
      setWorkflowStep('portal');
      showToast(`🎉 Subscription Activated! Welcome to ${onboardingEstateName || 'Royal Palms Gated Community'} Portal.`);
    }, 3000);
  };

  // Handlers
  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!woTitle.trim()) return;

    const newReport: Report = {
      id: `HOA-${Math.floor(800 + Math.random() * 199)}`,
      userName: `${estateContext.unitPlotNumber} (${estateContext.userRole.toUpperCase()})`,
      isGuest: false,
      title: woTitle,
      description: woDescription || 'Reported via Private Estate Portal Work Order system.',
      category: woCategory,
      status: 'OPEN',
      severity: woTier === 'PRIVATE_UNIT' ? 'MEDIUM' : 'HIGH',
      latitude: 37.7750,
      longitude: -122.4190,
      addressText: woTier === 'PRIVATE_UNIT' ? `${estateContext.unitPlotNumber}, ${estateContext.phaseSector}` : woLocation,
      imageUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      upvotesCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedWorker: woTier === 'PRIVATE_UNIT' ? 'In-House On-Call Dispatch ($15 Fee)' : 'Carlos Mendez (Senior Tech)',
      slaHoursTarget: woTier === 'PRIVATE_UNIT' ? 4 : 12,
      slaDueDate: new Date(Date.now() + 3600000 * 4).toISOString(),
      slaStatus: 'ON_TRACK',
      officialNote: woTier === 'PRIVATE_UNIT' ? `Private unit work order created. Estimated bill: $${woPrivateRate}` : 'Community shared asset ticket queued for dispatch.',
    };

    setReports([newReport, ...reports]);
    setIsWorkOrderModalOpen(false);
    setWoTitle('');
    setWoDescription('');
    showToast(`Work Order #${newReport.id} created successfully! Dispatched to Estate Desk.`);
  };

  const handleGenerateVisitorPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visName.trim()) return;

    const code = `PV-${Math.floor(1000 + Math.random() * 8999)}-QR`;
    const newPass: VisitorPass = {
      id: `vis-${Date.now()}`,
      visitorName: visName,
      visitorPhone: visPhone || '+1 (555) 000-1122',
      vehiclePlate: visPlate || 'N/A',
      entryPurpose: visPurpose,
      validDate: new Date().toISOString().split('T')[0],
      passCode: code,
      status: 'APPROVED',
      gateNumber: 'Main Entrance Gate #1',
      createdAt: new Date().toISOString(),
    };

    setVisitorPasses([newPass, ...visitorPasses]);
    setIsVisitorModalOpen(false);
    setVisName('');
    setVisPhone('');
    setVisPlate('');
    showToast(`Gate Pass Generated! Code: ${code} pre-approved at Security Gate.`);
  };

  const handlePayDues = (billId: string) => {
    setMaintenanceBills(prev =>
      prev.map(b => (b.id === billId ? { ...b, status: 'PAID', paidOn: new Date().toISOString().split('T')[0], receiptNumber: `RCP-HOA-${Math.floor(10000 + Math.random() * 89999)}` } : b))
    );
    setEstateContext(prev => ({ ...prev, duesStatus: 'PAID' }));
    showToast('Society maintenance dues cleared! Official receipt generated.');
  };

  const handleTriggerPanic = () => {
    setPanicAlertActive(true);
    showToast('🚨 GATE PANIC ALERT ACTIVATED! Security Officer Marcus Vance & Patrol Unit notified with your GPS coordinates.');
    setTimeout(() => setPanicAlertActive(false), 8000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcastModalOpen(false);
    showToast(`Broadcast sent via SMS & App Push to all 148 residents in ${broadcastTargetSector}!`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#111827] dark:text-slate-100 font-['Montserrat'] pb-20">
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 max-w-md bg-[#0A2540] text-[#CCFF00] p-4 rounded-2xl shadow-xl border-2 border-[#006D5B] flex items-center gap-3 font-bold text-sm"
          >
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP WORKFLOW STEPPER NAVIGATION */}
      <div className="bg-[#0A2540] text-white border-b-2 border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#B45309] rounded-lg text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm sm:text-base tracking-wide text-white block">
                CITYSCAPE PRIVATE ESTATES & HOA PORTAL GATEWAY
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
                Dedicated Housing Society Licensing, Onboarding & Access Management
              </span>
            </div>
          </div>

          {/* Workflow Stepper Control */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setWorkflowStep('subscription')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                workflowStep === 'subscription'
                  ? 'bg-[#B45309] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">1</span>
              <span>1. Society Plans & Pricing</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            <button
              onClick={() => setWorkflowStep('checkout')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                workflowStep === 'checkout'
                  ? 'bg-[#B45309] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">2</span>
              <span>2. Onboard & Subscribe</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            <button
              onClick={() => setWorkflowStep('portal')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                workflowStep === 'portal'
                  ? 'bg-[#006D5B] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">3</span>
              <span>3. Live Estate Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================================
          WORKFLOW STEP 1: SOCIETY SUBSCRIPTION & PRICING LANDING PAGE
         ================================================================================= */}
      {workflowStep === 'subscription' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#B45309] dark:text-amber-400 font-extrabold text-xs border border-amber-300 dark:border-amber-800 uppercase tracking-widest">
              <BadgeCheck className="w-4 h-4" />
              HOA & Gated Community Licensing
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0A2540] dark:text-white tracking-tight">
              Transform Your Housing Society Operations
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
              Equip your gated community with automated RFID security barriers, QR visitor passes, resident work order SLAs, and real-time utility telemetry.
            </p>

            {/* Billing Cycle Switcher */}
            <div className="pt-4 flex items-center justify-center">
              <div className="inline-flex items-center bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-slate-900 text-[#0A2540] dark:text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    billingCycle === 'annual'
                      ? 'bg-[#0A2540] text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#B45309] text-white text-[10px] font-black uppercase">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Subscription Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* PLAN 1: Standard Housing Society */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-lg uppercase">
                    Standard Society
                  </span>
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0A2540] dark:text-white">
                      ${billingCycle === 'annual' ? '39' : '49'}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">/month</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                    {billingCycle === 'annual' ? 'Billed annually ($468/yr)' : 'Billed monthly'}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Ideal for small to medium housing societies needing basic gate logs, visitor management, and shared work orders.
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 100 Residential Units</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Visitor QR Pre-Approval Gate Passes</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Shared Community Asset Work Orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard 48h Maintenance SLA Target</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 line-through">
                    <X className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Generator & Utility Telemetry</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanId('standard');
                  setWorkflowStep('checkout');
                }}
                className="w-full py-4 bg-[#0A2540] hover:bg-[#006D5B] text-white font-black text-sm rounded-2xl border-2 border-[#0A2540] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[52px]"
              >
                <span>Select Standard Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PLAN 2: Premier Gated Estate (FEATURED / POPULAR) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-[#B45309] p-8 shadow-xl flex flex-col justify-between space-y-6 relative transform lg:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#B45309] text-white px-4 py-1 rounded-full font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Most Popular Choice</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-[#B45309] dark:text-amber-300 font-black text-xs rounded-lg uppercase">
                    Premier Gated Estate
                  </span>
                  <Shield className="w-6 h-6 text-[#B45309]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0A2540] dark:text-white">
                      ${billingCycle === 'annual' ? '119' : '149'}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">/month</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-bold pt-1">
                    {billingCycle === 'annual' ? 'Billed annually ($1,428/yr)' : 'Billed monthly'}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Full-stack management for gated communities requiring automated security barriers, resident unit repairs, and live generator telemetry.
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold">
                    <Check className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>Up to 500 Residential Units</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold">
                    <Check className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>RFID & QR Automated Security Barrier Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold">
                    <Check className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>Real-Time Generator & Water Pump Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold">
                    <Check className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>Private Unit Repair Desk ($15 Fee Dispatch)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold">
                    <Check className="w-4 h-4 text-[#B45309] shrink-0" />
                    <span>Security Guard Panic Emergency Dispatch</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanId('premier');
                  setWorkflowStep('checkout');
                }}
                className="w-full py-4 bg-[#B45309] hover:bg-amber-700 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[52px]"
              >
                <Zap className="w-4 h-4" />
                <span>Start 14-Day Free Society Trial</span>
              </button>
            </div>

            {/* PLAN 3: Enterprise Master HOA */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-lg uppercase">
                    Enterprise Master HOA
                  </span>
                  <Award className="w-6 h-6 text-[#006D5B]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0A2540] dark:text-white">
                      ${billingCycle === 'annual' ? '249' : '299'}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">/month</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                    {billingCycle === 'annual' ? 'Billed annually ($2,988/yr)' : 'Billed monthly'}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Enterprise solution for multi-phase master-planned townships with automated maintenance billing and dedicated 24/7 ops desk.
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited Units & Multi-Phase Sectors</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-Gate Barrier Sync & LPR Plate Scanners</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated Society Maintenance Billing</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24/7 Dedicated Operations Control Desk</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanId('enterprise');
                  setWorkflowStep('checkout');
                }}
                className="w-full py-4 bg-[#006D5B] hover:bg-teal-700 text-white font-black text-sm rounded-2xl border-2 border-[#006D5B] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[52px]"
              >
                <span>Select Enterprise Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direct Jump Footer */}
          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#0A2540] dark:text-white shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-[#0A2540] dark:text-white">
                  Already Have an Active Housing Society Subscription?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Jump directly into your live Gated Community Resident & Desk Portal.
                </p>
              </div>
            </div>
            <button
              onClick={() => setWorkflowStep('portal')}
              className="px-6 py-3 bg-[#0A2540] hover:bg-[#006D5B] text-white font-black text-xs rounded-xl transition-all shrink-0 cursor-pointer min-h-[44px]"
            >
              Enter Live Portal Directly →
            </button>
          </div>
        </div>
      )}

      {/* =================================================================================
          WORKFLOW STEP 2: ONBOARDING & PAID SUBSCRIPTION CHECKOUT GATEWAY
         ================================================================================= */}
      {workflowStep === 'checkout' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          <button
            onClick={() => setWorkflowStep('subscription')}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 dark:text-slate-300 hover:text-[#0A2540] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subscription Plans
          </button>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#0A2540] dark:text-white">
              Configure & Subscribe Your Housing Society
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
              Complete your estate setup details and activate your dedicated gated community license.
            </p>
          </div>

          <form onSubmit={handleCompleteSubscriptionCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ESTATE ONBOARDING CONFIGURATION */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-[#0A2540] dark:text-white font-black text-base">
                <Building2 className="w-5 h-5 text-[#B45309]" />
                <span>Step 1: Housing Society & Resident Details</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Gated Estate / Society Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardingEstateName}
                    onChange={(e) => setOnboardingEstateName(e.target.value)}
                    placeholder="e.g. Royal Palms Gated Community"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm focus:outline-none focus:border-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Plot / Villa / Unit # *
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardingPlot}
                      onChange={(e) => setOnboardingPlot(e.target.value)}
                      placeholder="e.g. Villa 142"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Sector / Phase *
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardingSector}
                      onChange={(e) => setOnboardingSector(e.target.value)}
                      placeholder="e.g. Sector B - Phase 2"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Initial Portal Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOnboardingRole('resident')}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer ${
                        onboardingRole === 'resident'
                          ? 'border-[#0A2540] bg-[#0A2540] text-white'
                          : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      Resident Owner
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingRole('board_admin')}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer ${
                        onboardingRole === 'board_admin'
                          ? 'border-[#006D5B] bg-[#006D5B] text-white'
                          : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Society Board Admin
                    </button>
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-[#0A2540] dark:text-white font-black text-base">
                  <CreditCard className="w-5 h-5 text-[#B45309]" />
                  <span>Step 2: Payment Details (Simulated Gateway)</span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & CONFIRMATION */}
            <div className="lg:col-span-5 bg-[#0A2540] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border-2 border-slate-800">
              <div className="space-y-1 pb-4 border-b border-slate-700">
                <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                  Subscription Summary
                </span>
                <h3 className="text-xl font-black text-white">
                  {selectedPlanId === 'standard' && 'Standard Society License'}
                  {selectedPlanId === 'premier' && 'Premier Gated Estate License'}
                  {selectedPlanId === 'enterprise' && 'Enterprise Master HOA License'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Billing Cycle:</span>
                  <span className="font-bold text-white uppercase">{billingCycle}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Monthly Equivalent:</span>
                  <span className="font-bold text-white">
                    ${selectedPlanId === 'standard' ? (billingCycle === 'annual' ? '39' : '49') : selectedPlanId === 'premier' ? (billingCycle === 'annual' ? '119' : '149') : (billingCycle === 'annual' ? '249' : '299')} / mo
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>14-Day Free Society Trial:</span>
                  <span className="font-bold text-emerald-400 uppercase">INCLUDED</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Target Units Enrolled:</span>
                  <span className="font-bold text-white">148 Resident Plots</span>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-between items-baseline text-sm font-black">
                  <span>Total Due Today:</span>
                  <span className="text-2xl text-[#CCFF00]">$0.00 (Trial Active)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  First charge will occur in 14 days unless cancelled via society board settings.
                </p>
              </div>

              {/* Status Animation if Processing */}
              {isSubmittingCheckout ? (
                <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500/40 text-center space-y-3">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs font-extrabold text-amber-300 animate-pulse">
                    {checkoutStepStatus}
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 bg-[#B45309] hover:bg-amber-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[56px]"
                >
                  <Lock className="w-5 h-5" />
                  <span>Confirm & Launch Private Portal</span>
                </button>
              )}

              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>256-Bit Encrypted Housing Society Gateway</span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================================
          WORKFLOW STEP 3: LIVE PRIVATE HOUSING SOCIETY & GATED COMMUNITY PORTAL
         ================================================================================= */}
      {workflowStep === 'portal' && (
        <>
          {/* EMERGENCY PANIC OVERRIDE BANNER */}
          {panicAlertActive && (
            <div className="bg-red-600 text-white px-4 py-3 text-center font-black animate-pulse flex items-center justify-center gap-2 border-b-4 border-red-900 shadow-lg">
              <Siren className="w-6 h-6 animate-bounce" />
              <span className="text-sm md:text-base tracking-wide">
                ESTATE SECURITY PANIC DISPATCHED • OFFICER MARCUS VANCE EN ROUTE TO {estateContext.unitPlotNumber.toUpperCase()}
              </span>
            </div>
          )}

          {/* TOP COMMUNITY ALERT NOTIFICATION */}
          <div className="bg-amber-500/15 dark:bg-amber-950/40 border-b-2 border-amber-500/30 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] uppercase font-black tracking-wider">
                  Estate Notice
                </span>
                <span>
                  Scheduled Power Switchover for Backup Generator Testing: Today 2:00 PM – 2:15 PM
                </span>
              </div>
              <span className="hidden sm:inline-block text-xs font-mono text-amber-700 dark:text-amber-300">
                Phase 2 Sector B
              </span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

            {/* TOAST NOTIFICATION FLOATER */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#006D5B] text-[#CCFF00] font-black text-xs sm:text-sm p-4 rounded-2xl border-2 border-[#CCFF00]/40 shadow-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>{toastMessage}</span>
                  </div>
                  <button onClick={() => setToastMessage(null)} className="p-1 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =========================================================================
                MULTI-TENANT GATED COMMUNITY BACKEND ENGINE & CUSTOMIZER HEADER
               ========================================================================= */}
            <div className="bg-[#0A2540] text-white p-5 rounded-3xl border-2 border-slate-700 shadow-xl space-y-4 font-['Montserrat']">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-[#006D5B] text-[#CCFF00] rounded-2xl font-black shrink-0 shadow-md">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#2DD4BF] uppercase block">
                      MULTITENANT GATED COMMUNITY ENGINE
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      {estateContext.estateName}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {estateContext.phaseSector} • {estateContext.gateOperatingHours || '24/7 Gate Guard'} • Dues: ${estateContext.duesAmountUsd}/mo
                    </p>
                  </div>
                </div>

                {/* Community Selector & Customizer Trigger */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <select
                      value={estateContext.id}
                      onChange={(e) => handleSelectCommunity(e.target.value)}
                      className="bg-slate-900 text-white font-extrabold text-xs px-3.5 py-3 rounded-2xl border-2 border-teal-500/60 outline-none focus:ring-2 focus:ring-[#CCFF00] min-h-[48px] cursor-pointer"
                    >
                      {allCommunities.map((comm) => (
                        <option key={comm.id} value={comm.id}>
                          🏡 {comm.estateName}
                        </option>
                      ))}
                      <option value="NEW_ONBOARDING">+ Onboard / Register New Gated Community</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
                    className="px-4 py-3 bg-[#B45309] hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 min-h-[48px] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                    <span>{isCustomizerOpen ? 'Close Settings' : 'Customize Estate Bylaws & Rules'}</span>
                  </button>
                </div>
              </div>

              {/* Custom Announcement Broadcast If Present */}
              {estateContext.customAnnouncement && (
                <div className="bg-amber-500/20 border-l-4 border-[#CCFF00] p-3 rounded-r-xl text-xs font-bold text-amber-200 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#CCFF00] shrink-0 animate-bounce" />
                  <span>{estateContext.customAnnouncement}</span>
                </div>
              )}

              {/* LIVE EDITABLE CUSTOMIZER PANEL */}
              <AnimatePresence>
                {isCustomizerOpen && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveCommunityCustomizer}
                    className="pt-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold"
                  >
                    <div className="col-span-full bg-slate-900/90 p-3 rounded-xl border border-teal-500/40 text-[#2DD4BF] font-black uppercase text-[11px] flex items-center justify-between">
                      <span>Backend Customization Studio — {estateContext.estateName}</span>
                      <span className="text-white text-[10px] font-mono">ID: {estateContext.id}</span>
                    </div>

                    {/* Bylaws & Rules Text Area */}
                    <div className="col-span-full md:col-span-2 space-y-1.5">
                      <label className="text-slate-200 font-extrabold block">
                        Custom Bylaws & Community Code of Conduct:
                      </label>
                      <textarea
                        rows={4}
                        value={editBylaws}
                        onChange={(e) => setEditBylaws(e.target.value)}
                        placeholder="Enter custom bylaws..."
                        className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 focus:border-teal-400 font-mono text-xs outline-none"
                      />
                    </div>

                    {/* Gate Hotline & Duty Officer */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-200 font-extrabold block mb-1">
                          Gate Hotline Phone Number:
                        </label>
                        <input
                          type="text"
                          value={editGatePhone}
                          onChange={(e) => setEditGatePhone(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-200 font-extrabold block mb-1">
                          Chief Security Duty Officer:
                        </label>
                        <input
                          type="text"
                          value={editOfficerName}
                          onChange={(e) => setEditOfficerName(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                        />
                      </div>
                    </div>

                    {/* Dues Amount & Gate Hours */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-200 font-extrabold block mb-1">
                          Monthly HOA Maintenance Dues ($):
                        </label>
                        <input
                          type="number"
                          value={editDuesAmount}
                          onChange={(e) => setEditDuesAmount(Number(e.target.value))}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-200 font-extrabold block mb-1">
                          Gate Clearance Hours:
                        </label>
                        <input
                          type="text"
                          value={editGateHours}
                          onChange={(e) => setEditGateHours(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                        />
                      </div>
                    </div>

                    {/* Emergency Hotline & Amenity Hours */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-200 font-extrabold block mb-1">
                          Emergency Patrol Phone:
                        </label>
                        <input
                          type="text"
                          value={editEmergencyPhone}
                          onChange={(e) => setEditEmergencyPhone(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-200 font-extrabold block mb-1">
                          Quiet Hours Schedule:
                        </label>
                        <input
                          type="text"
                          value={editQuietHours}
                          onChange={(e) => setEditQuietHours(e.target.value)}
                          className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                        />
                      </div>
                    </div>

                    {/* Custom Broadcast Announcement */}
                    <div className="col-span-full md:col-span-2 space-y-1.5">
                      <label className="text-slate-200 font-extrabold block">
                        Broadcast Estate Announcement Banner (Live to All Residents):
                      </label>
                      <input
                        type="text"
                        value={editAnnouncement}
                        onChange={(e) => setEditAnnouncement(e.target.value)}
                        placeholder="e.g., Water pressure maintenance scheduled today at 3:00 PM."
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 outline-none"
                      />
                    </div>

                    {/* Submit Save Button */}
                    <div className="col-span-full flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCustomizerOpen(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingCustomizer}
                        className="px-6 py-2.5 bg-[#006D5B] hover:bg-teal-600 text-[#CCFF00] font-black rounded-xl shadow-md cursor-pointer flex items-center gap-2 min-h-[44px]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
                        <span>{isSavingCustomizer ? 'Saving Settings...' : 'Save & Deploy Settings'}</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ACTIVE SUBSCRIPTION STATUS BANNER */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#006D5B] text-white p-4 rounded-2xl border-2 border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-6 h-6 text-[#CCFF00] shrink-0" />
                <div>
                  <span className="font-black text-white text-sm block">
                    ACTIVE HOA SUBSCRIPTION: {selectedPlanId.toUpperCase()} GATED ESTATE LICENSE (#LIC-HOA-8921)
                  </span>
                  <span className="text-slate-200">
                    Enrolled: {estateContext.estateName} • 148 Resident Plots • Next Renewal: Aug 2027
                  </span>
                </div>
              </div>

              <button
                onClick={() => setWorkflowStep('subscription')}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-xl border border-white/20 transition-all shrink-0 cursor-pointer text-xs"
              >
                Manage Subscription Plan
              </button>
            </div>

            {/* =========================================================================
                PATTERN 1: CONTEXTUAL SCOPE SWITCHER & VERIFICATION BAR
               ========================================================================= */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Estate Context Badge */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0A2540] text-white font-extrabold text-xs">
                      <Building2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      CURRENT CONTEXT
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                      {estateContext.unitPlotNumber}, {estateContext.phaseSector} ({estateContext.estateName})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-[#006D5B] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
                      <Shield className="w-3.5 h-3.5" />
                      {estateContext.membershipStatus.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-md border ${
                      estateContext.duesStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
                    }`}>
                      <CreditCard className="w-3.5 h-3.5" />
                      Society Dues: {estateContext.duesStatus === 'PAID' ? `Up-to-Date ($${estateContext.duesAmountUsd}/mo Paid)` : `Due ($${estateContext.duesAmountUsd})`}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsDuesModalOpen(true)}
                    className="text-xs text-[#B45309] dark:text-amber-400 font-bold hover:underline cursor-pointer block pt-1"
                  >
                    View Payment History
                  </button>
                </div>

            {/* Role Perspective Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 self-start lg:self-auto">
              <button
                onClick={() => setActivePortalRole('resident')}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                  activePortalRole === 'resident'
                    ? 'bg-[#0A2540] text-[#CCFF00] shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Resident View
              </button>
              <button
                onClick={() => setActivePortalRole('admin')}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                  activePortalRole === 'admin'
                    ? 'bg-[#006D5B] text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Operations Desk
              </button>
            </div>
          </div>

          {/* Contextual Scope Radio Selector */}
          <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Issue Reporting Scope:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-extrabold">
              <label
                onClick={() => setSelectedScope('INSIDE_ESTATE')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[48px] ${
                  selectedScope === 'INSIDE_ESTATE'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0A2540] dark:text-white border-[#006D5B] ring-2 ring-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={selectedScope === 'INSIDE_ESTATE'}
                  onChange={() => setSelectedScope('INSIDE_ESTATE')}
                  className="w-4 h-4 text-[#006D5B]"
                />
                <div className="flex flex-col">
                  <span>(●) Inside Gated Community</span>
                  <span className="text-[10px] font-normal text-slate-500">Routed directly to Society Admin & Private Crew</span>
                </div>
              </label>

              <label
                onClick={() => {
                  setSelectedScope('OUTER_MUNICIPAL');
                  if (onOpenPublicReportModal) onOpenPublicReportModal();
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[48px] ${
                  selectedScope === 'OUTER_MUNICIPAL'
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-[#0A2540] dark:text-white border-sky-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={selectedScope === 'OUTER_MUNICIPAL'}
                  onChange={() => setSelectedScope('OUTER_MUNICIPAL')}
                  className="w-4 h-4 text-sky-600"
                />
                <div className="flex flex-col">
                  <span>( ) Outer City / Municipal Road</span>
                  <span className="text-[10px] font-normal text-slate-500">Routed to City Council Public Works</span>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* =========================================================================
            RESIDENT PORTAL VIEW
           ========================================================================= */}
        {activePortalRole === 'resident' && (
          <div className="space-y-6">

            {/* =========================================================================
                PATTERN 3: INTEGRATED GATE & ESTATE SERVICE DASHBOARD WIDGETS
               ========================================================================= */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-[#006D5B]" />
                  Society Operational Status — {estateContext.phaseSector}
                </h2>
                <span className="text-xs font-mono font-bold text-slate-500">Real-time Telemetry</span>
              </div>

              {/* Status Micro-Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                      asset.status === 'OPERATIONAL'
                        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800'
                        : asset.status === 'MAINTENANCE'
                        ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                        : 'bg-red-50/50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {asset.category === 'GENERATOR' && <Zap className="w-5 h-5 text-amber-500" />}
                      {asset.category === 'SECURITY_GATE' && <Shield className="w-5 h-5 text-indigo-500" />}
                      {asset.category === 'WATER_PUMP' && <Droplets className="w-5 h-5 text-sky-500" />}
                      {asset.category === 'CLUBHOUSE_POOL' && <Sparkles className="w-5 h-5 text-teal-500" />}
                      {asset.category === 'SOLAR_GRID' && <Zap className="w-5 h-5 text-yellow-500" />}
                      {asset.category === 'SECTOR_LIGHTING' && <AlertTriangle className="w-5 h-5 text-red-500" />}

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        asset.status === 'OPERATIONAL'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : asset.status === 'MAINTENANCE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                      }`}>
                        {asset.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs text-[#0A2540] dark:text-white line-clamp-1">{asset.name}</h3>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">{asset.metricsText}</p>
                    </div>

                    {asset.scheduleText && (
                      <p className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                        {asset.scheduleText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================================
                PATTERN 3: SUBSCRIPTION-TIERED OPERATIONAL FEATURE CONSOLES
               ========================================================================= */}
            
            {/* FEATURE 1 & 2 GRID: RESIDENTIAL CAPACITY & RFID SECURITY BARRIER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* FEATURE 1: UP TO 500 RESIDENTIAL UNITS CAPACITY MANAGER */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#0A2540] text-white rounded-xl">
                      <Building2 className="w-5 h-5 text-[#2DD4BF]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-[#0A2540] dark:text-white">
                          Residential Unit Capacity Manager
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-[#B45309] dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[10px] uppercase">
                          Tier: {selectedPlanId.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Max {maxAllowedUnits === 9999 ? 'Unlimited' : maxAllowedUnits} Enrolled Residential Units
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddUnitModalOpen(true)}
                    className="px-3 py-2 bg-[#006D5B] hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Enroll Unit</span>
                  </button>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Current Society Enrolment: <strong className="text-[#0A2540] dark:text-white">{enrolledUnitsList.length} Units Active</strong>
                    </span>
                    <span className="font-mono text-slate-500">
                      {enrolledUnitsList.length} / {maxAllowedUnits === 9999 ? '∞' : maxAllowedUnits} Units ({Math.round((enrolledUnitsList.length / (maxAllowedUnits === 9999 ? 1000 : maxAllowedUnits)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        enrolledUnitsList.length >= maxAllowedUnits ? 'bg-red-500' : 'bg-[#006D5B]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, (enrolledUnitsList.length / (maxAllowedUnits === 9999 ? 1000 : maxAllowedUnits)) * 100))}%` }}
                    />
                  </div>
                  {enrolledUnitsList.length >= maxAllowedUnits && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-extrabold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Plan unit limit reached. Upgrade subscription to enroll up to 500 or unlimited units.
                    </p>
                  )}
                </div>

                {/* Enrolled Units Roster Preview Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                    Active Enrolled Plots & Villas Roster:
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    {enrolledUnitsList.map((unit, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-[#0A2540] dark:text-slate-200 flex items-center gap-1.5 shadow-2xs"
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#006D5B]" />
                        <span>{unit.plot}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* FEATURE 2: RFID & QR AUTOMATED SECURITY BARRIER CONTROL */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-5 shadow-sm relative overflow-hidden">
                {!isPlanFeatureAllowed('RFID_BARRIER') && (
                  <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <Lock className="w-10 h-10 text-amber-400" />
                    <h4 className="font-black text-white text-base">RFID & QR Automated Barrier Locked</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Automated gate RFID scanner barriers and plate reading features require a Premier or Enterprise Subscription.
                    </p>
                    <button
                      onClick={() => setWorkflowStep('subscription')}
                      className="px-5 py-2.5 bg-[#B45309] hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Upgrade to Premier Plan →
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-900 text-white rounded-xl">
                      <Shield className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#0A2540] dark:text-white">
                        RFID & QR Automated Security Gate Barrier
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Live Barrier State: <strong className="text-emerald-600 uppercase font-mono">{barrierStatus}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] uppercase">
                    RFID Active
                  </span>
                </div>

                {/* Barrier Control Switches */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleSimulateRfidScan}
                    className="p-3 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 rounded-xl text-center cursor-pointer transition-all space-y-1"
                  >
                    <Car className="w-5 h-5 text-indigo-600 mx-auto" />
                    <span className="block font-black text-[11px] text-indigo-950 dark:text-indigo-200">
                      Simulate RFID Car Entry
                    </span>
                  </button>

                  <button
                    onClick={() => setBarrierStatus('MANUALLY_OPEN')}
                    className="p-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center cursor-pointer transition-all space-y-1"
                  >
                    <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="block font-black text-[11px] text-emerald-950 dark:text-emerald-200">
                      Force Lift Barrier
                    </span>
                  </button>

                  <button
                    onClick={() => setBarrierStatus('LOCKDOWN')}
                    className="p-3 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 border border-red-200 dark:border-red-800 rounded-xl text-center cursor-pointer transition-all space-y-1"
                  >
                    <Lock className="w-5 h-5 text-red-600 mx-auto" />
                    <span className="block font-black text-[11px] text-red-950 dark:text-red-200">
                      Gate Lockdown
                    </span>
                  </button>
                </div>

                {/* Live RFID Scan Log Stream */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Recent RFID Tag Passes & Scanner Logs:
                  </span>
                  <div className="space-y-1.5 font-mono text-xs">
                    {rfidLogs.slice(0, 2).map((log) => (
                      <div key={log.id} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.tag}</span>
                          <span className="text-slate-600 dark:text-slate-300">{log.unit}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* FEATURE 3 & 5 GRID: UTILITY TELEMETRY & PANIC EMERGENCY GUARD DISPATCH */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* FEATURE 3: REAL-TIME GENERATOR & WATER PUMP TELEMETRY */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-5 shadow-sm relative overflow-hidden">
                {!isPlanFeatureAllowed('REALTIME_TELEMETRY') && (
                  <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <Lock className="w-10 h-10 text-amber-400" />
                    <h4 className="font-black text-white text-base">Real-Time Utility Telemetry Locked</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Live fuel monitoring, water tank telemetry, and backup pump switches require a Premier or Enterprise Subscription.
                    </p>
                    <button
                      onClick={() => setWorkflowStep('subscription')}
                      className="px-5 py-2.5 bg-[#B45309] hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Upgrade to Premier Plan →
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500 text-white rounded-xl">
                      <Zap className="w-5 h-5 text-yellow-200" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#0A2540] dark:text-white">
                        Real-Time Utility Telemetry & Sensor Controls
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Generator Fuel: <strong className="text-amber-600 font-mono">{generatorFuel}% (340 Gal)</strong> • Water Reservoir: <strong className="text-sky-600 font-mono">{waterTankLevel}% (42,000 Gal)</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Generator Telemetry */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-600" />
                        Diesel Backup Generator
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        240V Standby
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <span>Fuel Level</span>
                        <span className="font-mono">{generatorFuel}% Tank</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${generatorFuel}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={handleTestRunGenerator}
                      disabled={isGeneratorTesting}
                      className="w-full py-2 bg-[#0A2540] hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isGeneratorTesting ? 'Running 15s Diagnostic...' : 'Test Run Generator (15s)'}</span>
                    </button>
                  </div>

                  {/* Water Pump Telemetry */}
                  <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-sky-600" />
                        Main Water Overhead Tank
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-sky-200 text-sky-900 px-2 py-0.5 rounded">
                        62 PSI Pressure
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <span>Water Capacity</span>
                        <span className="font-mono">{waterTankLevel}% (Pump #{activePumpNumber} Active)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${waterTankLevel}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={handleCycleWaterPump}
                      className="w-full py-2 bg-[#006D5B] hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Cycle Primary Water Pump #{activePumpNumber === 1 ? 2 : 1}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FEATURE 5: SECURITY GUARD PANIC EMERGENCY DISPATCH MONITOR */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-red-300 dark:border-red-900 p-6 space-y-5 shadow-sm relative overflow-hidden">
                {!isPlanFeatureAllowed('PANIC_GUARD_DISPATCH') && (
                  <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <Lock className="w-10 h-10 text-red-400" />
                    <h4 className="font-black text-white text-base">Guard Panic Emergency Dispatch Locked</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Automated security guard dispatch with live officer ETA tracking requires a Premier or Enterprise Subscription.
                    </p>
                    <button
                      onClick={() => setWorkflowStep('subscription')}
                      className="px-5 py-2.5 bg-[#B45309] hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Upgrade to Premier Plan →
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-red-600 text-white rounded-xl">
                      <Siren className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#0A2540] dark:text-white">
                        Security Guard Panic Emergency Dispatch
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        24/7 Gate Dispatch Desk • Officer Marcus Vance Assigned
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-black text-[10px] uppercase">
                    {guardDispatched ? 'DISPATCH ACTIVE' : 'STANDBY READY'}
                  </span>
                </div>

                {guardDispatched ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/60 rounded-2xl border-2 border-red-500 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-xs text-red-900 dark:text-red-200 block">
                          ESTATE SECURITY DISPATCHED
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold">
                          {guardOfficerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
                          02:15
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">ETA Countdown</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => showToast('📞 Radio Dispatch Call Connected to Security Guard Patrol Vehicle #04')}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl cursor-pointer min-h-[44px]"
                      >
                        Call Dispatched Officer
                      </button>
                      <button
                        onClick={() => {
                          setGuardDispatched(false);
                          setPanicAlertActive(false);
                          showToast('✅ Security Panic Resolved & Dispatched Guard Notified.');
                        }}
                        className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl cursor-pointer min-h-[44px]"
                      >
                        De-escalate & Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Pressing the Security Panic trigger immediately alerts the gate guard control room, dispatches the patrol officer to your plot ({estateContext.unitPlotNumber}), and transmits emergency GPS coordinates.
                    </p>
                    <button
                      onClick={handleTriggerPanicWithGuardDispatch}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <Siren className="w-5 h-5 text-yellow-300 animate-bounce" />
                      <span>🚨 Dispatch Security Guard to {estateContext.unitPlotNumber}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setIsWorkOrderModalOpen(true)}
                className="p-4 bg-[#0A2540] text-white hover:bg-[#006D5B] rounded-2xl border-2 border-[#0A2540] font-black text-xs sm:text-sm flex flex-col items-center justify-center text-center gap-2 shadow-sm min-h-[80px] cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Plus className="w-6 h-6 text-[#2DD4BF]" />
                <span>+ Report Estate Issue / Work Order</span>
              </button>

              <button
                onClick={() => setIsVisitorModalOpen(true)}
                className="p-4 bg-white dark:bg-slate-900 text-[#0A2540] dark:text-white hover:bg-slate-50 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 font-black text-xs sm:text-sm flex flex-col items-center justify-center text-center gap-2 shadow-sm min-h-[80px] cursor-pointer transition-all hover:scale-[1.02]"
              >
                <UserPlus className="w-6 h-6 text-[#006D5B]" />
                <span>Pre-Approve Visitor / Gate QR</span>
              </button>

              <button
                onClick={handleTriggerPanic}
                className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl border-2 border-red-700 font-black text-xs sm:text-sm flex flex-col items-center justify-center text-center gap-2 shadow-md min-h-[80px] cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Siren className="w-6 h-6 text-yellow-300 animate-bounce" />
                <span>🚨 Security Gate Panic Button</span>
              </button>
            </div>

            {/* VISITOR LOG & GATE PASSES SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#006D5B]" />
                    Gate Access & Pre-Approved Visitor Passes
                  </h3>
                  <p className="text-xs text-slate-500">Scanned at RFID barriers & Gate Security Desk</p>
                </div>
                <button
                  onClick={() => setIsVisitorModalOpen(true)}
                  className="px-3 py-2 bg-[#006D5B] text-white text-xs font-extrabold rounded-xl hover:bg-[#005244] min-h-[44px] cursor-pointer"
                >
                  + New Gate Pass
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visitorPasses.map((pass) => (
                  <div
                    key={pass.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#0A2540] dark:text-white">{pass.visitorName}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          pass.status === 'APPROVED' ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {pass.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{pass.entryPurpose}</p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Phone: {pass.visitorPhone} • Vehicle: {pass.vehiclePlate || 'Walk-in'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 flex flex-col items-center">
                        <QrCode className="w-8 h-8 text-[#0A2540] dark:text-teal-400" />
                        <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300 mt-1">{pass.passCode}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVE ESTATE WORK ORDERS QUEUE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#B45309]" />
                    Estate Work Orders & Repair Logs
                  </h3>
                  <p className="text-xs text-slate-500">Tracked under contracted private society SLA</p>
                </div>
                <button
                  onClick={() => setIsWorkOrderModalOpen(true)}
                  className="px-3 py-2 bg-[#0A2540] text-white text-xs font-extrabold rounded-xl hover:bg-[#006D5B] min-h-[44px] cursor-pointer"
                >
                  + New Request
                </button>
              </div>

              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => onSelectReportDetail && onSelectReportDetail(report)}
                    className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#006D5B] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#006D5B] bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                          #{report.id}
                        </span>
                        <h4 className="font-extrabold text-sm text-[#0A2540] dark:text-white">{report.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {report.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{report.description}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                        <span>Location: {report.addressText}</span>
                        <span>Assigned: {report.assignedWorker || 'Estate Crew'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          SLA Target: {report.slaHoursTarget || 4}h
                        </span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          {report.status}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            PATTERN 4: ESTATE MANAGEMENT COMMAND BOARD (ADMIN PERSPECTIVE)
           ========================================================================= */}
        {activePortalRole === 'admin' && (
          <div className="space-y-6">

            {/* Admin Header & Batch Announcement Launcher */}
            <div className="bg-[#0A2540] text-white p-5 rounded-2xl shadow-md border-2 border-[#006D5B] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#006D5B] text-[#CCFF00] font-black text-[10px] uppercase tracking-wider">
                  HOA COMMAND DESK
                </span>
                <h2 className="text-lg font-black mt-1">Estate Operations Desk & Dispatch Controller</h2>
                <p className="text-xs text-slate-300">{estateContext.estateName} • {estateContext.phaseSector} • 148 Residential Units</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="px-4 py-2.5 bg-[#B45309] hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 min-h-[44px] cursor-pointer shadow-sm"
                >
                  <Bell className="w-4 h-4" />
                  Broadcast Resident SMS Notice
                </button>
              </div>
            </div>

            {/* HOA Admin Navigation Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setActiveAdminSubTab('history')}
                className={`px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                  activeAdminSubTab === 'history'
                    ? 'bg-[#0A2540] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <History className={`w-4 h-4 ${activeAdminSubTab === 'history' ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                <span>Task Assignment History & Audit Trail</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  activeAdminSubTab === 'history' ? 'bg-[#006D5B] text-[#CCFF00]' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  Live Audit
                </span>
              </button>

              <button
                onClick={() => setActiveAdminSubTab('queue')}
                className={`px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                  activeAdminSubTab === 'queue'
                    ? 'bg-[#0A2540] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeAdminSubTab === 'queue' ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                <span>Work Orders Queue & SLA Desk</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  activeAdminSubTab === 'queue' ? 'bg-[#006D5B] text-[#CCFF00]' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {reports.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminSubTab('contractors')}
                className={`px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                  activeAdminSubTab === 'contractors'
                    ? 'bg-[#0A2540] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Users className={`w-4 h-4 ${activeAdminSubTab === 'contractors' ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                <span>Authorized Contractors Directory</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  activeAdminSubTab === 'contractors' ? 'bg-[#006D5B] text-[#CCFF00]' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {staffMembers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminSubTab('telemetry')}
                className={`px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                  activeAdminSubTab === 'telemetry'
                    ? 'bg-[#0A2540] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Navigation className={`w-4 h-4 ${activeAdminSubTab === 'telemetry' ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                <span>GIS Real-Time Patrol & Telemetry</span>
              </button>

              <button
                id="btn-hoa-gov-liaison-tab"
                onClick={() => setActiveAdminSubTab('liaison')}
                className={`px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer min-h-[44px] border ${
                  activeAdminSubTab === 'liaison'
                    ? 'bg-gradient-to-r from-[#006D5B] to-[#0A2540] text-white shadow-md border-teal-300'
                    : 'bg-teal-50/70 dark:bg-teal-950/40 text-[#006D5B] dark:text-teal-200 border-teal-300 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                }`}
              >
                <Building2 className={`w-4 h-4 ${activeAdminSubTab === 'liaison' ? 'text-[#CCFF00]' : 'text-[#006D5B] dark:text-teal-300'}`} />
                <span>Municipal Governance Liaison</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#006D5B] text-white font-bold">
                  ESCALATION BRIDGE
                </span>
              </button>
            </div>

            {/* TAB: MUNICIPAL GOVERNANCE LIAISON & ESCALATION HUB */}
            {activeAdminSubTab === 'liaison' && (
              <GovernanceLiaisonHub
                userPersona="HOA_ADMIN"
                onSelectReport={(repId) => {
                  const rep = reports.find((r) => r.id === repId);
                  if (rep && onSelectReportDetail) onSelectReportDetail(rep);
                }}
              />
            )}

            {/* TAB 1: TASK ASSIGNMENT HISTORY & AUDIT LOG */}
            {activeAdminSubTab === 'history' && (
              <HoaTaskAssignmentHistoryView
                estateContext={estateContext}
                reports={reports}
                onSelectReport={onSelectReportDetail}
                isPlanFeatureAllowed={isPlanFeatureAllowed}
              />
            )}

            {/* TAB 2: WORK ORDERS QUEUE & SLA DESK */}
            {activeAdminSubTab === 'queue' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#006D5B]" />
                      Private Estate Work Orders Queue & Contract SLA Tracking
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pending maintenance requests routed directly to contracted private society vendors
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveAdminSubTab('history')}
                    className="px-3.5 py-2 bg-[#006D5B] hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 min-h-[40px] cursor-pointer"
                  >
                    <History className="w-4 h-4" />
                    <span>View Full Assignment Audit History</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-['Montserrat']">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-[#0A2540] dark:text-slate-200 border-b-2 border-slate-300 dark:border-slate-700 font-extrabold uppercase">
                        <th className="p-3">Ticket ID</th>
                        <th className="p-3">Location / Plot</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Assigned Contractor</th>
                        <th className="p-3">Contracted SLA Target</th>
                        <th className="p-3 text-right">Dispatch Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-bold text-[#006D5B]">#{report.id}</td>
                          <td className="p-3 font-bold">{report.addressText}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold">
                              {report.category}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                            {report.assignedWorker || 'Unassigned Contractor'}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-mono font-black text-[10px]">
                              SLA: {report.slaHoursTarget || 4}h (URGENT)
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setActiveAdminSubTab('history');
                                showToast(`Opening Assignment Audit & Dispatch Desk for Work Order #${report.id}...`);
                              }}
                              className="px-3 py-1.5 bg-[#006D5B] text-white rounded-xl font-bold text-[11px] hover:bg-[#005244] cursor-pointer inline-flex items-center gap-1"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Dispatch / Audit</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: AUTHORIZED CONTRACTORS DIRECTORY */}
            {activeAdminSubTab === 'contractors' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#006D5B]" />
                      Pre-Approved HOA Contractors & Trade Specialists
                    </h3>
                    <p className="text-xs text-slate-500">
                      Licensed vendors cleared for RFID access and priority dispatching
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveAdminSubTab('history')}
                    className="px-3 py-2 bg-[#B45309] text-white text-xs font-black rounded-xl hover:bg-amber-700 cursor-pointer flex items-center gap-1.5 min-h-[40px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Dispatch Contractor</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border-2 border-slate-200 dark:border-slate-700 space-y-3 hover:border-[#006D5B] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatarUrl}
                          alt={staff.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#006D5B]"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-sm text-[#0A2540] dark:text-white">{staff.name}</h4>
                          <p className="text-xs text-slate-500">{staff.roleTitle}</p>
                          <span className="font-mono text-[10px] text-[#006D5B] font-bold">
                            Badge: {staff.badgeId || 'HOA-CERT-01'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Vendor Firm:</span>
                          <strong className="text-slate-800 dark:text-slate-200">{staff.vendorCompany || 'Independent Specialist'}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Hourly Rate:</span>
                          <strong className="text-[#006D5B] font-mono font-bold">${staff.hourlyRateUsd || 65} / hr</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned Sector:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{staff.sectorAssigned}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Rating & Work Orders:</span>
                          <span className="font-bold text-amber-600">★ {staff.rating || 4.9} ({staff.totalResolvedOrders || 40} resolved)</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <a
                          href={`tel:${staff.phone}`}
                          className="flex-1 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100 min-h-[40px]"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#006D5B]" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={() => {
                            setActiveAdminSubTab('history');
                            showToast(`Selected ${staff.name} for new dispatch order.`);
                          }}
                          className="flex-1 py-2 bg-[#006D5B] hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: GIS REAL-TIME PATROL & TELEMETRY */}
            {activeAdminSubTab === 'telemetry' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4 shadow-sm">
                <h3 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-indigo-500" />
                  Real-time Workforce & Security Patrol Positions (GIS Sector Tracking)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-3"
                    >
                      <img
                        src={staff.avatarUrl}
                        alt={staff.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#006D5B]"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-[#0A2540] dark:text-white">{staff.name}</h4>
                        <p className="text-[11px] text-slate-500">{staff.roleTitle}</p>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                            {staff.status}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">{staff.sectorAssigned}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            FIELD TECHNICIAN APP PERSPECTIVE
           ========================================================================= */}
        {activePortalRole === 'technician' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#B45309] text-white p-5 rounded-2xl shadow-md space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-200 font-mono font-black text-[10px] uppercase">
                FIELD CREW MOBILE APP
              </span>
              <h2 className="text-lg font-black">Contracted Maintenance Dispatch</h2>
              <p className="text-xs text-amber-100">Logged in as: Carlos Mendez (Senior Electrical Tech)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-black text-[#0A2540] dark:text-white">Assigned Work Order Tasks</h3>
              
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border-2 border-amber-300 dark:border-amber-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-amber-900 dark:text-amber-200">#HOA-882</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">IN PROGRESS</span>
                </div>
                <h4 className="font-extrabold text-sm text-[#0A2540] dark:text-white">Sewerage Line Leak on Lane 14 Crossing</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Vacuum tanker deployed. Replace damaged PVC coupling at junction box 4B.
                </p>

                <div className="space-y-2 pt-2 border-t border-amber-200 dark:border-amber-800 text-xs">
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#006D5B]" />
                    <span>Safety Zone Barricades Erected</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#006D5B]" />
                    <span>Vacuum Extraction Complete</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#006D5B]" />
                    <span>Replace Coupling & Pressure Test</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => showToast('Completion signature & before/after photo uploaded to HOA Desk!')}
                    className="w-full py-2.5 bg-[#006D5B] text-white font-extrabold text-xs rounded-xl hover:bg-[#005244] min-h-[44px] cursor-pointer"
                  >
                    Mark Job Resolved & Upload Sign-Off
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
        </>
      )}

      {/* =========================================================================
          PATTERN 2: DUAL-TIER WORK ORDER MODAL (PRIVATE UNIT vs COMMUNITY SHARED)
         ========================================================================= */}
      <AnimatePresence>
        {isWorkOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">Create Estate Work Order</h3>
                  <p className="text-xs text-slate-500">Private Unit Repair vs Shared Asset Maintenance</p>
                </div>
                <button
                  onClick={() => setIsWorkOrderModalOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tier Selection Card Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => setWoTier('PRIVATE_UNIT')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 ${
                    woTier === 'PRIVATE_UNIT'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-600 ring-2 ring-amber-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#0A2540] dark:text-white">
                      [ A. PRIVATE PROPERTY WORK ORDER ]
                    </span>
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Inside your unit (Plumbing, Electrical, Private Yard)
                  </p>
                  <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300 pt-1">
                    • Out-of-pocket / Billable to Unit ($15 Base Fee)
                    <br />• Same-Day Urgent Dispatch Available
                  </div>
                </div>

                <div
                  onClick={() => setWoTier('COMMUNITY_SHARED')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 ${
                    woTier === 'COMMUNITY_SHARED'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-[#006D5B] ring-2 ring-teal-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#0A2540] dark:text-white">
                      [ B. COMMUNITY SHARED ASSET ]
                    </span>
                    <Building2 className="w-4 h-4 text-[#006D5B]" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Common areas (Sector Streetlight, Pool, Security Gate)
                  </p>
                  <div className="text-[11px] font-mono text-teal-800 dark:text-teal-300 pt-1">
                    • Covered by Monthly Society Dues ($0 extra)
                    <br />• Governed by Board Contract SLA
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleCreateWorkOrder} className="space-y-4 text-xs font-['Montserrat']">
                {woTier === 'PRIVATE_UNIT' && (
                  <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      Fixed Rate Estimate Card:
                    </span>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-mono">
                      Inspection: $15 | Plumbing Leak Fix: $35 | AC Coil Cleaning: $25 | Electrical Fix: $40
                    </p>
                  </div>
                )}

                <div>
                  <label className="block font-extrabold text-slate-800 dark:text-slate-200 mb-1">
                    Work Order Title / Issue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={woTitle}
                    onChange={(e) => setWoTitle(e.target.value)}
                    placeholder={woTier === 'PRIVATE_UNIT' ? 'e.g., Master Bedroom Bathroom Pipe Leak' : 'e.g., Sector B Lane 4 Streetlight Failure'}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006D5B] min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 dark:text-slate-200 mb-1">
                    Category
                  </label>
                  <select
                    value={woCategory}
                    onChange={(e) => setWoCategory(e.target.value as any)}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#006D5B] min-h-[48px]"
                  >
                    <option value="WATER_LEAK">Plumbing & Water Leak</option>
                    <option value="LIGHTING">Electrical & Lighting</option>
                    <option value="SANITATION">Sanitation & Garbage</option>
                    <option value="VANDALISM">Security & Gate Sensors</option>
                    <option value="OTHER">Other Estate Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 dark:text-slate-200 mb-1">
                    Detailed Notes / Observations
                  </label>
                  <textarea
                    rows={3}
                    value={woDescription}
                    onChange={(e) => setWoDescription(e.target.value)}
                    placeholder="Describe problem, preferred time slot, or special entry instructions for technician..."
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#006D5B]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWorkOrderModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl hover:bg-slate-300 min-h-[44px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0A2540] text-white font-black rounded-xl hover:bg-[#006D5B] min-h-[44px] cursor-pointer"
                  >
                    Submit Work Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VISITOR PASS MODAL */}
      <AnimatePresence>
        {isVisitorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white">Pre-Approve Visitor Gate Pass</h3>
                  <p className="text-xs text-slate-500">Security Gate Instant Entry QR</p>
                </div>
                <button onClick={() => setIsVisitorModalOpen(false)} className="p-2 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateVisitorPass} className="space-y-3 text-xs font-['Montserrat']">
                <div>
                  <label className="block font-bold mb-1">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={visName}
                    onChange={(e) => setVisName(e.target.value)}
                    placeholder="e.g. David Miller"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Visitor Mobile Phone</label>
                  <input
                    type="tel"
                    value={visPhone}
                    onChange={(e) => setVisPhone(e.target.value)}
                    placeholder="+1 (555) 000-1122"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Vehicle License Plate (Optional)</label>
                  <input
                    type="text"
                    value={visPlate}
                    onChange={(e) => setVisPlate(e.target.value)}
                    placeholder="e.g. 7XYZ890"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none min-h-[48px]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVisitorModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl min-h-[44px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#006D5B] text-white font-black rounded-xl hover:bg-[#005244] min-h-[44px] cursor-pointer"
                  >
                    Generate Pass QR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DUES PAYMENT HISTORY MODAL */}
      <AnimatePresence>
        {isDuesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white">Society Maintenance Dues Ledger</h3>
                  <p className="text-xs text-slate-500">{estateContext.unitPlotNumber} ({estateContext.estateName})</p>
                </div>
                <button onClick={() => setIsDuesModalOpen(false)} className="p-2 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {maintenanceBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <h4 className="font-extrabold text-[#0A2540] dark:text-white">{bill.periodLabel}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Due Date: {bill.dueDate} • Amount: ${bill.amountUsd}
                      </p>
                      {bill.receiptNumber && (
                        <p className="text-[10px] text-emerald-600 font-mono">Receipt: {bill.receiptNumber}</p>
                      )}
                    </div>

                    <div>
                      {bill.status === 'PAID' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg text-[10px]">
                          PAID
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePayDues(bill.id)}
                          className="px-3 py-1.5 bg-[#B45309] text-white font-extrabold rounded-lg text-xs hover:bg-amber-700 cursor-pointer min-h-[36px]"
                        >
                          Pay ${bill.amountUsd}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BATCH ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {isBroadcastModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white">Batch Sector Announcement Engine</h3>
                  <p className="text-xs text-slate-500">Converts ticket update into instant SMS & App Push</p>
                </div>
                <button onClick={() => setIsBroadcastModalOpen(false)} className="p-2 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs font-['Montserrat']">
                <div>
                  <label className="block font-bold mb-1">Target Sector / Lane</label>
                  <select
                    value={broadcastTargetSector}
                    onChange={(e) => setBroadcastTargetSector(e.target.value)}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold min-h-[48px]"
                  >
                    <option value="Sector B - Royal Palms">Sector B - Royal Palms (148 Residents)</option>
                    <option value="Sector A - Grand Villas">Sector A - Grand Villas (92 Residents)</option>
                    <option value="Entire HOA Community">Entire HOA Community (420 Residents)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">SMS Notice Text</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl min-h-[44px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#B45309] text-white font-black rounded-xl hover:bg-amber-700 min-h-[44px] cursor-pointer"
                  >
                    Send Sector SMS & Push
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENROLL NEW RESIDENTIAL UNIT MODAL */}
      <AnimatePresence>
        {isAddUnitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white">Enroll Residential Unit</h3>
                  <p className="text-xs text-slate-500">Plan Limit: {enrolledUnitsList.length} / {maxAllowedUnits === 9999 ? '∞' : maxAllowedUnits} Units Enrolled</p>
                </div>
                <button onClick={() => setIsAddUnitModalOpen(false)} className="p-2 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollNewUnit} className="space-y-4 text-xs font-['Montserrat']">
                <div>
                  <label className="block font-bold mb-1">Plot / Villa / Unit Identifier *</label>
                  <input
                    type="text"
                    required
                    value={newUnitPlotName}
                    onChange={(e) => setNewUnitPlotName(e.target.value)}
                    placeholder="e.g., Villa 143 or Plot 88"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Resident Owner Name</label>
                  <input
                    type="text"
                    value={newUnitOwnerName}
                    onChange={(e) => setNewUnitOwnerName(e.target.value)}
                    placeholder="e.g., Sophia Martinez"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-medium min-h-[48px]"
                  />
                </div>

                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 font-mono">
                  • Enrolling a unit authorizes RFID barrier tags and grants portal credentials under current society plan.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUnitModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl min-h-[44px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#006D5B] text-white font-black rounded-xl hover:bg-teal-700 min-h-[44px] cursor-pointer"
                  >
                    + Confirm Enrolment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Simple Activity Icon helper
function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
