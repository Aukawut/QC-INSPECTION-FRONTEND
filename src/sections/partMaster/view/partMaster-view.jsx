import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus } from 'react-icons/fa6';
import { IoIosRemove } from 'react-icons/io';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { ResultMenu } from 'src/_mock/menuResult';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import PartTableRow from '../part-table-row';
import PartTableHead from '../part-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../part-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('bsthPartNo');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [allPart, setAllPart] = useState([]);

  const [open, setOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [bsthPartNo, setBsthPartNo] = useState('');
  const [partName, setPartName] = useState('');
  const [customerPartNo, setCustomerPartNo] = useState('');
  const [model, setModel] = useState('');
  const [point, setPoint] = useState(1);
  const [checked, setChecked] = useState(true);
  const [isRender, setIsRender] = useState(false);
  const inputRefBsthPartNo = useRef(null);
  const inputUploadRef = useRef(null);
  const [file, setFile] = useState(null);
  // const [checkedAvg, setCheckAvg] = useState(false);
  const handleOpenFileInput = () => {
    inputUploadRef.current.click();
  };
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
  const render = () => {
    setIsRender((prev) => !prev);
  };
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: allPart,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const baseURL = import.meta.env.VITE_BASE_URL;

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
      if (value <= 150.00) {
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
  const covertString = (array) => {
    if (array.length > 0) {
      const flattenedArray = array.flatMap((pair) => pair.split('-').map(Number));
      const sortedArray = flattenedArray.sort((a, b) => a - b);
      const arrayAsString = sortedArray.join(',');
      return arrayAsString;
    }
    return '';
  };
  const resetForm = () => {
    setBsthPartNo('');
    setPartName('');
    setCustomerPartNo('');
    setCustomerName('');
    setModel('');
    setChecked(true);
    setPointCheck([
      {
        usl: '',
        lsl: '',
      },
    ]);
    setPoint(1);
    setListResult(ResultMenu);
    setFile(null);
  };

  const uploadFile = async (fileUpload, BsthPartNo) => {
    const formData = new FormData();
    formData.append('router', 'uploadFileImage');
    formData.append('file', fileUpload);
    formData.append('bsthPartNo', BsthPartNo);
    const response = await axios.post(`${baseURL}/backend_qc_inspection/api_formData`, formData);
    console.log(response.data);
  };
  const isValidFormat = (value) => {
  const regex = /^\d{2,3}\.\d{2}$/;
  return regex.test(value.trim());
};

  const handleSubmit = async () => {
    let errorUslFormat = 0;
    let errorLslFormat = 0;
    const idResultChecked = listResult
      ?.filter((x) => x.checked === true)
      ?.map((val) => val.id_result);

   
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
    });

    if (idResultChecked.length > 0) {
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
      } else {
        const payload = {
          router: 'addPart',
          bsthPartNo,
          partName,
          customerPartNo,
          customerName,
          model,
          justOn: checked ? 'X,Y' : 'AVG',
          resultCheck: covertString(idResultChecked),
          standardValue: pointCheck?.map((val, index) => ({
            point: index + 1,
            lsl: val.lsl,
            usl: val.usl,
          })),
        };

        await axios
          .post(`${baseURL}/backend_qc_inspection/api`, payload)
          .then((response) => {
            if (response.data.err) {
              Swal.fire({
                icon: 'error',
                title: response.data.msg,
              });
            } else if (!response.data.err && response.data.status === 'Ok') {
              // Upload file
              if (file !== null) {
                uploadFile(file, bsthPartNo);
              }
              resetForm();
              getAllPart();
              setOpen(false);

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
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือก Result',
      });
    }

    console.log(file);
  };

  const handleChange = (e) => {
    const englishRegex = /^[a-zA-Z0-9]*$/; // อนุญาตให้ใช้อักขระภาษาอังกฤษ (ตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก) และตัวเลข
    let newValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // แปลงอินพุตเป็นตัวพิมพ์ใหญ่และลบอักขระที่ไม่ใช่ตัวอักษรและตัวเลข
    // ตรวจสอบให้แน่ใจว่าความยาวอินพุตไม่เกิน 9 ตัวอักษร
    if (newValue.length > 9) {
      newValue = newValue.slice(0, 9);
    }
    // จัดรูปแบบอัตโนมัติเป็น xxxxxx-xxx หากมีความยาว 7 อักขระขึ้นไป
    let formattedValue = '';
    if (newValue.length >= 7) {
      formattedValue = `${newValue.slice(0, 6)}-${newValue.slice(6)}`;
    } else {
      formattedValue = newValue;
    }
    if (englishRegex.test(newValue)) {
      setBsthPartNo(formattedValue);
    } else {
      console.log('Only English characters are allowed.');
    }
  };

  useEffect(() => {
    getAllPart();
    setListResult(ResultMenu);
  }, [getAllPart, isRender]);
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Parts Master</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => {
            setOpen(true);
            setTimeout(() => {
              inputRefBsthPartNo.current.focus();
            }, 100);
          }}
        >
          New Part
        </Button>
      </Stack>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: '80%', height: '90%', overflow: 'hidden', overflowY: 'auto' }}>
          <h3 id="child-modal-title">Add Part and Setting standard</h3>
          <div className='h-[90%] overflow-auto'>
            <Grid container spacing={2} marginTop={2}>
              <Grid item xs={12} lg={5}>
                <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                    PSTH PartNo : {bsthPartNo}
                  </Typography>
                  <TextField
                    value={bsthPartNo}
                    inputRef={inputRefBsthPartNo}
                    onChange={handleChange}
                    size="small"
                    placeholder="PSTH PartNo"
                  />
                </FormControl>
                <FormControl sx={{ marginBottom: '0.5rem' }} fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 'bold', marginRight: '15px' }}>
                    Part Name :
                  </Typography>
                  <TextField
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
                              *หมายเหตุ 00.01 - 150.00 เท่านั้น
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
                <Grid container>
                  <Grid item xs={12} lg={12}>
                    <Box className="flex items-center gap-x-1 mt-[1rem]">
                      <Typography fontSize={12}>Upload File Image (.png, .jpg only) :</Typography>
                      <button
                        className="w-[2.5rem] cursor-pointer h-[2.5rem] border-2 flex justify-center items-center border-dashed"
                        onClick={handleOpenFileInput}
                        type="button"
                      >
                        <i className="fa-solid fa-plus text-blue-500 text-[12px]" />
                      </button>
                      <input
                        ref={inputUploadRef}
                        accept=".png, .jpg"
                        style={{ display: 'none' }}
                        multiple
                        type="file"
                        onChange={(e) => {
                          if (e.target.files[0].size / (1024 * 1024) > 2) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Error File size',
                              text: 'อนุญาตอัพโหลดไม่เกิน 2 Mb ต่อไฟล์',
                            });
                          } else if (
                            e.target.files[0].type !== 'image/jpeg' &&
                            e.target.files[0].type !== 'image/png'
                          ) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Error File type',
                              text: 'อนุญาตอัพโหลดไฟล์ .png .jpg เท่านั้น',
                            });
                          } else {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                      {file !== null ? (
                        <Typography fontSize={12} color="#0388fc">
                          {file.name}
                        </Typography>
                      ) : null}
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Typography fontSize={14} fontWeight="bold" marginTop="1rem">
                      Result :
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                      <table style={{ width: '100%' }}>
                        <tbody style={{ fontSize: 14 }}>
                          {ResultMenu.map((result, index) => (
                            <tr key={index}>
                              <td>
                                <Checkbox
                                  defaultChecked={listResult[index]?.checked}
                                  onChange={(e) => {
                                    handleCheckChange(e.target.checked, index);
                                  }}
                                  checked={listResult[index]?.checked}
                                />
                                {result.name_result}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                    <Box>
                      <div style={{ marginTop: 20 }}>
                        <div>
                          <Button variant="contained" onClick={handleSubmit}>
                            Submit
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
      <Card>
        <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <PartTableHead
                order={order}
                orderBy={orderBy}
                rowCount={allPart.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'image', label: 'Drawing' },
                  { id: 'bsthPartNo', label: 'Part No.' },
                  { id: 'partName', label: 'Part name' },
                  { id: 'customerName', label: 'Customer' },
                  { id: 'model', label: 'Model', align: 'center' },
                  { id: 'customerPartNo', label: 'Customer Part' },
                  { id: 'point', label: 'Point', align: 'center' },
                  { id: 'justOn', label: 'Judge' },
                  { id: '', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PartTableRow
                      key={row.Id}
                      bsthPartNo={row.BSNCR_PART_NO}
                      partName={row.PART_NAME}
                      customerName={row.CUSTOMER_NAME}
                      model={row.MODEL}
                      customerPartNo={row.CUSTOMER_PART_NO}
                      justOn={row.JUST_ON}
                      point={row.AMOUNT_POINT}
                      getAllPart={getAllPart}
                      render={render}
                      file={row.FILENAME}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, allPart.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={allPart.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
