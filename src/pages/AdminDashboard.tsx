import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { AdminMetrics, PaymentTransaction, User, Subject, Lesson, Quiz, Summary } from '../types/index';
import {
  ShieldCheck,
  Users,
  CreditCard,
  BookOpen,
  FileText,
  CheckSquare,
  Plus,
  Trash2,
  Edit3,
  Bell,
  Settings,
  DollarSign,
  TrendingUp,
  Download,
  Lock,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';

export function AdminDashboard() {
  const {
    currentUser,
    subjects,
    subscriptionPlans,
    platformSettings,
    addSubject,
    updateSubject,
    deleteSubject,
    addLesson,
    updateLesson,
    deleteLesson,
    addPdf,
    deletePdf,
    addSummary,
    updateSummary,
    deleteSummary,
    addQuiz,
    deleteQuiz,
    updatePlanPrice,
    broadcastNotification,
    updatePlatformSettings,
    navParams,
    navigateTo,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'subjects' | 'lessons' | 'summaries' | 'pdfs' | 'quizzes' | 'pricing' | 'users' | 'notifications' | 'settings'
  >((navParams.tab as any) || 'overview');

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [allSummaries, setAllSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');

  // Edit Subject state
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editSubjectTitle, setEditSubjectTitle] = useState('');
  const [editSubjectCode, setEditSubjectCode] = useState('');
  const [editSubjectDesc, setEditSubjectDesc] = useState('');
  const [editSubjectColor, setEditSubjectColor] = useState('emerald');
  const [editSubjectIcon, setEditSubjectIcon] = useState('BookOpen');

  // Edit Lesson state
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonSubjectId, setEditLessonSubjectId] = useState('');
  const [editLessonExcerpt, setEditLessonExcerpt] = useState('');
  const [editLessonQuickSummary, setEditLessonQuickSummary] = useState('');
  const [editLessonContent, setEditLessonContent] = useState('');
  const [editLessonReadingTime, setEditLessonReadingTime] = useState(10);
  const [editLessonIsPremium, setEditLessonIsPremium] = useState(false);

  // Edit Summary state
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null);
  const [editSumTitle, setEditSumTitle] = useState('');
  const [editSumSubjectId, setEditSumSubjectId] = useState('');
  const [editSumExcerpt, setEditSumExcerpt] = useState('');
  const [editSumPoints, setEditSumPoints] = useState('');
  const [editSumFullText, setEditSumFullText] = useState('');
  const [editSumIsPremium, setEditSumIsPremium] = useState(false);

  // Lesson Form
  const [newLessonSubjectId, setNewLessonSubjectId] = useState(subjects[0]?.id || '');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonExcerpt, setNewLessonExcerpt] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonIsPremium, setNewLessonIsPremium] = useState(false);
  const [newLessonReadingTime, setNewLessonReadingTime] = useState(10);

  // Summary Form
  const [newSumSubjectId, setNewSumSubjectId] = useState(subjects[0]?.id || '');
  const [newSumTitle, setNewSumTitle] = useState('');
  const [newSumExcerpt, setNewSumExcerpt] = useState('');
  const [newSumPoints, setNewSumPoints] = useState('');
  const [newSumContent, setNewSumContent] = useState('');
  const [newSumIsPremium, setNewSumIsPremium] = useState(false);

  // PDF Form
  const [newPdfSubjectId, setNewPdfSubjectId] = useState(subjects[0]?.id || '');
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfDesc, setNewPdfDesc] = useState('');
  const [newPdfSize, setNewPdfSize] = useState('2.4 MB');
  const [newPdfPages, setNewPdfPages] = useState(18);
  const [newPdfIsPremium, setNewPdfIsPremium] = useState(true);

  // Quiz Form
  const [newQuizSubjectId, setNewQuizSubjectId] = useState(subjects[0]?.id || '');
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizIsPremium, setNewQuizIsPremium] = useState(false);
  const [newQ1Text, setNewQ1Text] = useState('');
  const [newQ1OptA, setNewQ1OptA] = useState('');
  const [newQ1OptB, setNewQ1OptB] = useState('');
  const [newQ1OptC, setNewQ1OptC] = useState('');
  const [newQ1Correct, setNewQ1Correct] = useState('');
  const [newQ1Exp, setNewQ1Exp] = useState('');

  // Notification Broadcast Form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  // Pricing Form
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});

  // Platform Settings Form
  const [settingsAppName, setSettingsAppName] = useState(platformSettings.appName);
  const [settingsTagline, setSettingsTagline] = useState(platformSettings.tagline);
  const [settingsLogoText, setSettingsLogoText] = useState(platformSettings.logoText);
  const [settingsEmail, setSettingsEmail] = useState(platformSettings.supportEmail);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      try {
        const [mRes, uRes, lRes, sRes] = await Promise.all([
          fetch('/api/admin/metrics'),
          fetch('/api/admin/users'),
          fetch('/api/lessons'),
          fetch('/api/summaries'),
        ]);
        if (mRes.ok) setMetrics(await mRes.json());
        if (uRes.ok) setUsersList(await uRes.json());
        if (lRes.ok) setAllLessons(await lRes.json());
        if (sRes.ok) setAllSummaries(await sRes.json());
      } catch (e) {
        console.error('Failed to load admin data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectTitle) return;
    const ok = await addSubject({
      title: newSubjectTitle,
      code: newSubjectCode || `SUBJ-${subjects.length + 1}`,
      description: newSubjectDesc,
    });
    if (ok) {
      setNewSubjectTitle('');
      setNewSubjectCode('');
      setNewSubjectDesc('');
    }
  };

  const handleOpenEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setEditSubjectTitle(subject.title);
    setEditSubjectCode(subject.code);
    setEditSubjectDesc(subject.description);
    setEditSubjectColor(subject.color || 'emerald');
    setEditSubjectIcon(subject.icon || 'BookOpen');
  };

  const handleSaveEditSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editSubjectTitle) return;
    const ok = await updateSubject(editingSubject.id, {
      title: editSubjectTitle,
      code: editSubjectCode,
      description: editSubjectDesc,
      color: editSubjectColor,
      icon: editSubjectIcon,
    });
    if (ok) {
      setEditingSubject(null);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonSubjectId) return;
    const ok = await addLesson({
      subjectId: newLessonSubjectId,
      title: newLessonTitle,
      excerpt: newLessonExcerpt,
      content: newLessonContent || 'محتوى الدرس النموذجي...',
      summary: newLessonExcerpt,
      isPremium: newLessonIsPremium,
      readingTimeMinutes: Number(newLessonReadingTime) || 10,
    });
    if (ok) {
      setNewLessonTitle('');
      setNewLessonExcerpt('');
      setNewLessonContent('');
      // Refresh lessons
      const res = await fetch('/api/lessons');
      if (res.ok) setAllLessons(await res.json());
    }
  };

  const handleOpenEditLesson = async (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditLessonTitle(lesson.title);
    setEditLessonSubjectId(lesson.subjectId);
    setEditLessonExcerpt(lesson.excerpt || '');
    setEditLessonQuickSummary(lesson.quickSummary || '');
    setEditLessonReadingTime(lesson.readingTimeMinutes || 10);
    setEditLessonIsPremium(lesson.isPremium);

    try {
      const res = await fetch(`/api/lessons/${lesson.id}`);
      if (res.ok) {
        const data = await res.json();
        setEditLessonContent(data.lesson?.content || lesson.content || '');
      } else {
        setEditLessonContent(lesson.content || '');
      }
    } catch {
      setEditLessonContent(lesson.content || '');
    }
  };

  const handleSaveEditLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !editLessonTitle) return;
    const ok = await updateLesson(editingLesson.id, {
      title: editLessonTitle,
      subjectId: editLessonSubjectId,
      excerpt: editLessonExcerpt,
      quickSummary: editLessonQuickSummary,
      content: editLessonContent,
      readingTimeMinutes: Number(editLessonReadingTime) || 10,
      isPremium: editLessonIsPremium,
    });
    if (ok) {
      setEditingLesson(null);
      const res = await fetch('/api/lessons');
      if (res.ok) setAllLessons(await res.json());
    }
  };

  const handleCreateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSumTitle || !newSumSubjectId) return;
    const pts = newSumPoints.split('\n').filter((p) => p.trim().length > 0);
    const ok = await addSummary({
      subjectId: newSumSubjectId,
      title: newSumTitle,
      excerpt: newSumExcerpt,
      keyPoints: pts.length > 0 ? pts : ['أهم قاعدة ومفهوم في الوحدة التعليمية'],
      fullSummary: newSumContent || newSumExcerpt,
      isPremium: newSumIsPremium,
    });
    if (ok) {
      setNewSumTitle('');
      setNewSumExcerpt('');
      setNewSumPoints('');
      setNewSumContent('');
      const sRes = await fetch('/api/summaries');
      if (sRes.ok) setAllSummaries(await sRes.json());
    }
  };

  const handleOpenEditSummary = (summary: Summary) => {
    setEditingSummary(summary);
    setEditSumTitle(summary.title);
    setEditSumSubjectId(summary.subjectId);
    setEditSumExcerpt(summary.excerpt || '');
    setEditSumPoints((summary.keyPoints || []).join('\n'));
    setEditSumFullText(summary.fullSummary || '');
    setEditSumIsPremium(summary.isPremium);
  };

  const handleSaveEditSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSummary || !editSumTitle) return;
    const pts = editSumPoints.split('\n').map((p) => p.trim()).filter(Boolean);
    const ok = await updateSummary(editingSummary.id, {
      title: editSumTitle,
      subjectId: editSumSubjectId,
      excerpt: editSumExcerpt,
      keyPoints: pts,
      fullSummary: editSumFullText,
      isPremium: editSumIsPremium,
    });
    if (ok) {
      setEditingSummary(null);
      const sRes = await fetch('/api/summaries');
      if (sRes.ok) setAllSummaries(await sRes.json());
    }
  };

  const handleDeleteSummary = async (id: string) => {
    const ok = await deleteSummary(id);
    if (ok) {
      setAllSummaries((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleCreatePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdfTitle || !newPdfSubjectId) return;
    const ok = await addPdf({
      subjectId: newPdfSubjectId,
      title: newPdfTitle,
      description: newPdfDesc,
      fileSize: newPdfSize,
      pagesCount: Number(newPdfPages) || 15,
      isPremium: newPdfIsPremium,
      downloadUrl: `/uploads/pdfs/document-${Date.now()}.pdf`,
    });
    if (ok) {
      setNewPdfTitle('');
      setNewPdfDesc('');
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle || !newQuizSubjectId) return;
    const ok = await addQuiz({
      subjectId: newQuizSubjectId,
      title: newQuizTitle,
      description: newQuizDesc,
      durationMinutes: 10,
      passingScore: 60,
      isPremium: newQuizIsPremium,
      questions: [
        {
          id: `q-${Date.now()}-1`,
          questionText: newQ1Text || 'السؤال الأول في المقياس',
          type: 'multiple_choice',
          options: [newQ1OptA || 'الخيار الأول', newQ1OptB || 'الخيار الثاني', newQ1OptC || 'الخيار الثالث'],
          correctAnswer: 0,
          explanation: newQ1Exp || 'توضيح منهجي للإجابة الصحيحة.',
        },
      ],
    });
    if (ok) {
      setNewQuizTitle('');
      setNewQuizDesc('');
      setNewQ1Text('');
      setNewQ1OptA('');
      setNewQ1OptB('');
      setNewQ1OptC('');
      setNewQ1Correct('');
      setNewQ1Exp('');
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;
    const ok = await broadcastNotification(notifTitle, notifMsg);
    if (ok) {
      setNotifTitle('');
      setNotifMsg('');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePlatformSettings({
      appName: settingsAppName,
      tagline: settingsTagline,
      logoText: settingsLogoText,
      supportEmail: settingsEmail,
    });
  };

  const handleToggleUserPremium = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'premium' ? 'free' : 'premium';
    try {
      const res = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          expiresAt: nextStatus === 'premium' ? '2026-06-30T00:00:00.000Z' : null,
        }),
      });
      if (res.ok) {
        showToast(
          nextStatus === 'premium' ? 'تم منح اشتراك Premium للطالب بنجاح' : 'تم تخفيض الحساب إلى مجاني',
          'info'
        );
        const uRes = await fetch('/api/admin/users');
        if (uRes.ok) setUsersList(await uRes.json());
      }
    } catch (e) {
      showToast('تعذر تحديث اشتراك المستخدم', 'error');
    }
  };

  return (
    <div id="admin-dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة تحكم الإدارة الكاملة (Admin Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            إدارة منصة أستاذي
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            تحكم كامل في المقاييس، الدروس، المذكرات، أسعار الاشتراكات، وحسابات الطلبة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            المشرفة: {currentUser.name}
          </span>
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 transition-colors"
          >
            معاينة الموقع كطالب
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
        <div className="flex gap-2 sm:gap-4 pb-1 text-xs sm:text-sm font-bold whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            نظرة عامة وإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'subjects'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            إدارة المقاييس ({subjects.length})
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'lessons'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            إدارة الدروس ({allLessons.length})
          </button>
          <button
            onClick={() => setActiveTab('summaries')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'summaries'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            الملخصات
          </button>
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'pdfs'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            ملفات PDF
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'quizzes'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            بنك الاختبارات
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'pricing'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            الأسعار والباقات
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            الطلاب والمشتركين ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'notifications'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            إرسال إشعارات
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2.5 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            إعدادات المنصة
          </button>
        </div>
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي الطلاب المسجلين</span>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                {metrics?.totalUsers || 248}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+18 طالب هذا الأسبوع</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <span className="text-xs text-stone-400 font-bold block mb-1">المشتركين في Premium</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                {metrics?.premiumSubscribers || 86}
              </span>
              <span className="text-[11px] text-amber-600 font-semibold block mt-1">نسبة التحويل 34%</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي الإيرادات (DZD)</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {(metrics?.totalRevenueDzd || 142600).toLocaleString('ar-DZ')} دج
              </span>
              <span className="text-[11px] text-stone-400 font-medium block mt-1">مدفوعات الذهبية و CIB</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <span className="text-xs text-stone-400 font-bold block mb-1">المحتوى الأكاديمي</span>
              <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                {subjects.length} مقاييس
              </span>
              <span className="text-[11px] text-teal-600 font-semibold block mt-1">
                {allLessons.length} دروس منشورة
              </span>
            </div>
          </div>

          {/* Recent Payment Transactions */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              أحدث عمليات الدفع والاشتراكات (Algerian Dinar)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400">
                    <th className="py-3 px-3">رقم العملية</th>
                    <th className="py-3 px-3">الطالب</th>
                    <th className="py-3 px-3">الباقة</th>
                    <th className="py-3 px-3">المبلغ</th>
                    <th className="py-3 px-3">طريقة الدفع</th>
                    <th className="py-3 px-3">الحالة</th>
                    <th className="py-3 px-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {metrics?.recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 px-3 font-mono text-stone-500">{tx.id}</td>
                      <td className="py-3 px-3 font-bold text-stone-900 dark:text-stone-100">{tx.userName}</td>
                      <td className="py-3 px-3">{tx.planName}</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">{tx.amountDzd} دج</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-medium">
                          {tx.paymentMethod === 'edahabia' ? 'البطاقة الذهبية' : 'CIB البنكية'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                          مكتمل ومفعل
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400">{tx.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Subjects Management */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          {/* Add Subject Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>إضافة مقياس دراسي جديد</span>
            </h3>
            <form onSubmit={handleCreateSubject} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم المقياس:</label>
                <input
                  type="text"
                  required
                  value={newSubjectTitle}
                  onChange={(e) => setNewSubjectTitle(e.target.value)}
                  placeholder="مثال: البلاغة العربية ومناهج النقد"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">الرمز الأكاديمي:</label>
                <input
                  type="text"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  placeholder="مثال: BALAGHA-101"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">وصف مختصر:</label>
                <input
                  type="text"
                  value={newSubjectDesc}
                  onChange={(e) => setNewSubjectDesc(e.target.value)}
                  placeholder="مقرر السداسي الأول لطلبة التعليم الابتدائي"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  حفظ ونشر المقياس
                </button>
              </div>
            </form>
          </div>

          {/* Subjects Table */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4">
              المقاييس الحالية ({subjects.length})
            </h3>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {subjects.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-stone-400 ml-2">{s.code}</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{s.title}</span>
                    <p className="text-stone-500 text-[11px] mt-0.5">{s.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[11px] hidden sm:inline">
                      {s.lessonsCount} درس • {s.quizzesCount} اختبار
                    </span>
                    <button
                      onClick={() => handleOpenEditSubject(s)}
                      className="p-2 text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors flex items-center gap-1 font-bold text-xs"
                      title="تعديل بيانات المقياس"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">تعديل</span>
                    </button>
                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="حذف المقياس"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Subject Modal */}
          {editingSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-lg w-full shadow-2xl space-y-4 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-emerald-600" />
                    <span>تعديل بيانات المقياس الدراسي</span>
                  </h3>
                  <button
                    onClick={() => setEditingSubject(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditSubject} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">اسم المقياس الدراسي:</label>
                    <input
                      type="text"
                      required
                      value={editSubjectTitle}
                      onChange={(e) => setEditSubjectTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">الرمز الأكاديمي:</label>
                    <input
                      type="text"
                      required
                      value={editSubjectCode}
                      onChange={(e) => setEditSubjectCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">الوصف والمقرر البيداغوجي:</label>
                    <textarea
                      rows={3}
                      value={editSubjectDesc}
                      onChange={(e) => setEditSubjectDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">السمة اللونية:</label>
                      <select
                        value={editSubjectColor}
                        onChange={(e) => setEditSubjectColor(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      >
                        <option value="emerald">أخضر زمردي (Emerald)</option>
                        <option value="amber">عنبري ذهبي (Amber)</option>
                        <option value="purple">أرجواني (Purple)</option>
                        <option value="rose">وردي (Rose)</option>
                        <option value="blue">أزرق سماوي (Blue)</option>
                        <option value="indigo">نيلي (Indigo)</option>
                        <option value="teal">فيروزي (Teal)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">الأيقونة المعتمدة:</label>
                      <select
                        value={editSubjectIcon}
                        onChange={(e) => setEditSubjectIcon(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      >
                        <option value="BookOpen">كتاب مفتوح (BookOpen)</option>
                        <option value="Feather">ريشة (Feather)</option>
                        <option value="Sparkles">بريق (Sparkles)</option>
                        <option value="Scroll">مخطوطة (Scroll)</option>
                        <option value="PenTool">قلم (PenTool)</option>
                        <option value="GraduationCap">قبعة تخرج (GraduationCap)</option>
                        <option value="Award">وسام (Award)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setEditingSubject(null)}
                      className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      حفظ التعديلات
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Lessons Management */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Add Lesson Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>إضافة درس منهجي جديد</span>
            </h3>
            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1">المقياس التابع له:</label>
                  <select
                    value={newLessonSubjectId}
                    onChange={(e) => setNewLessonSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">عنوان الدرس:</label>
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="مثال: بناء الجملة الفعلية وإعراب الفاعل"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">مدة القراءة (بالدقائق):</label>
                  <input
                    type="number"
                    value={newLessonReadingTime}
                    onChange={(e) => setNewLessonReadingTime(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">مقدمة أو ملخص قصير للدرس:</label>
                <input
                  type="text"
                  value={newLessonExcerpt}
                  onChange={(e) => setNewLessonExcerpt(e.target.value)}
                  placeholder="شرح مدخل عام للقواعد والأهداف البيداغوجية..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">محتوى الدرس الكامل (نصوص، عناوين، وفقرات):</label>
                <textarea
                  rows={4}
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  placeholder="اكتب تفاصيل الدرس وأمثلة الإعراب والتطبيقات الصفية..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLessonIsPremium}
                    onChange={(e) => setNewLessonIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>درس حصري لأعضاء Premium 🔒 (يحجب عن المستخدمين المجانيين)</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  نشر الدرس
                </button>
              </div>
            </form>
          </div>

          {/* Lessons List */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
              الدروس المسجلة في المنصة ({allLessons.length})
            </h3>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {allLessons.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{l.title}</span>
                      {l.isPremium ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Premium 🔒
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Free مجاني
                        </span>
                      )}
                    </div>
                    <p className="text-stone-500 text-[11px] line-clamp-1">{l.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditLesson(l)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 transition-colors"
                      title="تعديل محتوى هذا الدرس"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => navigateTo('lesson-detail', { lessonId: l.id })}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-bold hover:bg-stone-200 text-stone-700 dark:text-stone-200"
                    >
                      معاينة
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الدرس نهائياً؟')) return;
                        await deleteLesson(l.id);
                        const res = await fetch('/api/lessons');
                        if (res.ok) setAllLessons(await res.json());
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="حذف الدرس"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Lesson Modal */}
          {editingLesson && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-emerald-600" />
                      <span>تعديل محتوى الدرس الأكاديمي</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      تحكم كامل في عنوان الدرس ومحتواه وشروحاته ومقياسه التابع له.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingLesson(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditLesson} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">المقياس التابع له الدرس:</label>
                      <select
                        value={editLessonSubjectId}
                        onChange={(e) => setEditLessonSubjectId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
                      >
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">عنوان الدرس الأكاديمي:</label>
                      <input
                        type="text"
                        required
                        value={editLessonTitle}
                        onChange={(e) => setEditLessonTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block font-bold mb-1">وقت القراءة التقديري (بالدقائق):</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={editLessonReadingTime}
                        onChange={(e) => setEditLessonReadingTime(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      />
                    </div>

                    <div className="pt-4">
                      <label className="flex items-center gap-2 font-bold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editLessonIsPremium}
                          onChange={(e) => setEditLessonIsPremium(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-stone-800 dark:text-stone-200">
                          محتوى مدفوع (حصري لأعضاء باقة Premium 🔒)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">المقتطف والوصف المختصر (Excerpt):</label>
                    <textarea
                      rows={2}
                      value={editLessonExcerpt}
                      onChange={(e) => setEditLessonExcerpt(e.target.value)}
                      placeholder="نبذة سريعة تظهر في بطاقة الدرس قبل الدخول..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">التلخيص السريع (Quick Summary):</label>
                    <textarea
                      rows={2}
                      value={editLessonQuickSummary}
                      onChange={(e) => setEditLessonQuickSummary(e.target.value)}
                      placeholder="خلاصة موجزة ومفيدة في سطرين..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold">محتوى وشروحات الدرس الكاملة:</label>
                      <span className="text-[10px] text-stone-400">
                        يدعم تنسيقات العناوين (## و ###)، القوائم (*)، والاقتباسات (&gt;)
                      </span>
                    </div>
                    <textarea
                      rows={9}
                      value={editLessonContent}
                      onChange={(e) => setEditLessonContent(e.target.value)}
                      placeholder="اكتب هنا محتوى وشرح الدرس بالكامل مع الأمثلة والقواعد..."
                      className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setEditingLesson(null)}
                      className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                    >
                      حفظ وتحديث الدرس
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Summaries Management */}
      {activeTab === 'summaries' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>إضافة ملخص مراجعة جديد</span>
            </h3>
            <form onSubmit={handleCreateSummary} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">المقياس:</label>
                  <select
                    value={newSumSubjectId}
                    onChange={(e) => setNewSumSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">عنوان الملخص:</label>
                  <input
                    type="text"
                    required
                    value={newSumTitle}
                    onChange={(e) => setNewSumTitle(e.target.value)}
                    placeholder="مثال: خريطة ذهنية لقواعد الإعلال والإبدال"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">الوصف المختصر للملخص:</label>
                <input
                  type="text"
                  value={newSumExcerpt}
                  onChange={(e) => setNewSumExcerpt(e.target.value)}
                  placeholder="موجز يصف محتوى هذا الملخص..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">النقاط الرئيسية (كل نقطة في سطر):</label>
                <textarea
                  rows={3}
                  value={newSumPoints}
                  onChange={(e) => setNewSumPoints(e.target.value)}
                  placeholder="مفهوم الإعلال بالنقل&#10;شروط قلب الواو ياءً&#10;أمثلة نموذجية في الامتحانات"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">المحتوى الكامل والشرح المركز للملخص:</label>
                <textarea
                  rows={4}
                  value={newSumContent}
                  onChange={(e) => setNewSumContent(e.target.value)}
                  placeholder="اكتب تفاصيل الملخص والقواعد الأساسية والشرح الشامل..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newSumIsPremium}
                    onChange={(e) => setNewSumIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>ملخص حصري لأعضاء Premium 🔒</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  حفظ ونشر الملخص
                </button>
              </div>
            </form>
          </div>

          {/* Summaries List */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
              الملخصات المسجلة في المنصة ({allSummaries.length})
            </h3>
            {allSummaries.length === 0 ? (
              <p className="text-stone-500 text-xs py-4 text-center">لا توجد ملخصات مسجلة حالياً.</p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {allSummaries.map((s) => {
                  const subj = subjects.find((sub) => sub.id === s.subjectId);
                  return (
                    <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{s.title}</span>
                          {subj && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                              {subj.title}
                            </span>
                          )}
                          {s.isPremium ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Premium 🔒
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Free مجاني
                            </span>
                          )}
                        </div>
                        <p className="text-stone-500 text-[11px] line-clamp-1">{s.excerpt}</p>
                        {s.keyPoints && s.keyPoints.length > 0 && (
                          <p className="text-stone-400 text-[10px] mt-0.5">{s.keyPoints.length} نقاط رئيسية</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditSummary(s)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 transition-colors"
                          title="تعديل محتوى هذا الملخص"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => navigateTo('summaries')}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-bold hover:bg-stone-200 text-stone-700 dark:text-stone-200"
                        >
                          معاينة
                        </button>
                        <button
                          onClick={() => handleDeleteSummary(s.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="حذف الملخص"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Edit Summary Modal */}
          {editingSummary && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-emerald-600" />
                      <span>تعديل محتوى ملخص المراجعة</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      تعديل العنوان، المقياس، النقاط الرئيسية والشرح المفصل للملخص.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingSummary(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditSummary} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1">المقياس التابع له الملخص:</label>
                      <select
                        value={editSumSubjectId}
                        onChange={(e) => setEditSumSubjectId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
                      >
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">عنوان الملخص:</label>
                      <input
                        type="text"
                        required
                        value={editSumTitle}
                        onChange={(e) => setEditSumTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editSumIsPremium}
                        onChange={(e) => setEditSumIsPremium(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600"
                      />
                      <span>ملخص حصري لأعضاء باقة Premium 🔒</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">الوصف المختصر (Excerpt):</label>
                    <textarea
                      rows={2}
                      value={editSumExcerpt}
                      onChange={(e) => setEditSumExcerpt(e.target.value)}
                      placeholder="نبذة سريعة تصف هذا الملخص..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">النقاط الرئيسية (كل نقطة في سطر منفصل):</label>
                    <textarea
                      rows={4}
                      value={editSumPoints}
                      onChange={(e) => setEditSumPoints(e.target.value)}
                      placeholder="نقطة أولى جوهرية&#10;نقطة ثانية&#10;نقطة ثالثة"
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">المحتوى الكامل والشرح المركز للملخص:</label>
                    <textarea
                      rows={6}
                      value={editSumFullText}
                      onChange={(e) => setEditSumFullText(e.target.value)}
                      placeholder="اكتب هنا المحتوى الكامل للملخص والشرح التوضيحي..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setEditingSummary(null)}
                      className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                    >
                      حفظ وتحديث الملخص
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PDFs Management */}
      {activeTab === 'pdfs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              <span>رفع وتسجيل وثيقة PDF جديدة</span>
            </h3>
            <form onSubmit={handleCreatePdf} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1">المقياس:</label>
                  <select
                    value={newPdfSubjectId}
                    onChange={(e) => setNewPdfSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">اسم الملف أو المحاضرة:</label>
                  <input
                    type="text"
                    required
                    value={newPdfTitle}
                    onChange={(e) => setNewPdfTitle(e.target.value)}
                    placeholder="مطبوعة محاضرات النحو العربي (PDF)"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">عدد الصفحات والحجم:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPdfPages}
                      onChange={(e) => setNewPdfPages(Number(e.target.value))}
                      placeholder="الصفحات"
                      className="w-1/2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                    <input
                      type="text"
                      value={newPdfSize}
                      onChange={(e) => setNewPdfSize(e.target.value)}
                      placeholder="3.5 MB"
                      className="w-1/2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">وصف الملف:</label>
                <input
                  type="text"
                  value={newPdfDesc}
                  onChange={(e) => setNewPdfDesc(e.target.value)}
                  placeholder="المحاضرة الرسمية المعتمدة لطلبة المدارس العليا"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPdfIsPremium}
                    onChange={(e) => setNewPdfIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>ملف PDF محمي بموجب باقة Premium (يمنع التحميل للمجاني)</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  إضافة ملف PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Quizzes Management */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <span>إنشاء اختبار تفاعلي جديد مع بنك الأسئلة</span>
            </h3>
            <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">المقياس:</label>
                  <select
                    value={newQuizSubjectId}
                    onChange={(e) => setNewQuizSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">عنوان الاختبار:</label>
                  <input
                    type="text"
                    required
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder="مثال: اختبار الفهم المنهجي لمقياس النحو العربي"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              {/* Sample Question Creator */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
                <p className="font-bold text-stone-900 dark:text-stone-100">السؤال النموذجي الأول:</p>
                <input
                  type="text"
                  value={newQ1Text}
                  onChange={(e) => setNewQ1Text(e.target.value)}
                  placeholder="نص السؤال (مثال: ما هو حكم الفاعل في الجملة الفعلية؟)"
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newQ1OptA}
                    onChange={(e) => setNewQ1OptA(e.target.value)}
                    placeholder="الخيار أ (مثال: الرفع دائماً)"
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="text"
                    value={newQ1OptB}
                    onChange={(e) => setNewQ1OptB(e.target.value)}
                    placeholder="الخيار ب (مثال: النصب دائماً)"
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="text"
                    value={newQ1OptC}
                    onChange={(e) => setNewQ1OptC(e.target.value)}
                    placeholder="الخيار ج (مثال: الجر بحرف الجر)"
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newQ1Correct}
                    onChange={(e) => setNewQ1Correct(e.target.value)}
                    placeholder="الإجابة الصحيحة مطابقة تماماً لأحد الخيارات"
                    className="p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-900"
                  />
                  <input
                    type="text"
                    value={newQ1Exp}
                    onChange={(e) => setNewQ1Exp(e.target.value)}
                    placeholder="التعليل المنهجي والتفسير للطالب"
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newQuizIsPremium}
                    onChange={(e) => setNewQuizIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>اختبار مخصص لمشتركي Premium</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  نشر الاختبار في بنك الأسئلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Subscriptions & Pricing Management */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                تعديل أسعار خطط الاشتراك بالدينار الجزائري (DZD)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                تتحدث هذه الأسعار مباشرة وبشكل فوري في صفحة الأسعار وبوابة الدفع.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{plan.name}</span>
                    <span className="text-xs text-stone-400">المدة: {plan.durationMonths} شهر</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <label className="font-bold">السعر بالدينار الجزائري:</label>
                    <input
                      type="number"
                      defaultValue={plan.priceDzd}
                      onChange={(e) => {
                        setEditedPrices({
                          ...editedPrices,
                          [plan.id]: Number(e.target.value),
                        });
                      }}
                      className="w-28 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold text-emerald-600"
                    />
                    <span className="font-bold text-stone-500">دج</span>
                  </div>

                  <button
                    onClick={() => {
                      const newP = editedPrices[plan.id];
                      if (newP && newP > 0) {
                        updatePlanPrice(plan.id, newP);
                      }
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    حفظ السعر الجديد لـ {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              قائمة الطلاب والتحكم في الاشتراكات ({usersList.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400">
                    <th className="py-3 px-3">اسم الطالب</th>
                    <th className="py-3 px-3">البريد الإلكتروني</th>
                    <th className="py-3 px-3">التخصص</th>
                    <th className="py-3 px-3">حالة الاشتراك</th>
                    <th className="py-3 px-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-3 font-bold text-stone-900 dark:text-stone-100">{u.name}</td>
                      <td className="py-3 px-3 text-stone-500">{u.email}</td>
                      <td className="py-3 px-3">{u.academicLevel}</td>
                      <td className="py-3 px-3">
                        {u.subscriptionStatus === 'premium' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            Premium مشترك ⭐
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                            Free مجاني
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleUserPremium(u.id, u.subscriptionStatus)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                            u.subscriptionStatus === 'premium'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {u.subscriptionStatus === 'premium' ? 'تعطيل Premium' : 'ترقية يدوية إلى Premium'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. Broadcast Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span>إرسال إشعار عام لكافة طلبة المنصة</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                سيظهر هذا الإشعار فوراً في جرس التنبيهات وشريط الإشعارات لجميع الطلاب.
              </p>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان الإشعار:</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="مثال: تم نشر مذكرات وملخصات جديدة في مقياس النحو"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">نص الرسالة والتفاصيل:</label>
                <textarea
                  rows={4}
                  required
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  placeholder="أعزاءنا الطلبة، يمكنكم الآن تحميل ملفات PDF الخاصة بالوحدة الثالثة..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                <span>إرسال الإشعار لجميع الطلاب</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 10. Platform Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>إعدادات وهوية المنصة</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                تعديل اسم التطبيق، الشعار المكتوب، والشعار اللفظي.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم المنصة:</label>
                <input
                  type="text"
                  value={settingsAppName}
                  onChange={(e) => setSettingsAppName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">نص الشعار (Logo Text):</label>
                <input
                  type="text"
                  value={settingsLogoText}
                  onChange={(e) => setSettingsLogoText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">الشعار اللفظي (Tagline):</label>
                <input
                  type="text"
                  value={settingsTagline}
                  onChange={(e) => setSettingsTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">البريد الإلكتروني للدعم:</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
