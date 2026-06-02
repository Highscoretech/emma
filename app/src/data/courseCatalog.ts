import type { Term } from '../models';

export interface CatalogCourse {
  code: string;
  title: string;
  creditUnits: number;
}

/**
 * Official LASUSTECH (College of Basic Sciences / Computer Science) course
 * lists, transcribed from the course list provided by the client.
 *
 * Keyed by `${level}-${term}` so the grade-entry screen can offer the right
 * courses for a student to tap instead of typing them by hand.
 */
export const COURSE_CATALOG: Record<string, CatalogCourse[]> = {
  '100-FIRST SEMESTER': [
    { code: 'BIO101', title: 'General Biology I', creditUnits: 2 },
    { code: 'CHM101', title: 'General Chemistry I', creditUnits: 2 },
    { code: 'CSC101', title: 'Introduction to Computer Science', creditUnits: 3 },
    { code: 'GST111', title: 'Communication in English', creditUnits: 2 },
    { code: 'GST121', title: 'Use of Library, Study Skills, and ICT', creditUnits: 2 },
    { code: 'MTH101', title: 'Elementary Mathematics I', creditUnits: 2 },
    { code: 'PHY101', title: 'General Physics I', creditUnits: 2 },
    { code: 'PHY107', title: 'General Physics Practical I', creditUnits: 1 },
  ],
  '100-SECOND SEMESTER': [
    { code: 'CHM102', title: 'General Chemistry II', creditUnits: 2 },
    { code: 'CSC102', title: 'Introduction to Problem Solving', creditUnits: 3 },
    { code: 'GST112', title: 'Logic, Philosophy and Human Existence', creditUnits: 2 },
    { code: 'GST114', title: 'Nigerian Peoples and Culture', creditUnits: 2 },
    { code: 'GST122', title: 'Communication in English II', creditUnits: 2 },
    { code: 'MTH102', title: 'Elementary Mathematics II', creditUnits: 2 },
    { code: 'MTH103', title: 'Elementary Mathematics III', creditUnits: 3 },
    { code: 'PHY102', title: 'General Physics II', creditUnits: 2 },
    { code: 'PHY108', title: 'General Physics Practical II', creditUnits: 1 },
    { code: 'STA122', title: 'Statistical Computing I', creditUnits: 2 },
  ],
  '200-FIRST SEMESTER': [
    { code: 'CHM107', title: 'General Chemistry Practical I', creditUnits: 1 },
    { code: 'COS201', title: 'Computer Programming I', creditUnits: 3 },
    { code: 'CSC203', title: 'Discrete Structures', creditUnits: 2 },
    { code: 'CYB201', title: 'Introduction to Cyber Security and Strategy', creditUnits: 2 },
    { code: 'ENT211', title: 'Entrepreneurship and Innovation', creditUnits: 2 },
    { code: 'ICT201', title: 'Introduction to Information and Communication Technology', creditUnits: 2 },
    { code: 'IFT211', title: 'Digital Logic Design', creditUnits: 2 },
    { code: 'LASUSTECHAGR215', title: 'General Agricultural Practice', creditUnits: 1 },
    { code: 'LASUSTECHCSC103', title: 'Internet Technology', creditUnits: 2 },
    { code: 'LASUSTECHYOR101', title: 'Communication in Yoruba I', creditUnits: 1 },
    { code: 'MTH201', title: 'Mathematical Methods I', creditUnits: 2 },
    { code: 'SEN201', title: 'Introduction to Software Engineering', creditUnits: 2 },
  ],
  '200-SECOND SEMESTER': [
    { code: 'COS202', title: 'Computer Programming II', creditUnits: 3 },
    { code: 'CSC299', title: 'SIWES I', creditUnits: 3 },
    { code: 'GST212', title: 'Philosophy, Logic and Human Existence', creditUnits: 2 },
    { code: 'IFT212', title: 'Computer Architecture and Organisation', creditUnits: 2 },
    { code: 'INS204', title: 'Systems Analysis and Design', creditUnits: 3 },
    { code: 'LASUSTECHCSC106', title: 'Website Design and Management', creditUnits: 2 },
    { code: 'LASUSTECHCSC206', title: 'Web Server Administration', creditUnits: 2 },
    { code: 'LASUSTECHFRE102', title: 'French for Science Students', creditUnits: 1 },
    { code: 'LASUSTECHGET230', title: 'General Workshop Practice', creditUnits: 1 },
    { code: 'MTH202', title: 'Elementary Differential Equation', creditUnits: 2 },
    { code: 'PHY202', title: 'Electric Circuits and Electronics', creditUnits: 2 },
  ],
  '300-FIRST SEMESTER': [
    { code: 'CSC301', title: 'Data Structures', creditUnits: 3 },
    { code: 'CSC309', title: 'Artificial Intelligence', creditUnits: 2 },
    { code: 'CSC399', title: 'SIWES II', creditUnits: 3 },
    { code: 'ICT305', title: 'Data Communication System and Networks', creditUnits: 3 },
    { code: 'LASUSTECHCSC307', title: 'Cloud Computing', creditUnits: 3 },
    { code: 'LASUSTECHCSC311', title: 'Information Storage Management', creditUnits: 2 },
    { code: 'SEN301', title: 'Object-Oriented Analysis and Design', creditUnits: 2 },
  ],
  '300-SECOND SEMESTER': [
    { code: 'CSC308', title: 'Operating Systems', creditUnits: 3 },
    { code: 'CSC322', title: 'Computer Science Innovation and New Technologies', creditUnits: 2 },
    { code: 'DTS304', title: 'Data Management I', creditUnits: 3 },
    { code: 'ENT312', title: 'Venture Creation', creditUnits: 2 },
    { code: 'GST312', title: 'Peace and Conflict Resolutions', creditUnits: 2 },
    { code: 'LASUSTECHCSC302', title: 'Survey of Programming Languages', creditUnits: 2 },
    { code: 'LASUSTECHCSC304', title: 'Computer System Security', creditUnits: 2 },
    { code: 'LASUSTECHCSC310', title: 'Machine Learning (R, Python and Azure)', creditUnits: 2 },
    { code: 'MTH202', title: 'Elementary Differential Equation', creditUnits: 2 },
  ],
  '400-FIRST SEMESTER': [
    { code: 'COS409', title: 'Research Methodology and Technical Report Writing', creditUnits: 3 },
    { code: 'CSC401', title: 'Algorithms and Complexity Analysis', creditUnits: 2 },
    { code: 'CSC497', title: 'Final Year Project I', creditUnits: 3 },
    { code: 'INS401', title: 'Project Management', creditUnits: 2 },
    { code: 'LASUSTECHCSC405', title: 'Operating System Engineering', creditUnits: 2 },
    { code: 'LASUSTECHCSC435', title: 'Computer Graphics & Visualisation', creditUnits: 2 },
    { code: 'LASUSTECHCSC437', title: 'Data Mining & Big Data Analysis', creditUnits: 2 },
  ],
  '400-SECOND SEMESTER': [
    { code: 'CSC402', title: 'Ethics and Legal Issues in Computer Science', creditUnits: 2 },
    { code: 'CSC406', title: 'Fault Tolerance Computing', creditUnits: 2 },
    { code: 'CSC408', title: 'Game Design & Semantic Web Design', creditUnits: 2 },
    { code: 'CSC422', title: 'Human Computer Interaction', creditUnits: 2 },
    { code: 'CSC442', title: 'Mobile Application Development', creditUnits: 2 },
    { code: 'IFT442', title: 'Wireless Communications and Networking', creditUnits: 3 },
  ],
};

/** Valid academic levels offered by the catalog. */
export const LEVELS = ['100', '200', '300', '400'] as const;

export function catalogKey(level: string, term: Term): string {
  return `${level}-${term}`;
}

export function getCatalogCourses(level: string, term: Term): CatalogCourse[] {
  return COURSE_CATALOG[catalogKey(level, term)] ?? [];
}
