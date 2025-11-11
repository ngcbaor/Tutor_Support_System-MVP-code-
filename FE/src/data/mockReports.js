// Mock data for all report-related pages
// This file will be replaced with actual API calls later

// ============================================
// Lookup/Mapping Data
// ============================================
export const termMapping = {
  'sem1-2025': 'Semester 1 / 2025-2026',
  'sem2-2024': 'Semester 2 / 2024-2025'
};

export const facultyMapping = {
  'cs': 'Computer Science & Engineering',
  'ee': 'Electrical Engineering'
};

export const programMapping = {
  'all': 'All Programs',
  'cq': 'Chính quy (Regular)',
  'oisp': 'OISP'
};

export const cohortMapping = {
  'all': 'All Cohorts',
  'k23': 'K2023',
  'k24': 'K2024'
};

// ============================================
// Dropdown Options Arrays
// ============================================
export const termOptions = [
  { value: 'sem1-2025', label: 'Semester 1 / 2025-2026' },
  { value: 'sem2-2024', label: 'Semester 2 / 2024-2025' }
];

export const facultyOptions = [
  { value: 'cs', label: 'Computer Science & Engineering' },
  { value: 'ee', label: 'Electrical Engineering' }
];

export const programOptions = [
  { value: 'all', label: 'All Programs' },
  { value: 'cq', label: 'Chính quy (Regular)' },
  { value: 'oisp', label: 'OISP' }
];

export const cohortOptions = [
  { value: 'all', label: 'All Cohorts' },
  { value: 'k23', label: 'K2023' },
  { value: 'k24', label: 'K2024' }
];

// Helper function to format scope text for reports
export const formatReportScope = (type, filters) => {
  const { term, faculty, program, cohort } = filters;
  
  const termText = termMapping[term] || term;
  const facultyText = facultyMapping[faculty] || faculty;
  const programText = programMapping[program] || program;
  const cohortText = cohortMapping[cohort] || cohort;
  
  if (type === 'resource') {
    // Resource Allocation format
    const programPart = program === 'all' ? '' : ` / ${programText}`;
    return `${termText} / ${facultyText}${programPart}`;
  } else {
    // Student Summary format
    return `${termText} / ${facultyText} / ${cohortText} / ${programText}`;
  }
};

// ============================================
// Allocation Reports List
// ============================================
export const mockAllocationReports = [
  {
    id: 1,
    scope: 'CS - All Programs',
    term: 'Sem 1 / 2025-2026',
    dateGenerated: 'Oct 30, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem1-2025',
    facultyValue: 'cs',
    programValue: 'all'
  },
  {
    id: 2,
    scope: 'EE - Chính quy (Regular)',
    term: 'Sem 1 / 2025-2026',
    dateGenerated: 'Oct 29, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem1-2025',
    facultyValue: 'ee',
    programValue: 'cq'
  },
  {
    id: 3,
    scope: 'CS - OISP',
    term: 'Sem 2 / 2024-2025',
    dateGenerated: 'Oct 20, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem2-2024',
    facultyValue: 'cs',
    programValue: 'oisp'
  }
];

// ============================================
// Awarding Reports List
// ============================================
export const mockAwardingReports = [
  {
    id: 1,
    scope: 'K2024 - CS - Chính quy (Regular)',
    term: 'Sem 1 / 2025-2026',
    dateGenerated: 'Oct 28, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem1-2025',
    facultyValue: 'cs',
    programValue: 'cq',
    cohortValue: 'k24'
  },
  {
    id: 2,
    scope: 'K2023 - CS - OISP',
    term: 'Sem 1 / 2025-2026',
    dateGenerated: 'Oct 27, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem1-2025',
    facultyValue: 'cs',
    programValue: 'oisp',
    cohortValue: 'k23'
  },
  {
    id: 3,
    scope: 'K2024 - EE - All Programs',
    term: 'Sem 1 / 2025-2026',
    dateGenerated: 'Oct 26, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem1-2025',
    facultyValue: 'ee',
    programValue: 'all',
    cohortValue: 'k24'
  },
  {
    id: 4,
    scope: 'K2023 - EE - Chính quy (Regular)',
    term: 'Sem 2 / 2024-2025',
    dateGenerated: 'Oct 15, 2025',
    generatedBy: 'Academic Affairs',
    termValue: 'sem2-2024',
    facultyValue: 'ee',
    programValue: 'cq',
    cohortValue: 'k23'
  }
];

