import { createContext, useContext, useCallback, useState, useEffect, useMemo } from "react";
import PocketBase, {
  Admin,
  ListResult,
  Record,
  RecordAuthResponse,
  RecordListQueryParams,
} from "pocketbase";
import { useInterval } from "usehooks-ts";
import jwtDecode from "jwt-decode";
import ms from "ms";
import { BASE_URL } from "../config/api";

const MINUTES_5_IN_MS = ms("5 minutes");
const MINUTES_2_IN_MS = ms("2 minutes");

interface model {
  user?: Record | Admin | null;
  token?: string;
  pb?: PocketBase;
  register?: (username: string, email: string, password: string) => Promise<Record>;
  login?: (email: string, password: string) => Promise<RecordAuthResponse<Record>>;
  logout?: () => void;

  getCompanies?: (
    page?: number,
    perPage?: number,
    queryParams?: RecordListQueryParams
  ) => Promise<ListResult<Record>>;
  getJobs?: (
    page?: number,
    perPage?: number,
    queryParams?: RecordListQueryParams
  ) => Promise<ListResult<Record>>;
  
}

export const PocketContext = createContext<model>({});

export const PocketProvider = ({ children }: { children: any }) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);
  pb.autoCancellation(false);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    return await pb
      .collection("users")
      .create({ name, email, password, passwordConfirm: password });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return await pb.collection("users").authWithPassword(email, password);
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded: any = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + MINUTES_5_IN_MS) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? MINUTES_2_IN_MS : null);

  const getCompanies = useCallback(
    async (page?: number, perPage?: number, queryParams?: RecordListQueryParams) => {
      if (!page || page < 1) page = 1;
      if (!perPage || perPage < 1) perPage = 10;
      return await pb.collection("companies").getList(page, perPage, queryParams);
    },
    []
  );
  
  const getJobs = useCallback(
    async (page?: number, perPage?: number, queryParams?: RecordListQueryParams) => {
      if (!page || page < 1) page = 1;
      if (!perPage || perPage < 1) perPage = 10;
      return await pb.collection("jobs").getList(page, perPage, queryParams);
    },
    []
  );
  

  return (
    <PocketContext.Provider
      value={{ user, token, pb, register, login, logout, getCompanies, getJobs }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
