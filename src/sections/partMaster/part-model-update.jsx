import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa6';
import { IoIosRemove } from 'react-icons/io';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

// import { ResultMenu } from 'src/_mock/menuResult';

export default function ModalUpdatePart({ isOpen, onClose, oldStandard, images, render }) {
  const handleClose = () => {
    onClose(false); // Call onClose to close the modal
  };

  console.log('oldStandard', oldStandard);
  const style = {
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

  const [customerName, setCustomerName] = useState('');
  const [bsthPartNo, setBsthPartNo] = useState('');
  const [partName, setPartName] = useState('');
  const [customerPartNo, setCustomerPartNo] = useState('');
  const [model, setModel] = useState('');
  const [point, setPoint] = useState(1);
  const [checked, setChecked] = useState(true);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [allPart, setAllPart] = useState([]);

  console.log('oldStandard', oldStandard);

  const getAllPart = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getAllParts',
      })
      .then((res) => {
        if (res.data.err) {
          setAllPart([]);
        } else if (!res.data.err && res.data.status === 'Ok') {
          console.log(res.data.result);
          setAllPart(res.data.result);
        }
      });
  }, [baseURL]);

  const [pointCheck, setPointCheck] = useState([
    {
      usl: '',
      lsl: '',
    },
  ]);
  const handleUpdatePointCheck = (index, pointValue, value) => {
    if (parseFloat(value) !== 0) {
      const floatRegex = /^\d*\.?\d{0,2}$/;
      if (!floatRegex.test(value)) {
        console.error('Invalid input. Please enter a valid float with up to 2 decimal places.');
        return; // Exit the function if input is invalid
      }
      console.log(value.length);
      if (value < 100) {
        setPointCheck((prevPoint) => {
          // Make a copy of the previous state
          const updatedPointCheck = [...prevPoint];

          // Update the value based on pointValue and index
          if (pointValue === 'usl') {
            updatedPointCheck[index] = {
              ...updatedPointCheck[index],
              usl: value,
            };
          } else if (pointValue === 'lsl') {
            updatedPointCheck[index] = {
              ...updatedPointCheck[index],
              lsl: value,
            };
          }
          // Return the updated state
          return updatedPointCheck;
        });
      }
    }
  };

  console.log(oldStandard);
  console.log(pointCheck);
  console.log(allPart);
  const [listResult, setListResult] = useState([]);
  const handleCheckChange = (value, index) => {
    const prev = [...listResult];
    prev[index] = {
      ...prev[index],
      checked: value,
    };
    setListResult(prev);
  };

