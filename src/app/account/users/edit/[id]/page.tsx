'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { editClient, getSingleClient } from '@/app/action/client.action'
 import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface FormValues1 {
    name: string
    role: string
    password: string
    mobile_number: number
}
export default function EditUser() {
    const { id }: any = useParams()
     const [singleClient, setSingleClient] = useState<any>()
     const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const fetchSingle = useCallback(async () => {
        let client = await getSingleClient(id)
        setSingleClient(client)
    }, []) 
    const { handleSubmit, register, reset, setValue } = useForm<FormValues1>({
        values: {
            password: singleClient?.password,
            name: singleClient?.name,
            role: singleClient?.role,
            mobile_number: singleClient?.mobile_number,
        }
    })

    const handleEditClient = async (obj: any) => {
        let res = await editClient(singleClient?._id, obj)
        if (!res.error) {
            toast.success('موفق بود')
            setMutated(!mutated)
            reset()
            router.replace('/account/users')
        } else {
            toast.error('ناموفق بود')
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
                    <li className="breadcrumb-item  active" aria-current="page">ویرایش کاربر {singleClient?.name}</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleEditClient)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">سطح دسترسی </label>
                            <select className="form-control form-control-sm" defaultValue={singleClient?.role} onChange={(e: any) => { setValue('role', e.target.value) }}>
                                <option value={singleClient?.role} hidden>{singleClient?.role == 1 ? 'مدیر' : 'ادمین'}</option>
                                <option value={1}>مدیر</option>
                                <option value={0}>ادمین</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">رمز عبور </label>
                            <input type="text" className="form-control form-control-sm" {...register('password', { required: 'رمز عبور را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام نمایشی </label>
                            <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام نمایشی را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره موبایل </label>
                            <input type="number" className="form-control form-control-sm" {...register('mobile_number', { required: 'شماره موبایل را وارد کنید', })} />
                        </div>

                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>
                        </div>
                    </section>
                </form>
            </section>
        </>
    );
}
