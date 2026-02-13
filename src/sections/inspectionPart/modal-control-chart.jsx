import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import pic01 from '../../assets/images/control_chart/pic01.jpg'
import pic02 from '../../assets/images/control_chart/pic02.jpg'

const ModalControlChart = ({ isOpen, handleClose }) => {
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
  return (
    <div>
      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={{ ...style }} width="80%" height="90%" overflow="auto">
          <h4>การวิเคราะห์ Control Chart</h4>

          <Box className="flex justify-center mt-2 flex-col items-center">
            <img
              width="70%"
              src={pic01}
              alt={pic01}
            />
            <img
              className="mt-1"
              width="70%"
              src={pic02}
              alt={pic02}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalControlChart;

ModalControlChart.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};
