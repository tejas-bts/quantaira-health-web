import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logIn } from '../../reducers/auth';
import { selectHospital } from '../../reducers/patient';
import { loginUser } from '../../services/auth.services';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState<string>(
    'adityadoe@hospitaldomain.com'
  );
  const [password, setPassword] = useState<string>('qwerty@123');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userData: any = await loginUser({
        username: userName,
        password: password,
      });
      console.log('User Data', userData);
      dispatch(logIn({ userName: 'tejas', permissions: [1, 2, 3, 4] }));
      dispatch(selectHospital(userData.userAccess));
      navigate('/app', { replace: true });
    } catch (e) {
      // console.error('Error loging in', e);
      toast('Oops! The credentials are not correct');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex h-100">
      <div className="column-left flex-3"></div>
      <div className="column-center flex-4">
        {/* <form onSubmit={handleLogin}> */}
        <div className="login-card">
          <div className="login-card-header">Login to Your Account</div>
          <p className="field-label">Select who you are?</p>
          <div className="user-role">
            <div className="user-role-item">
              <input
                type="radio"
                name="role"
                value="doctors"
                id="doctors"
                checked
              />
              <label htmlFor="doctors">
                <div
                  className="role-icon"
                  style={{
                    backgroundImage: 'url("/images/login/doctors.svg")',
                  }}
                />
                <span>Doctors</span>
              </label>
            </div>
            <div className="user-role-item">
              <input
                type="radio"
                name="role"
                value="nurses"
                id="nurses"
                checked
              />
              <label htmlFor="nurses">
                <div
                  className="role-icon"
                  style={{
                    backgroundImage: 'url("/images/login/nurses.svg")',
                  }}
                />
                <span>Nurses</span>
              </label>
            </div>
            <div className="user-role-item">
              <input
                type="radio"
                name="role"
                value="clinicians"
                id="clinicians"
                checked
              />
              <label htmlFor="clinicians">
                <div
                  className="role-icon"
                  style={{
                    backgroundImage: 'url("/images/login/clinicians.svg")',
                  }}
                />
                <span>Clinicians</span>
              </label>
            </div>
          </div>
          <p className="field-label">Log in into</p>
          <div className="justify-content-start">
            <span className="btn btn-1" style={{ marginLeft: '-15px' }}>
              <input
                type="checkbox"
                name=""
                id="switch"
                checked={true}
                readOnly
              />
              <label htmlFor="switch"></label>
            </span>
          </div>
          <p className="field-label">Email Address</p>
          <div>
            <input
              type="text"
              onChange={(e) => setUserName(() => e.target.value)}
              value={userName}
            />
          </div>
          <div className="d-flex">
            <p className="field-label">Password</p>
            <p className="field-label text-right">
              <Link to="reset-password">Forgot Password?</Link>
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
              className="form-check-input drop-item-check m-0"
              id="terms-condition"
            />
            <label className="field-label m-0" htmlFor="terms-condition">
              Accept the terms and conditions
            </label>
          </div>
          <button className="login-btn w-100 mt-3" onClick={handleLogin}>
            {loading ? 'Loging in...' : 'Log in'}
          </button>
        </div>
        {/* </form> */}
        <div className="footer-links">Privacy Policy | Terms of Use</div>
      </div>
      <div className="column-right flex-3"></div>
    </div>
  );
};

export default Login;
