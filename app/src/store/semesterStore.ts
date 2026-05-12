import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { CourseEntry, Semester } from '../models';
import { uid } from '../utils/id';

const SEMESTERS_KEY = '@cgpa/semesters';

interface SemesterState {
  semesters: Semester[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addSemester: (
    data: Omit<Semester, 'id' | 'courses' | 'createdAt' | 'updatedAt'> & {
      courses?: CourseEntry[];
    },
  ) => Promise<Semester>;
  updateSemester: (
    id: string,
    patch: Partial<Omit<Semester, 'id' | 'createdAt'>>,
  ) => Promise<void>;
  deleteSemester: (id: string) => Promise<void>;
  addCourse: (
    semesterId: string,
    course: Omit<CourseEntry, 'id'>,
  ) => Promise<CourseEntry | undefined>;
  updateCourse: (
    semesterId: string,
    courseId: string,
    patch: Partial<Omit<CourseEntry, 'id'>>,
  ) => Promise<void>;
  deleteCourse: (semesterId: string, courseId: string) => Promise<void>;
  getSemester: (id: string) => Semester | undefined;
}

async function persist(semesters: Semester[]) {
  await AsyncStorage.setItem(SEMESTERS_KEY, JSON.stringify(semesters));
}

export const useSemesterStore = create<SemesterState>((set, get) => ({
  semesters: [],
  isHydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(SEMESTERS_KEY);
    const semesters: Semester[] = raw ? JSON.parse(raw) : [];
    set({ semesters, isHydrated: true });
  },

  addSemester: async (data) => {
    const now = Date.now();
    const semester: Semester = {
      id: uid(),
      level: data.level,
      session: data.session,
      term: data.term,
      courses: data.courses ?? [],
      createdAt: now,
      updatedAt: now,
    };
    const next = [...get().semesters, semester];
    set({ semesters: next });
    await persist(next);
    return semester;
  },

  updateSemester: async (id, patch) => {
    const next = get().semesters.map((s) =>
      s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s,
    );
    set({ semesters: next });
    await persist(next);
  },

  deleteSemester: async (id) => {
    const next = get().semesters.filter((s) => s.id !== id);
    set({ semesters: next });
    await persist(next);
  },

  addCourse: async (semesterId, course) => {
    const newCourse: CourseEntry = { ...course, id: uid() };
    let added: CourseEntry | undefined;
    const next = get().semesters.map((s) => {
      if (s.id !== semesterId) return s;
      added = newCourse;
      return {
        ...s,
        courses: [...s.courses, newCourse],
        updatedAt: Date.now(),
      };
    });
    set({ semesters: next });
    await persist(next);
    return added;
  },

  updateCourse: async (semesterId, courseId, patch) => {
    const next = get().semesters.map((s) => {
      if (s.id !== semesterId) return s;
      return {
        ...s,
        courses: s.courses.map((c) =>
          c.id === courseId ? { ...c, ...patch } : c,
        ),
        updatedAt: Date.now(),
      };
    });
    set({ semesters: next });
    await persist(next);
  },

  deleteCourse: async (semesterId, courseId) => {
    const next = get().semesters.map((s) => {
      if (s.id !== semesterId) return s;
      return {
        ...s,
        courses: s.courses.filter((c) => c.id !== courseId),
        updatedAt: Date.now(),
      };
    });
    set({ semesters: next });
    await persist(next);
  },

  getSemester: (id) => get().semesters.find((s) => s.id === id),
}));
