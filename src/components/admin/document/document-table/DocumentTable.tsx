"use client"
import React, { useEffect } from 'react';
import Card from 'components/card';
import SearchIcon from 'components/icons/SearchIcon';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import Image from 'next/image';

import { AiOutlineDelete } from 'react-icons/ai';

import {
  PaginationState,
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { GoPlusCircle } from 'react-icons/go';
import UploadDocumentModal from 'components/actions/UploadDocumentModal';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDocumentAction } from 'store/document/documentSlice';
import {
  deleteDocument,
  getDocumentByUserId,
} from '../../../../../backendActions/documents';
import { FaEdit, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type RowObj = {
  documentName: string;
  documentTimestamp: any;
  uploadTimestamp: any;
  processingTimestamp: any;
  status: string;
  action: any;

  //   type: string;
  //   actions: any;
};

function DocumentTable(props: { tableData: any }) {
  const { tableData } = props;
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { user } = useSelector((state: any) => state.user);
  const { documentData } = useSelector((state: any) => state.document);
  const dispatch: any = useDispatch();
  let route = useRouter();

  const getDoc = async () => {
    await getDocumentByUserId(user.id).then((data) => {
      if (data.status_code == 200) {
        dispatch(getDocumentAction(data.detail));
      } else {
        toast.error(data.detail);
      }
    });
  };

  useEffect(() => {
    if (user?.id) {
      getDoc();
      const interval = setInterval(() => {
        getDoc();
      }, 5000); // 20 seconds
      return () => clearInterval(interval);
    }
  }, []);

  let defaultData = tableData;
  const [globalFilter, setGlobalFilter] = React.useState('');
  const createPages = (count: number) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }
    return arrPageCount;
  };
  const columns = [
    columnHelper.accessor('documentName', {
      id: 'documentName',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Document Name
        </p>
      ),
      cell: (info: any) => (
        <div className="flex w-full items-center gap-[14px]">
          {/* <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-blue-300">
            <Image
              width="2"
              height="20"
              className="h-full w-full rounded-full"
              src={info.getValue()[1]}
              alt=""
            />
          </div> */}
          <p className="font-medium text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('uploadTimestamp', {
      id: 'uploadTimestamp',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Upload Timestamp
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('documentTimestamp', {
      id: 'documentTimestamp',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Document Timestamp
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('processingTimestamp', {
      id: 'processingTimestamp',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Processing Timestamp
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Status
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('action', {
      id: 'action',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Action
        </p>
      ),
      cell: (info) => (
        <>
          <div className="flex items-center">
            <span
              className="cursor-pointer text-lg font-bold text-red-500"
              onClick={() => {
                handleDeleteDocument(info.row.original);
              }}
            >
              <AiOutlineDelete />
            </span>
            {
              info.row.original.processingTimestamp !="null" && 
              <span
              className="ml-5 cursor-pointer text-lg font-bold dark:text-white"
              onClick={() => {
                handleDetail(info.row.original);
              }}
            >
              <FaEye />
            </span>
            }
           
          </div>
        </>
      ),
    }),
    // columnHelper.accessor('delete', {
    //   id: 'date',
    //   header: () => (
    //     <p className="text-sm font-bold text-gray-600 dark:text-white">
    //       DELETE
    //     </p>
    //   ),
    //   cell: (info) => (
    //     <p className="text-sm font-bold text-navy-700 dark:text-white">
    //       {info.getValue()}
    //     </p>
    //   ),
    // }),
    // columnHelper.accessor('actions', {
    //   id: 'actions',
    //   header: () => (
    //     <p className="text-sm font-bold text-gray-600 dark:text-white">
    //       ORDER ACTIONS
    //     </p>
    //   ),
    //   cell: (info) => (
    //     <p
    //       className="cursor-pointer font-medium text-brand-500 dark:text-brand-400"
    //       onClick={() => {
    //         console.log(info.getValue());
    //       }}
    //     >
    //       Edit user
    //     </p>
    //   ),
    // }),
  ];
  const [data, setData] = React.useState([]);
  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const formattedDate = `${dateObj.getDate()}-${
      dateObj.getMonth() + 1
    }-${dateObj.getFullYear()}`;
    const formattedTime = `${dateObj.getHours()}:${dateObj.getMinutes()}`;
    return `${formattedDate} ${formattedTime}`;
  }
  useEffect(() => {
    if (documentData.length > 0) {
      const newData = documentData?.map((item) => ({
        ...item,
        documentTimestamp: formatTimestamp(item?.documentTimestamp),
        uploadTimestamp: formatTimestamp(item?.uploadTimestamp),
        processingTimestamp:item.processingTimestamp ? item.processingTimestamp : "null"
      }));
      console.log('newData', newData);
      setData(newData);
    } else {
      setData([]);
    }
  }, [documentData]);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 6,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const handleDeleteDocument = async (value) => {
    await deleteDocument(value.documentUid).then((data) => {
      if (data.status_code == 200) {
        toast.success(data.detail);
        getDoc();
      } else {
        toast.error(data.detail);
      }
    });
  };
  const handleDetail = async (value) => {
    route.push(`/user/my-documents/${value.documentUid}`);
  };

  return (
    <Card extra={'w-full h-full sm:overflow-auto px-6'}>
      <div className="flex w-full items-center justify-between rounded-xl pt-[20px]">
        <div className="flex h-[38px] w-[300px]  items-center rounded-xl bg-lightPrimary text-sm text-gray-600 dark:!bg-navy-900 dark:text-white">
          <SearchIcon />
          <input
            value={globalFilter ?? ''}
            onChange={(e: any) => setGlobalFilter(e.target.value)}
            type="text"
            placeholder="Search...."
            className="block w-full rounded-full bg-lightPrimary text-base text-navy-700 outline-none dark:!bg-navy-900 dark:text-white"
          />
        </div>
        <UploadDocumentModal />
      </div>
      <div className=" flex  justify-between pt-4">
        <div>
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Documents Reviewed
          </div>
          <div className="text-base font-normal text-navy-700 dark:text-white">
            Your latest document reviews
          </div>
        </div>
        <select
          className="mt-2 px-2 text-sm font-bold text-navy-700 dark:!bg-navy-800 dark:text-white"
          name=""
          id=""
        >
          <option value="admin">Sort By Last modified</option>
          <option value="admin">Moderator</option>
        </select>
        {/* <div className="flex cursor-pointer items-center gap-2 rounded-md border border-navy-500 p-2 dark:border-white">
          
        </div> */}
      </div>

      <div className="mt-8 overflow-x-scroll">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`cursor-pointer whitespace-nowrap border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30 ${header.id === "action" ? 'sticky right-0 bg-white pl-3' : ''}`}
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 7)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                       <td
                          key={cell.id}
                          className={`min-w-[150px] border-white/0 py-3 pr-4 ${
                          cell.column.id === 'action' ? 'sticky right-0 bg-white pl-3' : ''
                        }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* pagination */}
        <div className="mt-2 flex h-20 w-full items-center justify-between px-6">
          {/* left side */}
          <div className="flex items-center gap-3">
            <p className="> Show rows per page text-sm text-gray-700">
              Showing 6 rows per page
            </p>
          </div>
          {/* right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`linear flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 p-2 text-lg text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
            >
              <MdChevronLeft />
            </button>

            {createPages(table.getPageCount()).map((pageNumber, index) => {
              return (
                <button
                  className={`linear flex h-10 w-10 items-center justify-center rounded-full p-2 text-sm transition duration-200 ${
                    pageNumber === pageIndex + 1
                      ? 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'
                      : 'border-[1px] border-gray-400 bg-[transparent] dark:border-white dark:text-white'
                  }`}
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  key={index}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`linear flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 p-2 text-lg text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 `}
            >
              <MdChevronRight />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DocumentTable;
const columnHelper = createColumnHelper<RowObj>();
