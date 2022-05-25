import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineCaretRight } from 'react-icons/ai';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';

const About = () => {
  const [dbStatus, setDbstatus] = useState('NA');
  const [apiStatus, setApiStatus] = useState('NA');

  useEffect(() => {
    setTimeout(() => {
      axios.get('http://192.168.1.29:7071/api/CheckStatus').then((response) => {
        console.log('response::::', response.data);
        setDbstatus(response.data.database);
        setApiStatus(response.data.api);
      });
    }, 6000);
  }, []);

  return (
    <div className="container">
      <section className="about-container">
        <h2>
          <MultiLingualLabel id="ABOUT" />
        </h2>
        <div className="about-content">
          <div className="about-list">
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>App Version</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>REST API version</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Websocket version</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Mac Address</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Gateway IP</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>User LoggedIn</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>CREST API Service Status</h4>
                <small>{apiStatus}</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Web Socket Status</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Database Status</h4>
                <small>{dbStatus}</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>License Number</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Valid Till</h4>
                <small>NA</small>
              </div>
            </article>
            <article className="about-details">
              <AiOutlineCaretRight className="about-list-icon" />
              <div>
                <h4>Org ID</h4>
                <small>NA</small>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
