'use client';
import tableDataUsersOverview from 'variables/users/users-overview/tableDataUsersOverview';
import Card from 'components/card';
import DocumentTable from 'components/admin/document/document-table/DocumentTable';

const MyDocuments = () => {
  return (
    <Card extra={'w-full h-full mt-3'}>
    <DocumentTable tableData={tableDataUsersOverview} />
  </Card>
  );
};

export default MyDocuments;
