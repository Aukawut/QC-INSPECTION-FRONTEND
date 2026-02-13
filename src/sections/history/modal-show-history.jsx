import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

export default function ModalDetailHistory({
  inspectionNgByPoint,
  inspectionNg,
  handleClose,
  isOpen,
  objHistory,
  style,
  standard,
  controlData,
}) {
  useEffect(() => {
    console.log('modalinspectionNgByPoint', inspectionNgByPoint);
    console.log('Ok is Mouse!');
    console.log('Ok is Mouse!', controlData);
  }, [inspectionNgByPoint, inspectionNg, controlData]);

  return (
    <div>
      <Modal open={isOpen} onClose={handleClose}>
        <Fade in={isOpen} timeout={300}>
          <Box sx={{ ...style }} width="80%" height="90%">
            <div className="flex justify-between items-center">
              <Typography>
                <i className="fa-solid fa-clock-rotate-left mr-2" />
                History
              </Typography>
              <Button variant="outlined" size="small" color="error" onClick={handleClose}>
                <i className="fa-solid fa-xmark mr-2" />
                Close
              </Button>
            </div>
            <Box padding={1} height="80%" width="100%" overflow="auto" marginTop={2}>
              <Box>
                <div className="flex gap-x-2 items-center">
                  <Typography fontWeight="bold">
                    {objHistory.psthPartNo} #{objHistory.moldProps}
                  </Typography>
                  <Label color="primary">{standard[0]?.JUST_ON}</Label>
                </div>
                <i className="fa-regular fa-clock mr-2" />
                <Typography variant="caption" fontSize={14} marginRight={1}>
                  {objHistory.dateProps}
                </Typography>
                <Typography variant="caption" fontSize={14}>
                  รอบเวลา {objHistory.timeProps} น.
                </Typography>
              </Box>
              <Box>
                <i className="fa-regular fa-user" /> {inspectionNg[0]?.INSPECTOR}
              </Box>

              <div className="text-[1rem] relative overflow-x-auto mt-[1rem] grid grid-cols-1 sm:grid-cols-2 gap-x-2">
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
                          Control Chart: {`${controlData[index]?.LCL} - ${controlData[index]?.UCL}`}{' '}
                          mm
                        </Typography>
                        <Typography fontSize={12}>
                          * UCL,LCL คำนวณจาก : {`${objHistory.dateProps} ${objHistory.timeProps}`}{' '}
                          Last 100 Data
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
                                ((avgSample1 / simple1.length).toFixed(2) <
                                  controlData[index]?.LCL &&
                                  standard[0]?.JUST_ON === 'AVG') ||
                                ((avgSample1 / simple1.length).toFixed(2) >
                                  controlData[index]?.UCL &&
                                  standard[0]?.JUST_ON === 'AVG')
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
                                ((avgSample2 / simple2.length).toFixed(2) <
                                  controlData[index]?.LCL &&
                                  standard[0]?.JUST_ON === 'AVG') ||
                                ((avgSample2 / simple2.length).toFixed(2) >
                                  controlData[index]?.UCL &&
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
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
ModalDetailHistory.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  objHistory: PropTypes.object,
  inspectionNg: PropTypes.array,
  inspectionNgByPoint: PropTypes.array,
  standard: PropTypes.array,
  style: PropTypes.object,
  controlData: PropTypes.any,
};
