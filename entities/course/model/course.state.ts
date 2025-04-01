import { atom } from "jotai";
import { authAtom } from "../../auth/model/auth.state";
import axios, { AxiosError } from "axios";
import { API } from "../api/api";
import { StudentCourse, StudentCourseDescription } from "./course.model";

export const courseAtom = atom<CourseState>({
  courses: null,
  isLoading: false,
  error: null,
});

export const loadCourseAtom = atom(
  async (get) => {
    return get(courseAtom);
  },
  async (get, set) => {
    try {
      const { accessToken } = await get(authAtom);
      set(courseAtom, {
        isLoading: true,
        courses: null,
        error: null,
      });
      const { data } = await axios.get<StudentCourse>(API.my, {
        // params: {
        //   studentCourse: "dontMy",
        // },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set(courseAtom, {
        isLoading: false,
        courses: data,
        error: null,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set(courseAtom, {
          isLoading: false,
          courses: null,
          error: error.response?.data.message,
        });
      }
    }
  }
);

export interface CourseState {
  courses: StudentCourse | null;
  isLoading: boolean;
  error: string | null;
}
