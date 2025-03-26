import { atom } from "jotai";
import { IProfileUser, IUser } from "./user.model";
import { authAtom } from "../../auth/model/auth.state";
import { USER_API } from "../api/userApi";
import axios, { AxiosError } from "axios";

export interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const userAtom = atom<UserState>(initialState);

export const loadUserProfileAtom = atom(
  async (get) => {
    return get(userAtom);
  },
  async (get, set) => {
    const { accessToken } = await get(authAtom);
    set(userAtom, {
      isLoading: true,
      error: null,
      user: null,
    });
    try {
      const { data } = await axios.get<IUser>(USER_API.profile, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set(userAtom, {
        isLoading: false,
        user: data,
        error: null,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set(userAtom, {
          isLoading: false,
          user: null,
          error: error.response?.data.message,
        });
      }
    }
  }
);

export const updateProfileAtom = atom(
  async (get) => {
    return get(userAtom);
  },
  async (get, set, { photo }: { photo: string }) => {
    const { accessToken } = await get(authAtom);
    // set(userAtom, {
    //   isLoading: true,
    //   error: null,
    //   user: null,
    // });
    try {
      const { data } = await axios.patch<IProfileUser>(
        USER_API.profile,
        {
          photo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("data :>> ", data);
      const { user } = await get(userAtom);
      if (user) {
        set(userAtom, {
          isLoading: false,
          user: { ...user, profile: data },
          error: null,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        set(userAtom, {
          isLoading: false,
          user: null,
          error: error.response?.data.message,
        });
      }
    }
  }
);
