'use client'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/app/context/UserProvider'
import { createContact } from '@/app/action/contact.action'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { getCustomerCats } from '@/app/action/customerCat.action'
import { nanoid } from 'nanoid'
import { getCompanies } from '@/app/action/company.action'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { convertToTimeStamp } from '@/app/utils/helpers'

interface FormValues1 {
    name: string
    phone_number_1: number
    phone_number_2: number
    title: string
    birthdayDate: number
    source: string
    description: string
    address: string
    email: string
    status: string
    categoryId: string
    companyId: string
}
export default function CreateContact() {
    const { handleSubmit, register, reset, setValue, control } = useForm<FormValues1>()
    const [mutated, setMutated] = useState(false)
    const { user } = useUser()
    const [companyList, setCompanyList] = useState<any>([])
    const [catList, setCatList] = useState<any>([])
    const router = useRouter()
    const handleCreateContact = async (obj: any) => {
        obj.creator = user?._id
        obj.birthdayDate = obj.birthdayDate !== undefined ? convertToTimeStamp(obj.birthdayDate) : undefined
        obj.status = 'مخاطب جدید'
        let res = await createContact(obj)
        if (!res.error) {
            toast.success('ایجاد شد')
            setMutated(!mutated)
            reset()
            router.replace('/expert/contacts')
        } else {
            toast.error('ناموفق بود')
        }
    }
    const fetchData = useCallback(async () => {
        let categories = await getCustomerCats({ isDeleted: false })
        setCatList(categories)
        let companies = await getCompanies({ isDeleted: false })
        setCompanyList(companies)
    }, [])
    useEffect(() => {
        fetchData()
    }, [fetchData, mutated])
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/expert/">داشبورد</Link></li>
                    <li className="breadcrumb-item "> <Link href="/expert/contacts"> مخاطبان</Link> </li>
                    <li className="breadcrumb-item  active" aria-current="page"> افزودن مخاطب جدید </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateContact)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام و نام خانوادگی </label>
                            <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام و نام خانوادگی را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره تماس یک </label>
                            <input type="number" className="form-control form-control-sm" {...register('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره تماس دو </label>
                            <input type="number" className="form-control form-control-sm" {...register('phone_number_2', { required: 'شماره تماس دو را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">آدرس ایمیل </label>
                            <input type="text" className="form-control form-control-sm" {...register('email')} />
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
                            <label className='my-1' htmlFor="">وضعیت </label>
                            <input type='text' disabled className="form-control form-control-sm" value='مخاطب جدید' />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">زمینه فعالیتی </label>
                            <select onChange={(e: any) => setValue('categoryId', e.target.value)} className="form-control form-control-sm">
                                <option value='' hidden>یک زمینه را انتخاب کنید</option>
                                {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شرکت مربوطه </label>
                            <select onChange={(e: any) => setValue('companyId', e.target.value)} className="form-control form-control-sm">
                                <option value='' hidden>یک شرکت را انتخاب کنید</option>
                                {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">عنوان </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('title', e.target.value)}>
                                <option value='' hidden>عنوان برای سرنخ  انتخاب کنید</option>
                                <option value='مدیر گروه'>مدیر گروه </option>
                                <option value='کارشناس'>کارشناس </option>
                                <option value='سرپرست'>سرپرست </option>
                                <option value='کاربر'>کاربر </option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">تاریخ تولد </label>
                            <div className='datePicker'>
                                <Controller
                                    control={control}
                                    name="birthdayDate"
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker className="form-control " format="YYYY/MM/DD" value={value || ''} calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date); }} />
                                    )} />
                            </div>
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
