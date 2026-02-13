import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStoreQCInspection } from 'src/store/store';

function AuthToken() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = useStoreQCInspection((state) => state.token);
  const logout = useStoreQCInspection((state) => state.logout);
  const authen = useCallback(async () => {
    if (!token || token === undefined || token === null || token === '') {
      navigate('/login');
      return;
    }
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'auth',
        token,
      })
      .then((res) => {
        if (res.data.err) {
          logout();
          navigate('/login');
          return;
        }
        console.log('res Token', res.data);
      })
      .catch((err) => {
        console.log(err);
        logout();
        navigate('/login');
      });
  }, [navigate, token, baseURL, logout]);
  useEffect(() => {
    authen();
  }, [authen]);
  return (
    <div>
      <p className="hidden">Auth</p>
    </div>
  );
}

export default AuthToken;
