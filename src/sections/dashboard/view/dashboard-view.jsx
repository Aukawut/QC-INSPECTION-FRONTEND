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

import { OptionTopData } from '../utils';

export default function DashboardView({ psthPartNo,handleMoldChange,dateProps }) {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [standardForm, setStandardForm] = useState([]);
  const [standardPart, setStandardPart] = useState([]);
  const [controlData, setControlData] = useState([]);

  const [dateControlChart, setDateControlChart] = useState('');
  const [dataXBarChart, setDataXBarChart] = useState([]);
  const [uclControl, setUclControl] = useState([]);
  const [lclControl, setLclControl] = useState([]);
  const [dateCalculate, setDateCalculate] = useState(new Date());
  const [manualControl, setManualControl] = useState([]);
  const [pathImage, setPathImage] = useState('');

  const [topData, setTopData] = useState(100);
  const [currentTab, setCurrentTab] = useState('1');
  const [allMold, setAllMold] = useState([]);
  const [mold, setMold] = useState('');
  const [isCalculate, setIsCalculate] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);


  const containerRef = useRef(null);


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
  const handleCloseCalModal = () => {
    setOpenCal(false);
    setCurrentTab('1');
  };

  // Get Standard Of Part
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

  // get Standard Inspection
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
         
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL, psthPartNo.partNo]);

  console.log('standardPart', standardPart);
  //   console.log(standardPart);

  const handleManualChange = (value, index, type) => {
    const floatRegex = /^\d+(\.\d{0,2})?$/;
    console.log(floatRegex);

    const prevManualControl = [...manualControl];

    // Check Number Format
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

    const floatRegex = /^\d+\.\d{2}$/; // Regex for check xxx.xx Format

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
      Swal.fire({ icon: 'warning', title: 'Error Format', text: 'ระบุทศนิยม 2 ตำแหน่งเท่านั้น' }); // Decimal 2 Only
    } else if (controlError !== 0) {
      Swal.fire({ icon: 'warning', title: 'Error Value LCL UCL', text: 'ค่า LCL UCL ไม่ถูกต้อง' }); // LCL UCL is not correct!
    } else {

      // # Check Array Key
      const newKey = manualControl.map((val) => ({
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
   
  };

 


  const getDataXBarChart = useCallback(
    async (moldNumber,date) => {
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getDataXBarChart',
          psthPartNo: psthPartNo.partNo,
          moldNo: moldNumber,
          dateInspection:`${date} 23:59:00`
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
    async (top, noMold, date) => {
      setIsCalculate(true);
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getXBarUCL',
          psthPartNo: psthPartNo.partNo,
          n: 2,
          dateInspection: `${date} 23:59:00`,
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
          setDateControlChart(dateProps.toJSON().slice(0, 10));
          getXBarControlLine(100, res.data.result[0].MOLD_NO, dateProps.toJSON().slice(0, 10));
          getDataXBarChart(res.data.result[0].MOLD_NO,dateProps.toJSON().slice(0, 10));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL, psthPartNo.partNo, getXBarControlLine, getDataXBarChart,dateProps]);

  useEffect(() => {
    console.log('Effefct');
    getStandardInspection();
    getStandardPart();
    getCountMoldOfPsthPart();
    containerRef.current.scrollTop = 0; // Slide to Top
  }, [
    getStandardInspection,
    getStandardPart,
    containerRef,
    getCountMoldOfPsthPart,
    getXBarControlLine,
  ]);
  return (
    <div className='mt-[1.4rem]'>
    
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
      <div ref={containerRef} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
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
                        getXBarControlLine(topData, mold, dateCalculate.toJSON().slice(0, 10));
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
                    <Box className="flex justify-center flex-col items-start border-[1px] p-2" key={index}>
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
            sx={{
              ...styleModal,
              height: '90%',
              width: '80%',
              overflow: 'hidden',
              overflowY: 'auto',
            }}
          >
            <img
              src={`${baseURL}/backend_qc_inspection/uploads/drawing/${pathImage}`}
              alt={pathImage}
              width="100%"
              height="auto"
            />
          </Box>
        </Modal>

       

        <Grid container>
          <Grid item xs={12} lg={12}>
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
                    getDataXBarChart(e.target.value,dateProps.toJSON().slice(0, 10));
                    getXBarControlLine(topData, e.target.value, dateProps.toJSON().slice(0, 10));
                    setMold(e.target.value);
                  }}
                >
                  {allMold?.map((val) => (
                    <MenuItem value={val.MOLD_NO} key={val.MOLD_NO}>
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
                Calculate UCL - LCL
              </Button>
            </Box>
            <Box>
              {standardPart.map((val, index) => (
                <>
                  <Label color="primary" key={index} >
                    Point No. {index + 1}
                  </Label>
                  {!isManual ? (
                    <div className='mt-4'>
                      <Typography fontSize={12} marginTop={1}>
                        Calculated from {topData} Data dating back to {dateControlChart} :
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
        
        </Grid>
      </div>
    </div>
  );
}


DashboardView.propTypes = {
  psthPartNo: PropTypes.object,
  handleMoldChange:PropTypes.func,
  dateProps:PropTypes.string
};
