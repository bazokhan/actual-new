import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }, [csvData, fileName]);

  return (
    <Button variant="outline" onClick={() => exportToCSV(csvData, fileName)}>
      Export
    </Button>
  );
};

ExportCSV.propTypes = {
  csvData: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired
};

export default ExportCSV;
