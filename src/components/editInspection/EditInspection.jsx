import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import TabList from '@mui/lab/TabList';
import Modal from '@mui/material/Modal';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import TabContext from '@mui/lab/TabContext';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import Label from 'src/components/label/label';
import XBarChart from 'src/components/eChart/XBarChart';
import RBarChart from 'src/components/eChart/RBarChart';

import ModalControlChart from 'src/sections/inspectionPart/modal-control-chart';

import { useStoreQCInspection } from 'src/store/store';

import { MenuTime, OptionTopData } from './utils';

const EditInspection = ({ psthPartNo, obj, handleCloseModal, oldCavityList }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [standardForm, setStandardForm] = useState([]);
  const [standardPart, setStandardPart] = useState([]);
  const [controlData, setControlData] = useState([]);
  const [simple1, setSimple1] = useState([]);
  const [simple2, setSimple2] = useState([]);
  const [cavitySimple1, setCavitySimple1] = useState(oldCavityList[0]?.CAVITY_NO);
  const [cavitySimple2, setCavitySimple2] = useState(oldCavityList[1]?.CAVITY_NO);
  const [lotNo, setLotNo] = useState(obj?.LOT_NO);
  const [moldNo, setMoldNo] = useState(obj?.MOLD_NO);
  const [time, setTime] = useState(obj?.TIME);
  const [inspector, setInspector] = useState(obj.INSPECTOR);
  const [dateControlChart, setDateControlChart] = useState('');
  const [dataXBarChart, setDataXBarChart] = useState([]);
  const [uclControl, setUclControl] = useState([]);
  const [lclControl, setLclControl] = useState([]);
  const [dateCalculate, setDateCalculate] = useState(new Date());
  const [manualControl, setManualControl] = useState([]);
  const [pathImage, setPathImage] = useState('');
  const [showModalControlChart, setShowModalControlChart] = useState(false);
  const Rerender = useStoreQCInspection((state) => state.render);

  const [topData, setTopData] = useState(100);
  const [currentTab, setCurrentTab] = useState('1');
  const [allMold, setAllMold] = useState([]);
  const [mold, setMold] = useState('');
  const [isCalculate, setIsCalculate] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef([]);
  const inputRefSimple2 = useRef([]);
  const inputRefCavity1 = useRef(null);
  const inputRefCavity2 = useRef(null);
  const inputRefLotNo = useRef(null);
  const inputRefMoldNo = useRef(null);
  const inputRefInspector = useRef(null);
  const btnSubmitRef = useRef(null);
  const btnTimeRef = useRef([]);
  console.log('oldCavityList', oldCavityList);
  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 'rgba(158, 199, 243, 0.65) 0 0 15px 2px',
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [openCal, setOpenCal] = useState(false);
  const handleShowCalModal = () => {
    setOpenCal(true); // เปิด Modal
    const newKey = controlData.map((val, index) => ({
      AMOUNT: val.AMOUNT,
      AVG_R: val.AVG_R,
      AVG_X: val.AVG_X,
      BSNCR_PART_NO: val.BSNCR_PART_NO,
      LCL_MANUAL: val.LCL,
      MOLD_NO: val.MOLD_NO,
      POINT_NO: val.POINT_NO,
      R_LCL_MANUAL: val.R_LCL,
      R_UCL_MANUAL: val.R_UCL,
      SUM_R: val.SUM_R,
      SUM_X: val.SUM_X,
      UCL_MANUAL: val.UCL,
    }));
    setManualControl(newKey);
  };
  const handleCavitySample1Change = (event) => {
    const input = event.target.value;

    // Validate input against the pattern x-xx or x-x
    const isValidInput = /^\d{1}-\d{1,2}$|^\d{1}-$|^\d{1}$/.test(input);

    // If input is valid, update the state with the input value
    if (isValidInput || input === '') {
      setCavitySimple1(input);
    }
  };

  const handleCavitySample2Change = (event) => {
    const input = event.target.value;

    // Validate input against the pattern x-xx or x-x
    const isValidInput = /^\d{1}-\d{1,2}$|^\d{1}-$|^\d{1}$/.test(input);

    // If input is valid, update the state with the input value
    if (isValidInput || input === '') {
      setCavitySimple2(input);
    }
  };
  const handleCloseCalModal = () => {
    setOpenCal(false);
    setCurrentTab('1');
  };
  console.log('btnTimeRef', btnTimeRef);
  const getStandardPart = useCallback(async () => {
    const response = await axios.post(`${baseURL}/backend_qc_inspection/api`, {
      router: 'getStandardByPart',
      bsthPartNo: psthPartNo.partNo,
    });
    if (response.data.err) {
      console.log(response.data.msg);
    } else if (!response.data.err && response.data.status === 'Ok') {
      setStandardPart(response.data.result);
    }
  }, [baseURL, psthPartNo.partNo]);

  const getStandardInspection = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getStandardInspection',
        bsthPartNo: psthPartNo.partNo,
      })
      .then((res) => {
        if (res.data.err) {
          setStandardForm([]);
        } else if (res.data.status === 'Ok' && !res.data.err) {
          setStandardForm(res.data.result);
          const point1 = res.data.result.filter((x) => parseInt(x.POINT_NO, 10) === 1); // แต่ละ Point ของ Drawing จะเช็คค่าเท่า ๆ กันอยู่แล้ว
          const array = []; // Array ที่จะใช้งานการเก็บค่าข้อมูล Simple 1
          const array2 = []; // Array ที่จะใช้งานการเก็บค่าข้อมูล Simple 2

          // Push Array ตัวใหม่สำหรับ แต่ละ Simple
          // จัด Format Js object กำหนดค่าเริ่มต้นที่จะใช้ในการ ตรวจแยก Simple 1 , 2
          // สำหรับ Simple 1
          for (let i = 1; i <= parseInt(res.data.result[0].AMOUNT_POINT, 10); i += 1) {
            array.push({
              valueCheck: point1.map((val, _) => ({
                id_result: parseInt(val.ID_RESULT, 10),
                name_result: val.NAME_RESULT,
                lsl: val.LSL,
                usl: val.USL,
                value: '', // Key Value simple 1
                point: i,
              })),
            });

            // สำหรับ Simple 2
            array2.push({
              valueCheck: point1.map((val, _) => ({
                id_result: parseInt(val.ID_RESULT, 10),
                name_result: val.NAME_RESULT,
                lsl: val.LSL,
                usl: val.USL,
                value2: '', // Key Value simple 2
                point: i,
              })),
            });
          }
          setSimple1(array);
          setSimple2(array2);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL, psthPartNo.partNo]);

  console.log('standardPart', standardPart);
  //   console.log(standardPart);

  const handleSimple1Change = (newValue, indexPoint, indexResult) => {
    const floatRegex = /^\d+(\.\d{0,2})?$/; // Modified regex to allow optional decimal part

    if (!floatRegex.test(newValue) && newValue !== '') {
      console.error('Invalid float format. Expected format: xx.xx');
      return; // Stop execution if format is invalid
    }

    const prev = [...simple1];
    prev[indexPoint].valueCheck[indexResult].value = newValue;
    setSimple1(prev);
  };

  const handleSimple2Change = (newValue, indexPoint, indexResult) => {
    const floatRegex = /^\d+(\.\d{0,2})?$/; // Modified regex to allow optional decimal part

    if (!floatRegex.test(newValue) && newValue !== '') {
      console.error('Invalid float format. Expected format: xx.xx');
      return; // Stop execution if format is invalid
    }

    const prev = [...simple2];
    prev[indexPoint].valueCheck[indexResult].value2 = newValue;
    setSimple2(prev);
  };
  const handleKeyPress = (e, i, index) => {
    if (e.key === 'Enter') {
      if (index < inputRef.current[i].length - 1) {
        // Focus on the next input field within the same group
        inputRef.current[i][index + 1].focus();
      } else if (i < inputRef.current.length - 1) {
        // Focus on the first input field of the next group
        inputRef.current[i + 1][0].focus();
      }

      if (index === inputRef.current[i].length - 1 && i === inputRef.current.length - 1) {
        console.log('ถึงตัวสุดท้าย');
        inputRefCavity2.current.focus();
        containerRef.current.scrollTop = 0;
      }
    }
  };
  const handleSimple2KeyPress = (e, i, index) => {
    if (e.key === 'Enter') {
      if (e.key === 'Enter') {
        if (index < inputRefSimple2.current[i].length - 1) {
          // Focus on the next input field within the same group
          inputRefSimple2.current[i][index + 1].focus();
        } else if (i < inputRefSimple2.current.length - 1) {
          // Focus on the first input field of the next group
          inputRefSimple2.current[i + 1][0].focus();
        }
        if (
          index === inputRefSimple2.current[i].length - 1 &&
          i === inputRefSimple2.current.length - 1
        ) {
          console.log('ถึงตัวสุดท้าย');
          if (inputRefCavity1.current.value === '') {
            inputRefCavity1.current.focus();
          } else {
            btnSubmitRef.current.focus();
          }
        }
      }
    }
  };

  const validationDecimal = () => {
    let errrorSimple1 = 0;
    let errrorSimple2 = 0;
    const validateFormat = (value, simple) => {
      const validate = /^\d+\.\d{2}$/.test(value); // xxx.xx
      if (!validate) {
        if (simple === 1) {
          errrorSimple1 += 1;
        } else if (simple === 2) {
          errrorSimple2 += 1;
        }
      }
    };
    for (let i = 0; i < simple1.length; i += 1) {
      simple1[i].valueCheck?.map((val) => validateFormat(val.value, 1)); // Loop Data Validate
      simple2[i].valueCheck?.map((val) => validateFormat(val.value2, 2)); // Loop Data Validate
    }
    if (errrorSimple1 !== 0) {
      return false; // ส่งค่ากลับไปเพื่อบอกว่า Error Format
    }
    if (errrorSimple2 !== 0) {
      return false; // ส่งค่ากลับไปเพื่อบอกว่า Error Format
    }

    return true; // ส่งค่ากลับไปเพื่อบอกว่า Format ถูกต้องทุก ๆ Input
  };

  const resetForm = () => {
    setInspector('');
    setLotNo('');
    setTime('');
    setMoldNo('');
    setCavitySimple1('');
    setCavitySimple2('');
  };
  const scrollUp = () => {
    containerRef.current.scrollTop = 0;
    inputRefLotNo.current.focus();
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleManualChange = (value, index, type) => {
    const floatRegex = /^\d+(\.\d{0,2})?$/;
    console.log(floatRegex);

    const prevManualControl = [...manualControl];
    if (!floatRegex.test(value) && value !== '') {
      console.log('Format Error');
      return;
    }
    if (type === 'lcl') {
      prevManualControl[index].LCL_MANUAL = value;
    } else if (type === 'ucl') {
      prevManualControl[index].UCL_MANUAL = value;
    }
    setManualControl(prevManualControl);
  };
  const [isManual, setIsManual] = useState(false);
  const handleManualSubmit = () => {
    const floatRegex = /^\d+\.\d{2}$/; // Regex สำหรับ xxx.xx Format
    let errorFormatUcl = 0;
    let errorFormatLcl = 0;
    let controlError = 0;
    for (let i = 0; i < controlData?.length; i += 1) {
      if (!floatRegex.test(manualControl[i].UCL_MANUAL) || manualControl[i].UCL_MANUAL === '') {
        errorFormatUcl += 1;
      }
      if (!floatRegex.test(manualControl[i].LCL_MANUAL) || manualControl[i].LCL_MANUAL === '') {
        errorFormatLcl += 1;
      }
      if (parseFloat(manualControl[i].LCL_MANUAL) > manualControl[i].UCL_MANUAL) {
        controlError += 1;
      }
    }
    if (errorFormatUcl !== 0 || errorFormatLcl !== 0) {
      Swal.fire({ icon: 'warning', title: 'Error Format', text: 'ระบุทศนิยม 2 ตำแหน่งเท่านั้น' });
    } else if (controlError !== 0) {
      Swal.fire({ icon: 'warning', title: 'Error Value LCL UCL', text: 'ค่า LCL UCL ไม่ถูกต้อง' });
    } else {
      const newKey = manualControl.map((val, index) => ({
        AMOUNT: val.AMOUNT,
        AVG_R: val.AVG_R,
        AVG_X: val.AVG_X,
        BSNCR_PART_NO: val.BSNCR_PART_NO,
        LCL: val.LCL_MANUAL,
        MOLD_NO: val.MOLD_NO,
        POINT_NO: val.POINT_NO,
        R_LCL: val.R_LCL_MANUAL,
        R_UCL: val.R_UCL_MANUAL,
        SUM_R: val.SUM_R,
        SUM_X: val.SUM_X,
        UCL: val.UCL_MANUAL,
      }));
      setControlData(newKey);
      handleCloseCalModal();
      setIsManual(true);
    }
    console.log(errorFormatUcl);
    console.log(errorFormatLcl);
    console.log(floatRegex);
  };

  const confirmHandleSubmit = async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'UpdateInspection',
        bsthPartNo: psthPartNo.partNo,
        inspector,
        lotNo,
        moldNo,
        time,
        date: obj.DATE,
        value: [
          {
            simple: 1,
            cavity: cavitySimple1,
            valueCheck: simple1,
          },
          {
            simple: 2,
            cavity: cavitySimple2,
            valueCheck: simple2,
          },
        ],
      })
      .then((res) => {
        if (res.data.err) {
          Swal.fire({
            icon: 'error',
            title: res.data.msg,
          });
        } else if (!res.data.err && res.data.status === 'Ok') {
          Swal.fire({
            icon: 'success',
            title: res.data.msg,
            timer: 600,
            showCancelButton: false,
            showConfirmButton: false,
          }).then(() => {
            Rerender();
            resetForm();
            setShowConfirmModal(false);
            handleCloseModal();
          });
          setTimeout(() => {
            scrollUp();
          }, 1500);
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSubmit = async () => {
    const isValidInput1 = /^\d{1}-\d{1,2}$/.test(cavitySimple1);
    const isValidInput2 = /^\d{1}-\d{1,2}$/.test(cavitySimple2);
    if (
      lotNo === '' ||
      moldNo === '' ||
      time === '' ||
      cavitySimple1 === '' ||
      cavitySimple2 === '' ||
      inspector === ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Error Input From',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    } else {
      const decimal = validationDecimal();
      if (!decimal) {
        Swal.fire({
          icon: 'warning',
          title: 'Format ไม่ถูกต้อง',
          text: 'กรุณาระบุเลขทศนิยม 2 ตำแหน่ง',
        });
      } else if (!isValidInput1 || !isValidInput2) {
        Swal.fire({
          icon: 'warning',
          title: 'Format Cavity ไม่ถูกต้อง',
          text: `กรุณาระบุ Format x-x หรือ x-xx เท่านั้น`,
        });
      } else {
        setShowConfirmModal(true);
      }
    }
  };

  const getDataXBarChart = useCallback(
    async (moldNumber, date, timeCheck) => {
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getDataXBarChart',
          psthPartNo: psthPartNo.partNo,
          moldNo: moldNumber,
          dateInspection: `${date} ${timeCheck}:00`,
        })
        .then((res) => {
          if (!res.data.err) {
            setDataXBarChart(res.data.result);
          } else {
            console.log(res.data.msg);
            setDataXBarChart([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL, psthPartNo.partNo]
  );

  const getXBarControlLine = useCallback(
    async (top, noMold, date, timeCheck) => {
      setIsCalculate(true);
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getXBarUCL',
          psthPartNo: psthPartNo.partNo,
          n: 2,
          dateInspection: `${date} ${timeCheck}:00`,
          MoldNo: noMold,
          top,
        })
        .then((res) => {
          if (res.data.err && res.data.msg !== 'Not Found!') {
            setControlData([]);
            setIsCalculate(false);
          } else if (!res.data.err && res.data.status === 'Ok') {
            setControlData(res.data.result);
            setUclControl(res.data.result[0]?.MAX);
            setLclControl(res.data.result[1]?.MIN);
            setIsCalculate(false);
            handleCloseCalModal(); // ปิด Modal Calculate
            setIsManual(false);
          } else if (res.data.err && res.data.msg === 'Not Found!') {
            Swal.fire({
              icon: 'warning',
              title: 'Not Found!',
              text: 'ไม่พบ Data ที่จะคำนวณ',
            });
            setIsCalculate(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL, psthPartNo.partNo]
  );

  const getCountMoldOfPsthPart = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'countMoldOfPsthPart',
        psthPartNo: psthPartNo.partNo,
      })
      .then((res) => {
        if (res.data.err) {
          setAllMold([]);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setAllMold(res.data.result);
          setMold(res.data.result[0].MOLD_NO);

          setDateControlChart(obj?.DATE);
          getXBarControlLine(100, res.data.result[0].MOLD_NO, obj?.DATE, obj?.TIME);
          getDataXBarChart(res.data.result[0].MOLD_NO, obj?.DATE, obj?.TIME);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL, psthPartNo.partNo, getXBarControlLine, getDataXBarChart, obj]);
  console.log(dateControlChart);
  useEffect(() => {
    console.log('Effefct');
    getStandardInspection();
    getStandardPart();
    getCountMoldOfPsthPart();
    inputRefLotNo.current.focus();
    containerRef.current.scrollTop = 0; // Slide to Top
  }, [
    getStandardInspection,
    getStandardPart,
    inputRefLotNo,
    containerRef,
    getCountMoldOfPsthPart,
    getXBarControlLine,
  ]);

  return (
    <div ref={containerRef} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
      {/* ModalControlChart */}
      <ModalControlChart
        isOpen={showModalControlChart}
        handleClose={() => setShowModalControlChart(false)}
      />
      {/* End ModalControlChart */}

      <Modal
        open={openCal}
        onClose={handleCloseCalModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ ...styleModal, height: '80%', overflow: 'hidden', overflowY: 'auto' }}
          className="w-[80%] lg:w-[50%]"
        >
          <TabContext value={currentTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={(e, value) => setCurrentTab(value)}
                aria-label="lab API tabs example"
              >
                <Tab label="Calculate" value="1" />
                <Tab label="Input Manual" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <h2>
                <i className="fa-solid fa-calculator text-[17px] mr-2" />
                Calculate | UCL , LCL ({psthPartNo.partNo})
              </h2>
              <Box className="mt-[2rem]">
                <DatePicker
                  maxDate={new Date()}
                  onChange={(date) => setDateCalculate(date)}
                  dateFormat="dd MMMM yyyy"
                  selected={dateCalculate}
                  customInput={
                    <TextField
                      value={dateCalculate}
                      id="standard-basic"
                      label="Date"
                      placeholder="เลือกวันที่"
                      variant="standard"
                    />
                  }
                />
                <div className="grid grid-cols-3 gap-2 mt-[1rem]">
                  {OptionTopData.map((val, index) => (
                    <button
                      key={index}
                      value={val.data}
                      type="button"
                      onClick={(e) => {
                        setTopData(e.target.value);
                      }}
                      className={`p-[5px] flex justify-center rounded-[5px] ${
                        val.data === parseInt(topData, 10)
                          ? 'bg-violet-400 text-white transition-all duration-300'
                          : 'bg-violet-100 text-gray-800 transition-all duration-300'
                      }`}
                    >
                      {val.data}
                    </button>
                  ))}
                </div>
                <div className="mt-[2rem]">
                  * Calculate from {dateCalculate.toJSON().slice(0, 10)} Last {topData} Data
                </div>
                <Box className="mt-[2rem]">
                  <Button
                    variant="contained"
                    onClick={() => {
                      getXBarControlLine(
                        topData,
                        mold,
                        dateCalculate.toJSON().slice(0, 10),
                        obj?.TIME
                      );
                      // alert(topData);
                      // alert(dateCalculate.toJSON().slice(0, 10));
                    }}
                  >
                    {isCalculate ? 'Process.....' : 'Calculate'}
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Typography>
                <i className="fa-solid fa-file-pen" /> Input Manual ({psthPartNo.partNo})
              </Typography>

              {standardPart?.map((val, index) => (
                <div key={index}>
                  <Typography fontSize={12}>
                    <i className="fa-solid fa-arrow-right mr-2 text-[red]" />
                    Point No.{val.POINT_NO}
                  </Typography>
                  <Typography fontSize={12}>
                    SPEC : {val?.LSL} - {val?.USL} mm
                  </Typography>
                </div>
              ))}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-1">
                {controlData?.map((val, index) => (
                  <Box className="flex justify-center flex-col items-start border-[1px] p-2">
                    <Label color="primary" className="my-1">
                      Point No. {index + 1}
                    </Label>
                    <div className="mb-[1rem]">
                      <div className="flex gap-2 items-center">
                        <Typography fontSize={12}>LCL :</Typography>
                        <TextField
                          size="small"
                          placeholder="LCL"
                          value={manualControl[index]?.LCL_MANUAL}
                          className="w-[120px]"
                          onChange={(e) => handleManualChange(e.target.value, index, 'lcl')}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        <Typography fontSize={12}>UCL :</Typography>
                        <TextField
                          size="small"
                          placeholder="UCL"
                          value={manualControl[index]?.UCL_MANUAL}
                          className="w-[120px]"
                          onChange={(e) => handleManualChange(e.target.value, index, 'ucl')}
                        />
                      </div>
                    </div>
                  </Box>
                ))}
              </div>
              <Box className="mt-[1rem]">
                <Button variant="contained" onClick={handleManualSubmit}>
                  OK
                </Button>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>
      {/* Modal Show รูปภาพ */}
      <Modal
        open={showPictureModal}
        onClose={() => setShowPictureModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ ...styleModal, height: '90%', width: '80%', overflow: 'hidden', overflowY: 'auto' }}
        >
          <img
            src={`${baseURL}/backend_qc_inspection/uploads/drawing/${pathImage}`}
            alt={pathImage}
            width="100%"
            height="auto"
          />
        </Box>
      </Modal>

      {/* Modal Show Value before Submit */}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ ...styleModal, height: '90%', width: '60%', overflow: 'hidden', overflowY: 'auto' }}
        >
          <Box>
            <div className="flex gap-x-2">
              <Typography fontWeight="bold">PSTH Part No : {psthPartNo.partNo}</Typography>
              <Label color={(standardForm[0]?.JUST_ON === 'X,Y' && 'info') || 'primary'}>
                {standardForm[0]?.JUST_ON}
              </Label>
            </div>
            <Typography fontSize={12} fontWeight="bold">
              Customer Name : {standardForm[0]?.CUSTOMER_NAME}
            </Typography>
            {standardPart?.map((val, index) => (
              <div key={index}>
                <Typography fontSize={12}>
                  <i className="fa-solid fa-arrow-right mr-2 text-[red]" />
                  Point No.{val.POINT_NO}
                </Typography>
                <Typography fontSize={12}>
                  SPEC : {val?.LSL} - {val?.USL} mm
                </Typography>
              </div>
            ))}
          </Box>
          <hr />
          <Box className="flex gap-x-2 my-[1rem]">
            <Button variant="contained" onClick={confirmHandleSubmit}>
              Confirm
            </Button>
            <Button variant="contained" color="error" onClick={() => setShowConfirmModal(false)}>
              Close
            </Button>
          </Box>
          <div className="flex ml-[8rem] gap-x-3 mt-3">
            <div className="flex flex-col justify-center text-center">
              <p>Sample 1</p>
              <TextField
                placeholder="Cavity No."
                size="small"
                sx={{ width: 90 }}
                value={cavitySimple1}
                disabled
              />
            </div>
            <div className="flex flex-col justify-center text-center">
              <p>Sample 2</p>
              <TextField
                placeholder="Cavity No."
                size="small"
                sx={{ width: 90 }}
                value={cavitySimple2}
                disabled
              />
            </div>
          </div>
          <Box className="flex gap-x-5">
            <Box>
              {Array.from({ length: simple1.length }).map((_, i) => {
                const arr = simple1[i].valueCheck?.map((val) => parseFloat(val.value).toFixed(2));
                const parsedArr = arr.map((val) => parseFloat(val));
                const sum = parsedArr.reduce((a, b) => a + b, 0);
                const avgSimple1 = sum / arr.length;
                return (
                  <div key={i}>
                    <div className="flex items-center">
                      <p className="font-bold text-[14px]">Point No. {i + 1} </p>
                    </div>
                    {Array.isArray(simple1[i].valueCheck) ? (
                      <div>
                        {simple1[i].valueCheck.map((val, index) => (
                          <div key={index}>
                            <table>
                              <tbody>
                                <tr>
                                  <td>
                                    <p className="mr-2">{val.name_result}</p>
                                  </td>
                                  <td>
                                    <p>
                                      <TextField
                                        size="small"
                                        style={{ width: 90 }}
                                        value={simple1[i].valueCheck[index].value || ''}
                                        sx={
                                          (parseFloat(controlData[i]?.UCL) <
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(controlData[i]?.LCL) >
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.USL) <
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.LSL) >
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y')
                                            ? {
                                                background: 'red',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                input: {
                                                  color: 'white',
                                                },
                                              }
                                            : {
                                                color: 'black',
                                              }
                                        }
                                        error={
                                          (parseFloat(controlData[i]?.UCL) <
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(controlData[i]?.LCL) >
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.USL) <
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.LSL) >
                                            parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                            standardForm[0]?.JUST_ON === 'X,Y')
                                          //  ถ้าค่ามากกว่า SPEC
                                        }
                                      />
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ))}
                        <div className="flex items-center mt-[1rem]">
                          <Typography>Average =</Typography>
                          <Box
                            className={
                              (avgSimple1.toFixed(2) > controlData[i]?.UCL &&
                                !Number.isNaN(parseFloat(avgSimple1.toFixed(2)))) ||
                              (avgSimple1.toFixed(2) < controlData[i]?.LCL &&
                                !Number.isNaN(parseFloat(avgSimple1.toFixed(2)))) ||
                              (avgSimple1.toFixed(2) > standardPart[i]?.USL &&
                                !Number.isNaN(parseFloat(avgSimple1.toFixed(2)))) ||
                              (avgSimple1.toFixed(2) < standardPart[i]?.LSL &&
                                !Number.isNaN(parseFloat(avgSimple1.toFixed(2))))
                                ? 'ml-[4rem] p-2 rounded-md bg-[red] flex justify-center text-[white]'
                                : 'ml-[4rem] p-2 rounded-md bg-slate-100 flex justify-center text-[#313131]'
                            }
                            width={80}
                          >
                            <Typography fontSize={14}>
                              {Number.isNaN(parseFloat(avgSimple1.toFixed(2)))
                                ? 'Wait..'
                                : avgSimple1.toFixed(2)}
                            </Typography>
                          </Box>
                        </div>
                      </div>
                    ) : (
                      <p>Not an array</p>
                    )}
                    <div className="mb-[1rem] mt-[1rem]">
                      <hr />
                    </div>
                  </div>
                );
              })}
            </Box>
            {/* Simple 2 */}
            <Box>
              {Array.from({ length: simple2.length }).map((_, i) => {
                const arr = simple2[i].valueCheck?.map((val) => parseFloat(val.value2).toFixed(2));
                const parsedArr = arr.map((val) => parseFloat(val));
                const sum = parsedArr.reduce((a, b) => a + b, 0);
                const avgSimple2 = sum / arr.length;
                return (
                  <div key={i}>
                    <div className="flex items-center">
                      <p className="font-bold text-[14px]">-</p>
                    </div>
                    {Array.isArray(simple2[i].valueCheck) ? (
                      simple2[i].valueCheck.map((val, index) => (
                        <div key={index}>
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <p>
                                    <TextField
                                      size="small"
                                      value={simple2[i].valueCheck[index].value2 || ''}
                                      sx={
                                        (parseFloat(controlData[i]?.UCL) <
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y') ||
                                        (parseFloat(controlData[i]?.LCL) >
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y') ||
                                        (parseFloat(standardPart[i]?.USL) <
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y') ||
                                        (parseFloat(standardPart[i]?.LSL) >
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y')
                                          ? {
                                              width: 90,
                                              background: 'red',
                                              color: '#fff',
                                              borderRadius: '8px',
                                              input: {
                                                color: 'white',
                                              },
                                            }
                                          : {
                                              width: 90,
                                              color: 'black',
                                            }
                                      }
                                      error={
                                        (parseFloat(controlData[i]?.UCL) <
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y') ||
                                        (parseFloat(controlData[i]?.LCL) >
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y') ||
                                        (parseFloat(standardPart[i]?.USL) <
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y') ||
                                        (parseFloat(standardPart[i]?.LSL) >
                                          parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                          standardForm[0]?.JUST_ON === 'X,Y')
                                        //  ถ้าค่ามากกว่า SPEC
                                      }
                                    />
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))
                    ) : (
                      <p>Not an array</p>
                    )}
                    <Box
                      className={
                        (avgSimple2.toFixed(2) > controlData[i]?.UCL &&
                          !Number.isNaN(parseFloat(avgSimple2.toFixed(2)))) ||
                        (avgSimple2.toFixed(2) < controlData[i]?.LCL &&
                          !Number.isNaN(parseFloat(avgSimple2.toFixed(2)))) ||
                        (avgSimple2.toFixed(2) > standardPart[i]?.USL &&
                          !Number.isNaN(parseFloat(avgSimple2.toFixed(2)))) ||
                        (avgSimple2.toFixed(2) < standardPart[i]?.LSL &&
                          !Number.isNaN(parseFloat(avgSimple2.toFixed(2))))
                          ? 'mt-[1rem] ml-2 p-2 rounded-md bg-[red] flex justify-center text-[white]'
                          : 'mt-[1rem] ml-2 p-2 rounded-md bg-slate-100 flex justify-center text-[#313131]'
                      }
                      width={80}
                    >
                      <Typography fontSize={14}>
                        {Number.isNaN(parseFloat(avgSimple2.toFixed(2)))
                          ? 'Wait..'
                          : avgSimple2.toFixed(2)}
                      </Typography>
                    </Box>
                    <div className="mb-[1rem] mt-[1rem]">
                      <hr />
                    </div>
                  </div>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Modal>

      <Grid container>
        <Grid item xs={12} lg={7}>
          <Box>
            <div className="flex gap-x-2">
              <Typography fontWeight="bold">PSTH Part No : {psthPartNo.partNo}</Typography>
              <Label color={(standardForm[0]?.JUST_ON === 'X,Y' && 'info') || 'primary'}>
                {standardForm[0]?.JUST_ON}
              </Label>
            </div>
            <Typography fontSize={12} fontWeight="bold">
              Customer Name : {standardForm[0]?.CUSTOMER_NAME}
            </Typography>
            {standardPart?.map((val, index) => (
              <div key={index}>
                <Typography fontSize={12}>
                  <i className="fa-solid fa-arrow-right mr-2 text-[red]" />
                  Point No.{val.POINT_NO}
                </Typography>
                <Typography fontSize={12}>
                  SPEC : {val?.LSL} - {val?.USL} mm
                </Typography>
              </div>
            ))}
          </Box>
          <Box className="mt-[1rem] mb-1">
            <FormControl className="w-[200px]">
              <InputLabel id="demo-simple-select-label">Mold No.</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mold}
                label="Mold No"
                size="small"
                onChange={(e) => {
                  getDataXBarChart(e.target.value, obj?.DATE, obj?.TIME);
                  getXBarControlLine(topData, e.target.value, obj?.DATE, obj?.TIME);
                  setMold(e.target.value);
                }}
              >
                {allMold?.map((val, index) => (
                  <MenuItem value={val.MOLD_NO} key={index}>
                    {val.MOLD_NO}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box className="flex items-center gap-x-2 mb-2">
            <Button
              variant="contained"
              size="small"
              sx={{ marginTop: 1 }}
              onClick={handleShowCalModal}
            >
              คำนวณ UCL - LCL
            </Button>
          </Box>
          <Box>
            {standardPart.map((val, index) => (
              <>
                <Label color="primary" key={index}>
                  Point No. {index + 1}
                </Label>
                {!isManual ? (
                  <div>
                    <Typography fontSize={12} marginTop={1}>
                      Calculated from {topData} Data dating back to{' '}
                      {dateCalculate.toJSON().slice(0, 10)} {obj?.TIME} :
                    </Typography>
                    <Typography fontSize={12} marginTop={1}>
                      UCL = {controlData[index]?.UCL} mm , LCL = {controlData[index]?.LCL} mm
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Typography fontSize={12} marginTop={1}>
                      Manual Input UCL = {manualControl[index]?.UCL_MANUAL} mm , LCL ={' '}
                      {manualControl[index]?.LCL_MANUAL} mm
                    </Typography>
                  </div>
                )}
                <Typography fontSize={12} marginTop={1}>
                  X Bar Chart - {index + 1}
                </Typography>
                <XBarChart
                  key={index}
                  isLoad={false}
                  lslValue={parseFloat(val?.LSL)}
                  uslValue={parseFloat(val?.USL)}
                  dataValue={dataXBarChart}
                  point={parseInt(index, 10) + 1}
                  controlData={controlData}
                  uclControl={uclControl}
                  lclControl={lclControl}
                />

                <Typography fontSize={12} marginTop={1}>
                  R Bar Chart - {index + 1}
                </Typography>
                <RBarChart
                  key={index}
                  isLoad={false}
                  lslValue={parseFloat(val?.LSL)}
                  uslValue={parseFloat(val?.USL)}
                  dataValue={dataXBarChart}
                  point={parseInt(index, 10) + 1}
                  controlData={controlData}
                  uclControl={uclControl}
                  lclControl={lclControl}
                />
              </>
            ))}
          </Box>
          <Box>{/* <RBarChart /> */}</Box>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Box fontSize={12} marginTop={3}>
            <Box className="flex items-center mb-[1rem]">
              <Typography fontSize={12} fontWeight="bold" marginRight={2}>
                Lot No. :
              </Typography>
              <TextField
                disabled
                value={lotNo}
                sx={{ marginLeft: 1 }}
                size="small"
                placeholder="Lot No."
                id="outlined-basic"
                label="Lot No"
                variant="outlined"
                inputRef={inputRefLotNo}
              />
            </Box>
            <Box className="flex items-center mb-[1rem]">
              <Typography fontSize={12} fontWeight="bold" marginRight={2}>
                Mold No. :
              </Typography>
              <TextField
                size="small"
                placeholder="Mold No."
                id="outlined-basic"
                label="Mold No"
                variant="outlined"
                inputRef={inputRefMoldNo}
                disabled
                value={moldNo}
              />
            </Box>
            <Box className="flex items-center mb-[0.2rem]">
              <Typography fontSize={12} fontWeight="bold" marginRight={4}>
                ผู้ตรวจ :
              </Typography>
              <TextField
                size="small"
                placeholder="ระบุชื่อย่อ เช่น AWK"
                id="outlined-basic"
                label="Inspector"
                variant="outlined"
                inputRef={inputRefInspector}
                value={inspector}
                disabled
                onChange={(e) => {
                  const englishRegex = /^[a-zA-Z0-9]*$/; // อนุญาตให้ใช้อักขระภาษาอังกฤษ (ตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก) และตัวเลข
                  const newValue = e.target.value.replace(/[^a-zA-Z]/g, ''); // แปลงอินพุตเป็นตัวพิมพ์ใหญ่และลบอักขระที่ไม่ใช่ตัวอักษรและตัวเลข
                  if (englishRegex.test(newValue)) {
                    setInspector(newValue.slice(0, 4));
                  } else {
                    console.log('Only English characters are allowed.');
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (e.target.value !== '') {
                      btnTimeRef.current[0].focus();
                    }
                  }
                }}
              />
            </Box>
            <span className="text-[red] text-[12px] ml-[5rem]">* ระบุชื่อย่อ เช่น AWK</span>
            <Box className="mt-[1rem]">
              {time === '' ? (
                <Typography fontSize={12} fontWeight="bold" marginRight={2} component="span">
                  Time : <span className="text-[red]">ไม่ได้เลือกเวลา</span>
                </Typography>
              ) : (
                <Typography fontSize={12} fontWeight="bold" marginRight={2} component="span">
                  Time : {obj.DATE} {time} น.
                </Typography>
              )}

              <div className="grid grid-cols-3 gap-2 p-2">
                {MenuTime?.map((value, index) => (
                  <button
                    key={index}
                    type="button"
                    ref={(el) => {
                      btnTimeRef.current[index] = el;
                    }}
                    onClick={() => {
                      setTime(obj.TIME);
                      inputRef.current[0][0].focus();
                    }}
                    className={`p-[5px] flex justify-center rounded-[5px] ${
                      value.time === time
                        ? 'bg-violet-400 text-white transition-all duration-300'
                        : 'bg-violet-100 text-gray-800 transition-all duration-300'
                    }`}
                  >
                    {value.time}
                  </button>
                ))}
              </div>

              <div className="mb-2">
                <Typography fontSize={12} fontWeight="bold" marginRight={2} component="span">
                  Drawing :{' '}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setPathImage(standardPart[0].FILENAME);
                      setShowPictureModal(true);
                    }}
                  >
                    Drawing
                  </Button>
                </Typography>
              </div>
              <div className="mb-2">
                <Typography fontSize={12} fontWeight="bold" marginRight={2} component="span">
                  Control Chart :{' '}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setShowModalControlChart(true);
                    }}
                  >
                    Control Chart
                  </Button>
                </Typography>
              </div>
            </Box>
            <hr />
            <div className="flex ml-[5.5rem] gap-x-2 mt-3">
              <div className="flex flex-col justify-center text-center">
                <p>Sample 1</p>
                <TextField
                  placeholder="Cavity No."
                  size="small"
                  sx={{ width: 80 }}
                  value={cavitySimple1}
                  inputRef={inputRefCavity1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      inputRef.current[0][0].focus();
                    }
                  }}
                  disabled={lotNo === '' || moldNo === '' || time === ''}
                  onChange={handleCavitySample1Change}
                />
              </div>
              <div className="flex flex-col justify-center text-center">
                <p>Sample 2</p>
                <TextField
                  placeholder="Cavity No."
                  size="small"
                  sx={{ width: 80 }}
                  inputRef={inputRefCavity2}
                  value={cavitySimple2}
                  onChange={handleCavitySample2Change}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      inputRefSimple2.current[0][0].focus();
                    }
                  }}
                  // disabled
                  disabled={lotNo === '' || moldNo === '' || time === ''}
                />
              </div>
            </div>
            <Box className="flex gap-x-5">
              <Box>
                {Array.from({ length: simple1.length }).map((_, i) => {
                  const arr = simple1[i].valueCheck?.map((val) => parseFloat(val.value).toFixed(2));
                  const parsedArr = arr.map((val) => parseFloat(val));
                  const sum = parsedArr.reduce((a, b) => a + b, 0);
                  const avgSimple1 = sum / arr.length;

                  return (
                    <div key={i}>
                      <div className="flex items-center my-1 gap-x-1">
                        <p className="font-bold text-[14px]">Point No. {i + 1} </p>
                        {controlData[i]?.LCL} - {controlData[i]?.UCL} mm
                      </div>
                      {Array.isArray(simple1[i].valueCheck) ? (
                        <div>
                          {simple1[i].valueCheck.map((val, index) => (
                            <div key={index}>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>
                                      <p className="mr-2">{val.name_result}</p>
                                    </td>
                                    <td>
                                      <p>
                                        <TextField
                                          onChange={(e) => {
                                            handleSimple1Change(e.target.value, i, index);
                                          }}
                                          onKeyPress={(e) => handleKeyPress(e, i, index)}
                                          onFocus={() => {
                                            handleSimple1Change('', i, index);
                                          }}
                                          size="small"
                                          inputRef={(el) => {
                                            if (!inputRef.current[i]) {
                                              inputRef.current[i] = [];
                                            }
                                            if (el) {
                                              inputRef.current[i][index] = el;
                                            }
                                          }}
                                          style={{ width: 90 }}
                                          value={simple1[i].valueCheck[index].value || ''}
                                          sx={
                                            (parseFloat(controlData[i]?.UCL) <
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y') ||
                                            (parseFloat(controlData[i]?.LCL) >
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y') ||
                                            (parseFloat(standardPart[i]?.USL) <
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y') ||
                                            (parseFloat(standardPart[i]?.LSL) >
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y')
                                              ? {
                                                  background: 'red',
                                                  color: '#fff',
                                                  borderRadius: '8px',
                                                  input: {
                                                    color: 'white',
                                                  },
                                                }
                                              : {
                                                  color: 'black',
                                                }
                                          }
                                          error={
                                            (parseFloat(controlData[i]?.UCL) <
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y') ||
                                            (parseFloat(controlData[i]?.LCL) >
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y') ||
                                            (parseFloat(standardPart[i]?.USL) <
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y') ||
                                            (parseFloat(standardPart[i]?.LSL) >
                                              parseFloat(simple1[i]?.valueCheck[index]?.value) &&
                                              standardForm[0]?.JUST_ON === 'X,Y')
                                            //  ถ้าค่ามากกว่า SPEC
                                          }
                                        />
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                          <div className="flex items-center mt-[1rem]">
                            <Typography>Average = </Typography>
                            <Box
                              className={
                                (avgSimple1.toFixed(2) > controlData[i]?.UCL &&
                                  !Number.isNaN(parseFloat(avgSimple1.toFixed(2)))) ||
                                (avgSimple1.toFixed(2) < controlData[i]?.LCL &&
                                  !Number.isNaN(parseFloat(avgSimple1.toFixed(2)))) ||
                                (avgSimple1.toFixed(2) > standardPart[i]?.USL &&
                                  !Number.isNaN(parseFloat(avgSimple1.toFixed(2)))) ||
                                (avgSimple1.toFixed(2) < standardPart[i]?.LSL &&
                                  !Number.isNaN(parseFloat(avgSimple1.toFixed(2))))
                                  ? 'ml-[1.5rem] p-2 rounded-md bg-[red] flex justify-center text-[white]'
                                  : 'ml-[1.5rem] p-2 rounded-md bg-slate-100 flex justify-center text-[#313131]'
                              }
                              width={80}
                            >
                              <Typography fontSize={14}>
                                {Number.isNaN(parseFloat(avgSimple1.toFixed(2)))
                                  ? 'Wait..'
                                  : avgSimple1.toFixed(2)}
                              </Typography>
                            </Box>
                          </div>
                        </div>
                      ) : (
                        <p>Not an array</p>
                      )}
                      <div className="mb-[1rem] mt-[1rem]">
                        <hr />
                      </div>
                    </div>
                  );
                })}
              </Box>
              {/* Simple 2 */}
              <Box>
                {Array.from({ length: simple2.length }).map((_, i) => {
                  const arr = simple2[i].valueCheck?.map((val) =>
                    parseFloat(val.value2).toFixed(2)
                  );
                  const parsedArr = arr.map((val) => parseFloat(val));
                  const sum = parsedArr.reduce((a, b) => a + b, 0);
                  const avgSimple2 = sum / arr.length;
                  return (
                    <div key={i}>
                      <div className="flex items-center my-1">
                        <p className="font-bold text-[14px]">-</p>
                      </div>
                      {Array.isArray(simple2[i].valueCheck) ? (
                        simple2[i].valueCheck.map((val, index) => (
                          <div key={index}>
                            <table>
                              <tbody>
                                <tr>
                                  <td>
                                    <p>
                                      <TextField
                                        size="small"
                                        onChange={(e) => {
                                          handleSimple2Change(e.target.value, i, index);
                                        }}
                                        onFocus={() => {
                                          handleSimple2Change('', i, index);
                                        }}
                                        onKeyPress={(e) => handleSimple2KeyPress(e, i, index)}
                                        inputRef={(el) => {
                                          if (!inputRefSimple2.current[i]) {
                                            inputRefSimple2.current[i] = [];
                                          }
                                          if (el) {
                                            inputRefSimple2.current[i][index] = el;
                                          }
                                        }}
                                        value={simple2[i].valueCheck[index].value2 || ''}
                                        sx={
                                          (parseFloat(controlData[i]?.UCL) <
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(controlData[i]?.LCL) >
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.USL) <
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.LSL) >
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y')
                                            ? {
                                                width: 90,
                                                background: 'red',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                input: {
                                                  color: 'white',
                                                },
                                              }
                                            : {
                                                width: 90,
                                                color: 'black',
                                              }
                                        }
                                        error={
                                          (parseFloat(controlData[i]?.UCL) <
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(controlData[i]?.LCL) >
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.USL) <
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y') ||
                                          (parseFloat(standardPart[i]?.LSL) >
                                            parseFloat(simple2[i]?.valueCheck[index]?.value2) &&
                                            standardForm[0]?.JUST_ON === 'X,Y')
                                          //  ถ้าค่ามากกว่า SPEC
                                        }
                                      />
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ))
                      ) : (
                        <p>Not an array</p>
                      )}
                      <Box
                        className={
                          (avgSimple2.toFixed(2) > controlData[i]?.UCL &&
                            !Number.isNaN(parseFloat(avgSimple2.toFixed(2)))) ||
                          (avgSimple2.toFixed(2) < controlData[i]?.LCL &&
                            !Number.isNaN(parseFloat(avgSimple2.toFixed(2)))) ||
                          (avgSimple2.toFixed(2) > standardPart[i]?.USL &&
                            !Number.isNaN(parseFloat(avgSimple2.toFixed(2)))) ||
                          (avgSimple2.toFixed(2) < standardPart[i]?.LSL &&
                            !Number.isNaN(parseFloat(avgSimple2.toFixed(2))))
                            ? 'mt-[1rem] ml-2 p-2 rounded-md bg-[red] flex justify-center text-[white]'
                            : 'mt-[1rem] ml-2 p-2 rounded-md bg-slate-100 flex justify-center text-[#313131]'
                        }
                        width={80}
                      >
                        <Typography fontSize={14}>
                          {Number.isNaN(parseFloat(avgSimple2.toFixed(2)))
                            ? 'Wait..'
                            : avgSimple2.toFixed(2)}
                        </Typography>
                      </Box>

                      <div className="mb-[1rem] mt-[1rem]">
                        <hr />
                      </div>
                    </div>
                  );
                })}
              </Box>
            </Box>
            <Box>
              <Button variant="contained" onClick={handleSubmit} ref={btnSubmitRef}>
                Update
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditInspection;
EditInspection.propTypes = {
  psthPartNo: PropTypes.object,
  obj: PropTypes.object,
  handleCloseModal: PropTypes.func,
  oldCavityList: PropTypes.array,
};
