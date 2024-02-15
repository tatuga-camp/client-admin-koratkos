import Sidebar from '@/components/layout/Sidebar'
import User from '@/components/svgs/User'
import Link from 'next/link';
import React from 'react'
import {Button, FieldError, Form, Input, Label, TextField} from 'react-aria-components';

const index = () => {
  return (
    <div className='w-screen min-h-screen flex font-Anuphan'>
       {/* Left */}
       <Sidebar/>
       {/* Right */}
       <div className='w-full h-full flex flex-col items-center lg:mt-6 lg:justify-center'>
          <div className='w-full my-8 flex flex-col justify-center items-center  '>
            <section className='mt-7 lg:mt-0'>
              <h1 className='bg-[#C6A969] w-[15.625rem] md:w-[18rem] rounded-full p-3 text-center \
              text-white font-semibold px-[3rem] md:px-[2rem] text-xl lg:text-base'>เข้าสู่ระบบสำหรับผู้ประเมิน</h1>
            </section>

            <div className='w-[7rem] my-10 lg:my-4 '>
              <User/>
            </div>
            
            <Form className='flex flex-col md:mt-1 w-[85%] gap-5 lg:gap-2'>
            

            {/* email password */}
            <TextField name="email" type="email" isRequired  className="flex flex-col items-center  ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-sm font-semibold'>E-mail :</Label>
                <Input className=" w-[18rem] border-solid border-[1px] text-sm border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="password" type="password" isRequired  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-sm font-semibold'>รหัสผ่าน :</Label>
                <Input className=" w-[18rem] border-solid border-[1px] text-sm border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>

             
            </TextField>

            <section className='flex flex-col items-center -mt-2'>
              
                <p className='w-[18rem] flex flex-col items-start my-2 text-base lg:text-[0.7rem] text-start text-[#3193A9] font-semibold underline '>
                <Link href='/auth/forget-password'>
                  <button className='underline'>ลืมรหัสผ่าน?</button>
                </Link>
                </p>
              
              
            </section>

             

            {/* submit ไปแล้ว ขึ้นalertด้วย */}
            <div className='flex justify-center'>
              <Button type="submit" className="drop-shadow-lg bg-[#597E52] w-[13rem] rounded-full p-3 text-center 
              text-white text-xl mt-5 font-semibold md:text-base hover:bg-[#81b077] duration-300">
                ลงทะเบียน
              </Button>
            </div>
            
          </Form>
           

          </div>
        
       </div>
      
    </div>
  )
}

export default index
