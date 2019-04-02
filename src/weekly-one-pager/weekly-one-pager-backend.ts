import * as d3 from 'd3'
import * as idb from 'idb-keyval'

import { 
    getOnTrackScore,
    getCPSOnTrack,
} from '../shared/utils'

import {
    ReportCards,
    ReportFiles, } from '../shared/report-types'

import {
    RawFileParse,
    } from '../shared/file-types'

import {
    RawESCumulativeGradeExtractRow,
    RawStudentProfessionalSupportDetailsRow,
    } from '../shared/file-interfaces'

export interface HomeRoom{
    room: string
    students: HRStudent[]
}

export interface HRStudent {
    fullName: string
    ELL: string
    quarterReadingGrade: number,
    quarterMathGrade: number,
    quarterScienceGrade: number,
    quarterSocialScienceGrade: number,
    quarterGPA: number[],
    finalReadingGrade: number,
    finalMathGrade: number,
    finalScienceGrade: number,
    finalSocialScienceGrade: number,
    finalGPA: number[],
    absences: number[]
    tardies: number[]
    enrollmentDays: number[]
    onTrack: number
    CPSonTrack: boolean
}

interface Student {
    HR: string
    ID: string
    fullName: string
    ELL: string
    quarterReadingGrade: number,
    quarterMathGrade: number,
    quarterScienceGrade: number,
    quarterSocialScienceGrade: number,
    quarterGPA: number[],
    finalReadingGrade: number,
    finalMathGrade: number,
    finalScienceGrade: number,
    finalSocialScienceGrade: number,
    finalGPA: number[],
    absencePercent: number
    absences: number[]
    tardies: number[]
    totalDays: number[]
    onTrack: number
}

interface Students {
    [id: string]: Student
}

interface Tardies {
    'Student ID': string
    Attended: string
    Absences: string
}

export const createOnePagers = (files: ReportFiles): HomeRoom[] => {
    let studentGradeObject = getStudentGrades(files.reportFiles[files.reportTitle.files[0].fileDesc]);
    const sp = files.reportFiles[files.reportTitle.files[1].fileDesc].parseResult;
    const tr = files.reportFiles[files.reportTitle.files[2].fileDesc].parseResult;
    const spps = sp === null ? null: sp.data as RawStudentProfessionalSupportDetailsRow[];
    const tardies = tr === null ? null: tr.data as Tardies[];
    const opts = files.reportTitle.optionalFiles !== undefined;
    const gradeHist = files.reportTitle.optionalFiles ? getStudentGrades(files.reportFiles[files.reportTitle.optionalFiles[0].fileDesc]): {};
    const tHist = files.reportTitle.optionalFiles && files.reportFiles[files.reportTitle.optionalFiles[1].fileDesc] ? files.reportFiles[files.reportTitle.optionalFiles[1].fileDesc].parseResult : null;
    const tardiesHist = tHist === null ? null: tHist.data as Tardies[];
    
    if (spps !== null){spps.forEach(row => {
        if(studentGradeObject[row['Student ID']]!== undefined){
            studentGradeObject[row['Student ID']].fullName = row.Name;
            studentGradeObject[row['Student ID']].ELL = row['ELL Program Year Code'];}
    });}
    if(tardies != null){
        getAttendanceData(studentGradeObject, tardies);
    };

    if(gradeHist !== {} && tardiesHist !== null){
        getAttendanceData(gradeHist, tardiesHist);
    }

    mergeStudents(studentGradeObject, gradeHist);

    const homeRooms = flattenStudents(studentGradeObject);

    return homeRooms;
    

}

const mergeStudents = (current: Students, past: Students) => {
    Object.keys(current).forEach( k => {
        if(past[k] !== undefined){
            current[k].quarterGPA.push(past[k].quarterGPA[0]);
            current[k].finalGPA.push(past[k].finalGPA[0]);
            current[k].absences.push(past[k].absences[0]);
            current[k].tardies.push(past[k].tardies[0]);
            current[k].totalDays.push(past[k].totalDays[0]);
        } else {
            current[k].finalGPA.push(current[k].finalGPA[0]);
            current[k].quarterGPA.push(current[k].quarterGPA[0]);
            current[k].absences.push(current[k].absences[0]);
            current[k].tardies.push(current[k].tardies[0]);
            current[k].totalDays.push(current[k].totalDays[0]);
        }
    })
}

