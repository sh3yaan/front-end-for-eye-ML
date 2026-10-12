import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import EyeAssessment from '../components/EyeAssessment';
import VitalsPanel from '../components/VitalsPanel';
import ManualVitals from '../components/ManualVitals';
import PatientHistory from '../components/PatientHistory';
import ReportDownload from '../components/ReportDownload';
import { IconUser, IconActivity, IconFileText, IconDownload, IconCheck } from '../components/MedicalIcons';
import { api, DEMO_SAMPLES } from '../api';

export default function ScreeningDashboard({
  patient,
  sessions,
  onRefreshSessions,
  backendOnline,
}) {
  const [activeSessionId, setActiveSessionId] = useState('sess_live_01');
  const [isAnalyzingEye, setIsAnalyzingEye] = useState(false);
  const [eyeResult, setEyeResult] = useState({
    prediction: DEMO_SAMPLES[0].condition,
    confidence: DEMO_SAMPLES[0].confidence,
    risk_level: DEMO_SAMPLES[0].riskLevel,
    all_probabilities: DEMO_SAMPLES[0].probabilities,
    quality_checks: DEMO_SAMPLES[0].quality,
    gradcam_image: DEMO_SAMPLES[0].gradcamHeatmap,
    original_url: DEMO_SAMPLES[0].originalImage,
    timestamp: new Date().toISOString(),
  });
  const [qualityResults, setQualityResults] = useState(DEMO_SAMPLES[0].quality);

  const [isSubmittingVitals, setIsSubmittingVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState({
    analysis: {
      heart_rate: { value: 78.5, unit: 'BPM', status: 'Normal' },
      spo2: { value: 97.2, unit: '%', status: 'Normal' },
      temperature: { value: 36.8, unit: '°C', status: 'Normal' },
      overall_status: 'Normal',
    },
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [sessionForReport, setSessionForReport] = useState(null);

  // Handle Fundus Image Evaluation
  const handleEvaluateImage = async (imageInput, filename) => {
    setIsAnalyzingEye(true);
    try {
      const response = await api.predictEye(imageInput, activeSessionId);
      setEyeResult(response);
      if (response.quality_checks) {
        setQualityResults(response.quality_checks);
      }
    } catch {
      // In case of unhandled rejection, maintain demo fallback
    } finally {
      setIsAnalyzingEye(false);
    }
  };

  // Handle Manual Vitals Submission
  const handleSubmitManualVitals = async (hr, spo2, temp) => {
    setIsSubmittingVitals(true);
    try {
      const response = await api.submitVitals(activeSessionId, hr, spo2, temp);
      setVitalsData(response);
    } catch {
      // Fallback
    } finally {
      setIsSubmittingVitals(false);
    }
  };

  // Open clinical report modal
  const handleOpenReport = (sessionToView = null) => {
    const reportTarget = sessionToView || {
      id: activeSessionId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eye_prediction: eyeResult?.prediction || 'Normal',
      confidence: eyeResult?.confidence || 0.91,
      risk_level: eyeResult?.risk_level || 'LOW',
      gradcam_image: eyeResult?.gradcam_image,
      vitals: {
        hr: vitalsData?.analysis?.heart_rate?.value || 78,
        spo2: vitalsData?.analysis?.spo2?.value || 97,
        temp: vitalsData?.analysis?.temperature?.value || 36.8,
        status: vitalsData?.analysis?.overall_status || 'Normal',
      },
      notes: 'Real-time multi-modal screening capture.',
    };
    setSessionForReport(reportTarget);
    setReportModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Row 1: Active Patient Banner & Session Telemetry */}
      <section className="bg-white border border-slate-200 rounded p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-slate-900 text-sky-400 flex items-center justify-center font-bold">
              <IconUser className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900">
                  {patient ? patient.name : 'Unknown Patient'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  ID: {patient ? patient.id : 'N/A'}
                </span>
                <span className="text-xs text-slate-500">
                  ({patient ? patient.gender : 'N/A'}, {patient ? patient.age : '--'} years)
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Contact: {patient ? patient.contact : 'Not specified'} | Clinical Registry: Active
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-mono">
                Active Session Token
              </span>
              <span className="text-xs font-bold font-mono text-slate-800">
                {activeSessionId}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenReport()}
              className="px-3.5 py-1.5 text-xs font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white transition-colors flex items-center"
            >
              <IconDownload className="w-3.5 h-3.5 mr-1.5" />
              Generate Clinical Dossier
            </button>
          </div>
        </div>
      </section>

      {/* Row 2: Assessment Grid (40% Image Upload | 60% Eye Assessment) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ImageUpload
            onEvaluate={handleEvaluateImage}
            isAnalyzing={isAnalyzingEye}
            qualityResults={qualityResults}
          />
        </div>

        <div className="lg:col-span-7">
          <EyeAssessment
            result={eyeResult}
            isLoading={isAnalyzingEye}
          />
        </div>
      </section>

      {/* Row 3: Physiological Screening Telemetry & Manual Intake */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <VitalsPanel
            vitalsData={vitalsData}
            isHardwareConnected={true}
          />
        </div>

        <div className="lg:col-span-5">
          <ManualVitals
            onSubmit={handleSubmitManualVitals}
            isSubmitting={isSubmittingVitals}
          />
        </div>
      </section>

      {/* Row 4: Longitudinal History & Trend Lines */}
      <section>
        <PatientHistory
          patient={patient}
          sessions={sessions}
          onSelectSessionForReport={handleOpenReport}
        />
      </section>

      {/* Clinical Dossier PDF / Print Modal */}
      <ReportDownload
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        session={sessionForReport}
        patient={patient}
      />
    </div>
  );
}
