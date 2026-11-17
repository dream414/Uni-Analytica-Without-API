
const generateSuggestions = (analytics) => {
  if (!analytics || !analytics.categorySummary) {
    throw new Error("Analytics data is required");
  }

  const suggestions = [];

  const categories = analytics.categorySummary;

  // Find the category with the highest number of issues
  const sortedCategories = Object.entries(categories)
    .filter(([category]) => category !== "Uncategorized")
    .sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length > 0) {
    const [topCategory, count] = sortedCategories[0];

    suggestions.push({
      type: "Priority",
      title: "Focus on the Most Reported Issue",
      description: `${topCategory} has the highest number of reported responses (${count}). The university should investigate this area and prepare an improvement plan.`,
      relatedCategory: topCategory,
      relatedRecords: count,
      priority: "High"
    });
  }

  // Academic issues
  const academicIssues =
    categories["Academic & Educational Issues"] || 0;

  if (academicIssues > 0) {
    suggestions.push({
      type: "Academic Improvement",
      title: "Improve Academic Services",
      description: `${academicIssues} responses are related to academic and educational issues. Universities should review teaching quality, course outlines, classroom facilities and academic support.`,
      relatedCategory: "Academic & Educational Issues",
      relatedRecords: academicIssues,
      priority: "High"
    });
  }

  // Career development
  const careerIssues =
    categories["Career Development & Internship Opportunities"] || 0;

  if (careerIssues > 0) {
    suggestions.push({
      type: "Career Development",
      title: "Expand Career Opportunities",
      description: `${careerIssues} responses relate to career development and internships. Universities should arrange internships, career counseling, skill development workshops and job guidance.`,
      relatedCategory: "Career Development & Internship Opportunities",
      relatedRecords: careerIssues,
      priority: "Medium"
    });
  }

  // Student welfare
  const welfareIssues =
    categories["Student Welfare, Safety & Support"] || 0;

  if (welfareIssues > 0) {
    suggestions.push({
      type: "Student Support",
      title: "Strengthen Student Welfare",
      description: `${welfareIssues} responses concern student welfare and support. Universities should improve student counseling, complaint handling and campus safety services.`,
      relatedCategory: "Student Welfare, Safety & Support",
      relatedRecords: welfareIssues,
      priority: "High"
    });
  }

  // Infrastructure
  const infrastructureIssues =
    categories["Campus Infrastructure & Facilities"] || 0;

  if (infrastructureIssues > 0) {
    suggestions.push({
      type: "Infrastructure",
      title: "Improve Campus Facilities",
      description: `${infrastructureIssues} responses concern campus infrastructure. Universities should review classrooms, laboratories, libraries, washrooms and other student facilities.`,
      relatedCategory: "Campus Infrastructure & Facilities",
      relatedRecords: infrastructureIssues,
      priority: "Medium"
    });
  }

  // Transportation and hostel
  const transportIssues =
    categories["Transportation & Hostel Facilities"] || 0;

  if (transportIssues > 0) {
    suggestions.push({
      type: "Student Facilities",
      title: "Review Transport and Hostel Services",
      description: `${transportIssues} responses concern transportation and hostel facilities. Universities should review transport routes, availability, charges and hostel accommodation.`,
      relatedCategory: "Transportation & Hostel Facilities",
      relatedRecords: transportIssues,
      priority: "Medium"
    });
  }

  // Duplicate records
  if (analytics.duplicateCount > 0) {
    suggestions.push({
      type: "Data Quality",
      title: "Review Duplicate Submissions",
      description: `${analytics.duplicateCount} duplicate response(s) were detected. Review them before preparing final reports to avoid counting repeated submissions as separate issues.`,
      relatedCategory: "Data Quality",
      relatedRecords: analytics.duplicateCount,
      priority: "Medium"
    });
  }

  // Manual review
  const reviewSummary = analytics.reviewSummary || {};

  const totalReviewRecords =
    (reviewSummary.language || 0) +
    (reviewSummary.classification || 0) +
    (reviewSummary.textAnalysis || 0);

  if (totalReviewRecords > 0) {
    suggestions.push({
      type: "Data Review",
      title: "Review Uncertain Analysis Results",
      description: `${totalReviewRecords} analysis flags were raised across language detection, classification and text analysis. These counts may overlap because one response can need review in multiple modules. Human verification is recommended.`,
      relatedCategory: "Manual Review",
      relatedRecords: totalReviewRecords,
      priority: "High"
    });
  }

  return {
    totalSuggestions: suggestions.length,
    generatedBy: "Rule-Based Analysis",
    suggestions
  };
};

module.exports = {
  generateSuggestions
};
