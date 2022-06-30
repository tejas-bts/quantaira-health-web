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
import MultiLingualLabel from '../components/core/MultiLingualLabel';
import { fetchKpi } from '../services/kpi.services';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logBiometricData } from '../utils/logger';

const colors = ['#94d699', '#e7d57d', '#c0f7ff', '#fff59d', '#FFAB91', '#CE93D8', '#80CBC4'];

const BiometricKpi = () => {
  const biometricDataProps: any = useSelector((state: any) => state.biometrics.biometricData);

  const [biometricData, setBiometricData] = useState<Array<BiometricData>>([]);

  const [slider, setSlider] = useState(0);

  const [temp, setTemp] = useState(new BioMetricDataObj(BiometricParameters.Temp));
  const [temp2, setTemp2] = useState(new BioMetricDataObj(BiometricParameters.Temp2));

  const [spo2, setSpO2] = useState(new BioMetricDataObj(BiometricParameters.SpO2));

  const [nibp, setNiBP] = useState(new BioMetricDataObj(BiometricParameters.NIBP));

  const [hr, setHr] = useState(new BioMetricDataObj(BiometricParameters.HR));
  const [rr, setRr] = useState(new BioMetricDataObj(BiometricParameters.RR));
  const [pr, setPr] = useState(new BioMetricDataObj(BiometricParameters.PR));

  const [st1, setST1] = useState(new BioMetricDataObj(BiometricParameters.ST1));
  const [st2, setST2] = useState(new BioMetricDataObj(BiometricParameters.ST2));
  const [st3, setST3] = useState(new BioMetricDataObj(BiometricParameters.ST3));

  const [staVR, setSTaVR] = useState(new BioMetricDataObj(BiometricParameters.STaVR));
  const [staVF, setSTaVF] = useState(new BioMetricDataObj(BiometricParameters.STaVF));
  const [staVL, setSTaVL] = useState(new BioMetricDataObj(BiometricParameters.STaVL));
  const [staV, setSTV] = useState(new BioMetricDataObj(BiometricParameters.STV));

  const [nibpSys, setNiBPsys] = useState(new BioMetricDataObj(BiometricParameters.NIBPsys));
  const [nibpDia, setNiBPdia] = useState(new BioMetricDataObj(BiometricParameters.NIBPdia));
  const [nibpPr, setNiBpPr] = useState(new BioMetricDataObj(BiometricParameters.NiBPpr));
  const [nibpMap, setNiBPmap] = useState(new BioMetricDataObj(BiometricParameters.NiBPmap));

  const [qt, setQT] = useState(new BioMetricDataObj(BiometricParameters.QT));
  const [qtc, setQTc] = useState(new BioMetricDataObj(BiometricParameters.QTc));
  const [deltaQtc, setDeltaQTc] = useState(new BioMetricDataObj(BiometricParameters.DeltaQTc));

  const [latestTimestamp, setLatestTimeStamp] = useState(-Infinity);
  const [pastKpiData, setPastKpiData] = useState<any>([]);
  const [pastKpiTime, setPastKpiTime] = useState<any>([]);

  const [selectedPastTime, setPastTime] = useState(Math.floor(new Date().getTime() / 1000));

  useEffect(() => {
    console.log('Selected Past Time', selectedPastTime);
  }, []);

  const isLive = useSelector((state: any) => state.time.isLive);
  const time = useSelector((state: any) => state.time.currentTime);
  const bed: any = useSelector((state: any) => state.patient.bed);

  const navigate = useNavigate();

  if (!bed) {
    navigate('/app/patient', { replace: true });
  }

  useEffect(() => {
    if (isLive) {
      setBiometricData(biometricDataProps);
    }
  }, [biometricDataProps]);

  useEffect(() => {
    if (!isLive) {
      setPastTime(time);
      fetchKpi({
        bedId: bed.bedId,
        patientId: bed.patientID,
        fromDate: time,
        limit: 100,
      })
        .then((data: any) => {
          if (data) {
            const kpiTimes = Object.keys(data).map((time) => parseInt(time));
            setPastKpiTime(() => kpiTimes);
            setPastKpiData(() => Object.keys(data).map((value) => data[value]));
            if (kpiTimes.length) setPastTime(kpiTimes[0]);
          }
        })
        .catch((e) => {
          toast(<MultiLingualLabel id="ERROR_FETCHING_KPI_DATA" />);
        });
    }
  }, [isLive, time]);

  useEffect(() => {
    logBiometricData(biometricData);

    for (const biometric of biometricData) {
      if (biometric && biometric.values) {
        if (biometric.values.length) {
          for (const [time, data] of biometric.values) {
            if (time > latestTimestamp) setLatestTimeStamp(time);
          }
        }
      }
    }

    //Getting Temperature from incoming data
    setTemp((oldTemp) => {
      const newTemp = biometricData.find((item) => item.label === BiometricParameters.Temp);
      return {
        ...oldTemp,
        ...newTemp,
        lastTimeStamp:
          newTemp && newTemp.values.length
            ? newTemp.values[newTemp.values.length - 1][0]
            : oldTemp.lastTimeStamp,
        currentValue:
          newTemp && newTemp.values.length
            ? newTemp.values[newTemp.values.length - 1][1]
            : oldTemp.currentValue,
      };
    });

    //Getting Temperature from incoming data
    setTemp2((oldTemp2) => {
      const newTemp2 = biometricData.find((item) => item.label === BiometricParameters.Temp2);
      return {
        ...oldTemp2,
        ...newTemp2,
        lastTimeStamp:
          newTemp2 && newTemp2.values.length
            ? newTemp2.values[newTemp2.values.length - 1][0]
            : oldTemp2.lastTimeStamp,
        currentValue:
          newTemp2 && newTemp2.values.length
            ? newTemp2.values[newTemp2.values.length - 1][1]
            : oldTemp2.currentValue,
      };
    });

    //Getting SpO2 from incoming data
    setSpO2((oldSpO2) => {
      const newSpo2 = biometricData.find((item) => item.label === BiometricParameters.SpO2);
      return {
        ...oldSpO2,
        ...newSpo2,
        lastTimeStamp:
          newSpo2 && newSpo2.values.length
            ? newSpo2.values[newSpo2.values.length - 1][0]
            : oldSpO2.lastTimeStamp,
        currentValue:
          newSpo2 && newSpo2.values.length
            ? newSpo2.values[newSpo2.values.length - 1][1]
            : oldSpO2.currentValue,
      };
    });

    setNiBP((oldNiBP) => {
      const newNiBP = biometricData.find((item) => item.label === BiometricParameters.NIBP);
      return {
        ...oldNiBP,
        ...newNiBP,
        lastTimeStamp:
          newNiBP && newNiBP.values.length
            ? newNiBP.values[newNiBP.values.length - 1][0]
            : oldNiBP.lastTimeStamp,
        currentValue:
          newNiBP && newNiBP.values.length
            ? newNiBP.values[newNiBP.values.length - 1][1]
            : oldNiBP.currentValue,
      };
    });

    //Getting HR from incoming data
    setHr((oldHR) => {
      const newHR = biometricData.find((item) => item.label === BiometricParameters.HR);
      return {
        ...oldHR,
        ...newHR,
        lastTimeStamp:
          newHR && newHR.values.length
            ? newHR.values[newHR.values.length - 1][0]
            : oldHR.lastTimeStamp,
        currentValue:
          newHR && newHR.values.length
            ? newHR.values[newHR.values.length - 1][1]
            : oldHR.currentValue,
      };
    });

    //Getting PR from incoming data
    setPr((oldPR) => {
      const newPR = biometricData.find((item) => item.label === BiometricParameters.PR);
      return {
        ...oldPR,
        ...newPR,
        lastTimeStamp:
          newPR && newPR.values.length
            ? newPR.values[newPR.values.length - 1][0]
            : oldPR.lastTimeStamp,
        currentValue:
          newPR && newPR.values.length
            ? newPR.values[newPR.values.length - 1][1]
            : oldPR.currentValue,
      };
    });

    //Getting RR from incoming data
    setRr((oldRR) => {
      const newRR = biometricData.find((item) => item.label === BiometricParameters.RR);
      return {
        ...oldRR,
        ...newRR,
        lastTimeStamp:
          newRR && newRR.values.length
            ? newRR.values[newRR.values.length - 1][0]
            : oldRR.lastTimeStamp,
        currentValue:
          newRR && newRR.values.length
            ? newRR.values[newRR.values.length - 1][1]
            : oldRR.currentValue,
      };
    });

    //Getting ST1 from incoming data
    setST1((oldST1) => {
      const newST1 = biometricData.find((item) => item.label === BiometricParameters.ST1);
      return {
        ...oldST1,
        ...newST1,
        lastTimeStamp:
          newST1 && newST1.values.length
            ? newST1.values[newST1.values.length - 1][0]
            : oldST1.lastTimeStamp,
        currentValue:
          newST1 && newST1.values.length
            ? newST1.values[newST1.values.length - 1][1]
            : oldST1.currentValue,
      };
    });

    //Getting ST2 from incoming data
    setST2((oldST2) => {
      const newST2 = biometricData.find((item) => item.label === BiometricParameters.ST2);
      return {
        ...oldST2,
        ...newST2,
        lastTimeStamp:
          newST2 && newST2.values.length
            ? newST2.values[newST2.values.length - 1][0]
            : oldST2.lastTimeStamp,
        currentValue:
          newST2 && newST2.values.length
            ? newST2.values[newST2.values.length - 1][1]
            : oldST2.currentValue,
      };
    });

    //Getting ST3 from incoming data
    setST3((oldST3) => {
      const newST3 = biometricData.find((item) => item.label === BiometricParameters.ST3);
      return {
        ...oldST3,
        ...newST3,
        lastTimeStamp:
          newST3 && newST3.values.length
            ? newST3.values[newST3.values.length - 1][0]
            : oldST3.lastTimeStamp,
        currentValue:
          newST3 && newST3.values.length
            ? newST3.values[newST3.values.length - 1][1]
            : oldST3.currentValue,
      };
    });

    //Getting STaVR from incoming data
    setSTaVR((oldSTaVR) => {
      const newSTaVR = biometricData.find((item) => item.label === BiometricParameters.STaVR);
      return {
        ...oldSTaVR,
        ...newSTaVR,
        lastTimeStamp:
          newSTaVR && newSTaVR.values.length
            ? newSTaVR.values[newSTaVR.values.length - 1][0]
            : oldSTaVR.lastTimeStamp,
        currentValue:
          newSTaVR && newSTaVR.values.length
            ? newSTaVR.values[newSTaVR.values.length - 1][1]
            : oldSTaVR.currentValue,
      };
    });

    //Getting STaVL from incoming data
    setSTaVL((oldSTaVL) => {
      const newSTaVL = biometricData.find((item) => item.label === BiometricParameters.STaVL);
      return {
        ...oldSTaVL,
        ...newSTaVL,
        lastTimeStamp:
          newSTaVL && newSTaVL.values.length
            ? newSTaVL.values[newSTaVL.values.length - 1][0]
            : oldSTaVL.lastTimeStamp,
        currentValue:
          newSTaVL && newSTaVL.values.length
            ? newSTaVL.values[newSTaVL.values.length - 1][1]
            : oldSTaVL.currentValue,
      };
    });

    //Getting STaVF from incoming data
    setSTaVF((oldSTaVF) => {
      const newSTaVF = biometricData.find((item) => item.label === BiometricParameters.STaVF);
      return {
        ...oldSTaVF,
        ...newSTaVF,
        lastTimeStamp:
          newSTaVF && newSTaVF.values.length
            ? newSTaVF.values[newSTaVF.values.length - 1][0]
            : oldSTaVF.lastTimeStamp,
        currentValue:
          newSTaVF && newSTaVF.values.length
            ? newSTaVF.values[newSTaVF.values.length - 1][1]
            : oldSTaVF.currentValue,
      };
    });

    //Getting STV from incoming data
    setSTV((oldSTV) => {
      const newSTV = biometricData.find((item) => item.label === BiometricParameters.STV);
      return {
        ...oldSTV,
        ...newSTV,
        lastTimeStamp:
          newSTV && newSTV.values.length
            ? newSTV.values[newSTV.values.length - 1][0]
            : oldSTV.lastTimeStamp,
        currentValue:
          newSTV && newSTV.values.length
            ? newSTV.values[newSTV.values.length - 1][1]
            : oldSTV.currentValue,
      };
    });

    //Getting NiBP Dia from incoming data
    setNiBPdia((oldNiBPdia) => {
      const newNiBPDia = biometricData.find((item) => item.label === BiometricParameters.NIBPdia);
      return {
        ...oldNiBPdia,
        ...newNiBPDia,
        lastTimeStamp:
          newNiBPDia && newNiBPDia.values.length
            ? newNiBPDia.values[newNiBPDia.values.length - 1][0]
            : oldNiBPdia.lastTimeStamp,
        currentValue:
          newNiBPDia && newNiBPDia.values.length
            ? newNiBPDia.values[newNiBPDia.values.length - 1][1]
            : oldNiBPdia.currentValue,
      };
    });

    //Getting NiBP systolic from incoming data
    setNiBPsys((oldNiBPsys) => {
      const newNiBPsys = biometricData.find((item) => item.label === BiometricParameters.NIBPsys);
      return {
        ...oldNiBPsys,
        ...newNiBPsys,
        lastTimeStamp:
          newNiBPsys && newNiBPsys.values.length
            ? newNiBPsys.values[newNiBPsys.values.length - 1][0]
            : oldNiBPsys.lastTimeStamp,
        currentValue:
          newNiBPsys && newNiBPsys.values.length
            ? newNiBPsys.values[newNiBPsys.values.length - 1][1]
            : oldNiBPsys.currentValue,
      };
    });

    //Getting NiBP from incoming data
    setNiBpPr((oldNibpPr) => {
      const newNibpPr = biometricData.find((item) => item.label === BiometricParameters.NiBPpr);
      return {
        ...oldNibpPr,
        ...newNibpPr,
        lastTimeStamp:
          newNibpPr && newNibpPr.values.length
            ? newNibpPr.values[newNibpPr.values.length - 1][0]
            : oldNibpPr.lastTimeStamp,
        currentValue:
          newNibpPr && newNibpPr.values.length
            ? newNibpPr.values[newNibpPr.values.length - 1][1]
            : oldNibpPr.currentValue,
      };
    });

    setNiBPmap((oldNiBPmap) => {
      const newNiBPmap = biometricData.find((item) => item.label === BiometricParameters.NiBPmap);
      return {
        ...oldNiBPmap,
        ...newNiBPmap,
        lastTimeStamp:
          newNiBPmap && newNiBPmap.values.length
            ? newNiBPmap.values[newNiBPmap.values.length - 1][0]
            : oldNiBPmap.lastTimeStamp,
        currentValue:
          newNiBPmap && newNiBPmap.values.length
            ? newNiBPmap.values[newNiBPmap.values.length - 1][1]
            : oldNiBPmap.currentValue,
      };
    });

    //Getting QT from incoming data
    setQT((oldQT) => {
      const newQT = biometricData.find((item) => item.label === BiometricParameters.QT);
      return {
        ...oldQT,
        ...newQT,
        lastTimeStamp:
          newQT && newQT.values.length
            ? newQT.values[newQT.values.length - 1][0]
            : oldQT.lastTimeStamp,
        currentValue:
          newQT && newQT.values.length
            ? newQT.values[newQT.values.length - 1][1]
            : oldQT.currentValue,
      };
    });

    //Getting QTc from incoming data
    setQTc((oldQTc) => {
      const newQTc = biometricData.find((item) => item.label === BiometricParameters.QTc);
      return {
        ...oldQTc,
        ...newQTc,
        lastTimeStamp:
          newQTc && newQTc.values.length
            ? newQTc.values[newQTc.values.length - 1][0]
            : oldQTc.lastTimeStamp,
        currentValue:
          newQTc && newQTc.values.length
            ? newQTc.values[newQTc.values.length - 1][1]
            : oldQTc.currentValue,
      };
    });

    //Getting delta QTc from incoming data
    setDeltaQTc((oldDeltaQTc) => {
      const newDeltaQTc = biometricData.find((item) => item.label === BiometricParameters.DeltaQTc);
      return {
        ...oldDeltaQTc,
        ...newDeltaQTc,
        lastTimeStamp:
          newDeltaQTc && newDeltaQTc.values.length
            ? newDeltaQTc.values[newDeltaQTc.values.length - 1][0]
            : oldDeltaQTc.lastTimeStamp,
        currentValue:
          newDeltaQTc && newDeltaQTc.values.length
            ? newDeltaQTc.values[newDeltaQTc.values.length - 1][1]
            : oldDeltaQTc.currentValue,
      };
    });
  }, [biometricData]);

  const fetchNotes = async () => {
    return new Promise<void>((resolve, rej) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchNotes();
    }, 500);

    return () => clearTimeout(timeOut);
  }, [time]);

  useEffect(() => {
    if (pastKpiData[slider]) {
      pastKpiData[slider];
      console.log('Past KPI data sadasd', new Date(pastKpiTime[slider]), pastKpiData[slider]);
      setPastTime(pastKpiTime[slider]);
      setBiometricData(pastKpiData[slider]);
    }
  }, [slider]);

  return (
    <div className="kpi-container gap-2 p-2">
      {!isLive && (
        <div className="kpi-badge">
          {time && <DateTimePicker defaultDate={new Date(selectedPastTime * 1000)} size="lg" />}
          <Slider
            size="small"
            defaultValue={0}
            min={0}
            max={pastKpiTime.length}
            className="quant-slider"
            onChange={({ target }: any) => {
              setSlider(() => target.value);
            }}
          />
        </div>
      )}
      <div className="d-flex flex-1 gap-2 w-100">
        <GenericKpiItem
          title={'HR'}
          color={colors[0]}
          currentValue={hr.currentValue}
          idealMin={hr.idealMin ?? undefined}
          idealMax={hr.idealMax ?? undefined}
          unit={hr.unit ?? undefined}
          isLive={hr.lastTimeStamp === latestTimestamp && isLive}
        />
        <GenericKpiItem
          title={'PR'}
          color={colors[1]}
          currentValue={pr.currentValue}
          idealMin={pr.idealMin ?? undefined}
          idealMax={pr.idealMax ?? undefined}
          unit={pr.unit ?? undefined}
          isLive={pr.lastTimeStamp === latestTimestamp && isLive}
        />
        <GenericKpiItem
          title={'SpO2'}
          color={colors[3]}
          currentValue={spo2.currentValue}
          idealMin={spo2.idealMin ?? undefined}
          idealMax={spo2.idealMax ?? undefined}
          unit={spo2.unit ?? undefined}
          isLive={spo2.lastTimeStamp === latestTimestamp && isLive}
        />
        <GenericKpiItem
          title={BiometricParameters.RR}
          color={colors[4]}
          currentValue={rr.currentValue}
          idealMin={rr.idealMin ?? undefined}
          idealMax={rr.idealMax ?? undefined}
          unit={rr.unit ?? undefined}
          isLive={rr.lastTimeStamp === latestTimestamp && isLive}
        />
        <NIBP
          isLive={false}
          systolicValue={nibpSys.currentValue}
          diastolicValue={nibpDia.currentValue}
          unit={nibpSys.unit}
          idealSystolicValue={undefined}
          idealDiastolicValue={undefined}
        />
      </div>

      <div className="d-flex flex-1 gap-2 w-100">
        <GenericKpiItem
          title={'Temp'}
          color={colors[2]}
          currentValue={temp.currentValue !== undefined ? temp.currentValue : temp2.currentValue}
          latestTimestamp={
            temp.lastTimeStamp !== undefined ? temp.lastTimeStamp : temp2.lastTimeStamp
          }
          idealMin={temp.idealMin !== undefined ? temp.idealMin : temp2.idealMin ?? undefined}
          idealMax={temp.idealMax !== undefined ? temp.idealMax : temp2.idealMax ?? undefined}
          unit={temp.unit ? temp.unit : temp2.unit ?? undefined}
          isLive={
            (temp.lastTimeStamp === latestTimestamp || temp2.lastTimeStamp === latestTimestamp) &&
            isLive
          }
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
            Math.max(qtc.lastTimeStamp, deltaQtc.lastTimeStamp, qt.lastTimeStamp) ===
              latestTimestamp && isLive
          }
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
            ) === latestTimestamp && isLive
          }
        />
      </div>
    </div>
  );
};

export default BiometricKpi;
