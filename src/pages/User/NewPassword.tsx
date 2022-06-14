import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MultiLingualLabel from '../../components/core/MultiLingualLabel';
import { logIn } from '../../reducers/auth';
import { selectHospital } from '../../reducers/patient';
import { resetUserPassword } from '../../services/auth.services';

const NewPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state }: any = useLocation();
  const { token } = state;

  console.log('Token', token);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [cpassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const user: any = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      dispatch(logIn(userObj));
      navigate('/app', { replace: true });
    }
  }, []);

  const handleResetPassword = async () => {
    if (password !== cpassword) {
      toast('Both the passwords need to be same');
      return;
    }
    if (password.length < 8) {
      toast('Password must be atleast 8 characters');
      return;
    }
    if (password.toUpperCase() === password.toLowerCase()) {
      toast('Password must contain atleast one Upper-case and one Lower-case alphabet');
      return;
    }
    if (!/\d/.test(password)) {
      toast('Password must contain atleast one number');
      return;
    }
    try {
      setLoading(true);
      const userData: any = await resetUserPassword({
        token,
        password,
        cpassword,
      });

      console.log('User Data', userData);

      dispatch(logIn({ userName: 'tejas', permissions: [1, 2, 3, 4] }));
      dispatch(selectHospital(userData.userAccess));
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/app', { replace: true });
    } catch (e: any) {
      console.log('Erorororro %j', e.message);
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
          <div className="login-card-header">
            <MultiLingualLabel id="NEW_PASSWORD_TITLE" />
          </div>
          <div className="d-flex">
            <div className="d-flex flex-1 flex-column">
              <p className="field-label">
                <MultiLingualLabel id="NEW_PASSWORD" />
              </p>
            </div>
            <div>
              <p className="field-label text-small text-no-wrap">
                (<MultiLingualLabel id="HINT" />)
              </p>
            </div>
          </div>
          <div>
            <input
              type="password"
              onChange={(e) => setPassword(() => e.target.value)}
              value={password}
            />
          </div>
          <div className="d-flex">
            <p className="field-label">
              <MultiLingualLabel id="CONFIRM_PASSWORD" />
            </p>
          </div>
          <div>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(() => e.target.value)}
              value={cpassword}
            />
          </div>
          <button className="login-btn w-100 mt-5" onClick={handleResetPassword}>
            <MultiLingualLabel id={loading ? 'RESETTING' : 'RESET_PASSWORD'} />
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

export default NewPassword;
