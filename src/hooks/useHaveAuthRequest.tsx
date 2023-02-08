import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/UserContext";
import { CreatePartyInterface } from "../types/party";
import { createParty } from "../__api__/party";

export const useHaveAuthRequest = (
  params: CreatePartyInterface,
  cb: typeof createParty
) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const callback = useCallback(async () => {
    const data = await cb(params);
    if ("error" in data) {
      if (data.error === 401 || data.error === 403) {
        setUser(null);
        navigate("/");
      }
    }
    return data;
  }, [cb, setUser, navigate, params]);
  return callback;
};
