/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BiometricData, BioMetricDataObj } from '../types/WebsocketData';
import GenericKpiItem from '../components/kpi-items/GenericKpiItem';
// import QTInterval from '../components/kpi-items/QTInterval';
// import STsegment from '../components/kpi-items/STsegment';
import { BiometricParameters } from '../utils/constants';
import QTInterval from '../components/kpi-items/QTInterval';
import STsegment from '../components/kpi-items/STsegment';
import NIBP from '../components/kpi-items/NIBP';
import { Slider } from '@mui/material';
import DateTimePicker from '../components/core/DateTimePicker';
import { fetchKpi } from '../services/kpi.services';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const colors = [
  '#94d699',
  '#e7d57d',
  '#c0f7ff',
  '#fff59d',
  '#FFAB91',
  '#CE93D8',
  '#80CBC4',
];

const BiometricKpi = ({
  biometricDataProps,
}: {
  biometricDataProps: BiometricData[];
}) => {
  const [biometricData, setBiometricData] = useState<Array<BiometricData>>([]);

  const [slider, setSlider] = useState(0);

  const [temp, setTemp] = useState(
    new BioMetricDataObj(BiometricParameters.Temp)
  );
  const [spo2, setSpO2] = useState(
    new BioMetricDataObj(BiometricParameters.SpO2)
  );

  const [nibp, setNiBP] = useState(
    new BioMetricDataObj(BiometricParameters.NIBP)
  );

  const [hr, setHr] = useState(new BioMetricDataObj(BiometricParameters.HR));
  const [rr, setRr] = useState(new BioMetricDataObj(BiometricParameters.RR));
  const [pr, setPr] = useState(new BioMetricDataObj(BiometricParameters.PR));

  const [st1, setST1] = useState(new BioMetricDataObj(BiometricParameters.ST1));
  const [st2, setST2] = useState(new BioMetricDataObj(BiometricParameters.ST2));
  const [st3, setST3] = useState(new BioMetricDataObj(BiometricParameters.ST3));

  const [staVR, setSTaVR] = useState(
    new BioMetricDataObj(BiometricParameters.STaVR)
  );
  const [staVF, setSTaVF] = useState(
    new BioMetricDataObj(BiometricParameters.STaVF)
  );
  const [staVL, setSTaVL] = useState(
    new BioMetricDataObj(BiometricParameters.STaVL)
  );
  const [staV, setSTV] = useState(
    new BioMetricDataObj(BiometricParameters.STV)
  );

  const [qt, setQT] = useState(new BioMetricDataObj(BiometricParameters.QT));
  const [qtc, setQTc] = useState(new BioMetricDataObj(BiometricParameters.QTc));
  const [deltaQtc, setDeltaQTc] = useState(
    new BioMetricDataObj(BiometricParameters.DeltaQTc)
  );

  const [latestTimestamp, setLatestTimeStamp] = useState(-Infinity);
  const [pastKpiData, setPastKpiData] = useState<any>([]);
  const [isLive, setLive] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Temp', temp);
  }, [temp]);

  useEffect(() => {
    if (isLive) {
      setBiometricData(biometricDataProps);
    }
  }, [biometricDataProps]);

  useEffect(() => {
    fetchKpi().then((data: any) => {
      console.log('Fetched Past DAta', data);
      setPastKpiData(() => Object.keys(data).map((value) => data[value]));
    });
  }, []);

  useEffect(() => {
    for (const biometric of biometricData) {
      if (biometric && biometric.values) {
        console.log('Biometric Values', biometric.values);
        if (biometric.values.length) {
          for (const [time, data] of biometric.values) {
            if (time > latestTimestamp) setLatestTimeStamp(time);
          }
        }
      }
    }

    //Getting Temperature from incoming data
    setTemp((oldTemp) => {
      const newTemp = biometricData.find(
        (item) => item.label === BiometricParameters.Temp
      );
      return {
        ...oldTemp,
        ...newTemp,
        lastTimeStamp:
          newTemp && newTemp.values.length
            ? newTemp.values[0][0]
            : oldTemp.lastTimeStamp,
        currentValue:
          newTemp && newTemp.values.length
            ? newTemp.values[0][1]
            : oldTemp.currentValue,
      };
    });

    //Getting SpO2 from incoming data
    setSpO2((oldSpO2) => {
      const newSpo2 = biometricData.find(
        (item) => item.label === BiometricParameters.SpO2
      );
      return {
        ...oldSpO2,
        ...newSpo2,
        lastTimeStamp:
          newSpo2 && newSpo2.values.length
            ? newSpo2.values[0][0]
            : oldSpO2.lastTimeStamp,
        currentValue:
          newSpo2 && newSpo2.values.length
            ? newSpo2.values[0][1]
            : oldSpO2.currentValue,
      };
    });

    setNiBP((oldNiBP) => {
      const newNiBP = biometricData.find(
        (item) => item.label === BiometricParameters.NIBP
      );
      return {
        ...oldNiBP,
        ...newNiBP,
        lastTimeStamp:
          newNiBP && newNiBP.values.length
            ? newNiBP.values[0][0]
            : oldNiBP.lastTimeStamp,
        currentValue:
          newNiBP && newNiBP.values.length
            ? newNiBP.values[0][1]
            : oldNiBP.currentValue,
      };
    });

    //Getting HR from incoming data
    setHr((oldHR) => {
      const newHR = biometricData.find(
        (item) => item.label === BiometricParameters.HR
      );
      return {
        ...oldHR,
        ...newHR,
        lastTimeStamp:
          newHR && newHR.values.length
            ? newHR.values[0][0]
            : oldHR.lastTimeStamp,
        currentValue:
          newHR && newHR.values.length
            ? newHR.values[0][1]
            : oldHR.currentValue,
      };
    });

    //Getting PR from incoming data
    setPr((oldPR) => {
      const newPR = biometricData.find(
        (item) => item.label === BiometricParameters.PR
      );
      return {
        ...oldPR,
        ...newPR,
        lastTimeStamp:
          newPR && newPR.values.length
            ? newPR.values[0][0]
            : oldPR.lastTimeStamp,
        currentValue:
          newPR && newPR.values.length
            ? newPR.values[0][1]
            : oldPR.currentValue,
      };
    });

    //Getting RR from incoming data
    setRr((oldRR) => {
      const newRR = biometricData.find(
        (item) => item.label === BiometricParameters.RR
      );
      return {
        ...oldRR,
        ...newRR,
        lastTimeStamp:
          newRR && newRR.values.length
            ? newRR.values[0][0]
            : oldRR.lastTimeStamp,
        currentValue:
          newRR && newRR.values.length
            ? newRR.values[0][1]
            : oldRR.currentValue,
      };
    });

    //Getting ST1 from incoming data
    setST1((oldST1) => {
      const newST1 = biometricData.find(
        (item) => item.label === BiometricParameters.ST1
      );
      return {
        ...oldST1,
        ...newST1,
        lastTimeStamp:
          newST1 && newST1.values.length
            ? newST1.values[0][0]
            : oldST1.lastTimeStamp,
        currentValue:
          newST1 && newST1.values.length
            ? newST1.values[0][1]
            : oldST1.currentValue,
      };
    });

    //Getting ST2 from incoming data
    setST2((oldST2) => {
      const newST2 = biometricData.find(
        (item) => item.label === BiometricParameters.ST2
      );
      return {
        ...oldST2,
        ...newST2,
        lastTimeStamp:
          newST2 && newST2.values.length
            ? newST2.values[0][0]
            : oldST2.lastTimeStamp,
        currentValue:
          newST2 && newST2.values.length
            ? newST2.values[0][1]
            : oldST2.currentValue,
      };
    });

    //Getting ST3 from incoming data
    setST3((oldST3) => {
      const newST3 = biometricData.find(
        (item) => item.label === BiometricParameters.ST3
      );
      return {
        ...oldST3,
        ...newST3,
        lastTimeStamp:
          newST3 && newST3.values.length
            ? newST3.values[0][0]
            : oldST3.lastTimeStamp,
        currentValue:
          newST3 && newST3.values.length
            ? newST3.values[0][1]
            : oldST3.currentValue,
      };
    });

    //Getting STaVR from incoming data
    setSTaVR((oldSTaVR) => {
      const newSTaVR = biometricData.find(
        (item) => item.label === BiometricParameters.STaVR
      );
      return {
        ...oldSTaVR,
        ...newSTaVR,
        lastTimeStamp:
          newSTaVR && newSTaVR.values.length
            ? newSTaVR.values[0][0]
            : oldSTaVR.lastTimeStamp,
        currentValue:
          newSTaVR && newSTaVR.values.length
            ? newSTaVR.values[0][1]
            : oldSTaVR.currentValue,
      };
    });

    //Getting STaVL from incoming data
    setSTaVL((oldSTaVL) => {
      const newSTaVL = biometricData.find(
        (item) => item.label === BiometricParameters.STaVL
      );
      return {
        ...oldSTaVL,
        ...newSTaVL,
        lastTimeStamp:
          newSTaVL && newSTaVL.values.length
            ? newSTaVL.values[0][0]
            : oldSTaVL.lastTimeStamp,
        currentValue:
          newSTaVL && newSTaVL.values.length
            ? newSTaVL.values[0][1]
            : oldSTaVL.currentValue,
      };
    });

    //Getting STaVF from incoming data
    setSTaVF((oldSTaVF) => {
      const newSTaVF = biometricData.find(
        (item) => item.label === BiometricParameters.STaVF
      );
      return {
        ...oldSTaVF,
        ...newSTaVF,
        lastTimeStamp:
          newSTaVF && newSTaVF.values.length
            ? newSTaVF.values[0][0]
            : oldSTaVF.lastTimeStamp,
        currentValue:
          newSTaVF && newSTaVF.values.length
            ? newSTaVF.values[0][1]
            : oldSTaVF.currentValue,
      };
    });

    //Getting STV from incoming data
    setSTV((oldSTV) => {
      const newSTV = biometricData.find(
        (item) => item.label === BiometricParameters.STV
      );
      return {
        ...oldSTV,
        ...newSTV,
        lastTimeStamp:
          newSTV && newSTV.values.length
            ? newSTV.values[0][0]
            : oldSTV.lastTimeStamp,
        currentValue:
          newSTV && newSTV.values.length
            ? newSTV.values[0][1]
            : oldSTV.currentValue,
      };
    });

    //Getting QT from incoming data
    setQT((oldQT) => {
      const newQT = biometricData.find(
        (item) => item.label === BiometricParameters.QT
      );
      return {
        ...oldQT,
        ...newQT,
        lastTimeStamp:
          newQT && newQT.values.length
            ? newQT.values[0][0]
            : oldQT.lastTimeStamp,
        currentValue:
          newQT && newQT.values.length
            ? newQT.values[0][1]
            : oldQT.currentValue,
      };
    });

    //Getting QTc from incoming data
    setQTc((oldQTc) => {
      const newQTc = biometricData.find(
        (item) => item.label === BiometricParameters.QTc
      );
      return {
        ...oldQTc,
        ...newQTc,
        lastTimeStamp:
          newQTc && newQTc.values.length
            ? newQTc.values[0][0]
            : oldQTc.lastTimeStamp,
        currentValue:
          newQTc && newQTc.values.length
            ? newQTc.values[0][1]
            : oldQTc.currentValue,
      };
    });

    //Getting delta QTc from incoming data
    setDeltaQTc((oldDeltaQTc) => {
      const newDeltaQTc = biometricData.find(
        (item) => item.label === BiometricParameters.DeltaQTc
      );
      return {
        ...oldDeltaQTc,
        ...newDeltaQTc,
        lastTimeStamp:
          newDeltaQTc && newDeltaQTc.values.length
            ? newDeltaQTc.values[0][0]
            : oldDeltaQTc.lastTimeStamp,
        currentValue:
          newDeltaQTc && newDeltaQTc.values.length
            ? newDeltaQTc.values[0][1]
            : oldDeltaQTc.currentValue,
      };
    });

    console.log('Biometric Data', biometricData);
  }, [biometricData]);

  const [time, setTime] = useState(new Date().getTime());

  const fetchNotes = async () => {
    return new Promise<void>((resolve, rej) => {
      setTimeout(() => {
        console.log('Fetch Notes');
        resolve();
      }, 500);
    });
  };

  useEffect(() => {
    console.log('Time', time);
    const timeOut = setTimeout(() => {
      fetchNotes();
    }, 500);

    return () => clearTimeout(timeOut);
  }, [time]);

  useEffect(() => {
    console.log('Slider Change', slider, pastKpiData);
    if (pastKpiData[slider]) setBiometricData(pastKpiData[slider]);
  }, [slider]);

  const bed: any = useSelector((state: any) => state.patient.bed);
  if (!bed) {
    navigate('/app/patient', { replace: true });
  }

  return (
    <div className="kpi-container">
      <div className="kpi-badge">
        {time && <DateTimePicker defaultDate={new Date(time)} size="lg" />}
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          // valueLabelDisplay="auto"
          className="quant-slider"
          onChange={({ target }: any) => {
            console.log('Slider', target);
            setTime((time) => new Date(time + target.value * 1000).getTime());
            setSlider(() => target.value);
            // setLive(false);
          }}
        />
      </div>
      <GenericKpiItem
        title={'HR'}
        color={colors[0]}
        currentValue={hr.currentValue}
        idealMin={hr.idealMin ?? undefined}
        idealMax={hr.idealMax ?? undefined}
        unit={hr.unit ?? undefined}
        isLive={hr.lastTimeStamp === latestTimestamp}
      />
      <GenericKpiItem
        title={'PR'}
        color={colors[1]}
        currentValue={pr.currentValue}
        idealMin={pr.idealMin ?? undefined}
        idealMax={pr.idealMax ?? undefined}
        unit={pr.unit ?? undefined}
        isLive={pr.lastTimeStamp === latestTimestamp}
      />
      <QTInterval
        color={colors[6]}
        qtcValue={qtc.currentValue}
        idealQtc={qtc.idealMax}
        qtcUnit={qtc.unit}
        deltaQtcValue={deltaQtc.currentValue}
        idealDeltaQtc={deltaQtc.idealMax}
        deltaQtcUnit={deltaQtc.unit}
        qtValue={qt.currentValue}
        idealQt={qt.idealMax}
        qtUnit={qt.unit}
        isLive={
          Math.max(
            qtc.lastTimeStamp,
            deltaQtc.lastTimeStamp,
            qt.lastTimeStamp
          ) === latestTimestamp
        }
      />
      <GenericKpiItem
        title={'Temp'}
        color={colors[2]}
        currentValue={temp.currentValue}
        latestTimestamp={temp.lastTimeStamp}
        idealMin={temp.idealMin ?? undefined}
        idealMax={temp.idealMax ?? undefined}
        unit={temp.unit ?? undefined}
        isLive={temp.lastTimeStamp === latestTimestamp}
      />
      <GenericKpiItem
        title={'SpO2'}
        color={colors[3]}
        currentValue={spo2.currentValue}
        idealMin={spo2.idealMin ?? undefined}
        idealMax={spo2.idealMax ?? undefined}
        unit={spo2.unit ?? undefined}
        isLive={spo2.lastTimeStamp === latestTimestamp}
      />
      <GenericKpiItem
        title={BiometricParameters.RR}
        color={colors[4]}
        currentValue={rr.currentValue}
        idealMin={rr.idealMin ?? undefined}
        idealMax={rr.idealMax ?? undefined}
        unit={rr.unit ?? undefined}
        isLive={rr.lastTimeStamp === latestTimestamp}
      />
      <NIBP
        isLive={false}
        systolicValue={undefined}
        diastolicValue={undefined}
        unit={nibp.unit}
        idealSystolicValue={undefined}
        idealDiastolicValue={undefined}
      />
      <STsegment
        unit={st1.unit}
        color={colors[1]}
        st1Value={st1.currentValue}
        st2Value={st2.currentValue}
        st3Value={st3.currentValue}
        stAVRValue={staVR.currentValue}
        stAVLValue={staVL.currentValue}
        stAVFValue={staVF.currentValue}
        stVvalue={staV.currentValue}
        isLive={
          Math.max(
            st1.lastTimeStamp,
            st2.lastTimeStamp,
            st3.lastTimeStamp,
            staV.lastTimeStamp,
            staVR.lastTimeStamp,
            staVL.lastTimeStamp,
            staVF.lastTimeStamp
          ) === latestTimestamp
        }
      />
    </div>
  );
};

export default BiometricKpi;
