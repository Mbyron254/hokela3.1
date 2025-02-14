import axios from 'axios';
//import fileDownload from 'js-file-download';

// import { postGQLMutation } from 'src/lib/client';
import { M_DOCUMENT_NAME } from './mutations/general.mutation';

export const streamFileDownload = async (documentId: string) => {
  // const data = await postGQLMutation(
  //   M_DOCUMENT_NAME,
  //   { input: { id: documentId } },
  //   'document'
  // );

  // if (!data) throw new Error('Document not found');

  // axios
  //   .get(`/document/d/${documentId}`, {
  //     responseType: 'blob',
  //     timeout: 0,
  //   })
  //   .then((res) => {
  //     //fileDownload(res.data, data.originalName);
  //   });
};
