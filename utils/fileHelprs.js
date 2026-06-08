const getSingleFile = (files, fieldName) => {
  return files?.[fieldName]?.[0] || null;
};

const getMultipleFiles = (files, fieldName) => {
  return files?.[fieldName] || [];
};

const getFileUrl = (req, file) => {
  const relativePath = file.path.split("uploads")[1].replace(/\\/g, "/");

  return `${req.protocol}://${req.get("host")}/uploads${relativePath}`;
};

module.exports = {
  getSingleFile,
  getMultipleFiles,
  getFileUrl,
};
