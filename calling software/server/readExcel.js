const xlsx = require('xlsx');

const readExcelFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data.map(row => row.PhoneNumber); // Adjust the key to match your Excel column header
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

module.exports = readExcelFile;
