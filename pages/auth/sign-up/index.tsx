import Sidebar from '@/components/layout/Sidebar';
import React, { useState } from 'react'
import {Button, FieldError, Form, Input, Label, TextField} from 'react-aria-components';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2'
import { SignUpService } from '@/services/auth';

type SignUpData = {
    firstName? : string;
    lastName? : string;
    organization? : string;
    keySignature?: string;
    email?: string;
    phone? : string;
    password? : string;
    confirmPassword?: string;
  }


const Index = () => {
  const [signUpData,setSignUpData] = useState<SignUpData>();
  
  const handleChangeSignUpData = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setSignUpData((prev) => {
      return {
         ...prev,
         [name]: value
      }
    })
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังบันทึกข้อมูล",
        didOpen: () => {
          Swal.showLoading();
        },
      });

       const update = await SignUpService({
        email : signUpData?.email,
        firstName : signUpData?.firstName,
        lastName : signUpData?.lastName,
        organization : signUpData?.organization,
        phone : signUpData?.phone,
        password : signUpData?.password,
       })

      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง"
      });
      //signup เสร็จให้เด้งไปหน้า sign-in
      
    }catch(error:any){
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message,
        icon: "error",
        confirmButtonText: "ตกลง"
      });
    }
  }


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

          
          <Form onSubmit={handleSubmit} className='flex flex-col mt-5 md:mt-3 w-[85%] gap-3'>

            <TextField name="first-name" type="text" isRequired className="flex flex-col items-center mt-4 md:mt-5">
              <div className='flex flex-col md:flex-row gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold '>ชื่อจริง :</Label>
                <Input onChange={handleChangeSignUpData} className="w-[20rem]  border-solid border-[1px] border-slate-300 rounded-lg px-3 py-2 md:py-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="last-name" type="text" isRequired className="flex flex-col items-center  md:mt-2">
              <div className='flex flex-col md:flex-row gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>นามสกุล :</Label>
                <Input onChange={handleChangeSignUpData}  className="w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg  px-3 py-2 md:py-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            {/* องค์กร เอาขนาดเต็มไปเลย  */}

            <TextField name="organization" type="text"  className="flex flex-col items-center mt-10 md:mt-6">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>หน่วยงาน/องค์กร :</Label>
                <Input onChange={handleChangeSignUpData}  className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg  px-3 py-2 md:py-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="key-signature" type="text"  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>Key Signature :</Label>
                <Input onChange={handleChangeSignUpData}  className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg px-3 py-2 md:py-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            {/* email password */}
            <TextField name="email" type="email" isRequired  className="flex flex-col items-center mt-10 md:mt-6">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>E-mail :</Label>
                <Input onChange={handleChangeSignUpData}  className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg px-3 py-2 md:py-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="password" type="password" isRequired  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>รหัสผ่าน :</Label>
                <Input onChange={handleChangeSignUpData}  className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg px-3 py-2 md:py-1"/>
              </div>
              <div className='w-full flex justify-center'>
                <FieldError className="mt-2 text-red-600 text-sm w-[90%] text-center" />
              </div>
            </TextField>

            <TextField name="confirm-password" type="password" isRequired  className="flex flex-col items-center ">
              <div className='flex flex-col gap-2 justify-start items-start'>
                <Label className='text-[#597E52] text-xl md:text-base font-semibold'>ยืนยันรหัสผ่าน :</Label>
                <Input onChange={handleChangeSignUpData}  className="md:w-[25rem] w-[20rem] border-solid border-[1px] border-slate-300 rounded-lg px-3 py-2 md:py-1"/>
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

export default Index
