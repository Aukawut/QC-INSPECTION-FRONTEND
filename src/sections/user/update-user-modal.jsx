import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { roleSys, optionMenuDep } from './utils';

export default function UpdateUserModal({ user, isOpen, onClose, baseURL, getAllUsers, id }) {
  const handleClose = () => {
    onClose(false); // Call onClose to close the modal
  };
  const [username, setUsername] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  console.log(role);
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
  function capitalizeName(string) {
    return string.length > 0 ? `${string.charAt(0).toUpperCase()}${string.slice(1)}` : '';
  }
  const resetForm = () => {
    setUsername('');
    setFname('');
    setLname('');
    setDepartment('');
    setPosition('');
    setRole('');
  };
  const updateUser = async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'updateUser',
        username,
        fname: capitalizeName(fname),
        lname: capitalizeName(lname),
        department,
        position,
        role,
        id
      })
      .then((res) => {
        if (res.data.err) {
          Swal.fire({
            icon: 'error',
            title: res.data.msg,
          });
        } else if (!res.data.err && res.data.status === 'Ok') {
          Swal.fire({
            icon: 'success',
            title: res.data.msg,
            timer: 700,
            showCancelButton: false,
            showConfirmButton: false,
          });
          handleClose();
          getAllUsers();
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setUsername(user.LOGIN_DOMAIN);
    setFname(user.FULLNAME?.split(' ')[0]);
    setLname(user.FULLNAME?.split(' ')[1]);
    setDepartment(user.DEPARTNAME);
    setPosition(user.POSITION);
    setRole(user.ROLE);
    console.log('userProps', user);
  }, [user]);
  return (
    <div>
      <Modal open={isOpen} onClose={handleClose}>
        <Box
          sx={{ ...style, height: '90%', overflow: 'hidden', overflowY: 'auto' }}
          className="w-[80%] lg:w-[50%]"
        >
          <button
            type="button"
            className=" absolute top-0 right-0 mx-[1rem] mt-[0.6rem]"
            onClick={() => handleClose()}
          >
            <i className="fa-solid fa-xmark text-[red] text-[18px]" />
          </button>
          <h4 className="font-bold">
            <i className="fa-regular fa-user text-[18px] mr-1" />
            Update User {id}
          </h4>
          <Box className="flex justify-center">
            <Box className="w-[400px]">
              <FormControl fullWidth sx={{ marginBottom: 1 }}>
                <Typography>Username :</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Username"
                  onChange={(e) => {
                    const englishRegex = /^[a-zA-Z0-9]*$/; // อนุญาตให้ใช้อักขระภาษาอังกฤษ (ตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก) และตัวเลข
                    const newValue = e.target.value.replace(/[^a-zA-Z]/g, ''); // แปลงอินพุตเป็นตัวพิมพ์ใหญ่และลบอักขระที่ไม่ใช่ตัวอักษรและตัวเลข
                    if (englishRegex.test(newValue)) {
                      setUsername(newValue);
                    } else {
                      console.log('Only English characters are allowed.');
                    }
                  }}
                  value={username}
                />
                <span className="text-[red] text-[12px] mt-[0.5rem]">
                  * ใส่ User Ad ที่ใช้ Login เข้า Computer เช่น swd
                </span>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 1 }}>
                <Typography>Firstname (English) :</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Firstname"
                  onChange={(e) => {
                    const englishRegex = /^[a-zA-Z0-9]*$/; // อนุญาตให้ใช้อักขระภาษาอังกฤษ (ตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก) และตัวเลข
                    const newValue = e.target.value.replace(/[^a-zA-Z]/g, ''); // แปลงอินพุตเป็นตัวพิมพ์ใหญ่และลบอักขระที่ไม่ใช่ตัวอักษรและตัวเลข
                    if (englishRegex.test(newValue)) {
                      setFname(newValue);
                    } else {
                      console.log('Only English characters are allowed.');
                    }
                  }}
                  value={fname}
                />
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 1 }}>
                <Typography>Lastname (English) :</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Lastname"
                  onChange={(e) => {
                    const englishRegex = /^[a-zA-Z0-9]*$/; // อนุญาตให้ใช้อักขระภาษาอังกฤษ (ตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก) และตัวเลข
                    const newValue = e.target.value.replace(/[^a-zA-Z]/g, ''); // แปลงอินพุตเป็นตัวพิมพ์ใหญ่และลบอักขระที่ไม่ใช่ตัวอักษรและตัวเลข
                    if (englishRegex.test(newValue)) {
                      setLname(newValue);
                    } else {
                      console.log('Only English characters are allowed.');
                    }
                  }}
                  value={lname}
                />
              </FormControl>

              <FormControl fullWidth sx={{ marginBottom: 1 }}>
                <Typography>Position (English) :</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Position"
                  onChange={(e) => {
                    const englishRegex = /^[a-zA-Z0-9\s]*$/; // อนุญาตให้ใช้อักขระภาษาอังกฤษ (ตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก) และตัวเลข
                    const newValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''); // แปลงอินพุตเป็นตัวพิมพ์ใหญ่และลบอักขระที่ไม่ใช่ตัวอักษรและตัวเลข
                    if (englishRegex.test(newValue)) {
                      setPosition(newValue);
                    } else {
                      console.log('Only English characters are allowed.');
                    }
                  }}
                  value={position}
                />
              </FormControl>
              <Typography>Department :</Typography>
              <FormControl fullWidth sx={{ marginTop: 1 }} size="small">
                <InputLabel id="demo-select-small-label">Department</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label="Department"
                >
                  {optionMenuDep.map((item, index) => (
                    <MenuItem value={item.name} key={index}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography sx={{ marginTop: 1 }}>Role :</Typography>
              <FormControl fullWidth sx={{ marginTop: 1 }} size="small">
                <InputLabel id="demo-select-small-label">Role</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Role"
                >
                  {roleSys.map((item, index) => (
                    <MenuItem value={item.name} key={index}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="mt-[1rem]">
                <Button onClick={updateUser} variant="contained">
                  Submit
                </Button>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

UpdateUserModal.propTypes = {
  isOpen: PropTypes.bool,
  user: PropTypes.object,
  onClose: PropTypes.func,
  baseURL: PropTypes.string,
  getAllUsers: PropTypes.func,
  id: PropTypes.number,
};
