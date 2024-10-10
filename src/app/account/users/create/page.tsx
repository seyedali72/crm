'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient, getSingleClient } from '@/app/action/client.action'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface FormValues1 {
    name: string
    user_name: string
    role: string
    password: string
    mobile_number: number
}
export default function CreateUser() {
    const { id }: any = useParams()
    const [singleClient, setSingleClient] = useState<any>()
    const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const fetchSingle = useCallback(async () => {
        let client = await getSingleClient(id)
        setSingleClient(client)
    }, [])
    const { handleSubmit, register, reset, setValue } = useForm<FormValues1>()

    const handleCreateClient = async (obj: any) => {
        let res = await createClient(obj)
        if (!res.error) {
            toast.success('موفق بود')
            setMutated(!mutated)
            reset()
            router.replace('/account/users')
        } else {
            toast.error('ridi')
        }
    }

    useEffect(() => {
        fetchSingle()
    }, [fetchSingle, mutated])

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item "> <Link href="/account/client"> کاربران</Link> </li>
                    <li className="breadcrumb-item  active" aria-current="page">تعریف کاربر {singleClient?.name}</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateClient)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام نمایشی </label>
                            <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام نمایشی را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">سطح دسترسی </label>
                            <select className="form-control form-control-sm" required onChange={(e: any) => { setValue('role', e.target.value) }}>
                                <option value='' hidden>یک گزینه را انتخاب کنید</option>
                                <option value={1}>مدیر</option>
                                <option value={0}>ادمین</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">رمز عبور </label>
                            <input type="text" className="form-control form-control-sm" {...register('password', { required: 'رمز عبور را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام کاربری </label>
                            <input type="text" className="form-control form-control-sm" {...register('user_name', { required: 'نام کاربری را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره موبایل </label>
                            <input type="number" className="form-control form-control-sm" {...register('mobile_number', { required: 'شماره موبایل را وارد کنید', })} />
                        </div>
                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت </button>
                        </div>
                    </section>
                </form>
            </section>
        </>
    );
}
