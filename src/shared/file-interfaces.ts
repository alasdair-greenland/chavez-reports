export interface RawESCumulativeGradeExtractRow {
    SchoolID:string
    SchoolName: string
    StudentID: string
    StudentFirstName: string
    StudentLastName: string
    StudentHomeroom: string
    StudentGradeLevel: string
    Quarter: string
    SubjectName: string
    TeacherLastName: string
    TeacherFirstName: string
    QuarterAvg: string
    FinalAvg: string
  }

export interface RawStudentProfessionalSupportDetailsRow {
    'Student ID': string
    Name: string
    ELL: string
    PDIS: string
    'ELL Program Year Code'
}

export type RawNWEACDF = RawNWEACDFRow[];

export interface RawNWEACDFRow {
  Requirement_Status: string
  SchoolName: string
  StudentID: string
  StudentLastName: string
  StudentFirstName: string
  GradeLevel: string
  StudentHomeroom: string
  ACCESS_TEST_YEAR1: string
  ACCESS_LITERACY_COMPOSITE1: string
  STUDENT_ELL_INDICATOR: string
  STUDENT_SPECIAL_ED_INDICATOR: string
  TermName: string
  Discipline: string
  GrowthMeasureYN: string
  TestName: string
  TestStartDate: string
  TestDurationMinutes: string
  TestRITScore: string
  TestStandardError: string
  TestPercentile: string
  TestPercentile_32: string
  TypicalFallToFallGrowth: string
  TypicalSpringToSpringGrowth: string
  TypicalFallToSpringGrowth: string
  TypicalFallToWinterGrowth: string
  StartGrade1: string
  LYSpringTestDate1: string
  LYSpringRITScore1: string
  LYTermName1: string
  SpringProjectedGain1: string
  CYSpringProjectedRIT1: string
  GrowthNeededtoAchieveProjected1: string
  RITtoReadingScore: string
  RITtoReadingMin: string
  RITtoReadingMax: string
  Goal1Name: string
  Goal1RitScore: string
  Goal1StdErr: string
  Goal1Range: string
  Goal1Adjective: string
  Goal2Name: string
  Goal2RitScore: string
  Goal2StdErr: string
  Goal2Range: string
  Goal2Adjective: string
  Goal3Name: string
  Goal3RitScore: string
  Goal3StdErr: string
  Goal3Range: string
  Goal3Adjective: string
  Goal4Name: string
  Goal4RitScore: string
  Goal4StdErr: string
  Goal4Range: string
  Goal4Adjective: string
  Goal5Name: string
  Goal5RitScore: string
  Goal5StdErr: string
  Goal5Range: string
  Goal5Adjective: string
  Goal6Name: string
  Goal6RitScore: string
  Goal6StdErr: string
  Goal6Range: string
  Goal6Adjective: string
  Goal7Name: string
  Goal7RitScore: string
  Goal7StdErr: string
  Goal7Range: string
  Goal7Adjective: string
  Goal8Name: string
  Goal8RitScore: string
  Goal8StdErr: string
  Goal8Range: string
  Goal8Adjective: string
  TestStartTime: string
  PercentCorrect: string
  ProjectedProficiency: string
  Textbox22: string
}

export interface RawStaffAbsenceRow {
  AMOUNT: number | null
  Date: string
  Emplid: number
  HOMELABORACCTNAME: string
  'Job Code': number
  Name: string
  PAYCODENAME: string | null
  Position: string
  'Position Number': number
  'Unit Name': string
  'Unit/Dept ID': number
}

export interface RawPunchcardRow {
  PERSONNUM: string
  PERSONFULLNAME: string
  POSITION: string
  EVENTDATE: string
  PAYCODENAME: string
  PUNCHDTM: string
  ENDPUNCHDTM: string
}

export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'a' | 'b' | 'c' | 'd' | 'f';
export const LetterGradeList = ['A' , 'B' , 'C' , 'D' , 'F' , 'a' , 'b' , 'c' , 'd' , 'f']

export type Score = string | 'Msg' | 'Exc' | 'Inc' | '' | LetterGrade;

export interface RawAssignmentsRow {
  StuStudentId: string
  ClassName: string
  TeacherLast: string
  TeacherFirst: string 
  ASGName: string 
  Score: Score 
  ScorePossible: string
  CategoryName: string
  CategoryWeight: string
  GradeEnteredOn: string
}

export interface RawTeacherCategoriesAndTotalPointsLogicRow {
  SchoolID: string
  SchoolName: string
  TeacherLastName: string
  TeacherFirstName: string
  ClassName: string
  CLSCycle: string
  MultipleWeightMode: string
  TotalPointsLogicSetting: string
  MaxGradestoDrop: string
  CategoryName: string
  CategoryWeight: string
  TotalWeight: string
}