// ============================================
// Allocation Report Details (for view page)
// ============================================
export const mockAllocationReportDetails = {
  kpis: {
    avgGrade: 7.5,
    failureRate: 14,
    avgFeedback: 4.1,
    avgStudentTutorRatio: 18.2
  },
  courses: [
    {
      id: 1,
      name: 'IT4409 - Adv. Web Prog.',
      enrollment: 65,
      sections: 3,
      avgPerSection: 21.7,
      avgGrade: 8.2,
      failureRate: 5,
      avgFeedback: 4.5,
      tutors: 2,
      studentTutorRatio: 32.5
    },
    {
      id: 2,
      name: 'IT4083 - Dist. DB',
      enrollment: 48,
      sections: 2,
      avgPerSection: 24.0,
      avgGrade: 7.5,
      failureRate: 10,
      avgFeedback: 4.1,
      tutors: 1,
      studentTutorRatio: 48.0
    },
    {
      id: 3,
      name: 'CS1010 - Intro to AI',
      enrollment: 112,
      sections: 3,
      avgPerSection: 37.3,
      avgGrade: 6.9,
      failureRate: 18,
      avgFeedback: 3.8,
      tutors: 3,
      studentTutorRatio: 37.3,
      warning: true
    }
  ],
  tutors: [
    {
      id: 1,
      name: 'Tran Ngoc Bao',
      courses: 2,
      totalStudents: 177,
      avgFeedback: 4.1
    },
    {
      id: 2,
      name: 'Nguyen Van B',
      courses: 1,
      totalStudents: 48,
      avgFeedback: 4.5
    },
    {
      id: 3,
      name: 'Le Thi C',
      courses: 1,
      totalStudents: 112,
      avgFeedback: 3.9,
      warning: true
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'danger',
      icon: '❗️',
      title: 'High Failure Rate & S/T Ratio',
      message: 'Course CS1010 requires attention due to high failure rate (18%) and high student load per tutor (37.3). Consider adding TA support or splitting sections.'
    },
    {
      id: 2,
      type: 'warning',
      icon: '⚠️',
      title: 'Low Student Feedback',
      message: 'Tutor Le Thi C has a significantly lower average feedback score (3.9). Mentoring or review suggested.'
    },
    {
      id: 3,
      type: 'info',
      icon: 'ℹ️',
      title: 'Course Overload?',
      message: 'Course IT4083 has a high S/T Ratio (48.0) assigned to a single tutor. Monitor workload.'
    }
  ]
};