const getStudentGrades = (file: RawFileParse): Students => {
    const getReadingGrade = (rows: RawESCumulativeGradeExtractRow[]): number[] => {
        const row = rows.find( r => r.SubjectName === 'CHGO READING FRMWK');
        if(row === undefined){return [-1, -1]}
        const finalAvg = row.FinalAvg !== '' ? parseInt(row.FinalAvg, 10): -1;
        const quarterAvg = row.QuarterAvg !== '' ? parseInt(row.QuarterAvg, 10): -1
        return [quarterAvg, finalAvg];

    }
    const getMathGrade = (rows: RawESCumulativeGradeExtractRow[]): number[] => {
        const row = rows.find( r => r.SubjectName === 'MATHEMATICS STD');
        const alg = rows.find( r => r.SubjectName === 'ALGEBRA');
        if(row === undefined){
            if(alg === undefined){return [-1, -1]}
            else{
                const finalAvg = alg.FinalAvg !== '' ? parseInt(alg.FinalAvg, 10): -1;
                const quarterAvg = alg.QuarterAvg !== '' ? parseInt(alg.QuarterAvg, 10): -1
                return [quarterAvg, finalAvg];
            }}
        const finalAvg = row.FinalAvg !== '' ? parseInt(row.FinalAvg, 10): -1;
        const quarterAvg = row.QuarterAvg !== '' ? parseInt(row.QuarterAvg, 10): -1
        return [quarterAvg, finalAvg];
    }
    const getScienceGrade = (rows: RawESCumulativeGradeExtractRow[]): number[] => {
        const row = rows.find( r => r.SubjectName === 'SCIENCE  STANDARDS');
        if(row === undefined){return [-1, -1]}
        const finalAvg = row.FinalAvg !== '' ? parseInt(row.FinalAvg, 10): -1;
        const quarterAvg = row.QuarterAvg !== '' ? parseInt(row.QuarterAvg, 10): -1
        return [quarterAvg, finalAvg];
    }
    const getSocialScienceGrade = (rows: RawESCumulativeGradeExtractRow[]): number[] => {
        const row = rows.find( r => r.SubjectName === 'SOCIAL SCIENCE STD');
        if(row === undefined){return [-1, -1]}
        const finalAvg = row.FinalAvg !== '' ? parseInt(row.FinalAvg, 10): -1;
        const quarterAvg = row.QuarterAvg !== '' ? parseInt(row.QuarterAvg, 10): -1
        return [quarterAvg, finalAvg];
    }

    const getGPA = (grades: number[]):number => {
        const pos = grades.filter( n => n >= 0);
        const normGrade = pos.map( (g):number => {
            if(g > 89){return 4;}
            if(g > 79){return 3;}
            if(g > 69){return 2;}
            if(g > 59){return 1;}
            return 0;
        })
        return normGrade.length > 0 ? normGrade.reduce(((a,b) => a+b), 0)/normGrade.length : 0
    }

    if (file === undefined || file.parseResult === null){return {}}
    const students = d3.nest<RawESCumulativeGradeExtractRow, Student>()
        .key( r => r.StudentID)
        .rollup( rs => {
            const grades = [getReadingGrade(rs),getMathGrade(rs),getScienceGrade(rs),getSocialScienceGrade(rs)];
            const quarterGrades = grades.map(a => a[0]);
            const finalGrades = grades.map(a=>a[1]);
            const GPA = getGPA(finalGrades);
            return {
                HR: rs[0].StudentHomeroom,
                ID: rs[0].StudentID,
                fullName: '',
                ELL: '',
                quarterReadingGrade: quarterGrades[0],
                quarterMathGrade: quarterGrades[1],
                quarterScienceGrade: quarterGrades[2],
                quarterSocialScienceGrade: quarterGrades[3],
                quarterGPA: [GPA],
                finalReadingGrade: finalGrades[0],
                finalMathGrade: finalGrades[1],
                finalScienceGrade: finalGrades[2],
                finalSocialScienceGrade: finalGrades[3],
                finalGPA: [GPA],
                absencePercent: 0,
                absences: [],
                tardies: [],
                totalDays: [],
                onTrack: -1,
            }
        }).object(file.parseResult.data as RawESCumulativeGradeExtractRow[])
    
    return students;
}

