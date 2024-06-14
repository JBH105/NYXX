'use server';
import * as z from 'zod';

import { db } from '../lib/db';
import axios from 'axios';
import moment from 'moment';




export const uploadDocument = async (values: any) => {
  try {
    const existingDocument = await db.documentUploads.findFirst({
      where: { documentName:values.documentName ,userId:values.userId},
    });
    console.log("existingDocument",existingDocument)

    if (existingDocument) {
      console.log("agia-------")
      await db.documentUploads.delete({
        where: {
          documentUid: existingDocument.documentUid,

        },
      });
    }
    let documentData = await db.documentUploads.create({
      data: {
        ...values,
      },
    });

    return { status_code: 200, detail: documentData };
  } catch (err) {
    console.log('err', err);
    return { detail: err };
  }
};
export const deleteDocument = async (docId: any) => {
  console.log('docid', docId);
  try {
    const deletedDocument = await db.documentUploads.delete({
      where: {
        documentUid: docId,
      },
    });
    console.log('deletedDocument', deletedDocument);

    return { status_code: 200, detail: 'Delete Document Successfully' };
  } catch (err) {
    console.log('err', err);
    return { detail: err };
  }
};
export const updateDocument = async (
  docid: any,
  currentTime: any,
  analyzeData: any,
  anonymizeData: any,
  status:string,
) => {
  try {
    console.log('currentTime===>', currentTime);

    let documentData = await db.documentUploads.update({
      where: {
        documentUid: docid,
      },
      data: {
        status: status,
        processingTimestamp: currentTime,
        analyzeData: analyzeData,
        anonymizeData:anonymizeData ,
      },
    });
    return { status_code: 200, detail: documentData };
  } catch (err) {
    console.log('err', err);
    return { detail: err };
  }
};
export const getDocumentByUserId = async (userId: any) => {
  try {
    let data = await db.documentUploads.findMany({
      where: { userId },
      orderBy: { documentTimestamp: 'desc' }
    });
    return { status_code: 200, detail: data };
  } catch (err) {
    console.log('err', err);
    return { detail: err };
  }
};


export const getSingleDocument= async (documentUid: any) => {
  try {
    let data = await db.documentUploads.findFirst({
      where: { documentUid },
    });
    return { status_code: 200, detail: data };
  } catch (err) {
    console.log('err', err);
    return { detail: err };
  }
};


// Assuming this function updates document status in your database

interface DocumentStatus {
  contractId: string;
  docId: string;
  intervalId: NodeJS.Timeout;
  startTime: any;
  userId: any;
}

let documentStatuses: DocumentStatus[] = [];

export const processingDocument = async (
  contractId: string,
  docId: string,
  uploadTime: any,
  userId: any,
) => {
  try {
    if (!isDocumentStatusExist(contractId, docId)) {
      const intervalId = setInterval(async () => {
        await checkDocumentStatus(contractId, docId, intervalId);
      }, 15000); // Set an interval to check the document status every 5 seconds
      // checkDocumentStatus(contractId, docId, intervalId);
      documentStatuses.push({
        contractId,
        docId,
        intervalId,
        startTime: uploadTime,
        userId,
      }); // Track the new processing task
    }
  } catch (err) {
    console.error('Error initiating document processing:', err);
    // Handle error, such as retrying after a delay
  }
};
const analyzeDocument = async (contractId: string) => {
  try {
    const response = await axios.get(
      `https://api.nyxx.ai/analyze_file?password=ij.iuokoi6o8l78cjdsancnacewoih&contract_id=${contractId}`,
    );
    return response;
  } catch (err) {
    console.error('Error while checking document status:', err);
  }
};
const anonymizeDocument = async (contractId: string) => {
  try {
    const response = await axios.get(
      `https://api.nyxx.ai/anonymize_file?password=ij.iuokoi6o8l78cjdsancnacewoih&contract_id=${contractId}`,
    );
    return response;
  } catch (err) {
    console.error('Error while checking document status:', err);
  }
};
const checkDocumentStatus = async (
  contractId: string,
  docId: string,
  intervalId: NodeJS.Timeout,
) => {
  try {
    console.log('Document processing complete for', contractId, docId);
    let anonymizeResult = await anonymizeDocument(contractId);
    clearInterval(intervalId);
    if (
      anonymizeResult?.status == 200 &&
      anonymizeResult?.data?.result == 'Success!'
    ) {
      try{
        let analyzeResult = await analyzeDocument(contractId);
        if (
          analyzeResult?.status == 200 &&
          analyzeResult?.data.result == 'Success!'
        ) {
          clearInterval(intervalId);
          let docData = documentStatuses.find(
            (obj) => obj.contractId == contractId,
          );
          let analyzeData = analyzeResult.data.recommendations;
          let anonymizeData = anonymizeResult.data.items;
          const currentDate = moment();
          const pastDate = moment(docData.startTime);
          const seconds = currentDate.diff(pastDate, 'seconds');
          const minutes = currentDate.diff(pastDate, 'minutes');
          const hours = currentDate.diff(pastDate, 'hours');
          const days = currentDate.diff(pastDate, 'days');
          let calculateTime = `${hours}:${minutes}:${seconds}`;
          try {
            let res = await updateDocument(
              docId,
              calculateTime,
              analyzeData,
              anonymizeData,
              "complete"
            );
          
            if (res.status_code == 200) {
              
              removeDocumentStatus(contractId, docId, intervalId);
            } else {
              console.log('error', res.detail);
            }
          } catch (err) {
            console.log(err);
          }
        }

      }catch(err){
        clearInterval(intervalId);
        console.log("error--",err)
      }
    
    }else{

    
        clearInterval(intervalId);
        let docData = documentStatuses.find(
          (obj) => obj.contractId == contractId,
        );
        let analyzeData = "";
        let anonymizeData ="";

        let calculateTime ="";
        try {
          let res = await updateDocument(
            docId,
            calculateTime,
            analyzeData,
            anonymizeData,
            "failed"
          );
          if (res.status_code == 200) {
            removeDocumentStatus(contractId, docId, intervalId);
          } else {
            console.log('error', res.detail);
          }
        } catch (err) {
          console.log(err);
        }
     
    
    }
  } catch (err) {
    console.error(err);
    clearInterval(intervalId);
    let docData = documentStatuses.find(
      (obj) => obj.contractId == contractId,
    );
    let analyzeData = "";
    let anonymizeData ="";
    let calculateTime ="";
    try {
      let res = await updateDocument(
        docId,
        calculateTime,
        analyzeData,
        anonymizeData,
        "failed"
      );
      if (res.status_code == 200) {
        removeDocumentStatus(contractId, docId, intervalId);
      } else {
        console.log('error', res.detail);
      }
    } catch (err) {
      console.log(err);
    } // Ensure interval is cleared on error
  }
};

