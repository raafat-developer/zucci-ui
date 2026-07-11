import http from './http';

export const uploadFile = (file, fileCategoryId = 1) => {
  const formData = new FormData();
  formData.append('file', file);
  if (fileCategoryId) {
    formData.append('fileCategoryId', fileCategoryId);
  }
  return http.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getFiles = (params = {}) => {
  return http.get('/files', { params });
};

export const deleteFile = (id) => {
  return http.delete(`/files/${id}`);
};
