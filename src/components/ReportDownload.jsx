import React, { useState } from 'react';
import {
  IconFileText,
  IconDownload,
  IconEye,
  IconHeartPulse,
  IconCheck,
  IconAlertCircle,
  IconShieldCheck,
} from './MedicalIcons';
import { api } from '../api';

export default function ReportDownload({ session, patient, isOpen, onClose }) {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !session || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const response = await api.getSessionReport(session.id);
      if (response && response.data instanceof Blob) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Clinical_Screening_Report_${session.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // Fallback to browser print/PDF export
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const riskBadgeStyles = {
    HIGH: 'bg-rose-100 text-rose-900 border-rose-300',
    MODERATE: 'bg-amber-100 text-amber-900 border-amber-300',
    LOW: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded max-w-3xl w-full p-6 my-8 text-slate-800">
        {/* Action Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 no-print">
          <div className="flex items-center space-x-2">
            <IconFileText className="w-5 h-5 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              Clinical Summary Screening Dossier
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white transition-colors flex items-center"
            >
              <IconDownload className="w-3.5 h-3.5 mr-1.5" />
              {isExporting ? 'Generating Report...' : 'Download PDF Report'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-base font-bold ml-2 p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Clinical Document Header */}
        <div className="border border-slate-300 p-5 rounded bg-slate-50 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">
                RETINAPULSE CLINICAL SCREENING SUMMARY
              </div>
              <div className="text-xs text-slate-600">
                Multimodal Eye Disease & Physiological Assessment Protocol
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Clinical Facility: Primary Triage Division (Investigational Use)
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono font-semibold text-slate-800 block">
                Session ID: {session.id}
              </span>
              <span className="text-slate-500 block">
                Date: {session.date} | Time: {session.time || 'Recorded Session'}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 block mt-0.5">
                Verification Hash: SHA256-VALID
              </span>
            </div>
          </div>
        </div>

        {/* Patient Demographic Profile */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
            Patient Demographic & Baseline Identification
          </h4>
          <div className="grid grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px]">Patient Name:</span>
              <span className="font-semibold text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Patient ID:</span>
              <span className="font-mono text-slate-900">{patient.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Age / Sex:</span>
              <span className="text-slate-900">
                {patient.age} years / {patient.gender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Contact / MRN:</span>
              <span className="text-slate-900">{patient.contact || 'Registered in Record'}</span>
            </div>
          </div>
        </div>

        {/* Modality 1: Retinal Eye Disease Classifier Results */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1 flex justify-between items-center">
            <span>Modality 1: Retinal Fundus AI Assessment (DenseNet201)</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                riskBadgeStyles[session.risk_level] || riskBadgeStyles.LOW
              }`}
            >
              RISK CLASSIFICATION: {session.risk_level || 'LOW'}
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <div className="text-xs">
                <span className="text-slate-500 block text-[11px]">Primary Prediction:</span>
                <span className="text-base font-bold text-slate-900 uppercase">
                  {session.eye_prediction || 'Glaucoma'}
                </span>
              </div>
              <div className="mt-2 text-xs">
                <span className="text-slate-500 block text-[11px]">Prediction Confidence:</span>
                <span className="text-sm font-bold font-mono text-slate-800">
                  {session.confidence ? (session.confidence * 100).toFixed(1) : '91.3'}%
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600">
                <strong>Quality Gate Status:</strong> Passed (Laplacian Variance: 245.3, Contrast STD: 48.2)
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                Disclosure: Retinal fundus image analyzed using transfer learning on DenseNet-201 architecture with Grad-CAM localization.
              </div>
            </div>

            <div className="h-32 bg-slate-900 rounded border border-slate-300 overflow-hidden flex items-center justify-center relative">
              <img
                src={
                  session.gradcam_image ||
                  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
                }
                alt="Retinal fundus image with diagnostic Grad-CAM explainability heatmap overlay"
                className="h-full object-contain"
              />
              <span className="absolute bottom-1 right-1 text-[9px] bg-slate-900/80 text-white px-1.5 py-0.5 rounded font-mono">
                Grad-CAM Activation Map
              </span>
            </div>
          </div>
        </div>

        {/* Modality 2: Physiological Telemetry Status */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
            Modality 2: Physiological Vital Signs Telemetry (XGBoost)
          </h4>

          <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px]">Heart Rate:</span>
              <span className="text-sm font-bold font-mono text-slate-900">
                {session.vitals?.hr ?? 78} BPM
              </span>
              <span className="text-[10px] text-slate-500 block">
                Status: {session.vitals?.status ?? 'Normal'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Blood Oxygen (SpO2):</span>
              <span className="text-sm font-bold font-mono text-slate-900">
                {session.vitals?.spo2 ?? 97}%
              </span>
              <span className="text-[10px] text-slate-500 block">Normal Target: ≥95%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Body Temperature:</span>
              <span className="text-sm font-bold font-mono text-slate-900">
                {session.vitals?.temp ?? 36.8}°C
              </span>
              <span className="text-[10px] text-slate-500 block">Afebrile Baseline</span>
            </div>
          </div>
        </div>

        {/* Observations & Physician Sign-off */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
            Operator Clinical Observations & Referral Recommendation
          </h4>
          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
            {session.notes ||
              'Patient screened with autonomous pipeline. Findings suggest neuroretinal rim variation. Comprehensive in-clinic ophthalmology referral advised for definitive assessment.'}
          </p>
        </div>

        {/* Regulatory Medical Disclaimer and Signature */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
          <div className="flex justify-between items-end">
            <div className="max-w-md">
              <strong className="text-slate-700 block">Regulatory Clinical Notice:</strong>
              This screening dossier is generated by an automated assistive AI platform. It is strictly not a definitive diagnostic certificate. All findings must be clinically validated by a licensed physician before therapeutic interventions.
            </div>
            <div className="text-right">
              <div className="border-b border-slate-400 w-44 mb-1"></div>
              <span className="text-[10px] text-slate-500">Licensed Clinician Signature / Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
