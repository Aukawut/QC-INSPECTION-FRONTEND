import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';

import HistoryFG from '../history-fg';
import HistoryNG from '../history-ng';

export default function HistoryView() {
  const param = useParams();
  const navigate = useNavigate();
 
  console.log('param', param.tab);
  function checkString(string) {
    return /^[0-9]*$/.test(string);
  }
  const handleChange = (event, newValue) => {
    navigate(`/history/${newValue}`);
  };
  useEffect(() => {
    if (parseInt(param.tab, 10) > 2) {
      navigate(`/history/1`);
    } else if (!checkString(parseInt(param.tab, 10))) {
      navigate(`/history/1`);
    }
  }, [navigate, param.tab]);
  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={param.tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Inspection FG" value="1" />
              <Tab label="Inspection NG" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <HistoryFG />
          </TabPanel>
          <TabPanel value="2">
            <HistoryNG  />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
