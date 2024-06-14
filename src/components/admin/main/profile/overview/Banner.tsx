'use client'
import { useDispatch, useSelector } from 'react-redux';
import avatar from '/public/img/avatars/avatar9.png';
import banner from '/public/img/profile/banner.png';
import Card from 'components/card';
import Image from 'next/image';
import { useEffect } from 'react';
import { getDocumentByUserId } from '../../../../../../backendActions/documents';
import { getDocumentAction } from 'store/document/documentSlice';
import { toast } from 'react-toastify';

const Banner = () => {



  const {user}=useSelector((state:any)=>state.user)
  const { documentData } = useSelector((state: any) => state.document);

const dispatch:any=useDispatch()
  const getDoc=async ()=>{
    await   getDocumentByUserId(user.id).then((data) => {
         if (data.status_code == 200) {
        
           dispatch(getDocumentAction(data.detail));
         } else {
           toast.error(data.detail);
         }
       });
     }
     useEffect(() => {
       if (user?.id) {
         getDoc() 
       }
     }, [user]);



  return (
    <Card extra={'items-center w-full h-full p-[16px] bg-cover'}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-48 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner.src})` }}
      >
        <div className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <Image
            width="2"
            height="20"
            className="h-full w-full rounded-full"
            src={avatar}
            alt=""
          />
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
         <span className='mr-1'>{user?.firstName} </span>  {user?.lastName}
        </h4>
        <h5 className="text-base font-normal text-gray-600">{user?.email}</h5>
      </div>

      {/* Post followers */}
      <div className="mb-3 mt-6 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
        {documentData?.length}
          </h4>
          <p className="text-sm font-normal text-gray-600">Total Documents</p>
        </div>
        {/* <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            9.7K
          </h4>
          <p className="text-sm font-normal text-gray-600">Followers</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            434
          </h4>
          <p className="text-sm font-normal text-gray-600">Following</p>
        </div> */}
      </div>
    </Card>
  );
};

export default Banner;
