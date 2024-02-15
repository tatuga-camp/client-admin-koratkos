import Link from 'next/link'
import React from 'react'
import Return from '../svgs/Return'
import KOSLogo from '../svgs/KOSLogo'
import KOSLogoLarge from '../svgs/KOSLogoLarge'
import { RiArrowGoBackFill } from "react-icons/ri";
import Leaf from '../svgs/Leaf'
import Image from 'next/image'

const Sidebar = () => {
  return (
    <div className='hidden lg:block lg:bg-[#F1E4C3] lg:w-[48%] relative'>
      <div className='flex items-center justify-center'>
        {/* return */}
        <Link href="/auth/sign-up" className='flex flex-col items-center justify-center gap-1 mt-4'>
            <div className='flex flex-col gap-1 items-center absolute left-5 top-5'>
          <section className='w-[38px] h-[38px] bg-[#597E52] flex justify-center items-center text-2xl text-white rounded-lg
           hover:bg-[#81b077] duration-300'>
            <RiArrowGoBackFill />
          </section>
          <p className='font-semibold text-[#597E52] text-[0.65rem]'>ย้อนกลับ</p>
        </div>    
                
        </Link>
        

        {/* Logo */}
        <div className='w-[85%] absolute top-[10rem] flex justify-center z-10 '>
          <div className='flex flex-col '>
            {/* img */}
            <div className='flex items-end justify-end pr-3 -mb-5'>
               <div className='relative w-[100px] h-[100px]'>
                <Image src='/ks_logo_photo.png' alt='logo' width={200} height={200} className='object-contain overflow-hidden' />
                </div>
            </div>
           
            <section className='font-bold'>
              WELCOME TO
            </section>
            <h1 className='text-[#597E52] font-bold text-5xl overflow-hidden'>Korat KOS</h1>
            <p className='font-semibold text-[0.8rem] mt-2 text-[#5C430D]'>ระบบสมัครขอรับการตรวจประเมินมาตรฐาน<br/>เกษตรอินทรีย์ขั้นพื้นฐานจังหวัดนครราชสีมา</p>
          </div>
        </div>

        <div className='w-full absolute bottom-0 z-0'>
           <Leaf/> 
        </div>

            
        </div>
    
    </div>
  )
}

export default Sidebar
