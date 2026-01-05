/**
 * Utility functions for downloading patient reports
 */

interface PatientReportData {
  patient_info: {
    name: string;
    age: number;
    gender: string;
    email?: string;
    phone?: string;
    cancer_type: string;
    cancer_subtype?: string;
    stage?: string;
    diagnosis_date?: string;
  };
  clinical_data?: any;
  risk_assessment: {
    score: number;
    level: string;
  };
  recommendations: {
    treatments: any[];
    note?: string;
  };
  generated_at: string;
  generated_by?: string;
  doctor_email?: string;
}

/**
 * Format treatment name for display
 */
function formatTreatmentName(treatment: string): string {
  const names: { [key: string]: string } = {
    chemo: "Chemotherapy",
    targeted: "Targeted Therapy",
    immuno: "Immunotherapy",
    radiation: "Radiation Therapy",
    surgery: "Surgery",
    combination: "Combination Therapy",
  };
  return names[treatment] || treatment.charAt(0).toUpperCase() + treatment.slice(1);
}

/**
 * Generate HTML content for the report
 */
function generateReportHTML(data: PatientReportData): string {
  const { patient_info, risk_assessment, recommendations, generated_at, generated_by } = data;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const treatments = recommendations.treatments || [];
  const topTreatment = treatments[0];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Treatment Recommendation Report - ${patient_info.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #fff;
    }
    .header {
      border-bottom: 3px solid #0066cc;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0066cc;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header .meta {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #0066cc;
      margin-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }
    .patient-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 16px;
      color: #333;
    }
    .risk-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 8px;
    }
    .risk-low { background: #d4edda; color: #155724; }
    .risk-medium { background: #fff3cd; color: #856404; }
    .risk-high { background: #f8d7da; color: #721c24; }
    .treatment-card {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .treatment-card.top {
      border-color: #0066cc;
      background: #f0f7ff;
    }
    .treatment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .treatment-name {
      font-size: 20px;
      font-weight: 600;
      color: #0066cc;
    }
    .response-prob {
      font-size: 24px;
      font-weight: 700;
      color: #0066cc;
    }
    .outcomes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 15px 0;
    }
    .outcome-item {
      text-align: center;
      padding: 12px;
      background: #fff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    .outcome-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 6px;
    }
    .outcome-value {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
    .side-effects {
      margin-top: 15px;
    }
    .side-effect-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .side-effect-name {
      font-weight: 500;
    }
    .side-effect-prob {
      color: #666;
      font-size: 14px;
    }
    .explanation {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      border-left: 4px solid #0066cc;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .disclaimer {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 13px;
      color: #856404;
    }
    @media print {
      body { padding: 20px; }
      .treatment-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AI Treatment Recommendation Report</h1>
    <div class="meta">
      Generated: ${formatTime(generated_at)}${generated_by ? ` | By: ${generated_by}` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Patient Information</div>
    <div class="patient-info">
      <div class="info-item">
        <span class="info-label">Name</span>
        <span class="info-value">${patient_info.name}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Age</span>
        <span class="info-value">${patient_info.age} years</span>
      </div>
      <div class="info-item">
        <span class="info-label">Gender</span>
        <span class="info-value">${patient_info.gender || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Cancer Type</span>
        <span class="info-value">${patient_info.cancer_type}${patient_info.cancer_subtype ? ` (${patient_info.cancer_subtype})` : ''}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Stage</span>
        <span class="info-value">${patient_info.stage || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Diagnosis Date</span>
        <span class="info-value">${formatDate(patient_info.diagnosis_date || '')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Risk Score</span>
        <span class="info-value">${risk_assessment.score?.toFixed(1) || 'N/A'}</span>
        <span class="risk-badge risk-${risk_assessment.level?.toLowerCase() || 'medium'}">${risk_assessment.level || 'Unknown'} Risk</span>
      </div>
      <div class="info-item">
        <span class="info-label">Contact</span>
        <span class="info-value">${patient_info.email || patient_info.phone || 'N/A'}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Treatment Recommendations</div>
    ${treatments.map((treatment, index) => {
      const isTop = index === 0;
      const outcomes = treatment.outcomes || {};
      const sideEffects = treatment.side_effects?.common_side_effects || [];
      
      return `
        <div class="treatment-card ${isTop ? 'top' : ''}">
          <div class="treatment-header">
            <div class="treatment-name">${formatTreatmentName(treatment.treatment)}${isTop ? ' ⭐ (Recommended)' : ''}</div>
            <div class="response-prob">${(treatment.response_probability * 100).toFixed(1)}%</div>
          </div>
          
          ${treatment.llm_explanation ? `
            <div class="explanation">
              ${treatment.llm_explanation}
            </div>
          ` : ''}
          
          <div class="outcomes-grid">
            <div class="outcome-item">
              <div class="outcome-label">1-Year Survival</div>
              <div class="outcome-value">${(outcomes.survival_1yr * 100).toFixed(1)}%</div>
            </div>
            <div class="outcome-item">
              <div class="outcome-label">Response Rate</div>
              <div class="outcome-value">${(outcomes.response_rate * 100).toFixed(1)}%</div>
            </div>
            <div class="outcome-item">
              <div class="outcome-label">Remission Probability</div>
              <div class="outcome-value">${(outcomes.remission_probability * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          ${sideEffects.length > 0 ? `
            <div class="side-effects">
              <strong>Common Side Effects:</strong>
              ${sideEffects.slice(0, 6).map((se: any) => `
                <div class="side-effect-item">
                  <span class="side-effect-name">${se.name}</span>
                  <span class="side-effect-prob">${(se.probability * 100).toFixed(0)}% probability</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('')}
  </div>

  <div class="disclaimer">
    <strong>⚠️ Important Disclaimer:</strong> ${recommendations.note || 'AI-generated decision support. Final decisions rest with clinicians. This report is for informational purposes only and should be used as a decision-support tool, not as a replacement for clinical judgment.'}
  </div>

  <div class="footer">
    <p>This report was generated by OncoAI Treatment Recommendation System</p>
    <p>Report ID: ${patient_info.name.replace(/\s+/g, '_')}_${new Date(generated_at).getTime()}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Download report as PDF using browser's print functionality
 */
export function downloadReportAsPDF(data: PatientReportData) {
  const htmlContent = generateReportHTML(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Clean up after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 250);
    };
  }
}

/**
 * Download report as text/JSON file
 */
export function downloadReportAsJSON(data: PatientReportData) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `patient_report_${data.patient_info.name.replace(/\s+/g, '_')}_${new Date(data.generated_at).toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}














