import React from 'react';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

const ExportToExcel = ({ data, fileName }) => {
  const exportToExcel = () => {
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Data is either not an array or is empty');
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}${new Date().toLocaleString()}.xlsx`);
  };

  return (
    <Button onClick={exportToExcel} type="button" variant="contained" size="small" color='success'>
     <i className="fa-regular fa-file-excel text-[16px] mr-1"/>Export to Excel
    </Button>
  );
};

export default ExportToExcel;

ExportToExcel.propTypes = {
  data: PropTypes.array,
  fileName: PropTypes.string,
};
