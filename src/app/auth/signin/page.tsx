'use client'

import { signinClient, signupClient } from '@/app/action/auth.action'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserProvider'
import { toast } from 'react-toastify'
import { signinExpert } from '@/app/action/expert.action'
import { signinEmployee } from '@/app/action/employe.action'

interface FormValues {
  mobile_number: string
  user_name: string
  password: string
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
  } = useForm<FormValues>()
  const [toggle, setToggle] = useState(false)
  const [employee, setEmployee] = useState(true)
  const [securityCode, setSecurityCode] = useState('')
  const [admin, setAdmin] = useState(true)
  const router = useRouter()
  const { updateUser } = useUser()

  const handleSignupUser = async (obj: any) => {
    const result = employee ? await signinEmployee(obj) : toggle ? await signupClient(obj) : admin ? await signinClient(obj) : await signinExpert(obj)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('انجام شد')
      updateUser(result)
      result.role === 2
        ? router.replace(`/crm/dashboard`) // after login client manager crm
        : result.role === 0
          ? router.replace(`/employee/dashboard`) // after login employee user
          : result.role === 4
            ? router.replace(`/expert/dashboard`) // after login client expert user
            : result.role === 1
              ? router.replace('/account/dashboard') // after login client admin
              : router.replace('/account/experts') // after login  admin
    }

    // useEffect(() => {
    //   if (user?._id !== undefined) {
    //     result.role === 2
    //       ? router.replace(`/crm/dashboard`) // after login client manager crm
    //       : result.role === 4
    //         ? router.replace(`/expert/dashboard`) // after login client expert user
    //         : result.role === 1
    //           ? router.replace('/account/dashboard') // after login client admin
    //           : router.replace('/account/experts') // after login  admin
    //   }
    // }, [user])
  }
  return (
    <div className='d-flex flex-column gap-3 py-5 px-5 justify-content-center align-item-center loginBackground' >
      {!toggle ?
        <div className={` w-50 p-4 rounded-2 ${employee ? 'bg-light' : admin ? 'bg-light-subtle' : 'bg-white'} `}>
          <div className="d-flex justify-content-between">
            <h2 className='mb-4 text-center'>{employee ? 'ورود کارمند' : admin ? ' ورود مدیریت' : 'ورود کارشناس'}</h2>
            <div className="d-flex justify-content-between gap-1">
              {admin ? <div><button className='px-3 py-2 border-0 rounded-2 text-white text-center bg-custom-3' type="button" onClick={() => { setAdmin(!admin), setEmployee(false) }}>ورود کارشناس</button></div>
                : <div><button className='px-3 py-2 border-0 rounded-2 text-white text-center bg-custom-3' type="button" onClick={() => { setAdmin(!admin), setEmployee(false) }}>ورود مدیریت</button></div>}
              <div><button className='px-3 py-2 border-0 rounded-2 text-white text-center bg-custom-1' type="button" onClick={() => { setEmployee(!employee), setToggle(false), setAdmin(false) }}>ورود کارمند</button></div>

            </div>
          </div>
          <form method="post" className='d-flex flex-column gap-3' onSubmit={handleSubmit(handleSignupUser)}>
            <div> <label htmlFor="">{employee ? 'شماره ملی' : ' نام کاربری'}</label>
              <input className='form-control  my-2' type="text" {...register('user_name')} /></div>
            <div>  <label htmlFor="">{employee ? 'شماره موبایل' : ' رمز عبور'}</label>
              <input className='form-control  my-2' type="text" {...register('password')} /></div>
            <div><button className='w-100 py-2 border-0 rounded-2 text-white text-center bg-custom-2' type="submit">{employee ? 'ورود کارمند' : admin ? ' ورود مدیریت' : 'ورود کارشناس'}</button></div>
          </form>
          <div><button className='w-100 py-2 border-0 mt-2 rounded-2 text-white text-center bg-custom-4' type="button" onClick={() => { setToggle(!toggle), setEmployee(false) }}>ثبت نام</button></div>
        </div> :
        <div className='w-50 bg-white p-4 rounded-2'>
          <h2 className='mb-4'>ثبت نام</h2>
          <form method="post" className='d-flex flex-column gap-3' onSubmit={handleSubmit(handleSignupUser)}>
            <div> <label htmlFor="">نام کاربری</label>
              <input className='form-control  my-2' type="text" {...register('user_name')} /></div>
            <div> <label htmlFor="">شماره موبایل</label>
              <input className='form-control  my-2' type="number" {...register('mobile_number')} /></div>
            <div>  <label htmlFor="">رمز عبور</label>
              <input className='form-control  my-2' type="password" {...register('password')} /></div>
            <div>  <label htmlFor="">کد امنیتی</label>
              <input className='form-control  my-2' type="password" onChange={(e: any) => setSecurityCode(e.target.value)} /></div>
            <div><button className='w-100 py-2 border-0 mt-2 rounded-2 text-white text-center bg-custom-2' disabled={securityCode !== '123456'} type="submit">ثبت نام</button></div>
          </form>
          <div><button className='w-100 py-2 border-0 mt-2 rounded-2 text-white text-center bg-custom-4' type="button" onClick={() => { setToggle(!toggle), setEmployee(true) }}>ورود</button></div>
        </div>}

    </div>
  )
}