const flattenStudents = (students: Students): HomeRoom[] => {
    const studentArray: Student[] = Object.keys(students).map( s => students[s]);
    const homeRoomsObject= d3.nest<Student, HomeRoom>()
        .key( r => r.HR)
        .rollup( rs => {
            return {
                room: rs[0].HR,
                students: rs.sort((a,b)=> a.onTrack-b.onTrack).map( (r: Student):HRStudent => {
                    return {
                        fullName: r.fullName,
                        ELL: r.ELL,
                        quarterReadingGrade: r.quarterReadingGrade,
                        quarterMathGrade: r.quarterMathGrade,
                        quarterScienceGrade: r.quarterScienceGrade,
                        quarterSocialScienceGrade: r.quarterSocialScienceGrade,
                        quarterGPA: r.quarterGPA,
                        finalReadingGrade: r.finalReadingGrade,
                        finalMathGrade: r.finalMathGrade,
                        finalScienceGrade: r.finalScienceGrade,
                        finalSocialScienceGrade: r.finalSocialScienceGrade,
                        finalGPA: r.finalGPA,
                        absences: r.absences,
                        tardies: r.tardies,
                        enrollmentDays: r.totalDays,
                        onTrack: r.onTrack,
                        CPSonTrack: getCPSOnTrack(r.finalMathGrade, r.finalReadingGrade, r.absencePercent),
                    }
                })
            }
        }).object(studentArray);
    
    return Object.keys(homeRoomsObject).map( hr => homeRoomsObject[hr]);

}

//Mutates data, like if you cry every time
const getAttendanceData = (students: Students, attData: Tardies[]) => {

    const getPresentAndTardy = (rs: Tardies[]):number =>{
        const p = rs.find(r=>r.Attended ==='Present');
        const t = rs.find(r=>r.Attended === 'Tardy');
        if(p !== undefined){
            if(t !== undefined){return parseInt(p.Absences)+parseInt(t.Absences)}
            else {return parseInt(p.Absences)}
        }
        return 0;
    }

    const getTardies = (rs: Tardies[]):number =>{
        const t = rs.find(r=>r.Attended ==='Tardy');
        if(t !== undefined){return parseInt(t.Absences)}
        return 0;
    }

    const getAbsences = (rs: Tardies[]):number =>{
        return rs.filter(r=> r.Attended !== 'Tardy' && r.Attended !== 'Present')
                    .reduce((a,b) => {return a + ((b.Attended === '1/2 Day Excused' || b.Attended === '1/2 Day Unexcused') ?
                                                    parseInt(b.Absences)/2.0 : parseInt(b.Absences))}, 0)
    }

    const attObject = d3.nest<Tardies, Tardies[]>()
        .key( r => r['Student ID'])
        .rollup( rs => {
            if(students[rs[0]['Student ID']]!==undefined){
                const total = rs.reduce((a,b) => a + parseInt(b.Absences),0);
                const present = getPresentAndTardy(rs);
                const tardy = getTardies(rs);
                const absent = getAbsences(rs);
                const pct = (total-absent)/total * 100;
                students[rs[0]['Student ID']].absencePercent = pct;
                students[rs[0]['Student ID']].absences = [absent];
                students[rs[0]['Student ID']].tardies = [tardy];
                students[rs[0]['Student ID']].onTrack = getOnTrackScore(students[rs[0]['Student ID']].finalGPA[0], pct);
                students[rs[0]['Student ID']].totalDays = [total];
            }
            return rs;
        })
        .object(attData)
}