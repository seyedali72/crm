'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/app/context/UserProvider'
import { createCompany } from '@/app/action/company.action'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface FormValues1 {
    name: string
    phone_number_1: number
    phone_number_2: number
    website: string
    source: string
    description: string
    address: string
    email: string
}
export default function CreateCompany() {
    const { handleSubmit, register, reset, setValue } = useForm<FormValues1>()
    const [mutated, setMutated] = useState(false)
    const { user } = useUser()
    const router = useRouter()
    const handleCreateCompany = async (obj: any) => {
        obj.creator = user?._id
        let res = await createCompany(obj)
        if (!res.error) {
            toast.success('ایجاد شد')
            setMutated(!mutated)
            reset()
            router.replace('/account/companies')
        } else {
            toast.error('ridi')
        }
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item "> <Link href="/account/companies"> شرکت ها</Link> </li>
                    <li className="breadcrumb-item  active" aria-current="page"> افزودن شرکت جدید </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateCompany)} method='Post'>
                    <section className="row">

                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام شرکت </label>
                            <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام شرکت را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره تماس یک </label>
                            <input type="number" className="form-control form-control-sm" {...register('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره تماس دو </label>
                            <input type="number" className="form-control form-control-sm" {...register('phone_number_2')} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">آدرس ایمیل </label>
                            <input type="text" className="form-control form-control-sm" {...register('email')} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">آدرس وبسایت </label>
                            <input type="text" className="form-control form-control-sm" {...register('website')} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">منبع ورودی </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('source', e.target.value)}>
                                <option value='' hidden>منبع ورودی را انتخاب کنید</option>
                                <option value='سایت'>سایت</option>
                                <option value='نمایشگاه'>نمایشگاه</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">آدرس  </label>
                            <textarea className="form-control form-control-sm" placeholder='آدرس کامل  ' {...register('address')} ></textarea>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">توضیحات  </label>
                            <textarea className="form-control form-control-sm" placeholder='توضیحات  ' {...register('description')} ></textarea>
                        </div>
                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت</button>
                        </div>
                    </section>
                </form>
            </section>


        </div>

    );
}
