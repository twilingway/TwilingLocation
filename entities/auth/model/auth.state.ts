import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthResponse, ILoginRequest } from "./auth.interfaces";
import axios, { AxiosError } from "axios";
import { AUTH_API } from "../api/api";
import { atom } from "jotai";

export interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const storage = createJSONStorage<AuthState>(() => AsyncStorage);

const initialState: AuthState = {
  accessToken: null,
  isLoading: false,
  error: null,
};

export const authAtom = atomWithStorage<AuthState>(
  "auth",
  initialState,
  storage
);

export const loginAtom = atom(
  (get) => get(authAtom),
  async (_get, set, { email, password }: ILoginRequest) => {
    set(authAtom, {
      isLoading: true,
      accessToken: null,
      error: null,
    });

    try {
      console.log("ВОйти2 :>> ");
      console.log("AUTH_API.login :>> ", AUTH_API.login);
      console.log("email :>> ", email);
      console.log("password :>> ", password);
      const { data } = await axios.post<IAuthResponse>(AUTH_API.login, {
        email,
        password,
      });
      console.log("data :>> ", data);
      set(authAtom, {
        isLoading: false,
        accessToken: data.accessToken,
        error: null,
      });
    } catch (error) {
      console.log("error :>> ", error);
      if (error instanceof AxiosError) {
        set(authAtom, {
          isLoading: false,
          accessToken: null,
          error: error.response?.data.message,
        });
      }
    }
  }
);

export const logoutAtom = atom(null, (_get, set) => {
  set(authAtom, initialState);
});
