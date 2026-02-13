import axios from 'axios';
import Swal from 'sweetalert2';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import ModalUpdatePart from './part-model-update';

// ----------------------------------------------------------------------

export default function PartTableRow({
  selected,
  bsthPartNo,
  partName,
  customerName,
  customerPartNo,
  model,
  justOn,
  point,
  getAllPart,
  file,
  render,
}) {
  const [open, setOpen] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [oldStandard, setOldStandard] = useState([]);
  const [images, setImages] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const imagePath = `${baseURL}/backend_qc_inspection/uploads/drawing`;
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleShowUpdateModal = async (pNo, CustomerPartNo, Customer) => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getPathByBsthName',
        bsthPartNo: pNo,
        customerPartNo: CustomerPartNo,
        customerName: Customer,
      })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setOldStandard(res.data.result);
        }
      });

    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getDrawingImagePath',
        bsthPartNo: pNo,
      })
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.msg);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setImages(res.data.result);
          setOpenUpdate(true);
        }
      });
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleDeletePart = async (pNo, CustomerPartNo, Customer) => {
    const response = await axios.post(`${baseURL}/backend_qc_inspection/api`, {
      router: 'deletePart',
      bsthPartNo: pNo,
      customerPartNo: CustomerPartNo,
      customerName: Customer,
    });
    console.log(response.data);
    if (response.data.err) {
      Swal.fire({
        icon: 'error',
        title: response.data.msg,
      });
    } else if (!response.data.err && response.data.status === 'Ok') {
      Swal.fire({
        icon: 'success',
        title: response.data.msg,
        timer: 700,
      });
      handleCloseMenu();
      getAllPart();
    } else {
      console.log('Something went wrong!');
    }
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    handleCloseMenu();
  };
  return (
    <>
      <ModalUpdatePart
        isOpen={openUpdate}
        onClose={handleCloseUpdate}
        oldStandard={oldStandard}
        images={images}
        render={render}
      />
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell sx={{ fontSize: 13 }}>
          <div className="flex justify-center border-[1px]">
            <img src={`${imagePath}/${file}`} alt="partno" className="h-[4rem] w-auto" />
          </div>
        </TableCell>
        <TableCell component="th" scope="row" padding="none" sx={{ fontSize: 13 }}>
          <Stack direction="row" alignItems="center" spacing={2} padding={2}>
            <Typography variant="subtitle2" noWrap sx={{ fontSize: 13 }}>
              {bsthPartNo}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell sx={{ fontSize: 13 }}>
          <div className="w-[90px]">
            <Tooltip title={partName}>
              <p className="truncate block w-full">{partName}</p>
            </Tooltip>
          </div>
        </TableCell>

        <TableCell sx={{ fontSize: 13 }}>
          <div className="w-[90px]">
            <p className="truncate block w-full">{customerName}</p>
          </div>
        </TableCell>
        <TableCell sx={{ fontSize: 13 }}>{model}</TableCell>
        <TableCell sx={{ fontSize: 13 }}>
          {' '}
          <div className="w-[120px]">
            <p className="truncate block w-full">{customerPartNo}</p>
          </div>
        </TableCell>
        <TableCell sx={{ fontSize: 13 }}>{point}</TableCell>

        <TableCell sx={{ fontSize: 13 }}>
          <Label color={(justOn === 'XY' && 'info') || 'primary'}>{justOn}</Label>
        </TableCell>

        <TableCell align="right" sx={{ fontSize: 13 }}>
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem
          onClick={() => {
            handleShowUpdateModal(bsthPartNo, customerPartNo, customerName);
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            Swal.fire({
              title: `ต้องการลบ ?  ${bsthPartNo}`,
              text: `ข้อมูลการ Inspection จะถูกลบด้วย!`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ใช่, ต้องการลบ!',
            }).then((result) => {
              if (result.isConfirmed) {
                handleDeletePart(bsthPartNo, customerPartNo, customerName);
              }
            });
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

PartTableRow.propTypes = {
  bsthPartNo: PropTypes.string,
  partName: PropTypes.string,
  customerName: PropTypes.string,
  customerPartNo: PropTypes.string,
  model: PropTypes.string,
  justOn: PropTypes.string,
  point: PropTypes.string,
  selected: PropTypes.any,
  getAllPart: PropTypes.func,
  file: PropTypes.string,
  render: PropTypes.func,
};