// const checkDocumentStatus = async (
//   contractId: string,
//   docId: string,
//   intervalId: NodeJS.Timeout,
// ) => {
//   try {
//     const response = await axios.get(
//       `https://api.nyxx.ai/status?password=ij.iuokoi6o8l78cjdsancnacewoih&contract_id=${contractId}`,
//     );
//     if (response.status === 200) {
//       if (
//         response.data.status.analyze == 'success' &&
//         response.data.status.anonymize == 'success'
//       ) {
//         console.log('Document processing complete for', contractId, docId);

//         let analyzeResult = await analyzeDocument(contractId);
//         let anonymizeResult = await anonymizeDocument(contractId);
//         console.log("analyzeResult",analyzeResult)
//         if (analyzeResult.status === 200 && anonymizeResult.status == 200) {
//           let docData = documentStatuses.find(
//             (obj) => obj.contractId == contractId,
//           );

//           let analyzeData=analyzeResult.data.recommendations;
//           let anonymizeData=anonymizeResult.data.items;
//           const currentDate = moment();
//           const pastDate = moment(docData.startTime);
//           const seconds = currentDate.diff(pastDate, 'seconds');
//           const minutes = currentDate.diff(pastDate, 'minutes');
//           const hours = currentDate.diff(pastDate, 'hours');
//           const days = currentDate.diff(pastDate, 'days');
//           console.log('time diff', `${hours}:${minutes}:${seconds}`);

//           let calculateTime = `${hours}:${minutes}:${seconds}`;
//           try {
//             let res = await updateDocument(
//               docId,
//               JSON.stringify(calculateTime),
//               analyzeData,
//               anonymizeData
//             );
//             if (res.status_code == 200) {
//               clearInterval(intervalId);
//               getDocumentByUserId(docData.userId);
//               removeDocumentStatus(contractId, docId, intervalId);
//             } else {
//               console.log('error', res.detail);
//             }
//           } catch (err) {
//             console.log(err);
//           }
//         }
//       } else {
//         console.log(
//           'Document status for',
//           contractId,
//           docId,
//           'is not 100 yet:',
//           response.data,
//         );
//       }
//     } else {
//       console.error('API call failed with status', response.status);
//       clearInterval(intervalId); // Stop interval on API failure
//     }
//   } catch (err) {
//     console.error('Error while checking document status:', err);
//     clearInterval(intervalId); // Ensure interval is cleared on error
//   }
// };

const isDocumentStatusExist = (contractId: string, docId: string) => {
  return documentStatuses.some(
    (status) => status.contractId === contractId && status.docId === docId,
  );
};

const removeDocumentStatus = (
  contractId: string,
  docId: string,
  intervalId: NodeJS.Timeout,
) => {
  documentStatuses = documentStatuses.filter(
    (status) =>
      !(
        status.contractId === contractId &&
        status.docId === docId &&
        status.intervalId === intervalId
      ),
  );
};
