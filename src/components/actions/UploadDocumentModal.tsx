// @ts-nocheck
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import moment from 'moment';
import Image from 'next/image';
import { GoPlusCircle } from 'react-icons/go';
import { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import {
  getDocumentByUserId,
  processingDocument,
  uploadDocument,
} from '../../../backendActions/documents';
import { useDispatch, useSelector } from 'react-redux';
import { ImSpinner8 } from 'react-icons/im';
import {
  getDocumentAction,
  processingDocumentAction,
  uploadDocumentAction,
} from 'store/document/documentSlice';

const UploadDocumentModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  const [file, setFile] = useState(null);
  const { user } = useSelector((state) => state.user);
  const dispatch: any = useDispatch();
  const { documentData } = useSelector((state: any) => state.document);
  
  console.log('file', file);
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    const dublicatFile = documentData.find((name)=>name.documentName === selectedFile.name)
    if(dublicatFile) return toast.warn(
      'This file already exists.',
    );
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.warn(
        'Invalid file type. Please upload a .docx, .pdf, .doc, or .txt file.',
      );
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    let form = new FormData();
    form.append('file', file);
    setLoader(true);
    dispatch(
      uploadDocumentAction({
        form,
        onSuccess: (result) => {
          if (result == 'error') {
            setLoader(false);
          } else {
            const now = new Date();
            let payload = {
              userId: user.id,
              documentName: file.name,
              status: 'processing',
              uploadTimestamp: now,
            };
            uploadDocument(payload).then((data) => {
              if (data.status_code == 200) {
                toast.success('Upload document successfully');
                setLoader(false);
                if (user?.id) {
                  getDocumentByUserId(user.id).then((data) => {
                    if (data.status_code == 200) {
                      dispatch(getDocumentAction(data.detail));
                      setFile(null);
                      toggle();
                    } else {
                      toast.error(data.detail);
                    }
                  });
                }
             
                setLoader(false);
                
                 processingDocument(result,data.detail.documentUid,data.detail.uploadTimestamp,user?.id)

                // const pastDate = moment(data.detail.uploadTimestamp);
                // // Current date
                // const currentDate = moment();

                // Difference in various units
                // const seconds = currentDate.diff(pastDate, 'seconds');
                // const minutes = currentDate.diff(pastDate, 'minutes');
                // const hours = currentDate.diff(pastDate, 'hours');
                // const days = currentDate.diff(pastDate, 'days');
              // console.log("time diff",`${hours}:${minutes}:${seconds}`)
                // dispatch(
                //   processingDocumentAction({
                //     id: result,
                //     onSuccess: () => {
                //       let processingTime =
                //         data.detail.uploadTimestamp - new Date();
                //       console.log('processingTime', processingTime);
                //       // let obj={
                //       //   docId:data.detail.documentUid,
                //       // }
                //     },
                //   }),
                // );
              } else {
                setLoader(false);
                toast.error(data.detail);
              }
            });
           
          }
        },
      }),
    );
  };
  return (
    <div>
      <div
        onClick={toggle}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-navy-500 p-2 dark:border-white"
      >
        <span className="text-lg text-navy-500 dark:text-white">
          <GoPlusCircle />
        </span>
        <span className="text-lg text-navy-500 dark:text-white">
          {' '}
          New Review
        </span>
      </div>
      <Modal className="!z-[100]" isOpen={open} onClose={toggle}>
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="top-[22vh]  !m-auto !w-max !max-w-[85%] rounded-2xl bg-white  md:top-[12vh]">
          <ModalCloseButton className="ml-auto mr-4 mt-4 text-red-500" />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className=" flex h-auto  w-[400px] max-w-full justify-center  overflow-hidden p-3">
                <div className="mt-5 w-full px-3">
                  <div className="text-lg font-semibold">Upload Document</div>

                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="!border-whit mr-3 mt-4 flex h-12 w-full items-center justify-center rounded-full border bg-white/0 p-3 text-sm text-white outline-none placeholder:text-white"
                    accept=".docx,.pdf,.doc,.txt"
                  />
                  {file != null && (
                    <div className="text-base font-normal text-navy-700">
                      {file?.name}
                    </div>
                  )}

                  <div className="mx-3 mb-2 mt-10 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={toggle}
                      className="mr-2 cursor-pointer rounded-md bg-red-600 px-3 py-2   text-white"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={loader}
                      className="cursor-pointer rounded-md bg-navy-700 px-3 py-2 text-white hover:bg-none"
                    >
                      {loader ? (
                        <ImSpinner8 className="spinning-icon" />
                      ) : (
                        'Upload'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UploadDocumentModal;
