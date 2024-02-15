import Link from 'next/link';
import React from 'react'
import { RiArrowGoBackFill } from 'react-icons/ri';
import Return from '../svgs/Return';
import KOSLogo from '../svgs/KOSLogo';



const Navbar = () => {
  return (
    <div className='w-screen h-full'>
      <div className='w-full h-[8rem] bg-[#F1E4C3] lg:hidden p-6 flex justify-between font-Anuphan items-center'>
        <div >
            <Link href="/auth/sign-up" className='flex flex-col items-center justify-center gap-1 mt-4'>
                <Return/>
                <p className='text-[#597E52] font-bold text-[0.8rem]'>ย้อนกลับ</p>
                
            </Link>
        </div>
        
        <div className='text-[0.7rem] text-[#5C430D] font-bold'>
            <section className='flex gap-2 items-center'>
                <h1 className='text-[#597E52] font-bold text-[2.1rem]'>Korat KOS</h1>
                <KOSLogo/>
            </section>
            <section className='flex flex-col -mt-1'>
                <p>ระบบสมัครขอรับการตรวจประเมินมาตรฐาน</p>
                <p>เกษตรอินทรีย์ขั้นพื้นฐาน จังหวัดนครราชสีมา</p>
            </section>
            
        </div>
        
      </div>
    </div>
  )
}

export default Navbar
