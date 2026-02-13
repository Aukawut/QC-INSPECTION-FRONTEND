import axios from 'axios';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { optionsTable } from '../utils';
import AddUserModel from '../add-user-modal';
import UpdateUserModal from '../update-user-modal';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [openMenu, setOpenMenu] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [objUser, setObjUser] = useState({});

  const findUser = (id) => {
    const obj = users?.find((x) => parseInt(x.USER_ID, 10) === parseInt(id, 10));
    setObjUser(obj);
  };
  const handleModalAdd = () => {
    setOpenModalAdd(true);
  };
  const handleModalUpdate = () => {
    setOpenModalUpdate(true);
  };
  const handleOpenMenu = (event, id) => {
    setOpenMenu(event.currentTarget);
    setIdUser(id);
    findUser(id);
  };
  console.log(idUser);
  const handleCloseMenu = () => {
    setOpenMenu(null);
  };
  const handleCloseAdd = () => {
    setOpenModalAdd(false);
    handleCloseMenu();
  };
  const handleCloseUpdate = () => {
    setOpenModalUpdate(false);
    handleCloseMenu();
  };
  const getAllUsers = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'allUsers',
      })
      .then((res) => {
        if (res.data.err) {
          setUsers([]);
        } else if (!res.data.err && res.data.status === 'Ok') {
          setUsers(res.data.results);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL]);

  const column = [
    {
      name: 'No',
      label: 'Row #',
    },
    {
      name: 'LOGIN_DOMAIN',
      label: 'Login Domain',
    },
    {
      name: 'FULLNAME',
      label: 'Fullname',
    },
    {
      name: 'ROLE',
      label: 'Role',
      options: {
        customBodyRender: (value, tableMeta) => (
          <Label color={(tableMeta.rowData[3] === 'Inspector' && 'info') || 'primary'}>
            {tableMeta.rowData[3]}
          </Label>
        ),
      },
    },
    {
      name: 'USER_ID',
      label: 'Action',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const id = tableMeta.rowData[4];

          return (
            <IconButton style={{ cursor: 'pointer' }} onClick={(e) => handleOpenMenu(e, id)}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          );
        },
      },
    },
  ];
  const deleteUser = async (id) => {
    const response = await axios.post(`${baseURL}/backend_qc_inspection/api`, {
      router: 'deleteUser',
      id: idUser,
    });
    if (response.data.err) {
      Swal.fire({
        icon: 'error',
        title: response.data.msg,
      });
    } else if (!response.data.err && response.data.status === 'Ok') {
      Swal.fire({
        icon: 'success',
        title: response.data.msg,
        showCancelButton: false,
        showConfirmButton: false,
        timer: 700,
      });
      getAllUsers();
      handleCloseMenu();
      setIdUser(null);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  return (
    <Container>
      <AddUserModel
        getAllUsers={getAllUsers}
        isOpen={openModalAdd}
        onClose={handleCloseAdd}
        baseURL={baseURL}
      />
      <UpdateUserModal
        user={objUser}
        getAllUsers={getAllUsers}
        isOpen={openModalUpdate}
        onClose={handleCloseUpdate}
        baseURL={baseURL}
        id={idUser}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalAdd}
        >
          New User
        </Button>
      </Stack>
      <Card>
        <Popover
          open={!!openMenu}
          anchorEl={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 140 },
          }}
        >
          <MenuItem onClick={handleModalUpdate}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              Swal.fire({
                title: 'Are you sure?',
                text: 'คุณจะไม่สามารถกู้ข้อมูลกลับมาได้!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result.isConfirmed) {
                  deleteUser(idUser);
                }
              });
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
        <MUIDataTable
          columns={column}
          data={users}
          options={optionsTable}
          title={<p style={{fontSize:15}}>Table showing user information in the system ({users?.length} users)</p>}
        />
      </Card>
    </Container>
  );
}
