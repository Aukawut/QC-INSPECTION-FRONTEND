import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';

import ExportToExcel from 'src/components/exportExcel/ExportExcel';

import DashboardView from 'src/sections/dashboard/view/dashboard-view';

import AppWidgetSummary from '../app-widget-summary';
import ic_glass_bag from '../../../assets/icons/glass/ic_glass_bag.png';
import ic_glass_users from '../../../assets/icons/glass/ic_glass_users.png';
import ic_glass_message from '../../../assets/icons/glass/ic_glass_message.png';
// ----------------------------------------------------------------------

export default function AppView() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [dataOverview, setDataOverview] = useState([]);
  const [allParts, setAllParts] = useState([]);
  const [psthPartNoProps, setPsthPartNoProps] = useState('');
  const [dateCalculate, setDateCalculate] = useState(new Date());

  const getAmountInSystem = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getAmountInSystem',
      })
      .then((res) => {
        setDataOverview(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL]);

  const handlePartChange = (event) => {
    setPsthPartNoProps(event.value);
    getRawDataByPartNo(event.value, dateCalculate.toJSON().slice(0, 10));
  };
  const [rawData, setRawData] = useState([]);
  const getRawDataByPartNo = useCallback(
    async (partno, date) => {
      await axios
        .post(`${baseURL}/backend_qc_inspection/api`, {
          router: 'getRawDataByPartNo',
          psthPartNo: partno,
          date: `${date} 23:59:00`,
        })
        .then((res) => {
          if (res.data.err) {
            console.log(res.data.msg);
          } else if (!res.data.err && res.data.status === 'Ok') {
            setRawData(res.data.result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [baseURL]
  );

  const getAllParts = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getAllParts',
      })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setAllParts(res.data.result);
          setPsthPartNoProps(res.data.result[0].BSNCR_PART_NO);
          getRawDataByPartNo(res.data.result[0].BSNCR_PART_NO, new Date().toJSON().slice(0, 10));
          console.log('res.data.result[0].BSNCR_PART_NO', res.data.result[0].BSNCR_PART_NO);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL, getRawDataByPartNo]);
  useEffect(() => {
    getAmountInSystem();
    getAllParts();
  }, [getAmountInSystem, getAllParts]);
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back to QC Inspection System 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="All Parts"
            total={parseInt(dataOverview[0]?.PART_ALL, 10)}
            color="success"
            icon={<img alt="icon" src={ic_glass_bag} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="All Users"
            total={parseInt(dataOverview[0]?.ALL_USERS, 10)}
            color="info"
            icon={<img alt="icon" src={ic_glass_users} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="All Data"
            total={dataOverview[0]?.All_Data}
            color="warning"
            icon={<img alt="icon" src={ic_glass_message} />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <Card>
            <CardHeader
              title={
                <div>
                  <i className="fa-solid fa-thumbtack text-[red] mr-2" />
                  {`Dashboard ${psthPartNoProps}`}
                </div>
              }
              subheader={`Showing Chart of Part ${psthPartNoProps}`}
            />

            <Box sx={{ p: 3, pb: 1 }}>
              <Box className="flex mb-2 gap-x-1">
                <Box className="w-[250px] flex items-center">
                  <FormControl>
                    <Select
                      className="w-[200px]"
                      onChange={handlePartChange}
                      placeholder="PSTH Part No"
                      styles={{
                        menu: (base) => ({
                          ...base,

                          zIndex: 9999,
                          fontSize: 13,
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          fontSize: 13,
                        }),
                      }}
                      options={allParts?.map((item) => ({
                        value: item.BSNCR_PART_NO,
                        label: item.BSNCR_PART_NO,
                      }))}
                      menuShouldScrollIntoView={false}
                    />
                  </FormControl>
                </Box>
                <FormControl>
                  <DatePicker
                    maxDate={new Date()}
                    onChange={(date) => {
                      getRawDataByPartNo(psthPartNoProps, date.toJSON().slice(0, 10));
                      setDateCalculate(date);
                    }}
                    dateFormat="dd MMMM yyyy"
                    selected={dateCalculate}
                    customInput={
                      <TextField
                        value={dateCalculate}
                        id="standard-basic"
                        label="Date"
                        sx={{
                          '.MuiInputBase-input': { fontSize: '14px' },
                        }}
                        placeholder="Select date"
                        size="small"
                        variant="outlined"
                      />
                    }
                  />
                </FormControl>
                <ExportToExcel data={rawData} fileName={psthPartNoProps} />
              </Box>

              <hr />
              <DashboardView psthPartNo={{ partNo: psthPartNoProps }} dateProps={dateCalculate} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
