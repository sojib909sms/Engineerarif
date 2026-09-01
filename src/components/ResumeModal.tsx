import React, { useRef, useState } from 'react';
import { X, Download, Printer, ShieldCheck, Award, Briefcase, GraduationCap, Building2, Phone, Mail, MapPin, User, FileText, CheckCircle2, Globe, Laptop, ExternalLink, Calendar, Compass, Sparkles, FileDown, Loader2 } from 'lucide-react';
import { OFFICIAL_CV_DATA } from '../data/portfolioData';

// Helper to convert image URL to base64 data URL for 100% reliable PDF embedding
const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(imageUrl);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    return imageUrl;
  }
};

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const cvRef = useRef<HTMLDivElement>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const cv = OFFICIAL_CV_DATA;

  // Build the complete, beautifully styled HTML template for direct PDF and Print
  const generateCvDocumentHtml = (photoDataUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Curriculum Vitae - ${cv.name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 8mm 8mm 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
      padding: 0;
      margin: 0;
    }
    .cv-container {
      width: 100%;
      max-width: 100%;
      background: #ffffff;
    }
    .header-banner {
      background: #090d16 !important;
      color: #ffffff !important;
      padding: 16px 20px;
      border-bottom: 3px solid #f59e0b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-info {
      flex: 1;
    }
    .badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      color: #93c5fd;
      background: rgba(30, 58, 138, 0.6);
      border: 1px solid #3b82f6;
      padding: 2px 8px;
      border-radius: 9999px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .name-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin-bottom: 3px;
    }
    .sub-role {
      font-size: 11px;
      color: #f59e0b;
      font-weight: 700;
      margin-bottom: 3px;
    }
    .msc-tag {
      display: inline-block;
      font-size: 9.5px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      color: #f8fafc;
      padding: 1px 6px;
      border-radius: 12px;
      margin-left: 6px;
      font-weight: 600;
    }
    .summary-text {
      font-size: 10px;
      color: #cbd5e1;
      max-width: 480px;
      margin-top: 2px;
    }
    .photo-container {
      width: 100px;
      height: 125px;
      border-radius: 8px;
      border: 2px solid #f59e0b;
      overflow: hidden;
      background: #1e293b;
      margin-left: 16px;
      flex-shrink: 0;
    }
    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      display: block;
    }
    .contact-strip {
      background: #0f172a !important;
      color: #e2e8f0 !important;
      padding: 6px 20px;
      font-size: 9.5px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
      font-family: monospace;
    }
    .body-content {
      padding: 14px 20px;
    }
    .section-block {
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .section-heading {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 3px;
      margin-bottom: 6px;
    }
    .box-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 6px;
      font-size: 10.5px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .job-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #1d4ed8;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 6px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 3px;
      margin-bottom: 4px;
    }
    .job-role {
      font-weight: 800;
      font-size: 11px;
      color: #0f172a;
    }
    .job-company {
      color: #1e40af;
      font-weight: 700;
      margin-left: 4px;
    }
    .job-period {
      font-size: 9.5px;
      font-weight: 700;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e3a8a;
      padding: 1px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    ul {
      margin-left: 16px;
      margin-top: 3px;
      font-size: 10px;
      color: #334155;
    }
    li {
      margin-bottom: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-top: 4px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 4px 8px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
    }
    .info-label {
      font-weight: 600;
      color: #0f172a;
    }
    .info-val {
      color: #334155;
    }
    .declaration-text {
      font-style: italic;
      font-size: 9.5px;
      color: #475569;
      background: #f8fafc;
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      line-height: 1.4;
    }
    .sign-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 14px;
      padding-top: 8px;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Header Banner -->
    <div class="header-banner">
      <div class="header-info">
        <div class="badge">OFFICIAL CURRICULUM VITAE</div>
        <div class="name-title">${cv.name}</div>
        <div class="sub-role">
          Civil Engineer <span class="msc-tag">M.Sc. in Civil Engineering (Ongoing)</span>
        </div>
        <div class="summary-text">
          Specialized in Construction Site Supervision, AutoCAD 2D/3D Drafting, Rebar/Structural Execution & 3ds Max Architectural Visualization.
        </div>
      </div>
      <div class="photo-container">
        <img src="${photoDataUrl}" alt="${cv.name}" />
      </div>
    </div>

    <!-- Quick Contact Strip -->
    <div class="contact-strip">
      <div><strong>Mob:</strong> ${cv.mobile}</div>
      <div><strong>Email:</strong> ${cv.email}</div>
      <div><strong>Location:</strong> Rangpur / Dhaka, Bangladesh</div>
    </div>

    <div class="body-content">
      <!-- 1. CAREER OBJECTIVE -->
      <div class="section-block">
        <div class="section-heading">CAREER OBJECTIVE</div>
        <div class="box-card" style="background:#eff6ff; border-color:#bfdbfe; color:#1e3a8a;">
          ${cv.careerObjective}
        </div>
      </div>

      <!-- 2. CONFIDENCE & STRENGTH -->
      <div class="section-block">
        <div class="section-heading">CONFIDENCE & PROFESSIONAL STRENGTH</div>
        <div class="box-card">
          ${cv.confidence}
        </div>
      </div>

      <!-- 3. JOB EXPERIENCE -->
      <div class="section-block">
        <div class="section-heading">PROFESSIONAL JOB EXPERIENCE</div>
        ${cv.jobExperience.map(exp => `
          <div class="job-card">
            <div class="job-header">
              <div>
                <span class="job-role">${exp.role}</span>
                <span style="color:#94a3b8;">|</span>
                <span class="job-company">${exp.company}</span>
                ${exp.location ? `<span style="font-size:9.5px; color:#64748b;"> (${exp.location})</span>` : ''}
              </div>
              <div class="job-period">${exp.period}</div>
            </div>
            <ul>
              ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- 4. INDUSTRIAL ATTACHMENT -->
      <div class="section-block">
        <div class="section-heading">INDUSTRIAL ATTACHMENT</div>
        <div class="job-card" style="border-left-color:#475569;">
          <div class="job-header">
            <div>
              <span class="job-role">${cv.industrialAttachment.title}</span>
              <span style="color:#94a3b8;">|</span>
              <span style="font-weight:700; color:#334155;">${cv.industrialAttachment.institute} (${cv.industrialAttachment.location})</span>
            </div>
            <div class="job-period" style="background:#f1f5f9; border-color:#cbd5e1; color:#334155;">${cv.industrialAttachment.period}</div>
          </div>
          <ul>
            ${cv.industrialAttachment.responsibilities.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 5. EDUCATIONAL QUALIFICATION -->
      <div class="section-block">
        <div class="section-heading">EDUCATIONAL QUALIFICATION</div>
        ${cv.education.map(edu => `
          <div class="box-card" style="margin-bottom:4px; padding:6px 10px;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:10.5px; border-bottom:1px solid #e2e8f0; padding-bottom:2px; margin-bottom:4px;">
              <span>• ${edu.degree}</span>
              <span style="font-family:monospace; font-size:9.5px; color:#1e3a8a;">${edu.passingYear}</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:9.5px; color:#475569;">
              <div><strong>Institute:</strong> ${edu.institute}</div>
              <div><strong>Board:</strong> ${edu.board}</div>
              ${edu.group ? `<div><strong>Group:</strong> ${edu.group}</div>` : ''}
              <div><strong>${edu.resultLabel}:</strong> <span style="font-weight:700; color:#047857;">${edu.result || '--'}</span></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 6. TECHNICAL & COMPUTER SKILLS -->
      <div class="section-block">
        <div class="section-heading">TECHNICAL & COMPUTER SKILLS</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <div class="box-card"><strong>Professional Skills:</strong> ${cv.skills.professional}</div>
          <div class="box-card"><strong>Operating Systems:</strong> ${cv.skills.operatingSystems}</div>
          <div class="box-card"><strong>Applications:</strong> ${cv.skills.applications}</div>
          <div class="box-card"><strong>Internet:</strong> ${cv.skills.internet}</div>
        </div>
      </div>

      <!-- 7. LANGUAGE PROFICIENCY -->
      <div class="section-block">
        <div class="section-heading">LANGUAGE PROFICIENCY</div>
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>Writing</th>
              <th>Reading</th>
              <th>Speaking</th>
            </tr>
          </thead>
          <tbody>
            ${cv.languages.map(l => `
              <tr>
                <td><strong>${l.language}</strong></td>
                <td>${l.writing}</td>
                <td>${l.reading}</td>
                <td style="font-weight:600; color:#1e40af;">${l.speaking}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- 8. PERSONAL INFORMATION & PERMANENT ADDRESS -->
      <div class="section-block" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="box-card">
          <div style="font-weight:800; font-size:10px; color:#0f172a; border-bottom:1.5px solid #1e3a8a; padding-bottom:2px; margin-bottom:4px;">PERSONAL INFORMATION</div>
          <div class="info-item"><span class="info-label">Name:</span> <span class="info-val">${cv.personalInfo.name}</span></div>
          <div class="info-item"><span class="info-label">Father's Name:</span> <span class="info-val">${cv.personalInfo.fatherName}</span></div>
          <div class="info-item"><span class="info-label">Mother's Name:</span> <span class="info-val">${cv.personalInfo.motherName}</span></div>
          <div class="info-item"><span class="info-label">Date of Birth:</span> <span class="info-val">${cv.personalInfo.dateOfBirth}</span></div>
          <div class="info-item"><span class="info-label">Blood Group:</span> <span class="info-val" style="font-weight:700; color:#b91c1c;">${cv.personalInfo.bloodGroup}</span></div>
          <div class="info-item"><span class="info-label">Nationality:</span> <span class="info-val">${cv.personalInfo.nationality}</span></div>
        </div>

        <div class="box-card">
          <div style="font-weight:800; font-size:10px; color:#0f172a; border-bottom:1.5px solid #1e3a8a; padding-bottom:2px; margin-bottom:4px;">PERMANENT ADDRESS</div>
          <div class="info-item"><span class="info-label">C/O:</span> <span class="info-val">${cv.permanentAddress.careOf}</span></div>
          <div class="info-item"><span class="info-label">Village:</span> <span class="info-val">${cv.permanentAddress.village}</span></div>
          <div class="info-item"><span class="info-label">Post Office:</span> <span class="info-val">${cv.permanentAddress.postOffice}</span></div>
          <div class="info-item"><span class="info-label">Police Station:</span> <span class="info-val">${cv.permanentAddress.policeStation}</span></div>
          <div class="info-item"><span class="info-label">District:</span> <span class="info-val" style="font-weight:700;">${cv.permanentAddress.district}</span></div>
        </div>
      </div>

      <!-- 9. DECLARATION -->
      <div class="section-block" style="margin-top:6px;">
        <div class="section-heading">DECLARATION</div>
        <div class="declaration-text">"${cv.declaration}"</div>
        <div class="sign-row">
          <div><strong>Date:</strong> ______________________</div>
          <div style="text-align:right;">
            <div style="width:160px; border-bottom:1.5px solid #0f172a; margin-bottom:2px; margin-left:auto;"></div>
            <div style="font-weight:800; font-size:11px; color:#0f172a;">${cv.name}</div>
            <div style="font-size:9.5px; color:#64748b;">Civil Engineering Designer & Site Engineer</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // Direct PDF Download handler using html2pdf with embedded high-res photo
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setDownloadMenuOpen(false);

      // Load base64 version of photo so it renders flawlessly in PDF
      const photoDataUrl = await getBase64ImageFromUrl(cv.photoUrl);

      // Dynamically import html2pdf
      const html2pdfModule: any = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      // Create a temporary isolated container to render the document
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // Exact A4 width at 96 DPI
      tempContainer.style.background = '#ffffff';
      tempContainer.innerHTML = generateCvDocumentHtml(photoDataUrl);

      document.body.appendChild(tempContainer);

      const targetElement = tempContainer.querySelector('.cv-container') || tempContainer;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: `MD_ARIF_MIA_Civil_Engineer_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await (html2pdf as any)().set(opt).from(targetElement).save();

      // Clean up
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error('Error generating PDF with html2pdf, falling back to print dialog:', error);
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Clean native print handler that leverages optimized print stylesheet
  const handlePrint = () => {
    window.print();
  };

  // Clean Plain-Text Download with UTF-8 BOM
  const handleDownloadPlainText = () => {
    const cvContent = `================================================================================
                                CURRICULUM VITAE
================================================================================

${cv.name}
${cv.title} | M.Sc. in Civil Engineering (Ongoing)

Mobile  : ${cv.mobile}
Email   : ${cv.email}
Address : ${cv.address}

--------------------------------------------------------------------------------
CAREER OBJECTIVE
--------------------------------------------------------------------------------
${cv.careerObjective}

--------------------------------------------------------------------------------
CONFIDENCE & PROFESSIONAL STRENGTH
--------------------------------------------------------------------------------
${cv.confidence}

--------------------------------------------------------------------------------
PROFESSIONAL JOB EXPERIENCE
--------------------------------------------------------------------------------
${cv.jobExperience.map(exp => `
[ ${exp.period} ]
Role    : ${exp.role}
Company : ${exp.company}${exp.location ? `\nLocation: ${exp.location}` : ''}
Key Responsibilities:
${exp.responsibilities.map(r => `  - ${r}`).join('\n')}
`).join('\n')}

--------------------------------------------------------------------------------
INDUSTRIAL ATTACHMENT
--------------------------------------------------------------------------------
[ ${cv.industrialAttachment.period} ]
Title      : ${cv.industrialAttachment.title}
Institute  : ${cv.industrialAttachment.institute}
Location   : ${cv.industrialAttachment.location}
Details:
${cv.industrialAttachment.responsibilities.map(r => `  - ${r}`).join('\n')}

--------------------------------------------------------------------------------
EDUCATIONAL QUALIFICATION
--------------------------------------------------------------------------------
${cv.education.map(edu => `
Degree / Exam : ${edu.degree}
Institute     : ${edu.institute}
Board         : ${edu.board}${edu.group ? `\nGroup         : ${edu.group}` : ''}
Passing Year  : ${edu.passingYear}
${edu.resultLabel}          : ${edu.result ? edu.result : '--'}
`).join('\n')}

--------------------------------------------------------------------------------
TECHNICAL & COMPUTER SKILLS
--------------------------------------------------------------------------------
Professional Skills : ${cv.skills.professional}
Operating Systems   : ${cv.skills.operatingSystems}
Applications        : ${cv.skills.applications}
Internet            : ${cv.skills.internet}

--------------------------------------------------------------------------------
LANGUAGE PROFICIENCY
--------------------------------------------------------------------------------
Language       | Writing        | Reading        | Speaking
--------------------------------------------------------------------------------
${cv.languages.map(l => `${l.language.padEnd(14)} | ${l.writing.padEnd(14)} | ${l.reading.padEnd(14)} | ${l.speaking}`).join('\n')}

--------------------------------------------------------------------------------
PERSONAL INFORMATION
--------------------------------------------------------------------------------
Name            : ${cv.personalInfo.name}
Father's Name   : ${cv.personalInfo.fatherName}
Mother's Name   : ${cv.personalInfo.motherName}
Date of Birth   : ${cv.personalInfo.dateOfBirth}
Place of Birth  : ${cv.personalInfo.placeOfBirth}
Sex             : ${cv.personalInfo.sex}
Religion        : ${cv.personalInfo.religion}
Marital Status  : ${cv.personalInfo.maritalStatus}
Nationality     : ${cv.personalInfo.nationality}
Blood Group     : ${cv.personalInfo.bloodGroup}
Height          : ${cv.personalInfo.height}

--------------------------------------------------------------------------------
PERMANENT ADDRESS
--------------------------------------------------------------------------------
C/O             : ${cv.permanentAddress.careOf}
Village         : ${cv.permanentAddress.village}
Post Office     : ${cv.permanentAddress.postOffice}
Police Station  : ${cv.permanentAddress.policeStation}
District        : ${cv.permanentAddress.district}

--------------------------------------------------------------------------------
DECLARATION
--------------------------------------------------------------------------------
"${cv.declaration}"


Date: ________________________                     _____________________________
                                                            ${cv.name}
================================================================================
`;

    // '\uFEFF' UTF-8 Byte Order Mark guarantees perfect encoding on all mobile and desktop viewers
    const blob = new Blob(['\uFEFF' + cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MD_ARIF_MIA_Civil_Engineer_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadMenuOpen(false);
  };

  // Download Formatted Microsoft Word Document (.doc) with full styles & zero corrupt characters
  const handleDownloadWordDoc = () => {
    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Curriculum Vitae - ${cv.name}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.4; }
    h1 { font-size: 20pt; color: #0f172a; margin-bottom: 2pt; font-weight: bold; }
    h2 { font-size: 12pt; color: #1e3a8a; border-bottom: 2pt solid #1e3a8a; padding-bottom: 3pt; margin-top: 12pt; margin-bottom: 6pt; text-transform: uppercase; font-weight: bold; }
    .sub { font-size: 12pt; color: #d97706; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 6pt; }
    th { background: #f1f5f9; border: 1pt solid #cbd5e1; padding: 5pt; text-align: left; font-size: 10pt; font-weight: bold; }
    td { border: 1pt solid #cbd5e1; padding: 5pt; font-size: 10pt; vertical-align: top; }
    .job-title { font-weight: bold; font-size: 11pt; color: #0f172a; }
    .job-comp { color: #1e40af; font-weight: bold; }
    .period { float: right; font-weight: bold; color: #1e3a8a; }
    ul { margin-top: 3pt; margin-bottom: 6pt; padding-left: 18pt; }
    li { margin-bottom: 2pt; }
  </style>
</head>
<body>
  <table style="border:none; width:100%; margin-bottom:12pt;">
    <tr>
      <td style="border:none; width:75%;">
        <h1>${cv.name}</h1>
        <div class="sub">Civil Engineer &bull; M.Sc. in Civil Engineering (Ongoing)</div>
        <p style="font-size:10pt; color:#475569; margin-top:3pt;">
          Specialized in Construction Site Supervision, AutoCAD 2D/3D Drafting & 3ds Max Architectural Visualization
        </p>
        <p style="font-size:10pt; font-family:monospace; margin-top:4pt;">
          <strong>Mobile:</strong> ${cv.mobile} | <strong>Email:</strong> ${cv.email} | <strong>Location:</strong> Rangpur / Dhaka, BD
        </p>
      </td>
      <td style="border:none; width:25%; text-align:right;">
        <img src="${cv.photoUrl}" width="110" height="140" style="border:2pt solid #f59e0b; border-radius:6pt;" alt="${cv.name}" />
      </td>
    </tr>
  </table>

  <h2>Career Objective</h2>
  <p>${cv.careerObjective}</p>

  <h2>Confidence & Professional Strength</h2>
  <p>${cv.confidence}</p>

  <h2>Professional Job Experience</h2>
  ${cv.jobExperience.map(exp => `
    <div style="margin-bottom:8pt;">
      <div style="margin-bottom:2pt;">
        <span class="job-title">${exp.role}</span> &bull; <span class="job-comp">${exp.company}</span>
        ${exp.location ? `<span style="font-size:9.5pt; color:#64748b;"> (${exp.location})</span>` : ''}
        <span class="period">${exp.period}</span>
      </div>
      <ul>
        ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <h2>Industrial Attachment</h2>
  <div style="margin-bottom:8pt;">
    <div>
      <span class="job-title">${cv.industrialAttachment.title}</span> &bull; <span>${cv.industrialAttachment.institute} (${cv.industrialAttachment.location})</span>
      <span class="period">${cv.industrialAttachment.period}</span>
    </div>
    <ul>
      ${cv.industrialAttachment.responsibilities.map(r => `<li>${r}</li>`).join('')}
    </ul>
  </div>

  <h2>Educational Qualification</h2>
  <table>
    <tr>
      <th>Degree / Exam</th>
      <th>Institute</th>
      <th>Board</th>
      <th>Passing Year</th>
      <th>Result</th>
    </tr>
    ${cv.education.map(edu => `
      <tr>
        <td><strong>${edu.degree}</strong></td>
        <td>${edu.institute}</td>
        <td>${edu.board}</td>
        <td>${edu.passingYear}</td>
        <td><strong>${edu.result || '--'}</strong></td>
      </tr>
    `).join('')}
  </table>

  <h2>Technical & Computer Skills</h2>
  <table style="border:none;">
    <tr><td style="border:none; width:30%;"><strong>Professional Skills:</strong></td><td style="border:none;">${cv.skills.professional}</td></tr>
    <tr><td style="border:none;"><strong>Operating Systems:</strong></td><td style="border:none;">${cv.skills.operatingSystems}</td></tr>
    <tr><td style="border:none;"><strong>Applications:</strong></td><td style="border:none;">${cv.skills.applications}</td></tr>
    <tr><td style="border:none;"><strong>Internet:</strong></td><td style="border:none;">${cv.skills.internet}</td></tr>
  </table>

  <h2>Language Proficiency</h2>
  <table>
    <tr>
      <th>Language</th>
      <th>Writing</th>
      <th>Reading</th>
      <th>Speaking</th>
    </tr>
    ${cv.languages.map(l => `
      <tr>
        <td><strong>${l.language}</strong></td>
        <td>${l.writing}</td>
        <td>${l.reading}</td>
        <td>${l.speaking}</td>
      </tr>
    `).join('')}
  </table>

  <h2>Personal Information & Permanent Address</h2>
  <table style="border:none;">
    <tr>
      <td style="width:50%; vertical-align:top; border:none;">
        <table style="margin:0;">
          <tr><td><strong>Name:</strong></td><td>${cv.personalInfo.name}</td></tr>
          <tr><td><strong>Father's Name:</strong></td><td>${cv.personalInfo.fatherName}</td></tr>
          <tr><td><strong>Mother's Name:</strong></td><td>${cv.personalInfo.motherName}</td></tr>
          <tr><td><strong>Date of Birth:</strong></td><td>${cv.personalInfo.dateOfBirth}</td></tr>
          <tr><td><strong>Blood Group:</strong></td><td><strong style="color:#b91c1c;">${cv.personalInfo.bloodGroup}</strong></td></tr>
          <tr><td><strong>Nationality:</strong></td><td>${cv.personalInfo.nationality}</td></tr>
        </table>
      </td>
      <td style="width:50%; vertical-align:top; border:none;">
        <table style="margin:0;">
          <tr><td><strong>Care Of (C/O):</strong></td><td>${cv.permanentAddress.careOf}</td></tr>
          <tr><td><strong>Village:</strong></td><td>${cv.permanentAddress.village}</td></tr>
          <tr><td><strong>Post Office:</strong></td><td>${cv.permanentAddress.postOffice}</td></tr>
          <tr><td><strong>Police Station:</strong></td><td>${cv.permanentAddress.policeStation}</td></tr>
          <tr><td><strong>District:</strong></td><td><strong>${cv.permanentAddress.district}</strong></td></tr>
        </table>
      </td>
    </tr>
  </table>

  <h2>Declaration</h2>
  <p style="font-style:italic;">"${cv.declaration}"</p>

  <br/><br/>
  <table style="border:none; width:100%;">
    <tr>
      <td style="border:none;"><strong>Date:</strong> ______________________</td>
      <td style="border:none; text-align:right;">
        <div style="border-top:1.5pt solid #0f172a; width:180pt; margin-left:auto; text-align:center; padding-top:4pt;">
          <strong>${cv.name}</strong><br/>
          <span style="font-size:9.5pt; color:#64748b;">Civil Engineering Designer & Site Engineer</span>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const blob = new Blob(['\uFEFF' + docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MD_ARIF_MIA_Civil_Engineer_CV.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadMenuOpen(false);
  };

  return (
    <div className="cv-modal-overlay fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="cv-modal-card bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative border border-slate-300">
        
        {/* Header Bar */}
        <div className="cv-modal-header no-print bg-slate-900 text-white px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-white truncate">
              Curriculum Vitae — {cv.name}
            </h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0 relative">
            {/* Direct Instant PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="p-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
              title="Direct PDF Download"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
              title="Print CV or Save as PDF via Browser"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            {/* Other Formats Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="p-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                title="More Formats"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span className="hidden md:inline">Doc / Txt</span>
              </button>

              {downloadMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                  <button
                    onClick={handleDownloadWordDoc}
                    className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-blue-600 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Download Word (.doc)</span>
                  </button>
                  <button
                    onClick={handleDownloadPlainText}
                    className="w-full px-3.5 py-2.5 text-left text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    <span>Download Text (.txt)</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable CV Body Content */}
        <div ref={cvRef} className="cv-printable-sheet p-4 sm:p-8 md:p-10 overflow-y-auto bg-slate-100 text-slate-800 font-sans">
          
          {/* Main CV Sheet (A4 Styled Canvas) */}
          <div className="cv-paper-box bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
            
            {/* Executive Top Banner Header */}
            <div className="cv-header-banner print-avoid-break bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 border-b-4 border-amber-500">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-300 text-xs font-mono font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>OFFICIAL CURRICULUM VITAE</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {cv.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                    <span className="text-base sm:text-lg font-bold text-amber-400">
                      Civil Engineer
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      🎓 M.Sc. in Civil Engineering (Ongoing)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl pt-1">
                    Specialized in Construction Site Supervision, AutoCAD 2D/3D Drafting, Rebar/Structural Execution & 3ds Max Architectural Visualization.
                  </p>
                </div>

                {/* Profile Photo in Executive Corporate Frame */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-2 border-amber-400 shadow-2xl bg-slate-900 ring-4 ring-white/20 flex items-center justify-center">
                      {cv.photoUrl ? (
                        <img
                          src={cv.photoUrl}
                          alt={cv.name}
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-14 h-14 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow border border-emerald-400 flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Engineer</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Contact Bar */}
            <div className="bg-slate-900 text-slate-200 px-6 sm:px-8 py-3 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`tel:${cv.mobile}`} className="hover:text-amber-300 transition-colors">
                  <strong>Mob:</strong> {cv.mobile}
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`mailto:${cv.email}`} className="hover:text-amber-300 transition-colors truncate">
                  <strong>Email:</strong> {cv.email}
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Location:</strong> Rangpur / Dhaka, BD</span>
              </div>
            </div>

            {/* Full Professional Body Layout in Standard Chronological Flow */}
            <div className="p-6 sm:p-8 md:p-10 space-y-7">
              
              {/* 1. CAREER OBJECTIVE */}
              <div className="cv-section print-avoid-break space-y-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <Compass className="w-4 h-4 text-blue-700" />
                  CAREER OBJECTIVE
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
                  {cv.careerObjective}
                </p>
              </div>

              {/* 2. CONFIDENCE & PROFESSIONAL STRENGTH */}
              <div className="cv-section print-avoid-break space-y-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <Award className="w-4 h-4 text-blue-700" />
                  CONFIDENCE & PROFESSIONAL STRENGTH
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {cv.confidence}
                </p>
              </div>

              {/* 3. PROFESSIONAL JOB EXPERIENCE (Reverse Chronological Timeline) */}
              <div className="cv-section print-avoid-break space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <Briefcase className="w-4 h-4 text-blue-700" />
                  PROFESSIONAL JOB EXPERIENCE
                </h3>

                <div className="space-y-3.5">
                  {cv.jobExperience.map((exp, idx) => (
                    <div key={idx} className="cv-card print-avoid-break bg-white p-4 rounded-xl border-l-4 border-l-blue-700 border border-slate-200 shadow-sm space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            <span>{exp.role}</span>
                            <span className="text-slate-400 font-normal">|</span>
                            <span className="text-blue-800 font-bold">{exp.company}</span>
                          </h4>
                          {exp.location && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 w-fit font-mono">
                          {exp.period}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="text-xs font-bold text-slate-800">Key Responsibilities:</div>
                        <ul className="list-disc list-outside ml-4 text-xs sm:text-sm text-slate-700 space-y-1">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. INDUSTRIAL ATTACHMENT */}
              <div className="cv-section print-avoid-break space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  INDUSTRIAL ATTACHMENT
                </h3>

                <div className="cv-card print-avoid-break bg-white p-4 rounded-xl border-l-4 border-l-slate-700 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {cv.industrialAttachment.title}
                      </h4>
                      <div className="text-xs text-blue-800 font-semibold">
                        {cv.industrialAttachment.institute} ({cv.industrialAttachment.location})
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 w-fit font-mono">
                      {cv.industrialAttachment.period}
                    </span>
                  </div>

                  <ul className="list-disc list-outside ml-4 text-xs sm:text-sm text-slate-700 space-y-1 pt-1">
                    {cv.industrialAttachment.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5. EDUCATIONAL QUALIFICATION */}
              <div className="cv-section print-avoid-break space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  EDUCATIONAL QUALIFICATION
                </h3>

                <div className="space-y-3">
                  {cv.education.map((edu, idx) => (
                    <div key={idx} className="cv-card print-avoid-break bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {edu.degree}
                          </h4>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border w-fit font-mono ${
                          edu.passingYear.includes('Ongoing')
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}>
                          {edu.passingYear}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        <div>
                          <strong className="text-slate-900">Institute:</strong> {edu.institute}
                        </div>
                        <div>
                          <strong className="text-slate-900">Board / Authority:</strong> {edu.board}
                        </div>
                        {edu.group && (
                          <div>
                            <strong className="text-slate-900">Group:</strong> {edu.group}
                          </div>
                        )}
                        <div>
                          <strong className="text-slate-900">{edu.resultLabel}:</strong>{' '}
                          {edu.result ? (
                            <span className="font-bold text-emerald-700 font-mono">{edu.result}</span>
                          ) : (
                            <span className="text-slate-400 italic">--</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. TECHNICAL & COMPUTER SKILLS */}
              <div className="cv-section print-avoid-break space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <Laptop className="w-4 h-4 text-blue-700" />
                  TECHNICAL & COMPUTER SKILLS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="cv-card print-avoid-break bg-slate-50/90 p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      <span>Professional Skills:</span>
                    </div>
                    <div className="text-slate-700">{cv.skills.professional}</div>
                  </div>
                  <div className="cv-card print-avoid-break bg-slate-50/90 p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-blue-600" />
                      <span>Operating Systems:</span>
                    </div>
                    <div className="text-slate-700">{cv.skills.operatingSystems}</div>
                  </div>
                  <div className="cv-card print-avoid-break bg-slate-50/90 p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Applications:</span>
                    </div>
                    <div className="text-slate-700">{cv.skills.applications}</div>
                  </div>
                  <div className="cv-card print-avoid-break bg-slate-50/90 p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Internet & Communication:</span>
                    </div>
                    <div className="text-slate-700">{cv.skills.internet}</div>
                  </div>
                </div>
              </div>

              {/* 7. LANGUAGE PROFICIENCY */}
              <div className="cv-section print-avoid-break space-y-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <Globe className="w-4 h-4 text-blue-700" />
                  LANGUAGE PROFICIENCY
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2.5 sm:px-4 border-r border-slate-300">Language</th>
                        <th className="p-2.5 sm:px-4 border-r border-slate-300">Writing</th>
                        <th className="p-2.5 sm:px-4 border-r border-slate-300">Reading</th>
                        <th className="p-2.5 sm:px-4">Speaking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                      {cv.languages.map((l, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 sm:px-4 font-bold border-r border-slate-200 text-slate-900">{l.language}</td>
                          <td className="p-2.5 sm:px-4 border-r border-slate-200">{l.writing}</td>
                          <td className="p-2.5 sm:px-4 border-r border-slate-200">{l.reading}</td>
                          <td className="p-2.5 sm:px-4 font-semibold text-blue-900">{l.speaking}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. PERSONAL INFORMATION & PERMANENT ADDRESS (Plotted at bottom) */}
              <div className="cv-section print-avoid-break grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* PERSONAL INFORMATION */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    PERSONAL INFORMATION
                  </h3>

                  <div className="space-y-2 text-xs text-slate-700 font-sans">
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Name:</span>
                      <span className="font-bold text-slate-900">{cv.personalInfo.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Father's Name:</span>
                      <span>{cv.personalInfo.fatherName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Mother's Name:</span>
                      <span>{cv.personalInfo.motherName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Date of Birth:</span>
                      <span className="font-mono">{cv.personalInfo.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Place of Birth:</span>
                      <span>{cv.personalInfo.placeOfBirth}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Sex:</span>
                      <span>{cv.personalInfo.sex}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Religion:</span>
                      <span>{cv.personalInfo.religion}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Marital Status:</span>
                      <span>{cv.personalInfo.maritalStatus}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Nationality:</span>
                      <span>{cv.personalInfo.nationality}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-1">
                      <span className="font-semibold text-slate-900">Blood Group:</span>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200 font-mono">
                        {cv.personalInfo.bloodGroup}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Height:</span>
                      <span>{cv.personalInfo.height}</span>
                    </div>
                  </div>
                </div>

                {/* PERMANENT ADDRESS */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      PERMANENT ADDRESS
                    </h3>

                    <div className="space-y-2 text-xs text-slate-700 font-sans">
                      <div className="flex justify-between border-b border-slate-200/80 pb-1">
                        <span className="font-semibold text-slate-900">Care Of (C/O):</span>
                        <span>{cv.permanentAddress.careOf}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1">
                        <span className="font-semibold text-slate-900">Village:</span>
                        <span>{cv.permanentAddress.village}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1">
                        <span className="font-semibold text-slate-900">Post Office (P.O):</span>
                        <span>{cv.permanentAddress.postOffice}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1">
                        <span className="font-semibold text-slate-900">Police Station (P.S):</span>
                        <span>{cv.permanentAddress.policeStation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-900">District:</span>
                        <span className="font-bold text-slate-900">{cv.permanentAddress.district}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Seal */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-blue-950">Civil Engineering Verification</div>
                      <div className="text-blue-800 text-[11px]">Site Operations & Structural Drawing Management</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* 9. DECLARATION & SIGNATURE */}
              <div className="cv-section print-avoid-break pt-4 border-t-2 border-slate-200 space-y-4">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b-2 border-blue-900 pb-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  DECLARATION
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  "{cv.declaration}"
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                  <div className="text-xs sm:text-sm text-slate-700">
                    <strong>Date:</strong> ______________________
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="w-48 border-b-2 border-slate-800 mb-1.5 mx-auto sm:ml-auto sm:mr-0"></div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900">{cv.name}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">Civil Engineering Designer & Site Engineer</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


