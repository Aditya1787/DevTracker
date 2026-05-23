import PDFDocument from 'pdfkit';
import Repository from '../models/Repository.model.js';
import AIReport from '../models/AIReport.model.js';
import * as analyticsService from './analytics.service.js';

/**
 * Generate a premium PDF report stream and write it to the response stream
 * @param {string} repoId - Repository ID
 * @param {string} userId - Authenticated user ID
 * @param {res} res - Express response stream
 */
export const generatePdfReport = async (repoId, userId, res) => {
  // 1. Verify access and fetch repository
  const repo = await Repository.findOne({ _id: repoId, userId });
  if (!repo) {
    throw new Error('Repository not found or access denied');
  }

  // 2. Fetch latest AI report and metrics in parallel
  const [commits, pullrequests, issues, contributors, aiReport] = await Promise.all([
    analyticsService.getCommitAnalytics(repoId),
    analyticsService.getPRAnalytics(repoId),
    analyticsService.getIssueAnalytics(repoId),
    analyticsService.getContributorAnalytics(repoId),
    AIReport.findOne({ repoId }).sort({ generatedAt: -1 })
  ]);

  if (!aiReport) {
    throw new Error('No AI reports found. Please generate an AI report first before downloading the PDF.');
  }

  // 3. Initialize PDF document with A4 specifications
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true // Enable buffering to write page counts dynamically in the footer
  });

  // Set response headers for direct PDF download
  const safeRepoName = repo.repoName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="devtrackr_${safeRepoName}_report.pdf"`);
  
  // Pipe PDF stream to response
  doc.pipe(res);

  // --- BRAND COLORS ---
  const colors = {
    primary: '#4f46e5',   // Premium Indigo
    secondary: '#0891b2', // Premium Cyan
    dark: '#1e293b',      // Deep slate text
    lightDark: '#475569', // Muted slate text
    bgDark: '#0f172a',    // Dark background panel
    bgLight: '#f8fafc',   // Soft background panel
    border: '#cbd5e1',    // Border line color
    danger: '#ef4444',    // Danger Rose
    success: '#10b981',   // Emerald Success
    white: '#ffffff'
  };

  // --- 1. HEADER SECTION ---
  // Draw deep indigo header banner panel
  doc.rect(50, 40, 495, 75).fill(colors.primary);

  // Logo & Branding Title
  doc.fillColor(colors.white)
     .font('Helvetica-Bold')
     .fontSize(22)
     .text('DevTrackr', 65, 52);
     
  doc.font('Helvetica-Bold')
     .fontSize(8)
     .fillColor('#a5b4fc')
     .text('DEVELOPER PRODUCTIVITY & TEAMS TELEMETRY REPORT', 65, 76);

  // Date block inside header
  const reportDate = new Date(aiReport.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.fillColor(colors.white)
     .font('Helvetica')
     .fontSize(9)
     .text(`Generated: ${reportDate}`, 410, 56, { width: 120, align: 'right' });
     
  doc.fontSize(8)
     .fillColor('#a5b4fc')
     .text(`Version: 1.2.0`, 410, 72, { width: 120, align: 'right' });

  // Move cursor down
  doc.y = 135;

  // --- 2. REPOSITORY METADATA SECTION ---
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('Repository Overview', 50, doc.y);

  // Horizontal divider
  doc.moveTo(50, doc.y + 4).lineTo(545, doc.y + 4).strokeColor(colors.primary).lineWidth(1.5).stroke();
  doc.y += 12;

  // Metadata Grid Layout
  const metaY = doc.y;
  
  // Left Column
  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.lightDark).text('Repository Name:', 60, metaY)
     .font('Helvetica').fontSize(9).fillColor(colors.dark).text(repo.fullName, 160, metaY);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.lightDark).text('Primary Language:', 60, metaY + 16)
     .font('Helvetica').fontSize(9).fillColor(colors.dark).text(repo.language || 'Unknown', 160, metaY + 16);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.lightDark).text('Last GitHub Sync:', 60, metaY + 32)
     .font('Helvetica').fontSize(9).fillColor(colors.dark).text(repo.lastSynced ? new Date(repo.lastSynced).toLocaleString() : 'Never', 160, metaY + 32);

  // Right Column
  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.lightDark).text('GitHub Stars:', 320, metaY)
     .font('Helvetica').fontSize(9).fillColor(colors.dark).text(repo.stars.toString(), 420, metaY);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.lightDark).text('GitHub Forks:', 320, metaY + 16)
     .font('Helvetica').fontSize(9).fillColor(colors.dark).text(repo.forks.toString(), 420, metaY + 16);

  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.lightDark).text('Description:', 320, metaY + 32)
     .font('Helvetica').fontSize(8).fillColor(colors.dark).text(repo.description ? (repo.description.substring(0, 50) + (repo.description.length > 50 ? '...' : '')) : 'No description provided', 420, metaY + 32, { width: 120 });

  doc.y = metaY + 55;

  // --- 3. DYNAMIC PRODUCTIVITY BANNER & SUMMARY ---
  const bannerY = doc.y;
  
  // Left: AI Productivity Score Box
  doc.rect(50, bannerY, 150, 90).fill(colors.bgLight);
  doc.rect(50, bannerY, 150, 90).strokeColor(colors.border).lineWidth(1).stroke();
  
  doc.fillColor(colors.lightDark)
     .font('Helvetica-Bold')
     .fontSize(8)
     .text('PRODUCTIVITY SCORE', 60, bannerY + 12, { width: 130, align: 'center' });

  // Big Score Text
  doc.fillColor(colors.primary)
     .font('Helvetica-Bold')
     .fontSize(36)
     .text(aiReport.productivityScore.toString(), 50, bannerY + 24, { width: 150, align: 'center' });

  // Score Status Level
  let statusText = 'Steady Cadence';
  let statusColor = colors.secondary;
  if (aiReport.productivityScore >= 80) {
    statusText = 'High Velocity';
    statusColor = colors.success;
  } else if (aiReport.productivityScore < 50) {
    statusText = 'Optimization Needed';
    statusColor = colors.danger;
  }

  doc.fillColor(statusColor)
     .font('Helvetica-Bold')
     .fontSize(8)
     .text(statusText.toUpperCase(), 50, bannerY + 68, { width: 150, align: 'center' });

  // Right: Executive Summary Text Box
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('Executive Summary (AI Insights)', 220, bannerY);
     
  doc.moveTo(220, bannerY + 14).lineTo(545, bannerY + 14).strokeColor(colors.border).lineWidth(0.5).stroke();
  
  doc.fillColor(colors.lightDark)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text(aiReport.summary, 220, bannerY + 22, { width: 325, align: 'justify', lineGap: 3 });

  doc.y = bannerY + 105;

  // --- 4. TEAM METRICS BREAKDOWN GRIDS ---
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('Key Operational Telemetry Metrics', 50, doc.y);
  
  doc.moveTo(50, doc.y + 14).lineTo(545, doc.y + 14).strokeColor(colors.border).lineWidth(0.5).stroke();
  doc.y += 22;

  const metricsY = doc.y;

  // Render 3 stats columns: Commits | Pull Requests | Issues
  
  // Box 1: Commit Speed
  doc.rect(50, metricsY, 150, 50).fill(colors.bgLight);
  doc.fillColor(colors.lightDark).font('Helvetica-Bold').fontSize(7.5).text('RECENT COMMIT CADENCE', 55, metricsY + 8, { width: 140, align: 'center' });
  const totalCommits = commits.daily?.reduce((sum, d) => sum + d.count, 0) || 0;
  doc.fillColor(colors.dark).font('Helvetica-Bold').fontSize(16).text(totalCommits.toString(), 50, metricsY + 18, { width: 150, align: 'center' });
  doc.fillColor(colors.lightDark).font('Helvetica').fontSize(7).text('Commits recorded in last 30d', 50, metricsY + 36, { width: 150, align: 'center' });

  // Box 2: Pull Requests
  doc.rect(222, metricsY, 150, 50).fill(colors.bgLight);
  doc.fillColor(colors.lightDark).font('Helvetica-Bold').fontSize(7.5).text('PULL REQUEST MERGE RATE', 227, metricsY + 8, { width: 140, align: 'center' });
  doc.fillColor(colors.dark).font('Helvetica-Bold').fontSize(16).text(`${pullrequests.mergeRate}%`, 222, metricsY + 18, { width: 150, align: 'center' });
  doc.fillColor(colors.lightDark).font('Helvetica').fontSize(7).text(`Avg Merge Time: ${pullrequests.avgMergeTimeHours}h`, 222, metricsY + 36, { width: 150, align: 'center' });

  // Box 3: Issues
  doc.rect(395, metricsY, 150, 50).fill(colors.bgLight);
  doc.fillColor(colors.lightDark).font('Helvetica-Bold').fontSize(7.5).text('ISSUE RESOLUTION EFFICACY', 400, metricsY + 8, { width: 140, align: 'center' });
  doc.fillColor(colors.dark).font('Helvetica-Bold').fontSize(16).text(`${issues.closed} / ${issues.total}`, 395, metricsY + 18, { width: 150, align: 'center' });
  doc.fillColor(colors.lightDark).font('Helvetica').fontSize(7).text(`Avg Resolution: ${issues.avgResolutionTimeHours}h`, 395, metricsY + 36, { width: 150, align: 'center' });

  doc.y = metricsY + 68;

  // --- 5. DETAILED DEVELOPMENT ANALYSES ---
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('Delivery Rhythm & Cadence Analysis', 50, doc.y);
  doc.moveTo(50, doc.y + 14).lineTo(545, doc.y + 14).strokeColor(colors.border).lineWidth(0.5).stroke();
  
  doc.fillColor(colors.lightDark)
     .font('Helvetica')
     .fontSize(8.5)
     .text(aiReport.sprintAnalysis, 50, doc.y + 22, { width: 495, align: 'justify', lineGap: 2.5 });

  doc.y += 105;

  // --- ADD PAGE BREAK FOR CONTRIBUTORS & RECOMMENDATIONS ---
  doc.addPage();

  // --- Header on Page 2 ---
  doc.rect(50, 30, 495, 30).fill(colors.primary);
  doc.fillColor(colors.white).font('Helvetica-Bold').fontSize(10).text('DevTrackr Operational Report', 65, 40);
  doc.text(repo.fullName, 400, 40, { width: 130, align: 'right' });

  doc.y = 80;

  // --- 6. CONTRIBUTORS PERFORMANCE TABLE ---
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('Team Contribution & Workload Distribution', 50, doc.y);
  doc.moveTo(50, doc.y + 14).lineTo(545, doc.y + 14).strokeColor(colors.primary).lineWidth(1.5).stroke();
  doc.y += 20;

  // Table Headers
  const tableY = doc.y;
  doc.rect(50, tableY, 495, 18).fill(colors.bgDark);
  
  doc.fillColor(colors.white).font('Helvetica-Bold').fontSize(7.5);
  doc.text('CONTRIBUTOR NAME', 55, tableY + 5, { width: 110 });
  doc.text('COMMITS', 170, tableY + 5, { width: 50, align: 'right' });
  doc.text('LOC ADDED', 230, tableY + 5, { width: 60, align: 'right' });
  doc.text('LOC DELETED', 300, tableY + 5, { width: 65, align: 'right' });
  doc.text('PRs MERGED', 375, tableY + 5, { width: 60, align: 'right' });
  doc.text('SCORE', 445, tableY + 5, { width: 45, align: 'center' });
  doc.text('STATUS', 500, tableY + 5, { width: 40, align: 'center' });

  doc.y = tableY + 18;

  // Loop through top 8 contributors to fit beautifully in the page bounds
  const displayedContributors = contributors.slice(0, 8);
  
  displayedContributors.forEach((c, index) => {
    const rowY = doc.y;
    // Zebra striping backgrounds
    if (index % 2 === 1) {
      doc.rect(50, rowY, 495, 16).fill(colors.bgLight);
    }
    
    // Draw cells
    doc.fillColor(colors.dark).font('Helvetica-Bold').fontSize(7.5);
    doc.text(c.login.substring(0, 20), 55, rowY + 4, { width: 110 });

    doc.font('Helvetica').fontSize(7.5);
    doc.text(c.commitsCount.toString(), 170, rowY + 4, { width: 50, align: 'right' });
    doc.text(c.additions.toString(), 230, rowY + 4, { width: 60, align: 'right' });
    doc.text(c.deletions.toString(), 300, rowY + 4, { width: 65, align: 'right' });
    doc.text(`${c.mergedPRs}/${c.totalPRs}`, 375, rowY + 4, { width: 60, align: 'right' });
    
    // Score column with dynamic color
    let scoreColor = colors.primary;
    if (c.productivityScore >= 80) scoreColor = colors.success;
    else if (c.productivityScore < 40) scoreColor = colors.danger;
    
    doc.fillColor(scoreColor).font('Helvetica-Bold').text(`${c.productivityScore}/100`, 445, rowY + 4, { width: 45, align: 'center' });

    // Status column
    const statusVal = c.inactive ? 'Stale' : 'Active';
    const statusCol = c.inactive ? colors.danger : colors.success;
    doc.fillColor(statusCol).font('Helvetica-Bold').text(statusVal, 500, rowY + 4, { width: 40, align: 'center' });

    // Draw border line
    doc.moveTo(50, rowY + 16).lineTo(545, rowY + 16).strokeColor(colors.border).lineWidth(0.5).stroke();

    doc.y = rowY + 16;
  });

  doc.y += 15;

  // --- 7. BOTTLENECKS SECTION ---
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('Detected Team Operational Bottlenecks', 50, doc.y);
  doc.moveTo(50, doc.y + 14).lineTo(545, doc.y + 14).strokeColor(colors.danger).lineWidth(1).stroke();
  doc.y += 22;

  const bottleY = doc.y;
  aiReport.bottlenecks.forEach((b, index) => {
    const listY = doc.y;
    
    // Draw danger dot bullet
    doc.circle(60, listY + 5, 2.5).fill(colors.danger);
    
    doc.fillColor(colors.dark)
       .font('Helvetica')
       .fontSize(8)
       .text(b, 72, listY, { width: 470, lineGap: 2 });
       
    doc.y = listY + doc.heightOfString(b, { width: 470 }) + 5;
  });

  doc.y += 10;

  // --- 8. AI RECOMMENDATIONS & STRATEGIES ---
  doc.fillColor(colors.dark)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('AI Strategic Engineering Recommendations', 50, doc.y);
  doc.moveTo(50, doc.y + 14).lineTo(545, doc.y + 14).strokeColor(colors.success).lineWidth(1).stroke();
  doc.y += 22;

  aiReport.recommendations.forEach((r, index) => {
    const listY = doc.y;
    
    // Draw index number badge
    doc.rect(55, listY - 1, 12, 12).fill(colors.bgLight);
    doc.rect(55, listY - 1, 12, 12).strokeColor(colors.border).stroke();
    doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(7.5).text((index + 1).toString(), 55, listY + 1, { width: 12, align: 'center' });

    doc.fillColor(colors.dark)
       .font('Helvetica')
       .fontSize(8)
       .text(r, 75, listY, { width: 465, lineGap: 2 });
       
    doc.y = listY + doc.heightOfString(r, { width: 465 }) + 6;
  });

  // --- 9. GLOBAL PAGE NUMBERING & FOOTERS ---
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    
    // Draw footer line
    doc.moveTo(50, 800).lineTo(545, 800).strokeColor(colors.border).lineWidth(0.5).stroke();
    
    // Footer Brand Subtext
    doc.fillColor(colors.lightDark)
       .font('Helvetica')
       .fontSize(7)
       .text('CONFIDENTIAL - FOR INTERNAL ENGINEERING TEAM REVIEW ONLY', 50, 808, { width: 350 });
       
    doc.fillColor(colors.lightDark)
       .font('Helvetica')
       .fontSize(7)
       .text(`Page ${i + 1} of ${range.count}`, 445, 808, { width: 100, align: 'right' });
  }

  // End and finalize PDF
  doc.end();
};
