import { courseRepository } from '../repositories/courseRepository.js';
import { CourseGrade } from '../types/index.js';

export interface GradeForecastResult {
  currentGrade: number;
  targetGrade: number;
  examWeight: number;
  requiredExamScore: number;
  status: 'Secured' | 'Achievable' | 'Challenging' | 'Impossible';
  recommendation: string;
}

export class CourseService {
  /**
   * Calculate required final exam score percentage to reach target grade.
   * Formula: Required = (Target - Current * (1 - Weight)) / Weight
   */
  public calculateRequiredExamScore(
    currentGrade: number,
    targetGrade: number,
    examWeight: number
  ): GradeForecastResult {
    if (examWeight <= 0 || examWeight > 100) {
      throw new Error('Exam weight must be between 1% and 100%');
    }

    const weightDec = examWeight / 100;
    const requiredScoreRaw = (targetGrade - currentGrade * (1 - weightDec)) / weightDec;
    const requiredExamScore = Math.round(requiredScoreRaw * 100) / 100;

    let status: 'Secured' | 'Achievable' | 'Challenging' | 'Impossible' = 'Achievable';
    let recommendation = '';

    if (requiredExamScore <= 0) {
      status = 'Secured';
      recommendation = '🎉 You have already secured your target grade! Keep up the baseline effort.';
    } else if (requiredExamScore <= 85) {
      status = 'Achievable';
      recommendation = `✅ Target is comfortably achievable. Score at least ${requiredExamScore}% on the final exam.`;
    } else if (requiredExamScore <= 100) {
      status = 'Challenging';
      recommendation = `🔥 Target requires focused study effort. You need ${requiredExamScore}% on the final exam.`;
    } else {
      status = 'Impossible';
      recommendation = `⚠️ Target exceeds 100% (${requiredExamScore}% required). Consider speaking to your instructor for extra credit opportunities.`;
    }

    return {
      currentGrade,
      targetGrade,
      examWeight,
      requiredExamScore,
      status,
      recommendation,
    };
  }

  public async getAllCourses(userId?: string): Promise<CourseGrade[]> {
    return await courseRepository.findAll(userId);
  }

  public async getCourseById(id: string): Promise<CourseGrade | null> {
    return await courseRepository.findById(id);
  }

  public async createCourse(
    courseData: Omit<CourseGrade, 'id'> & { userId?: string }
  ): Promise<CourseGrade> {
    if (!courseData.code || !courseData.name) {
      throw new Error('Course code and course name are required');
    }

    return await courseRepository.create(courseData);
  }

  public async updateCourse(
    id: string,
    updates: Partial<CourseGrade>
  ): Promise<CourseGrade | null> {
    return await courseRepository.update(id, updates);
  }

  public async deleteCourse(id: string): Promise<boolean> {
    return await courseRepository.delete(id);
  }
}

export const courseService = new CourseService();
