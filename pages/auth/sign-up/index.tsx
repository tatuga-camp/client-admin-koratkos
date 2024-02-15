import Sidebar from '@/components/layout/Sidebar';
import React from 'react'
import {Button, FieldError, Form, Input, Label, TextField} from 'react-aria-components';
import Checkbox from '@mui/material/Checkbox';


const index = () => {
  return (
    <div className='w-screen h-full flex font-Anuphan'>
        {/* Left */}
       <Sidebar/>
       {/* right */}
      <div className='w-full flex flex-col items-center justify-center m-0 '>
        <div className='w-full my-8 flex flex-col items-center m-0 '>
          <section>
            <h1 className='bg-[#597E52] w-[15.625rem] md:w-[20rem] rounded-full p-3 text-center text-white font-semibold px-[3rem] md:px-[2rem] text-xl'>ลงทะเบียนสำหรับผู้ประเมิน</h1>
          </section>

          
          <Form className='flex flex-col mt-5 md:mt-3 w-[85%] gap-3'>
            <TextField name="name-title" type="text" isRequired className="flex flex-col items-center ">
              <div className='flex gap-4 justify-center items-center mt-6'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>คำนำหน้า :</Label>
                <Input className=" border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            
            </TextField>

            {/* ชื่อ จอใหญ่ทำให้เรียงต่อกัน */}
            <TextField name="first-name" type="text" isRequired className="flex flex-col items-center mt-4 md:mt-2">
              <div className='flex flex-col md:flex-row gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold '>ชื่อจริง :</Label>
                <Input className="w-[20rem]  border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="last-name" type="text" isRequired className="flex flex-col items-center  md:mt-2">
              <div className='flex flex-col md:flex-row gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>นามสกุล :</Label>
                <Input className="w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            {/* องค์กร เอาขนาดเต็มไปเลย  */}

            <TextField name="organization" type="text"  className="flex flex-col items-center mt-10 md:mt-6">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>หน่วยงาน/องค์กร :</Label>
                <Input className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="key-signature" type="text"  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>Key Signature :</Label>
                <Input className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            {/* email password */}
            <TextField name="email" type="email" isRequired  className="flex flex-col items-center mt-10 md:mt-6">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>E-mail :</Label>
                <Input className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="password" type="password" isRequired  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>รหัสผ่าน :</Label>
                <Input className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="confirm-password" type="password" isRequired  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>ยืนยันรหัสผ่าน :</Label>
                <Input className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg p-2 md:p-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

                    
            <section className='flex justify-center items-center mt-5'>
              <div>
              <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    />
              </div>
              <p className='font-semibold'> ฉันยืนยันว่าข้อมูลถูกต้อง</p>
             
            </section>

            {/* submit ไปแล้ว ขึ้นalertด้วย */}
            <div className='flex justify-center mt-2'>
              <Button type="submit" className="drop-shadow-lg bg-[#597E52] w-[13rem] rounded-full p-3 text-center 
              text-white text-xl font-semibold md:text-base hover:bg-[#81b077] duration-300">
                ลงทะเบียน
              </Button>
            </div>
            

            
          </Form>
            {/* เหลือ footer */}
        </div>
        </div>
    

      
    </div>
  )
}

export default index