const isValidFormat = (value) => {
  const regex = /^\d{2,3}\.\d{2}$/;
  return regex.test(value.trim());
};
    
  const handleUpdateSubmit = async () => {
    let errorUslFormat = 0;
    let errorLslFormat = 0;
    let errorLessFormat = 0;

   
    pointCheck.forEach((obj) => {
      // Check 'usl' value
      if (isValidFormat(obj.usl)) {
        console.log('OK');
      } else {
        errorUslFormat += 1;
      }
      // Check 'lsl' value
      if (isValidFormat(obj.lsl)) {
        console.log('OK');
      } else {
        errorLslFormat += 1;
      }
      if (obj.lsl > obj.usl) {
        errorLessFormat += 1;
      }
    });

    if (errorLslFormat !== 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid format LSL',
        text: 'Format ข้อมูล LSL ไม่ถูกต้อง',
      });
    } else if (errorUslFormat !== 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid format USL',
        text: 'Format ข้อมูล USL ไม่ถูกต้อง',
      });
    } else if (errorLessFormat !== 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Value',
        text: 'USL ต้องมากกว่า LSL เท่านั้น',
      });
    } else {
      const payload = {
        router: 'updatePart',
        bsthPartNo,
        partName,
        customerPartNo,
        customerName,
        model,
        justOn: checked ? 'X,Y' : 'AVG',
        standardValue: pointCheck?.map((val, index) => ({
          point: index + 1,
          lsl: val.lsl,
          usl: val.usl,
        })),
      };
      axios
        .post(`${baseURL}/backend_qc_inspection/api`, payload)
        .then((response) => {
          console.log(response.data);
          if (response.data.err) {
            Swal.fire({
              icon: 'error',
              title: response.data.msg,
            });
          } else if (!response.data.err && response.data.status === 'Ok') {
            handleClose();
            getAllPart();
            render();
            Swal.fire({
              icon: 'success',
              title: response.data.msg,
              showCancelButton: false,
              showConfirmButton: false,
              timer: 700,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(payload);
      console.log(listResult);
    }
  };
  console.log('pointCheck', pointCheck);

  useEffect(() => {
    // เรียกใช้งาน Function ดึงข้อมูล Part Master
    getAllPart();

    if (oldStandard && oldStandard[0]?.AMOUNT_POINT !== undefined) {
      // แปลงข้อมูลให้เป็น Int เพื่อให้ Render Loop Input Part Standard
      setPoint(parseInt(oldStandard[0].AMOUNT_POINT, 10));
    }
    setCustomerName(oldStandard[0]?.CUSTOMER_NAME);
    setBsthPartNo(oldStandard[0]?.BSNCR_PART_NO);
    setPartName(oldStandard[0]?.PART_NAME);
    setCustomerPartNo(oldStandard[0]?.CUSTOMER_PART_NO);
    setModel(oldStandard[0]?.MODEL);
    setChecked(oldStandard[0]?.JUST_ON === 'X,Y');

    const newArray = oldStandard?.map((val) => ({
      usl: parseFloat(val.USL).toFixed(2),
      lsl: parseFloat(val.LSL).toFixed(2),
    }));
    // ลบข้อมูลที่ซ้ำที่ Query มาจาก View ที่ทำไว้
    const uniqueData = Array.from(new Set(newArray?.map(JSON.stringify)))?.map(JSON.parse);
    const newArrayResult = oldStandard?.map((val) => val.NAME_RESULT);
    const uniqueDataResult = [...new Set(newArrayResult)];
    setListResult(uniqueDataResult);
    setPointCheck(uniqueData);
  }, [getAllPart, oldStandard]);
  return (
    // Modal Update
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{ ...style, width: '80%', height: '90%', overflow: 'hidden', overflowY: 'auto' }}>
        <div className="w-[100%] flex justify-end absolute top-[1rem] right-[1rem]">
          <button
            type="button"
            className="fa-solid fa-xmark text-[18px] text-red-500 cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <h3>Update Standard Part</h3>
        <div className='h-[90%] overflow-auto'>
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={12} lg={5}>
              <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                  PSTH Part No :
                </Typography>
                <TextField
                  disabled
                  value={bsthPartNo}
                  onChange={(e) => {
                    setBsthPartNo(e.target.value);
                  }}
                  size="small"
                  placeholder="BSTH PartNo"
                />
              </FormControl>
              <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                  Part Name :
                </Typography>
                <TextField
                  disabled
                  value={partName}
                  onChange={(e) => {
                    setPartName(e.target.value);
                  }}
                  size="small"
                  placeholder="Part name"
                />
              </FormControl>
              <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                  Model :
                </Typography>
                <TextField
                  disabled
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                  }}
                  size="small"
                  placeholder="Model"
                />
              </FormControl>
              <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                  Customer :
                </Typography>
                <TextField
                  disabled
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                  }}
                  size="small"
                  placeholder="Customer"
                />
              </FormControl>

              <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                  Customer Part No :
                </Typography>
                <TextField
                  disabled
                  fullWidth
                  value={customerPartNo}
                  onChange={(e) => {
                    setCustomerPartNo(e.target.value);
                  }}
                  size="small"
                  placeholder="Customer Part No"
                />
              </FormControl>
              <div>
                <FormControl sx={{ marginBottom: '0.5rem' }}>
                  <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                    Just : {checked ? 'X,Y' : 'Avg'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        value="X,Y"
                        checked={checked}
                        onChange={(e) => {
                          if (!checked) {
                            setChecked(e.target.checked);
                          }
                        }}
                      />
                      <Typography>X,Y</Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        value="AVG"
                        checked={!checked}
                        onChange={(e) => {
                          setChecked(false);
                        }}
                      />
                      <Typography>AVG</Typography>
                    </div>
                  </Box>
                </FormControl>
              </div>
              <div>
                <FormControl>
                  <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px',marginBottom:1 }}>
                    Drawing
                  </Typography>
                  {Array.isArray(images) && images.length > 0 ? (
                    images?.map((val) => (
                      <a
                        href={`${baseURL}/backend_qc_inspection/uploads/drawing/${val.FILENAME}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="rounded-lg h-[5rem] w-[8rem] border-[1.5px] flex justify-center items-center overflow-hidden">
                          <img
                            className="object-cover w-[auto] h-[100%]"
                            alt={val.FILENAME}
                            src={`${baseURL}/backend_qc_inspection/uploads/drawing/${val.FILENAME}`}
                          />
                        </div>
                      </a>
                    ))
                  ) : (
                    <Typography color="red" fontSize={12}>
                      ไม่ได้อัพโหลด Drawing
                    </Typography>
                  )}
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} lg={7}>
              <FormControl sx={{ marginBottom: '0.5rem' }}>
                <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                  Number of check points :
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0px 10px' }}>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setPoint((prev) => (prev !== 1 ? prev - 1 : 1));
                      if (point !== 1) {
                        setPointCheck((prev) => prev.slice(0, -1));
                      }
                    }}
                  >
                    <IoIosRemove fontSize={20} />
                  </Button>
                  <Typography fontWeight="bold">{point}</Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      setPoint((prev) => (prev < 4 ? prev + 1 : 4));
                      setPointCheck((prev) =>
                        point < 4
                          ? [
                              ...prev,
                              {
                                usl: '',
                                lsl: '',
                              },
                            ]
                          : prev
                      );
                    }}
                  >
                    <FaPlus fontSize={17} />
                  </Button>
                </div>
              </FormControl>
              <Grid container spacing={2}>
                {/* Loop Input ตาม Point ที่เคยตั้งค่าเอาไว้ */}
                {new Array(point).fill('').map((val, index) => {
                  const a = 10;
                  const uslValue = pointCheck[index]?.usl;
                  const isError = uslValue !== undefined && isValidFormat(uslValue) === false;
                  const lslValue = pointCheck[index]?.lsl;
                  const isErrorLsl = lslValue !== undefined && isValidFormat(lslValue) === false;
                  console.log(a);
                  return (
                    <Grid item xs={12} lg={6} key={index}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex' }}>
                            <Typography fontSize={14} marginBottom={1}>
                              Point Check No. {index + 1}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: '0px 5px' }}>
                            <div>
                              <Typography fontSize={11} marginLeft={1}>
                                LSL Point {index + 1}
                              </Typography>
                              <TextField
                                size="small"
                                sx={{ width: 100 }}
                                placeholder={`LSL ${index + 1}`}
                                value={pointCheck[index]?.lsl}
                                onChange={(e) => {
                                  handleUpdatePointCheck(index, 'lsl', e.target.value);
                                }}
                                error={isErrorLsl}
                              />
                            </div>
                            <div>
                              <Typography fontSize={11} marginLeft={1}>
                                USL Point {index + 1}
                              </Typography>
                              <TextField
                                size="small"
                                sx={{ width: 100 }}
                                placeholder={`USL ${index + 1}`}
                                value={pointCheck[index]?.usl}
                                error={isError}
                                onChange={(e) => {
                                  handleUpdatePointCheck(index, 'usl', e.target.value);
                                }}
                              />
                            </div>
                          </Box>
                          <Typography color="red" fontSize={12} marginTop={1}>
                            *หมายเหตุ 00.01 - 99.99 เท่านั้น
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              <Grid container>
                <Grid item xs={12} lg={12}>
                  <div className="flex items-start mt-[1rem] gap-x-2">
                    <Typography fontSize={14} fontWeight="bold">
                      Result :
                    </Typography>
                    <Typography fontSize={12} color="red">
                      * Result ไม่สามารถแก้ไขได้
                    </Typography>
                  </div>
                  <Box sx={{ display: 'flex' }}>
                    <table style={{ width: '100%' }}>
                      <tbody style={{ fontSize: 14 }}>
                        {listResult?.map((result, index) => (
                          <tr key={index}>
                            <td>
                              <Checkbox
                                checked
                                disabled
                                onChange={(e) => {
                                  handleCheckChange(e.target.checked, index);
                                }}
                                // checked={listResult[index]?.checked}
                              />
                              {result}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                  <Box>
                    <div style={{ marginTop: 20 }}>
                      <div>
                        <Button variant="contained" onClick={handleUpdateSubmit}>
                          Update
                        </Button>
                      </div>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
    // End Modal Update
  );
}
// กำหนด data type เพื่อรับ Props จาก Component อื่น ๆ
ModalUpdatePart.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  oldStandard: PropTypes.array,
  images: PropTypes.array,
  render: PropTypes.func,
};
