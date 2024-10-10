'use client'

import { editContact } from "@/app/action/contact.action"
import { editCustomer, getSingleCustomer } from "@/app/action/customer.action"
import CallLogSectionCus from "@/app/components/customer/CallLogSection"
import DialogSectionCus from "@/app/components/customer/DialogSection"
import MoreInfoCus from "@/app/components/customer/MoreInfo"
import ReminderSectionCus from "@/app/components/customer/RimenderSection"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "react-multi-date-picker"
import { toast } from "react-toastify"

interface FormValues3 {
    name: string
    phone_number_1: number
    phone_number_2: number
    title: string
    source: string
    description: string
    address: string
    email: string
    birthdayDate: number
}
export default function EditCustomer() {
    const [mutated, setMutated] = useState(false)
    const [singleCustomer, setSingleCustomer] = useState<any>([])
    const [owner, setOwner] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const { user } = useUser()
    const fetchCustomer = useCallback(async () => {
        if (user?._id !== undefined) {
            let customer = await getSingleCustomer(id) 
            customer?.expert?._id == undefined ? setOwner(true) : customer?.expert?._id == user?._id ? setOwner(true) : setOwner(false)
            setSingleCustomer(customer)
        }
    }, [user])

    useEffect(() => {
        fetchCustomer()
    }, [fetchCustomer, mutated])

    const { handleSubmit, register, setValue, control } = useForm<FormValues3>({ values: { name: singleCustomer?.contactId?.name, phone_number_1: singleCustomer?.contactId?.phone_number_1, phone_number_2: singleCustomer?.contactId?.phone_number_2, email: singleCustomer?.contactId?.email, title: singleCustomer?.contactId?.title, address: singleCustomer?.contactId?.address, source: singleCustomer?.contactId?.source, description: singleCustomer?.contactId?.description, birthdayDate: singleCustomer?.contactId?.birthdayDate !== undefined ? Date.parse(singleCustomer?.contactId?.birthdayDate) : 0, } })

    const handleEditContact = async (obj: any) => {
        obj.status = singleCustomer?.contactId?.status
        let res = await editContact(singleCustomer?.contactId?._id, obj)
        if (!res.error) {
            await editCustomer(singleCustomer?._id, {}, user?._id)
            toast.success('انجام شده')
            setMutated(!mutated)
        } else {
            toast.error('ridi')
        }
        setEditInfo(false)
    }
    if (singleCustomer?.contactId !== undefined) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/crm/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/crm/customers">لیست مشتری ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{singleCustomer?.contactId?.name}</li>
                    </ol>
                </nav>
                <section className="d-flex flex-column flex-md-row">
                    <section className="col-md-8 ps-2">
                        <section className="main-body-container rounded">
                            <form action="post" onSubmit={handleSubmit(handleEditContact)} method='Post'>
                                <section className="row">
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">نام و نام خانوادگی </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.name} </p> : <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام و نام خانوادگی را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس یک </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.phone_number_1} </p> : <input type="number" className="form-control form-control-sm" {...register('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس دو </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.phone_number_2} </p> : <input type="number" className="form-control form-control-sm" {...register('phone_number_2', { required: 'شماره تماس دو را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس ایمیل </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.email !== '' ? singleCustomer?.contactId?.email : '---'}  </p> : <input type="text" className="form-control form-control-sm" {...register('email')} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">منبع ورودی </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.source !== '' ? singleCustomer?.contactId?.source : '---'}  </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue('source', e.target.value)}>
                                            {singleCustomer?.contactId?.source !== '' ? <option value={singleCustomer?.contactId?.source}>{singleCustomer?.contactId?.source}</option> : <option value='' hidden>منبع ورودی را انتخاب کنید</option>}
                                            <option value='سایت'>سایت</option>
                                            <option value='نمایشگاه'>نمایشگاه</option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">عنوان </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.title !== '' ? singleCustomer?.contactId?.title : '---'} </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue('title', e.target.value)}>
                                            {singleCustomer?.contactId?.title !== '' ? <option value={singleCustomer?.contactId?.title}>{singleCustomer?.contactId?.title}</option> : <option value='' hidden>عنوان برای مشتری انتخاب کنید</option>}
                                            <option value='مدیر گروه'>مدیر گروه </option>
                                            <option value='کارشناس'>کارشناس </option>
                                            <option value='سرپرست'>سرپرست </option>
                                            <option value='کاربر'>کاربر </option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">تاریخ تولد </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.birthdayDate !== '' ? convertToPersianDate(singleCustomer?.contactId?.birthdayDate, 'YMD') : '---'}  </p> : <div className='datePicker'>
                                            <Controller
                                                control={control}
                                                name="birthdayDate"
                                                render={({ field: { onChange, value } }) => (
                                                    <DatePicker className="form-control " format="YYYY/MM/DD" value={value || ''} calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date); }} />
                                                )} />
                                        </div>}
                                    </div>
                                    <div className="col-12 col-md-6"></div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس  </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.address !== '' ? singleCustomer?.contactId?.address : '---'}  </p> : <textarea className="form-control form-control-sm" placeholder='آدرس کامل  ' {...register('address')} ></textarea>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">توضیحات  </label>
                                        {!editInfo ? <p>{singleCustomer?.contactId?.description !== '' ? singleCustomer?.contactId?.description : '---'} </p> : <textarea className="form-control form-control-sm" placeholder='توضیحات  ' {...register('description')} ></textarea>}
                                    </div>
                                    {editInfo &&
                                        <div className="col-12 my-2">
                                            <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>
                                        </div>}
                                </section>
                            </form>
                            {(!editInfo && owner) &&
                                <div className="col-12 my-2">
                                    <button type='button' onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>
                                </div>}
                        </section>
                        <DialogSectionCus owner={owner} singleCustomer={singleCustomer} mutated={() => setMutated(!mutated)} />
                    </section>
                    <section className="col-md-4 pe-2">
                        <MoreInfoCus owner={owner} singleCustomer={singleCustomer} mutated={() => setMutated(!mutated)} />
                        <ReminderSectionCus owner={owner} singleCustomer={singleCustomer} mutated={() => setMutated(!mutated)} />
                        <CallLogSectionCus owner={owner} singleCustomer={singleCustomer} mutated={() => setMutated(!mutated)} />
                    </section>
                </section>
            </>
        )
    } else {
        return <p>درحال دریافت اطلاعات</p>
    }
}