'use client'

import { signinClient, signinUser, signoutUser, signupClient, signupUser } from '@/app/action/auth.action'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserProvider'
import { toast } from 'react-toastify'

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
  const [admin, setAdmin] = useState(false)
  const router = useRouter()
  const { user, updateUser } = useUser()

  const handleSignupUser = async (obj: any) => {

    const result = toggle ?
      admin ? await signupUser(obj) : await signupClient(obj) :
      admin ? await signinUser(obj) : await signinClient(obj)


    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('انجام شد')
      updateUser(result)
      result.role === 2
        ? router.replace('/account/expert') // after login client expert user
        : result.role === 1
          ? router.replace('/account/client') // after login client admin
          : router.replace('/dashboard') // after login  admin
    }

    // useEffect(() => {
    //   if (user?._id) redirect('/leads')
    // }, [])
  }
  return (
    <div style={{ display: 'flex', width: '100%', gap: 20, padding: '100px 20%' }}>
      {!toggle &&
        <div style={{ width: '30%', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 20 }}>ورود</h2>
          <form method="post" style={{ display: 'flex', gap: 10, flexDirection: 'column' }} onSubmit={handleSubmit(handleSignupUser)}>
            <div> <label htmlFor="">نام کاربری</label>
              <input style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} type="text" {...register('user_name')} /></div>
            <div>  <label htmlFor="">رمز عبور</label>
              <input style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} type="text" {...register('password')} /></div>
            <div><button style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }} type="submit">ورود</button></div>
          </form>
          <div><button style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }} type="button" onClick={() => setToggle(!toggle)}>ثبت نام</button></div>
        </div>}

      {toggle &&
        <div style={{ width: '30%', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 20 }}>ثبت نام</h2>
          <form method="post" style={{ display: 'flex', gap: 10, flexDirection: 'column' }} onSubmit={handleSubmit(handleSignupUser)}>
            <div> <label htmlFor="">نام کاربری</label>
              <input style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} type="text" {...register('user_name')} /></div>
            <div> <label htmlFor="">شماره موبایل</label>
              <input style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} type="text" {...register('mobile_number')} /></div>
            <div>  <label htmlFor="">رمز عبور</label>
              <input style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} type="text" {...register('password')} /></div>
            <div><button style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }} type="submit">ثبت نام</button></div>
          </form>
          <div><button style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }} type="button" onClick={() => setToggle(!toggle)}>ورود</button></div>
        </div>}
      {admin ? <div><button style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }} type="button" onClick={() => setAdmin(!admin)}>ورود مشتری</button></div>
        : <div><button style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }} type="button" onClick={() => setAdmin(!admin)}>ورود ادمین</button></div>}

    </div>
  )
}

