import React from 'react';

const Login = () => {
  return (
    <div className="d-flex h-100">
      <div className="column-left flex-2"></div>
      <div className="column-center flex-3">
        <div className="login-card">
          <div className="login-card-header">Login to Your Account</div>
          <p className="field-label">Select who you are?</p>
          <div className="user-role">
            <label className="radio-role" htmlFor="doctors">
              <input
                type="radio"
                name="test"
                value="big"
                id="doctors"
                checked
              />
              <div
                className="radio-role-icon"
                style={{ backgroundImage: 'url("/images/login/doctors.svg")' }}
              />
              <span>Doctors</span>
            </label>
            <label className="radio-role" htmlFor="nurses">
              <input type="radio" name="test" value="big" id="nurses" />
              <div
                className="radio-role-icon"
                style={{ backgroundImage: 'url("/images/login/nurses.svg")' }}
              />
              <span>Nurses</span>
            </label>
            <label className="radio-role" htmlFor="clinicians">
              <input type="radio" name="test" value="big" />
              <div
                id="clinicians"
                className="radio-role-icon"
                style={{
                  backgroundImage: 'url("/images/login/clinicians.svg")',
                }}
              />
              <span>Clinicians</span>
            </label>
          </div>
          <p className="field-label">Log in into</p>
          <div></div>
          <p className="field-label">Email Address</p>
          <div></div>
          <p className="field-label">Password</p>
          <div></div>
        </div>
        <div className="footer-links">Privacy Policy | Terms of Use</div>
      </div>
      <div className="column-right flex-2"></div>
    </div>
  );
};

export default Login;
