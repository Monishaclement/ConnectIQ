import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signup as signupApi, login as loginApi } from "../api/authApi";
import { updateProfile as updateProfileApi } from "../api/userApi";
import { STORAGE_KEYS } from "../utils/constants";
import {
  getProfileExtended,
  saveProfileExtended,
} from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [profileExtended, setProfileExtended] = useState({});

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && user) {
      setProfileExtended(getProfileExtended(user._id) || {});
    }
    setLoading(false);
  }, [user]);

  const persistUser = useCallback((userData, token) => {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (userData) {
      const { password: _password, ...safeUser } = userData;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
      setUser(safeUser);
      setProfileExtended(getProfileExtended(safeUser._id) || {});
    }
  }, []);

  const signup = async (data) => {
    const res = await signupApi(data);
    persistUser(res.data.user, res.data.token);
    return res.data;
  };

  const login = async (data) => {
    const res = await loginApi(data);
    persistUser(res.data.user, res.data.token);
    return res.data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setProfileExtended({});
  }, []);

  const updateProfile = async (profileData, extendedData) => {
    const apiFields = {
      bio: profileData.bio,
      skills: profileData.skills,
      interests: profileData.interests,
      location: profileData.location,
      profileImage: profileData.profileImage,
    };
    const res = await updateProfileApi(apiFields);
    const updated = res.data.user;
    persistUser(updated, localStorage.getItem(STORAGE_KEYS.TOKEN));

    if (extendedData) {
      saveProfileExtended(updated._id, extendedData);
      setProfileExtended(extendedData);
    }
    return res.data;
  };

  const updateExtendedProfile = (data) => {
    if (!user) return;
    saveProfileExtended(user._id, data);
    setProfileExtended(data);
  };

  const isAuthenticated = !!user && !!localStorage.getItem(STORAGE_KEYS.TOKEN);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        profileExtended,
        signup,
        login,
        logout,
        updateProfile,
        updateExtendedProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
