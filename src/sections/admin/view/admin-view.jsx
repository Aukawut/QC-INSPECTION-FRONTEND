import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label/label';

import { useStoreQCInspection } from 'src/store/store';

export default function AdminView() {
  const params = useParams();
  const [psthPartNo, setPsthPartNo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mold, setMold] = useState('');
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [inspectionNg, setInspectionNg] = useState([]);
  const [standard, setStandard] = useState([]);
  const [inspectionNgByPoint, setInspectionNgByPoint] = useState([]);
  const [statusPart, setStatusPart] = useState([]);
  const [controlData, setControlData] = useState([]);
  const info = useStoreQCInspection((state) => state.info);
  const render = useStoreQCInspection((state) => state.render);
  const isChange = useStoreQCInspection((state) => state.isChange);
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
  const getXBarControlLine = useCallback(
    async (top, noMold, dateCheck, part,timeCheck) => {
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getXBarUCL',
          psthPartNo: part,
          n: 2,
          dateInspection: `${dateCheck} ${timeCheck}:00`,
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
  const getStandardByPart = useCallback(
    async (psthPartNoCheck) => {
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getStandardByPart',
          bsthPartNo: psthPartNoCheck,
        })
        .then((res) => {
          if (res.data.err) {
            console.log(res.data.msg);
            navigate('/404');
          } else if (!res.data.err && res.data.status === 'Ok') {
            setStandard(res.data.result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL, navigate]
  );
  console.log('standard', standard);
  const getInspectionPartByDatetime = useCallback(
    async (psthPartNoCheck, dateCheck, timeCheck, moldCheck) => {
      setLoading(true);
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
            navigate('/404');
          } else if (!res.data.err && res.data.status === 'Ok') {
            setInspectionNg(res.data.result);
            const splitArrays = splitArrayByPoint(res.data.result);
            setInspectionNgByPoint(splitArrays);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL, navigate, splitArrayByPoint]
  );
  console.log('inspectionNg', inspectionNg);
  console.log('psthPartNo', psthPartNo);
  console.log('inspectionNg', inspectionNg);

  const approveRecheck = async (psthPartNoParam, dateParam, timeParam, moldNoParam) => {
    const objPayload = {
      router: 'approveRecheck',
      psthPartNo: psthPartNoParam,
      date: dateParam,
      time: timeParam,
      mold: moldNoParam,
      approver: info?.LDAP_samaccountname,
    };
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, objPayload)
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          Swal.fire({
            icon: 'success',
            title: res.data.msg,
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            timer: 600,
          }).then(() => {
            render();
          });
        }
        navigate('');
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(objPayload);
  };

  const unApproveRecheck = async (psthPartNoParam, dateParam, timeParam, moldNoParam) => {
    const objPayload = {
      router: 'unApproveRecheck',
      psthPartNo: psthPartNoParam,
      date: dateParam,
      time: timeParam,
      mold: moldNoParam,
      approver: info?.LDAP_samaccountname,
    };
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, objPayload)
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          Swal.fire({
            icon: 'success',
            title: res.data.msg,
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            timer: 600,
          }).then(() => {
            render();
          });
        }
        navigate('');
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(objPayload);
  };
  const acceptNG = async (psthPartNoParam, dateParam, timeParam, moldNoParam) => {
    const objPayload = {
      router: 'acceptNG',
      psthPartNo: psthPartNoParam,
      date: dateParam,
      time: timeParam,
      mold: moldNoParam,
      approver: info?.LDAP_samaccountname,
    };
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, objPayload)
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          Swal.fire({
            icon: 'success',
            title: res.data.msg,
            showCancelButton: false,
            showCloseButton: false,
            showConfirmButton: false,
            timer: 600,
          }).then(() => {
            render();
            setStatusPart([]);
          });
        }
        navigate('');
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(objPayload);
  };
  console.log(statusPart);
  const CheckInspectionNGStatus = useCallback(
    async (psthPartNoCheck, dateCheck, timeCheck, moldCheck) => {
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'CheckInspectionNGStatus',
          psthPartNo: psthPartNoCheck,
          date: dateCheck,
          time: timeCheck,
          mold: moldCheck,
        })
        .then((res) => {
          if (res.data.err) {
            console.log(res.data.msg);
          } else if (!res.data.err && res.data.status === 'Ok') {
            setStatusPart(res.data.result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL]
  );

  useEffect(() => {
    const { query } = params; // อ่านค่า Params บน URL
    const partNoParam = params.query?.split('&')[0]; // แยก Params ด้วย '&'
    const dateParam = params.query?.split('&')[1];
    const timeParam = params.query?.split('&')[2];
    const moldParam = params.query?.split('&')[3];
    setPsthPartNo(partNoParam);
    setDate(dateParam);
    setTime(timeParam);
    setMold(moldParam);
    console.log('query', query);
    // console.log(params);
    getInspectionPartByDatetime(partNoParam, dateParam, timeParam, moldParam); // Function Query Data บน Database
    CheckInspectionNGStatus(partNoParam, dateParam, timeParam, moldParam); // Function Check Status Approve
    getXBarControlLine(100, moldParam, dateParam, partNoParam,timeParam);
    getStandardByPart(partNoParam);
  }, [
    params,
    getInspectionPartByDatetime,
    getStandardByPart,
    date,
    time,
    mold,
    CheckInspectionNGStatus,
    isChange,
    getXBarControlLine,
  ]);
  return (
    <motion.Box
      padding={1}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 100,
        y: 0,
      }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
    >
      <Box>
        <div className="flex gap-x-2 items-center">
          <Typography fontWeight="bold">
            {psthPartNo} #{mold}
          </Typography>
          <Label color="primary">{standard[0]?.JUST_ON}</Label>
        </div>
        <i className="fa-regular fa-clock mr-2" />
        <Typography variant="caption" fontSize={14} marginRight={1}>
          {date}
        </Typography>
        <Typography variant="caption" fontSize={14}>
          รอบเวลา {time} น.
        </Typography>
      </Box>
      <Box>
        <i className="fa-regular fa-user" /> {inspectionNg[0]?.INSPECTOR}
      </Box>

      <div>
        {!Array.isArray(statusPart) ? (
          <Box className="my-2 flex justify-start gap-x-1">
            {statusPart?.ACCEPT === 'N' ? (
              <Box className="flex justify-start gap-x-1">
                {statusPart?.APPROVAL_STATUS === 'Waiting Approve' ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: 'คุณต้องการอนุมัติเพื่อ Re Check!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, I want!',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          approveRecheck(psthPartNo, date, time, mold);
                        }
                      });
                    }}
                  >
                    Re-check
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: 'คุณต้องการยกเลิกอนุมัติเพื่อ Re Check!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, I want!',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          unApproveRecheck(psthPartNo, date, time, mold);
                        }
                      });
                    }}
                  >
                    Un Approve
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => {
                    Swal.fire({
                      title: 'Are you sure?',
                      text: 'คุณต้องการยอมรับงาน NG!',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, I want!',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        acceptNG(psthPartNo, date, time, mold);
                      }
                    });
                  }}
                >
                  Accept NG
                </Button>
              </Box>
            ) : (
              <Label color="success">{statusPart?.APPROVAL_STATUS}</Label>
            )}
          </Box>
        ) : (
          <Box>..</Box>
        )}
      </div>

      {loading ? (
        <div>Loading ...</div>
      ) : (
        <div className="text-[1rem] relative overflow-x-auto mt-[1rem] grid grid-cols-2 gap-x-2">
          {inspectionNgByPoint?.map((item, index) => {
            const table = item?.filter((val) => parseInt(val.POINT_NO, 10) === index + 1);
            const simple1 = table?.filter((val) => parseInt(val.SIMPLE, 10) === 1);
            const simple2 = table?.filter((val) => parseInt(val.SIMPLE, 10) === 2);
            let avgSample1 = 0;
            let avgSample2 = 0;
            return (
              <div key={index}>
                <div key={index}>
                  <Typography fontSize={12}>
                    <i className="fa-solid fa-angles-right text-[red] mr-2" />
                    Point No. {index + 1}
                  </Typography>
                  <Typography fontSize={12}>
                    SPEC : {`${standard[index]?.LSL} - ${standard[index]?.USL}`} mm
                  </Typography>
                  <Typography fontSize={12}>
                    Control Chart : {`${controlData[index]?.LCL} - ${controlData[index]?.UCL}`} mm
                  </Typography>
                  <Typography fontSize={12}>
                   * คำนวณจาก Data ของวันที่ {date} {time} Last 100 Data
                  </Typography>
                </div>
                <table className="border-2 mt-[1rem] w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-center">
                        No.
                      </th>
                      <th scope="col" className="px-5 py-4 text-center">
                        Direction
                      </th>

                      <th scope="col" className="px-5 py-4 text-center">
                        Sample 1
                      </th>
                      <th scope="col" className="px-5 py-4 text-center">
                        Sample 2
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {simple1?.map((val, i) => {
                      avgSample1 += parseFloat(simple1[i].INSPECTION_VALUE);
                      avgSample2 += parseFloat(simple2[i].INSPECTION_VALUE);
                      return (
                        <tr key={i}>
                          <td className="p-2 text-center">{i + 1}</td>
                          <td className="p-2 text-center">{val.NAME_RESULT}</td>
                          <td
                            className={`p-2 text-center ${
                              (standard[index]?.JUST_ON === 'X,Y' &&
                                parseFloat(simple1[i]?.INSPECTION_VALUE) >
                                  parseFloat(controlData[index]?.UCL)) ||
                              (standard[index]?.JUST_ON === 'X,Y' &&
                                parseFloat(simple1[i]?.INSPECTION_VALUE) <
                                  parseFloat(controlData[index]?.LCL))
                                ? 'text-red-400'
                                : ''
                            }`}
                          >
                            {simple1[i]?.INSPECTION_VALUE}
                          </td>
                          <td
                            className={`p-2 text-center ${
                              (standard[index]?.JUST_ON === 'X,Y' &&
                                parseFloat(simple2[i]?.INSPECTION_VALUE) >
                                  parseFloat(controlData[index]?.UCL)) ||
                              (standard[index]?.JUST_ON === 'X,Y' &&
                                parseFloat(simple2[i]?.INSPECTION_VALUE) <
                                  parseFloat(controlData[index]?.LCL))
                                ? 'text-red-400'
                                : ''
                            }`}
                          >
                            {simple2[i]?.INSPECTION_VALUE}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className="p-2 text-center" colSpan={2}>
                        <Typography fontSize={15} fontWeight="bold">
                          AVG
                        </Typography>
                      </td>

                      <td
                        className={`p-2 text-center bg-slate-200 font-bold ${
                          ((avgSample1 / simple1.length).toFixed(2) < controlData[index]?.LCL &&
                            standard[0]?.JUST_ON === 'AVG') ||
                          ((avgSample1 / simple1.length).toFixed(2) > controlData[index]?.UCL &&
                            standard[0]?.JUST_ON === 'etStatusAVG')
                            ? 'text-[red]'
                            : ''
                        }`}
                      >
                        {simple1 && simple1.length > 0
                          ? (avgSample1 / simple1.length).toFixed(2)
                          : '...'}
                      </td>
                      <td
                        className={`p-2 text-center bg-slate-200 font-bold ${
                          ((avgSample2 / simple2.length).toFixed(2) < controlData[index]?.LCL &&
                            standard[0]?.JUST_ON === 'AVG') ||
                          ((avgSample2 / simple2.length).toFixed(2) > controlData[index]?.UCL &&
                            standard[0]?.JUST_ON === 'AVG')
                            ? 'text-[red]'
                            : ''
                        }`}
                      >
                        {simple2 && simple2.length > 0
                          ? (avgSample2 / simple2.length).toFixed(2)
                          : '...'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </motion.Box>
  );
}
