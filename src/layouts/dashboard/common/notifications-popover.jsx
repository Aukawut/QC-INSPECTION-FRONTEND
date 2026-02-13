import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
// import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useStoreQCInspection } from 'src/store/store';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [inspectionNg, setInspectionNg] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  const isChange = useStoreQCInspection((state) => state.isChange);
  const getInspectionNG = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getInspectionNG',
      })
      .then((res) => {
        if (res.data.err && res.data.msg !== 'Not Found!') {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setInspectionNg(res.data.result);
        } else if (res.data.err && res.data.msg === 'Not Found!') {
          setInspectionNg([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL]);

  const totalUnRead = inspectionNg.length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  console.log(inspectionNg);
  useEffect(() => {
    getInspectionNG();
  }, [getInspectionNG, isChange]);
  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} items
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline',textTransform:"none" }}>
                Over Control Notify
              </ListSubheader>
            }
          >
            {inspectionNg?.length > 0 ? (
              inspectionNg?.map((notification) => (
                <NotificationItem
                  key={notification.NO}
                  notification={notification}
                  baseURL={baseURL}
                  handleClose={handleClose}
                />
              ))
            ) : (
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline', color: 'green' }}
              >
                Not found NOTIFY!
              </ListSubheader>
            )}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    BSNCR_PART_NO: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
    DATE: PropTypes.string,
    TIME: PropTypes.string,
    APPROVAL_STATUS: PropTypes.string,
    MOLD_NO: PropTypes.string,
  }),
  handleClose: PropTypes.func,
};

function NotificationItem({ notification, handleClose }) {
  const navigate = useNavigate();
  const info = useStoreQCInspection((state) => state.info);
  const redirectApprove = (partNo, date, time, mold) => {
    navigate(`/admin/approve/${partNo}&${date}&${time}&${mold}`);
  };
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
      }}
      onClick={() => {
        if (info?.ROLE === 'Admin' || info?.ROLE === 'Super Admin') {
          redirectApprove(
            notification.BSNCR_PART_NO,
            notification.DATE,
            notification.TIME,
            notification.MOLD_NO
          );
        } else {
          navigate('/history/2');
        }
        handleClose();
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral', color: 'orange' }}>OC</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography fontSize={15}>
            {notification.BSNCR_PART_NO} #{notification.MOLD_NO}
          </Typography>
        }
        secondary={
          <>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {notification.DATE} {notification.TIME} น.
            </Typography>
            <Typography
              variant="caption"
              className={
                notification.APPROVAL_STATUS === 'Waiting User Re-check'
                  ? 'text-[orange]'
                  : 'text-[red]'
              }
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {notification.APPROVAL_STATUS}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
}
