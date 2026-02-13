import axios from 'axios';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';

import Label from 'src/components/label';
import EditInspection from 'src/components/editInspection/EditInspection';

import { useStoreQCInspection } from 'src/store/store';

import { optionsTable } from './utils';
import ModalDetailHistory from './modal-show-history';

const customTheme = createTheme({
  typography: {
    fontFamily: 'Prompt, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // Remove boxShadow
          borderRadius: '15px',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px',
          textAlign: 'center',
        },
      },
    },
  },
});
export default function HistoryNG() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [psthPartNo, setPsthPartNo] = useState({});
  const [objHistory, setObjHistory] = useState({});
  const [inspectionNg, setInspectionNg] = useState([]);
  const [inspectionNgByPoint, setInspectionNgByPoint] = useState([]);
  const [propsObjHistory, setPropsObjHistory] = useState({});
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [controlData, setControlData] = useState([]);
  const [standardPart, setStandardPart] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  console.log(psthPartNo);

  const findHistory = (row) => {
    const obj = history.find((x) => x.NO === row);
    setObjHistory(obj);
  };
  const handleCloseModalHistory = () => {
    setShowModalHistory(false);
  };
  const handleOpenModalHistory = () => {
    setShowModalHistory(true);
  };
  const getHistory = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getInspectionNG',
      })
      .then((res) => {
        // รับ Response จาก API
        setLoading(true); // State Loading เป็น True
        if (res.data.err && res.data.msg !== 'Not Found!') {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setHistory(res.data.result);
          console.log("History",res.data.result);
          setLoading(false); // State Loading เป็น False
        } else if (res.data.err && res.data.msg === 'Not Found!') {
          setLoading(false);
          setHistory([])
        } else {
          setHistory([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL]);
  console.log(history);

  const splitArrayByPoint = useCallback((array) => {
    const result = {};
    array.forEach((obj) => {
      if (!result[obj.POINT_NO]) {
        result[obj.POINT_NO] = [];
      }
      result[obj.POINT_NO].push(obj);
    });

    // Convert object to array of arrays and sort by point in ascending order
    return Object.values(result).sort((a, b) => a[0].point - b[0].point);
  }, []);
  const getInspectionPartByDatetime = async (psthPartNoCheck, dateCheck, timeCheck, moldCheck) => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getInspectionPartByDatetime',
        psthPartNo: psthPartNoCheck,
        date: dateCheck,
        time: timeCheck,
        mold: moldCheck,
      })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setInspectionNg(res.data.result);
          const splitArrays = splitArrayByPoint(res.data.result);
          setInspectionNgByPoint(splitArrays);
          setTimeout(() => {
            handleOpenModalHistory(); // Open Modal
          }, 300);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [oldCavityList, setOldCavityList] = useState([]);
  const getListCavity = async (psthPartNoCheck, dateCheck, timeCheck, moldCheck) => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getListCavity',
        psthPartNo: psthPartNoCheck,
        date: dateCheck,
        time: timeCheck,
        mold: moldCheck,
      })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setOldCavityList(res.data.result);
          setTimeout(() => {
            console.log(objHistory);
            setOpenModal(true);
          }, 200);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getStandardByPart = async (psthPartNoCheck) => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getStandardByPart',
        bsthPartNo: psthPartNoCheck,
      })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setStandardPart(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log('inspectionNg', inspectionNg);
  console.log('inspectionNgByPoint', inspectionNgByPoint);
  const columns = [
    {
      name: 'NO',
      label: 'Row #',
    },
    {
      name: 'BSNCR_PART_NO',
      label: 'PSTH Part No',
    },
    {
      name: 'LOT_NO',
      label: 'LOT_NO',
    },
    {
      name: 'DATE',
      label: 'Date',
    },
    {
      name: 'MOLD_NO',
      label: 'MOLD_NO',
    },
    {
      name: 'TIME',
      label: 'Time',
      options: {
        customBodyRender: (value, tableMeta) => (
          <Label color="primary">{tableMeta.rowData[5]}</Label>
        ),
      },
    },
    {
      name: 'NG',
      label: 'Result',
      options: {
        customBodyRender: (value, tableMeta) => (
          <Label color={(parseInt(tableMeta.rowData[6], 10) > 0 && 'error') || 'success'}>
            {parseInt(tableMeta.rowData[6], 10) > 0 ? 'NG' : 'FG'}
          </Label>
        ),
      },
    },
    {
      name: 'INSPECTOR',
      label: 'Inspector',
    },
    {
      name: 'action',
      label: 'Action',

      options: {
        customBodyRender: (value, tableMeta) =>
          tableMeta.rowData[9] === 'Y' && tableMeta.rowData[10] ? (
            <Button
              type="button"
              style={{ cursor: 'pointer' }}
              size="small"
              variant="outlined"
              onClick={() => {
                const part = tableMeta.rowData[1];
                const date = tableMeta.rowData[3];
                const mold = tableMeta.rowData[4];
                const time = tableMeta.rowData[5];
                setPsthPartNo({
                  partNo: tableMeta.rowData[1],
                });

                findHistory(tableMeta.rowData[0]);
                getListCavity(part, date, time, mold);
              }}
            >
              <i className="fa-solid fa-arrows-rotate mr-2" /> Re check
            </Button>
          ) : (
            <Button
              type="button"
              style={{ cursor: 'pointer' }}
              size="small"
              variant="outlined"
              onClick={() => {
                const part = tableMeta.rowData[1];
                const date = tableMeta.rowData[3];
                const mold = tableMeta.rowData[4];
                const time = tableMeta.rowData[5];
                const obj = {
                  psthPartNo: part,
                  dateProps: date,
                  moldProps: mold,
                  timeProps: time,
                };
                setPropsObjHistory(obj);
                getInspectionPartByDatetime(part, date, time, mold);
                getStandardByPart(part);
                getXBarControlLine(100, mold, date, part,time);
              }}
            >
              <i className="fa-regular fa-eye mr-2" /> View
            </Button>
          ),
      },
    },
    {
      name: 'APPROVE',
      label: 'APPROVE',
      options: {
        display: false,
      },
    },
    {
      name: 'WAIT_REINSPECTION',
      label: 'WAIT_REINSPECTION',
      options: {
        display: false,
      },
    },
  ];
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '4px',
    boxShadow: 'rgba(158, 199, 243, 0.65) 0 0 15px 2px',
    pt: 2,
    px: 4,
    pb: 3,
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const isChange = useStoreQCInspection((state) => state.isChange)
  const getXBarControlLine = useCallback(
    async (top, noMold, date, part,time) => {

      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getXBarUCL',
          psthPartNo: part,
          n: 2,
          dateInspection: `${date} ${time}:00`,
          MoldNo: noMold,
          top,
        })
        .then((res) => {
          if (res.data.err && res.data.msg !== 'Not Found!') {
            setControlData([]);
          } else if (!res.data.err && res.data.status === 'Ok') {
            setControlData(res.data.result);
          } else if (res.data.err && res.data.msg === 'Not Found!') {
            Swal.fire({
              icon: 'warning',
              title: 'Not Found!',
              text: 'ไม่พบ Data ที่จะคำนวณ UCL LCL',
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL]
  );
  useEffect(() => {
    getHistory(); // ดึงข้อมูลประวัติการตรวจ
  }, [getHistory,isChange]);

  return (
    <div>
      <ModalDetailHistory
        inspectionNg={inspectionNg}
        inspectionNgByPoint={inspectionNgByPoint}
        objHistory={propsObjHistory}
        isOpen={showModalHistory}
        handleClose={handleCloseModalHistory}
        style={style}
        standard={standardPart}
        controlData={controlData}
      />

      <Typography variant="h4">History</Typography>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Fade in={openModal} timeout={300}>
          <Box sx={{ ...style }} width="100%" height="100%">
            <div className="flex justify-between">
              <h4 className="font-bold">
                <i className="fa-solid fa-arrows-rotate mr-2" />
                Re Check Data
              </h4>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                <i className="fa-solid fa-xmark mr-1" />
                Close
              </Button>
            </div>
            <div className="mt-[1rem]">
              <EditInspection
                psthPartNo={psthPartNo}
                obj={objHistory}
                handleCloseModal={handleCloseModal}
                oldCavityList={oldCavityList}
              />
            </div>
          </Box>
        </Fade>
      </Modal>

      {loading ? (
        <p>Loading ...</p>
      ) : (
        <ThemeProvider theme={customTheme}>
          <MUIDataTable options={optionsTable} columns={columns} data={history} />
        </ThemeProvider>
      )}
    </div>
  );
}
