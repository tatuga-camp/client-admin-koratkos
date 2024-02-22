import Sidebar from '@/components/layout/Sidebar'
import User from '@/components/svgs/User'
import Link from 'next/link';
import React, { useState } from 'react'
import {Button, FieldError, Form, Input, Label, TextField} from 'react-aria-components';

const Index = () => {
    const [isPhone,setIsPhone] = useState<boolean>(false)
  return (
    <div className='w-screen min-h-screen flex font-Anuphan'>
    {/* Left */}
    <Sidebar/>
    {/* Right */}
    <div className='w-full h-full flex flex-col items-center lg:mt-6 lg:justify-center'>
       <div className='w-full my-8 flex flex-col justify-center items-center  '>
         <section className='mt-7 lg:mt-0'>
           <h1 className='bg-[#3193A9] w-[15.625rem] md:w-[18rem] rounded-full p-3 text-center \
           text-white font-semibold px-[3rem] md:px-[2rem] text-xl lg:text-base'>ลืมรหัสผ่าน</h1>
         </section>

         <div className='w-[7rem] my-10 lg:my-6 '>
           <User/>
         </div>
         
         <Form className='flex flex-col md:mt-1 w-[85%] gap-5 lg:gap-2'>
         
            {isPhone ? (
                <div>
                    
                    <section className='flex flex-col items-center -mt-1'>
                        <p className='text-sm lg:text-[0.8rem] w-[18rem] flex flex-col items-start my-2  text-start text-[#3193A9] font-semibold underline '>
                        <button onClick={() => {setIsPhone(!isPhone)}} >เปลี่ยนไปใช้ email</button>
                        {/* ควร toggle ให้กลับไปใส่ email เหมือนเดิมดีไหม?? */}
                        </p>
                    </section>
                    <TextField name="phone" type="tel" isRequired  className="flex flex-col items-center  ">
                            <div className='flex flex-col gap-2 justify-start items-start'>
                                <Label className='text-[#597E52] text-xl md:text-sm font-semibold'>เบอร์โทรศัพท์ :</Label>
                                <Input className="pl-3 w-[18rem] border-solid border-[1px] text-sm border-slate-300 rounded-lg py-2 md:py-1"/>
                            </div>
                            <div className='w-full flex justify-center'>
                                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
                            </div>
                    </TextField>

                </div>
            ) : (
                <div>

                    <TextField name="email" type="email" isRequired  className="flex flex-col items-center  ">
                            <div className='flex flex-col gap-2 justify-start items-start'>
                                <Label className='text-[#597E52] text-xl md:text-sm font-semibold'>E-mail :</Label>
                                <Input className="pl-3 w-[18rem] border-solid border-[1px] text-sm border-slate-300 rounded-lg py-2 md:py-1"/>
                            </div>
                            <div className='w-full flex justify-center'>
                                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
                            </div>
                    </TextField>
                    <section className='flex flex-col items-center mt-1'>
                        <p className='text-sm lg:text-[0.8rem] w-[18rem] flex flex-col items-start my-2  text-start text-[#3193A9] font-semibold underline '>
                        <button onClick={() => {setIsPhone(!isPhone)}}>ลืม E-mail ใช่ไหม? กรอกเบอร์โทรศัทพ์เพื่อค้นหา?</button>
                        </p>
                    </section>

                </div>
            )}
         {/* email password */}
        

        

        

          

         {/* submit ไปแล้ว ขึ้นalertด้วย */}
         <div className='flex justify-center'>
           <Button type="submit" className="drop-shadow-lg bg-[#597E52] w-[13rem] rounded-full p-3 text-center 
           text-white text-xl mt-5 font-semibold md:text-base hover:bg-[#81b077] duration-300">
             ค้นหา
           </Button>
         </div>
         
       </Form>
       {/* <div className="col-3 col-s-3 menu flex flex-col">
                <h2>PRSME</h2>
              <ul className='bg-slate-200'>
                <li><a href="">My Showcase</a></li>
                <li><a href="">My Resume</a></li>
                <li><a href="">TU Life</a></li> 
              </ul>
        </div> */}

       </div>
     
    </div>
   
 </div>
  )
}

export default Index
