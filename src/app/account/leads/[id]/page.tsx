'use client'

import { getSingleLead } from "@/app/action/lead.action"
import { getReminders } from "@/app/action/reminder.action"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"

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
    const [reminderList, setReminderList] = useState<any>([])
    const [reminderId, setReminderId] = useState<any>('')
    const [singleLead, setSingleLead] = useState<any>([])
    const [popup, setPopup] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const fetchLead = useCallback(async () => {
        let lead = await getSingleLead(id)
        setSingleLead(lead)
        let reminders = await getReminders({ isDeleted: false, leadId: lead?._id })
        setReminderList(reminders)
    }, [])
    useEffect(() => {
        fetchLead()
    }, [fetchLead])


    const { register, setValue, control } = useForm<FormValues3>({ values: { name: singleLead?.name, phone_number_1: singleLead?.phone_number_1, phone_number_2: singleLead?.phone_number_2, email: singleLead?.email, title: singleLead?.title, address: singleLead?.address, source: singleLead?.source, description: singleLead?.description, birthdayDate: singleLead?.birthdayDate !== undefined ? Date.parse(singleLead?.birthdayDate) : 0, } })

    let reverseArray = singleLead?.dialog?.slice()?.reverse()
    let reverseArrayCall = singleLead?.call?.slice()?.reverse()
    let inCall = singleLead?.call?.filter((el: any) => el.status == 'تماس ورودی')
    let successCall = singleLead?.call?.filter((el: any) => el.status == 'تماس موفق')
    let brokenCall = singleLead?.call?.filter((el: any) => el.status == 'تماس بی پاسخ')
    let offCall = singleLead?.call?.filter((el: any) => el.status == 'دردسترس نبود')
    let a = singleLead?.edits?.length > 0 ? Date.parse(singleLead?.edits[singleLead?.edits?.length - 1]?.time) : 0
    let b = singleLead?.call?.length > 0 ? Date.parse(singleLead?.call[singleLead?.call?.length - 1]?.time) : 0
    let c = singleLead?.dialog?.length > 0 ? Date.parse(singleLead?.dialog[singleLead?.dialog?.length - 1]?.time) : 0
    let lastActivityArr = [a, b, c]
    const lastActivityResult = lastActivityArr.reduce((c: any, d: any) => Math.max(c, d));



    if (singleLead?._id !== undefined) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/account/leads">لیست سرنخ ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{singleLead?.name}</li>
                    </ol>
                </nav>
                {popup && <div className="popupCustom">
                    <section className="main-body-container rounded">
                        <div className="d-flex justify-content-between"> <h5>جزئیات یادآوری </h5>
                            <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                        </div>
                        <form method="post" className="col-12 d-flex flex-column gap-2">
                            <div className="col-12">
                                <label className="my-1" >{reminderId?.type}</label>
                               <p className="">{convertToPersianDate(reminderId?.schedule,'YYMDHM')}</p>
                            </div>
                            <div className="col-12">
                                <label className="my-1" >توضیحات اضافی</label>
                               <p className="mb-0">{reminderId?.description}</p>
                            </div>
                         </form>
                         <div className="col-12"><button type="button" onClick={() => setPopup(false)} className="btn w-100 btn-sm bg-custom-2 text-white px-3" >بستن پاپ آپ</button></div>
                    </section>
                </div>}
                <section className="d-flex flex-column flex-md-row">
                    <section className="col-md-8 ps-2">
                        <section className="main-body-container rounded">
                            <form action="post" method='Post'>
                                <section className="row">
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">نام و نام خانوادگی </label>
                                        {!editInfo ? <p>{singleLead?.name} </p> : <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام و نام خانوادگی را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس یک </label>
                                        {!editInfo ? <p>{singleLead?.phone_number_1} </p> : <input type="number" className="form-control form-control-sm" {...register('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس دو </label>
                                        {!editInfo ? <p>{singleLead?.phone_number_2} </p> : <input type="number" className="form-control form-control-sm" {...register('phone_number_2', { required: 'شماره تماس دو را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس ایمیل </label>
                                        {!editInfo ? <p>{singleLead?.email !== '' ? singleLead?.email : '---'}  </p> : <input type="text" className="form-control form-control-sm" {...register('email')} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">منبع ورودی </label>
                                        {!editInfo ? <p>{singleLead?.source !== '' ? singleLead?.source : '---'}  </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue('source', e.target.value)}>
                                            {singleLead?.source !== '' ? <option hidden value={singleLead?.source}>{singleLead?.source}</option> : <option value='' hidden>منبع ورودی را انتخاب کنید</option>}
                                            <option value='سایت'>سایت</option>
                                            <option value='نمایشگاه'>نمایشگاه</option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">عنوان </label>
                                        {!editInfo ? <p>{singleLead?.title !== '' ? singleLead?.title : '---'} </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue('title', e.target.value)}>
                                            {singleLead?.title !== '' ? <option hidden value={singleLead?.title}>{singleLead?.title}</option> : <option value='' hidden>عنوان برای سرنخ  انتخاب کنید</option>}
                                            <option value='مدیر گروه'>مدیر گروه </option>
                                            <option value='کارشناس'>کارشناس </option>
                                            <option value='سرپرست'>سرپرست </option>
                                            <option value='کاربر'>کاربر </option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">تاریخ تولد </label>
                                        {!editInfo ? <p>{singleLead?.birthdayDate !== '' ? convertToPersianDate(singleLead?.birthdayDate, 'YMD') : '---'}  </p> : <div className='datePicker'>
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
                                        {!editInfo ? <p>{singleLead?.address !== '' ? singleLead?.address : '---'}  </p> : <textarea className="form-control form-control-sm" placeholder='آدرس کامل  ' {...register('address')} ></textarea>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">توضیحات  </label>
                                        {!editInfo ? <p>{singleLead?.description !== '' ? singleLead?.description : '---'} </p> : <textarea className="form-control form-control-sm" placeholder='توضیحات  ' {...register('description')} ></textarea>}
                                    </div>

                                </section>
                            </form>

                        </section>
                        <section className="main-body-container rounded">
                            <h5>لیست مکالمات</h5>

                            {reverseArray?.map((el: any, idx: number) => {
                                return (
                                    <div key={nanoid()} className="d-flex align-items-end border-1 border-bottom p-2 mb-2">
                                        <div className="w-100">
                                            <p>{el.text}</p>
                                            <div className="d-flex w-100 justify-content-between"  ><p className="mb-0">{convertToPersianDate(el.time, 'YMDHM')}</p>
                                                {el?.editedTime && <p className="mb-0"><i className="fa fa-edit mx-1"></i> {convertToPersianDate(el?.editedTime, 'YMDHM')}</p>}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </section>
                    </section>
                    <section className="col-md-4 pe-2">
                        <section className="main-body-container rounded">
                            {singleLead?.expert !== undefined ? <p className="w-100 d-flex justify-content-between align-item-center"><span>نام کارشناس: <Link href={`/account/expert/${singleLead?.expert?._id}`}> {singleLead?.expert?.employe_id?.name}</Link></span>
                            </p> : <p className="w-100 d-flex justify-content-between align-item-center">بدون کارشناس</p>}
                            {singleLead?.assignedAt !== undefined && <p>زمان اختصاص به کارشناس <b> {convertToPersianDate(singleLead?.assignedAt, 'YMDHM')}</b></p>}
                            <p>زمان ساخت سرنخ <b>{convertToPersianDate(singleLead?.createdAt, "YMDHM")}</b></p>
                            {lastActivityResult !== 0 && <p>آخرین فعالیت روی سرنخ <b>{convertToPersianDate(lastActivityResult, "YMDHM")}  </b></p>}

                            {singleLead?.contactId !== undefined && <div className="d-flex gap-1 align-items-center mb-3">
                                <span className="text-nowrap" >شرکت مربوطه سرنخ:</span>
                                {singleLead?.companyId == undefined ? 'تعریف نشده است' : <Link href={`/account/companeis/${singleLead?.companyId?._id}`}>{singleLead?.companyId?.name}</Link>}
                            </div>}

                            <div className="d-flex gap-1 align-items-center mb-3">
                                <span className="text-nowrap" >زمینه فعالیتی سرنخ:</span>
                                {singleLead?.categoryId == undefined ? 'تعریف نشده است' : <Link href={`/account/customers/categoreis/${singleLead?.categoryId?._id}`}>{singleLead?.categoryId?.name}</Link>}
                            </div>
                            <div className="d-flex gap-1 align-items-center mb-2">
                                <span >وضعیت:</span> {singleLead?.status}
                            </div>
                        </section>
                        <section className="main-body-container rounded">
                            <div className="d-flex justify-content-between mb-2"> <b>یادآور</b>

                            </div>
                            {reminderList?.map((reminder: any) => {
                                return (<p key={nanoid()} className="mb-1 py-1 cursorPointer fs90" onClick={() => { setReminderId(reminder), setPopup(!popup) }}><i className={`fa ${reminder?.type == 'مناسبت تقویمی' ? 'fa-calendar' : reminder?.type == 'مناسبت تولد' ? 'fa-birthday-cake' : reminder?.type == 'تماس تلفنی' ? 'fa-phone' : 'fa-calendar-check-o'}`}></i>{' '}{reminder?.type}{' '}<b>{convertToPersianDate(reminder?.schedule, 'YYMDHM')}</b></p>)
                            })}
                        </section>
                        <section className="main-body-container rounded">
                            <div className="d-flex align-items-center justify-content-between mb-2"><b>تماس ها:  {singleLead?.call?.length} عدد</b>

                            </div>
                            <div style={{ display: 'flex', gap: 10, padding: ' 10px 0', fontSize: 13 }}>
                                <p> ورودی: {inCall?.length} عدد</p>
                                <p> موفق: {successCall?.length} عدد</p>
                                <p> بی پاسخ: {brokenCall?.length} عدد</p>
                                <p>دردسترس نبود: {offCall?.length} عدد</p>
                            </div>
                            <div style={{ overflowY: 'scroll', maxHeight: 200 }}>
                                {reverseArrayCall?.map((call: any, idx: number) => {
                                    return (
                                        <p key={nanoid()} style={{ marginBottom: 5, borderBottom: '1px solid #3333', padding: '5px 10px' }}>{call.status} {convertToPersianDate(call?.time, 'YYMDHM')}</p>
                                    )
                                })}
                            </div>
                        </section>
                    </section>
                </section>
            </>
        )
    } else {
        return <p>درحال دریافت اطلاعات</p>
    }
}