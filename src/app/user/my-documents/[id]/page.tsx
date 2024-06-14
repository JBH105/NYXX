'use client';
import tableDataUsersOverview from 'variables/users/users-overview/tableDataUsersOverview';
import Card from 'components/card';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSingleDocument } from '../../../../../backendActions/documents';
import { toast } from 'react-toastify';
import AnonymizeTable from '../../../../components/document_anonymize/AnonymizeTable';
const Page = () => {
  let { id } = useParams();

  const [docData, setDocData] = useState<any>('');
  const [jsonData, setJsonData] = useState<any>('');

  useEffect(() => {
    if (docData.anonymizeData) {
      const data = JSON.parse(docData?.anonymizeData);
      setJsonData(data);
    }
  }, [docData]);

  console.log('docData+++', docData);
  console.log('docData+++', jsonData);

  const getSingleDocumentApi = async (docId: any) => {
    try {
      let res = await getSingleDocument(docId);
      if (res.status_code == 200) {
        setDocData(res.detail);
      } else {
        toast.error(res.detail);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleDocumentApi(id);
    } else {
      setDocData('');
    }
  }, [id]);
  return (
    <Card extra={'w-full h-full mt-3'}>
      <div className={`flex  px-4  py-4 w-full`}>
        <div>
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Analyze
          </div>
          {docData?.analyzeData ? (
            <div className="mt-4 text-base font-normal text-navy-700 dark:text-white whitespace-pre text-balance">
              {docData?.analyzeData}
            </div>
          ) : (
            <div className="self-center py-4 text-center text-base font-bold text-navy-700 dark:text-white">
              No Data Found
            </div>
          )}
        </div>
      </div>
      <div className=" px-4  py-4 text-xl font-bold text-navy-700 dark:text-white">
        Anonymize
      </div>
      {jsonData.length > 0 ? (
        <AnonymizeTable tableData={jsonData} />
      ) : (
        <div className="py-4 text-center text-base font-bold text-navy-700 dark:text-white">
          No Data Found
        </div>
      )}
    </Card>
  );
};

export default Page;