// ============================================
// Awarding Report Details (for view page)
// ============================================
export const mockAwardingReportDetails = {
  students: [
    {
      no: 1,
      studentId: '2352053',
      fullName: 'Nguyễn Thiện Anh',
      gpa4: 3.6,
      gpa10: 8.5,
      avgTutorAssessment: 4.0
    },
    {
      no: 2,
      studentId: '2352109',
      fullName: 'Trần Ngọc Bảo',
      gpa4: 3.2,
      gpa10: 7.8,
      avgTutorAssessment: 4.2
    },
    {
      no: 3,
      studentId: '2352237',
      fullName: 'Nguyễn Thành Đạt',
      gpa4: 2.5,
      gpa10: 6.5,
      avgTutorAssessment: 3.5
    },
    {
      no: 4,
      studentId: '2352514',
      fullName: 'Cao Nguyễn Gia Khánh',
      gpa4: 3.9,
      gpa10: 9.1,
      avgTutorAssessment: 4.8
    },
    {
      no: 5,
      studentId: '2352641',
      fullName: 'Mai Trung Kiên',
      gpa4: 2.9,
      gpa10: 7.2,
      avgTutorAssessment: 3.9
    },
    {
      no: 6,
      studentId: '2352931',
      fullName: 'Lê Nguyễn Gia Phúc',
      gpa4: 3.7,
      gpa10: 8.8,
      avgTutorAssessment: 4.5
    },
    {
      no: 7,
      studentId: '2352847',
      fullName: 'Phạm Minh Quân',
      gpa4: 3.4,
      gpa10: 8.2,
      avgTutorAssessment: 4.1
    },
    {
      no: 8,
      studentId: '2352759',
      fullName: 'Võ Thị Thu',
      gpa4: 3.8,
      gpa10: 9.0,
      avgTutorAssessment: 4.6
    },
    {
      no: 9,
      studentId: '2352456',
      fullName: 'Hoàng Văn Tùng',
      gpa4: 2.8,
      gpa10: 7.0,
      avgTutorAssessment: 3.7
    },
    {
      no: 10,
      studentId: '2352621',
      fullName: 'Đặng Hải Yến',
      gpa4: 3.5,
      gpa10: 8.3,
      avgTutorAssessment: 4.3
    }
  ]
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get allocation report by ID
 * @param {number} reportId 
 * @returns {object|null}
 */
export function getAllocationReportById(reportId) {
  return mockAllocationReports.find(report => report.id === parseInt(reportId)) || null;
}

/**
 * Get awarding report by ID
 * @param {number} reportId 
 * @returns {object|null}
 */
export function getAwardingReportById(reportId) {
  return mockAwardingReports.find(report => report.id === parseInt(reportId)) || null;
}

/**
 * Get allocation report details (KPIs, courses, tutors, alerts)
 * @param {number} reportId 
 * @returns {object}
 */
export function getAllocationReportDetails(reportId) {
  // In real implementation, this would fetch data based on reportId
  // For now, return the same mock data
  const report = getAllocationReportById(reportId);
  if (!report) return null;
  
  return {
    ...report,
    details: mockAllocationReportDetails
  };
}

/**
 * Get awarding report details (student list)
 * @param {number} reportId 
 * @returns {object}
 */
export function getAwardingReportDetails(reportId) {
  // In real implementation, this would fetch data based on reportId
  // For now, return the same mock data
  const report = getAwardingReportById(reportId);
  if (!report) return null;
  
  return {
    ...report,
    details: mockAwardingReportDetails
  };
}

// ============================================
// Monitor Student Performance Data
// ============================================

// Mock courses data for Performance Dashboard
export const mockPerformanceCourses = [
  {
    id: 'it4409',
    code: 'IT4409',
    name: 'Adv. Web Prog.',
    tutors: 'Tran Ngoc Bao, Nguyen Van B',
    enrollment: 65,
    avgGrade: 8.2,
    failureRate: 5,
    participation: 92,
    atRiskCount: 2,
    riskLevel: 'low'
  },
  {
    id: 'cs1010',
    code: 'CS1010',
    name: 'Intro to AI',
    tutors: 'Le Thi C',
    enrollment: 112,
    avgGrade: 6.9,
    failureRate: 18,
    participation: 78,
    atRiskCount: 15,
    riskLevel: 'high'
  },
  {
    id: 'it4083',
    code: 'IT4083',
    name: 'Dist. DB',
    tutors: 'Nguyen Van B',
    enrollment: 48,
    avgGrade: 7.5,
    failureRate: 10,
    participation: 85,
    atRiskCount: 5,
    riskLevel: 'medium'
  }
];

// Mock course details with student data
export const mockCourseDetails = {
  'it4409': {
    code: 'IT4409',
    name: 'Adv. Web Prog.',
    avgGrade: 8.2,
    failureRate: 5,
    participation: 92,
    atRiskCount: 2,
    students: [
      { id: '2352001', name: 'Trần Ngọc Bảo', status: 'low', statusLabel: 'On Track', reason: '-', grade: 8.5, tutor: 'Tran Ngoc Bao', advisor: 'Advisor A', isAtRisk: false },
      { id: '2352002', name: 'Nguyễn Thiện Anh', status: 'low', statusLabel: 'On Track', reason: '-', grade: 9.1, tutor: 'Nguyen Van B', advisor: 'Advisor B', isAtRisk: false }
    ]
  },
  'cs1010': {
    code: 'CS1010',
    name: 'Intro to AI',
    avgGrade: 6.9,
    failureRate: 18,
    participation: 78,
    atRiskCount: 15,
    students: [
      { id: '2352001', name: 'Trần Ngọc Bảo', status: 'high', statusLabel: 'High Risk', reason: 'Low Grade (5.1), Attendance (65%)', grade: 5.1, tutor: 'Le Thi C', advisor: 'Advisor A', isAtRisk: true },
      { id: '2352002', name: 'Nguyễn Thiện Anh', status: 'low', statusLabel: 'On Track', reason: '-', grade: 8.5, tutor: 'Le Thi C', advisor: 'Advisor B', isAtRisk: false },
      { id: '2352003', name: 'Mai Trung Kiên', status: 'medium', statusLabel: 'Medium Risk', reason: 'Participation (Low)', grade: 7.2, tutor: 'Le Thi C', advisor: 'Advisor A', isAtRisk: true },
      { id: '2352004', name: 'Cao Nguyễn Gia Khánh', status: 'low', statusLabel: 'On Track', reason: '-', grade: 9.1, tutor: 'Le Thi C', advisor: 'Advisor C', isAtRisk: false }
    ]
  },
  'it4083': {
    code: 'IT4083',
    name: 'Dist. DB',
    avgGrade: 7.5,
    failureRate: 10,
    participation: 85,
    atRiskCount: 5,
    students: [
      { id: '2352001', name: 'Trần Ngọc Bảo', status: 'medium', statusLabel: 'Medium Risk', reason: 'Attendance (70%)', grade: 7.0, tutor: 'Nguyen Van B', advisor: 'Advisor A', isAtRisk: true },
      { id: '2352002', name: 'Nguyễn Thiện Anh', status: 'low', statusLabel: 'On Track', reason: '-', grade: 8.8, tutor: 'Nguyen Van B', advisor: 'Advisor B', isAtRisk: false }
    ]
  }
};
