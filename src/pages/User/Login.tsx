import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MultiLingualLabel from '../../components/core/MultiLingualLabel';
import { logIn } from '../../reducers/auth';
import { selectHospital } from '../../reducers/patient';
import { loginUser } from '../../services/auth.services';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState<string>('adityadoe@hospitaldomain.com');
  const [password, setPassword] = useState<string>('qwertY@123');
  const [termsAndCondns, setTermsAndConditions] = useState(false);

  useEffect(() => {
    const user: any = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      dispatch(logIn(userObj));
      navigate('/app', { replace: true });
    }
  }, []);

  const handleLogin = async () => {
    if (!termsAndCondns) {
      toast('Please accept the terms and conditions to proceed');
      return;
    }
    try {
      setLoading(true);
      const userData: any = await loginUser({
        username: userName,
        password: password,
      });

      if (userData.resetPassword) {
        const token = userData.token;
        console.log('Redirection', token);
        navigate('/new-password', { replace: false, state: { token } });
        toast('You need to reset the password', { position: 'top-center', autoClose: 10000 });
        return;
      }

      dispatch(
        logIn({
          userName: userData.name,
          permissions: userData.permissions,
          token: userData.token,
          userAccess: userData.userAccess,
        })
      );
      dispatch(selectHospital(userData.userAccess));
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/app', { replace: true });
    } catch (e) {
      // console.error('Error loging in', e);
      toast('Oops! The credentials are not correct');
    } finally {
      setLoading(false);
    }
  };

  const handleTermsAndConditions = ({ target }: any) => {
    setTermsAndConditions(target.checked);
  };

  return (
    <div className="d-flex h-100">
      <div className="column-left flex-3"></div>
      <div className="column-center flex-4">
        {/* <form onSubmit={handleLogin}> */}
        <div className="login-card">
          <div className="login-card-header">
            <MultiLingualLabel id="LOGIN_TO_YOUR_ACCOUNT" />
          </div>
          <p className="field-label">
            <MultiLingualLabel id="SELECT_WHO_YOU_ARE" />
          </p>
          <div className="user-role">
            <div className="user-role-item">
              <input type="radio" name="role" value="doctors" id="doctors" checked />
              <label htmlFor="doctors">
                <div
                  className="role-icon"
                  style={{
                    backgroundImage: 'url("/images/login/doctors.svg")',
                  }}
                />
                <span>
                  <MultiLingualLabel id="ROLE_DOCTOR" />
                </span>
              </label>
            </div>
            <div className="user-role-item">
              <input type="radio" name="role" value="nurses" id="nurses" checked />
              <label htmlFor="nurses">
                <div
                  className="role-icon"
                  style={{
                    backgroundImage: 'url("/images/login/nurses.svg")',
                  }}
                />
                <span>
                  <MultiLingualLabel id="ROLE_NURSE" />
                </span>
              </label>
            </div>
            <div className="user-role-item">
              <input type="radio" name="role" value="clinicians" id="clinicians" checked />
              <label htmlFor="clinicians">
                <div
                  className="role-icon"
                  style={{
                    backgroundImage: 'url("/images/login/clinicians.svg")',
                  }}
                />
                <span>
                  <MultiLingualLabel id="ROLE_CLINICIAN" />
                </span>
              </label>
            </div>
          </div>
          <p className="field-label">
            <MultiLingualLabel id="LOG_IN_INTO" />
          </p>
          <div className="justify-content-start">
            <span className="btn btn-1" style={{ marginLeft: '-15px' }}>
              <input type="checkbox" name="" id="switch" checked={true} readOnly />
              <label htmlFor="switch"></label>
            </span>
          </div>
          <p className="field-label">
            <MultiLingualLabel id="EMAIL_ADDRESS" />
          </p>
          <div>
            <input
              type="text"
              onChange={(e) => setUserName(() => e.target.value)}
              value={userName}
            />
          </div>
          <div className="d-flex">
            <p className="field-label">
              <MultiLingualLabel id="PASSWORD" />
            </p>
            <p className="field-label text-right">
              <Link to="reset-password">
                <MultiLingualLabel id="FORGOT_PASSWORD" />
              </Link>
            </p>
          </div>
          <div>
            <input
              type="password"
              onChange={(e) => setPassword(() => e.target.value)}
              value={password}
            />
          </div>
          <div className="d-flex m-2">
            <input
              type="checkbox"
              onChange={handleTermsAndConditions}
              checked={termsAndCondns}
              className="form-check-input drop-item-check m-0"
              id="terms-condition"
            />
            <label className="field-label m-0" htmlFor="terms-condition">
              <MultiLingualLabel id="ACCEPT_TERMS_CONDITIONS" />
            </label>
          </div>
          <button className="login-btn w-100 mt-3" onClick={handleLogin}>
            <MultiLingualLabel id={loading ? 'LOGING_IN' : 'LOG_IN'} />
          </button>
        </div>
        {/* </form> */}
        <div className="footer-links">
          <MultiLingualLabel id="PRIVACY_POLICY" /> | <MultiLingualLabel id="TERMS_OF_USE" />
        </div>
      </div>
      <div className="column-right flex-3"></div>
    </div>
  );
};

export default Login;
