'use client'

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { editContact } from "@/app/action/contact.action"
import { getSingleLead } from "@/app/action/lead.action"
import CallLogSection from "@/app/components/lead/CallLogSection"
import DialogSection from "@/app/components/lead/DialogSection"
import MoreInfo from "@/app/components/lead/MoreInfo"
import ReminderSection from "@/app/components/lead/RimenderSection"
import { convertToPersianDate } from "@/app/utils/helpers"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "react-multi-date-picker"
import { toast } from "react-toastify"
import { useUser } from "@/app/context/UserProvider"

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
export default function EditLead() {
    const [mutated, setMutated] = useState(false)
    const [singleLead, setSingleLead] = useState<any>([])
    const [owner, setOwner] = useState(false)
    const [deletedCheck, setDeletedCheck] = useState(false)
    const [popup, setPopup] = useState(false)
    const [customerPopup, setCustomerPopup] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const { user } = useUser()
    const fetchLead = useCallback(async () => {
        if (user?._id !== undefined) {
            let lead = await getSingleLead(id)
            lead?.expert?._id == undefined ? setOwner(true) : lead?.expert?._id == user?._id ? setOwner(true) : setOwner(false)
            lead.isDeleted === false ? setSingleLead(lead) : setDeletedCheck(true)
        }
    }, [user])
    useEffect(() => {
        fetchLead()
    }, [fetchLead, mutated])

    const { handleSubmit: handleSubmit3, register: register3, setValue: setValue3, control } = useForm<FormValues3>({ values: { name: singleLead?.contactId?.name, phone_number_1: singleLead?.contactId?.phone_number_1, phone_number_2: singleLead?.contactId?.phone_number_2, email: singleLead?.contactId?.email, title: singleLead?.contactId?.title, address: singleLead?.contactId?.address, source: singleLead?.contactId?.source, description: singleLead?.contactId?.description, birthdayDate: singleLead?.contactId?.birthdayDate !== undefined ? Date.parse(singleLead?.contactId?.birthdayDate) : 0, } })
    const handleEditContact = async (obj: any) => {
        obj.status = singleLead?.contactId?.status
        let res = await editContact(singleLead?.contactId?._id, obj)
        if (!res.error) {
            toast.success('انجام شده')
            setMutated(!mutated)
        } else {
            toast.error('ridi')
        }
        setEditInfo(false)
    }

    if (deletedCheck) {
        return <p>این سرنخ حذف یا تبدیل گردیده است</p>
    }

    if (singleLead?.contactId !== undefined) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/crm/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/crm/leads">لیست سرنخ ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{singleLead?.contactId?.name}</li>
                    </ol>
                </nav>
                <section className="d-flex flex-column flex-md-row">
                    <section className="col-md-8 ps-2">
                        <section className="main-body-container rounded">
                            <form action="post" onSubmit={handleSubmit3(handleEditContact)} method='Post'>
                                <section className="row">
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">نام و نام خانوادگی </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.name} </p> : <input type="text" className="form-control form-control-sm" {...register3('name', { required: 'نام و نام خانوادگی را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس یک </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.phone_number_1} </p> : <input type="number" className="form-control form-control-sm" {...register3('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس دو </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.phone_number_2} </p> : <input type="number" className="form-control form-control-sm" {...register3('phone_number_2', { required: 'شماره تماس دو را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس ایمیل </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.email !== '' ? singleLead?.contactId?.email : '---'}  </p> : <input type="text" className="form-control form-control-sm" {...register3('email')} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">منبع ورودی </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.source !== '' ? singleLead?.contactId?.source : '---'}  </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue3('source', e.target.value)}>
                                            {singleLead?.contactId?.source !== '' ? <option value={singleLead?.contactId?.source} hidden>{singleLead?.contactId?.source}</option> : <option value='' hidden>منبع ورودی را انتخاب کنید</option>}
                                            <option value='سایت'>سایت</option>
                                            <option value='نمایشگاه'>نمایشگاه</option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">عنوان </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.title !== '' ? singleLead?.contactId?.title : '---'} </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue3('title', e.target.value)}>
                                            {singleLead?.contactId?.title !== '' ? <option value={singleLead?.contactId?.title} hidden>{singleLead?.contactId?.title}</option> : <option value='' hidden>عنوان برای سرنخ  انتخاب کنید</option>}

                                            <option value='مدیر گروه'>مدیر گروه </option>
                                            <option value='کارشناس'>کارشناس </option>
                                            <option value='سرپرست'>سرپرست </option>
                                            <option value='کاربر'>کاربر </option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">تاریخ تولد </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.birthdayDate !== '' ? convertToPersianDate(singleLead?.contactId?.birthdayDate, 'YMD') : '---'}  </p> : <div className='datePicker'>
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
                                        {!editInfo ? <p>{singleLead?.contactId?.address !== '' ? singleLead?.contactId?.address : '---'}  </p> : <textarea className="form-control form-control-sm" placeholder='آدرس کامل  ' {...register3('address')} ></textarea>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">توضیحات  </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.description !== '' ? singleLead?.contactId?.description : '---'} </p> : <textarea className="form-control form-control-sm" placeholder='توضیحات  ' {...register3('description')} ></textarea>}
                                    </div>
                                    {editInfo &&
                                        <div className="col-12 my-2">
                                            <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>
                                        </div>}
                                </section>
                            </form>
                            {!editInfo &&
                                <div className="col-12 my-2">
                                    {owner && <button type='button' onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>}
                                </div>}
                        </section>
                        <DialogSection owner={owner} singleLead={singleLead} mutated={() => setMutated(!mutated)} />
                    </section>
                    <section className="col-md-4 pe-2">
                        <MoreInfo owner={owner} singleLead={singleLead} mutated={() => setMutated(!mutated)} popUp={() => setPopup(!popup)} customerPopup={() => setCustomerPopup(!customerPopup)} />
                        <ReminderSection owner={owner} singleLead={singleLead} mutated={() => setMutated(!mutated)} />
                        <CallLogSection owner={owner} singleLead={singleLead} mutated={() => setMutated(!mutated)} />
                    </section>
                </section>
            </>
        )
    } else {
        return <p>درحال دریافت اطلاعات</p>
    }
}