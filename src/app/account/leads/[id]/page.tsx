'use client'

import { createCompany, getCompanies } from "@/app/action/company.action"
import { editContact } from "@/app/action/contact.action"
import { createCustomer } from "@/app/action/customer.action"
import { addCustomerToCustomerCat, getCustomerCats } from "@/app/action/customerCat.action"
import { addCustomerToExpert, addLeadToExpert, deleteLeadFromExpert, getExperts } from "@/app/action/expert.action"
import { addCallStatus, addDialog, deleteLead, editDialog, editLead, getSingleLead } from "@/app/action/lead.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "react-multi-date-picker"
import { toast } from "react-toastify"
interface FormValues {
    text: string
}
interface FormValues2 {
    text: string
}
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
    const [dialogId, setDialogId] = useState('')
    const [status, setStatus] = useState('')
    const [type, setType] = useState('')
    const [catId, setCatId] = useState<any>()
    const [expertId, setExpertId] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [catList, setCatList] = useState<any>([])
    const [companyList, setCompanyList] = useState<any>([])
    const [expertsList, setExpertList] = useState<any>([])
    const [singleLead, setSingleLead] = useState<any>([])
    const [deletedCheck, setDeletedCheck] = useState(false)
    const [popup, setPopup] = useState(false)
    const [changeExpertPopup, setChangeExpertPopup] = useState(false)
    const [customerPopup, setCustomerPopup] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const { user } = useUser()
    const router = useRouter()
    const fetchLead = useCallback(async () => {
        let lead = await getSingleLead(id)
        lead.isDeleted === false ? setSingleLead(lead) : setDeletedCheck(true)
        let experts = await getExperts({ isDeleted: false })
        setExpertList(experts)
        let company = await getCompanies({ isDeleted: false })
        setCompanyList(company)
        let categories = await getCustomerCats({ isDeleted: false })
        setCatList(categories)
    }, [])
    useEffect(() => {
        fetchLead()
    }, [fetchLead, mutated])

    const handleCallStatus = async (obj: any) => {
        await addCallStatus(singleLead?._id, obj, singleLead?.expert?._id)
        setMutated(!mutated)
    }
    const { handleSubmit, register, reset } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
    const { handleSubmit: handleSubmit3, register: register3, setValue: setValue3, control } = useForm<FormValues3>({ values: { name: singleLead?.contactId?.name, phone_number_1: singleLead?.contactId?.phone_number_1, phone_number_2: singleLead?.contactId?.phone_number_2, email: singleLead?.contactId?.email, title: singleLead?.contactId?.title, address: singleLead?.contactId?.address, source: singleLead?.contactId?.source, description: singleLead?.contactId?.description, birthdayDate: singleLead?.contactId?.birthdayDate !== undefined ? Date.parse(singleLead?.contactId?.birthdayDate) : 0, } })


    const handleCreateDialog = async (obj: any) => {
        let res = await addDialog(singleLead?._id, obj.text, user?._id)
        if (!res?.error) {
            reset()
            setMutated(!mutated)
        }
    }
    const handleEditDialog = async (obj: any) => {
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialog(singleLead?._id, data, singleLead?.expert?._id)
        setDialogId('')
        setMutated(!mutated)
    }
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
    const toExpert = async (expertId: any) => {
        let time = Date.now()
        await addLeadToExpert(singleLead?._id, expertId)
        await editLead(singleLead?._id, { expert: expertId, assignedAt: time, status: 'تخصیص به کارشناس' }, user?._id)
        setMutated(!mutated)
    }
    const convertToCustomer = async (expertId = singleLead?.expert?._id) => {
        let data = singleLead
        data.expert = expertId
        data.status = 'مشتری جدید'
        let res = await createCustomer(data, user?._id)
        if (res?._id !== undefined) {
            let time = Date.now()
            await deleteLead(singleLead?._id)
            await addCustomerToExpert(res?._id, { assignedAt: time }, expertId)
            await deleteLeadFromExpert(singleLead?._id, expertId)
            router.replace('/account/leads')
        } else {
            toast.error('متاسفانه تبدیل سرنخ به مشتری انجام نشد')
        }
    }
    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editContact(singleLead?.contactId?._id, status)
        if (!res.error) {
            await editLead(singleLead?._id, {}, user?._id)
            toast.success('انجام شده')
            setMutated(!mutated)
        } else {
            toast.error('ridi')
        }
    }
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

    const addToCategory = async (contactId: any) => {
        let res = await addCustomerToCustomerCat(catId, contactId, 'lead')
        if (!res?.error) {
            await editLead(singleLead?._id, {}, user?._id)
            setMutated(!mutated)
        }
    }
    const changeExpert = async (expertId: any) => {
        await deleteLeadFromExpert(singleLead?._id, singleLead?.expert?._id)
        await addLeadToExpert(singleLead?._id, expertId)
        await editLead(singleLead?._id, { expert: expertId }, user?._id)
        setMutated(!mutated)
    }
    if (deletedCheck) {
        return <p>این سرنخ حذف یا تبدیل گردیده است</p>
    }
    if (singleLead?.contactId !== undefined) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/account/leads">لیست سرنخ ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{singleLead?.contactId?.name}</li>
                    </ol>
                </nav>
                {popup ? <div className="popupCustome">
                    <section className="main-body-container rounded">
                        <div className="d-flex justify-content-between"> <h5>کارشناس مورد نظر را انتخاب کنید</h5>
                            <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                        </div>
                        <select className="form-control form-control-sm my-2 w-100" onChange={(e: any) => setExpertId(e?.target?.value)}  >
                            <option value=''>کارشناس مورد نظر را انتخاب کنید</option>
                            {expertsList?.map((expert: any, idx: number) => <option key={nanoid()} value={expert?._id} >{expert?.employe_id?.name}</option>)}
                        </select>
                        {/* شرطی سازی دکمه ها  */}
                        {!customerPopup ? !changeExpertPopup ?
                            <button className="btn btn-sm bg-success text-white " disabled={expertId === ''} onClick={() => [toExpert(expertId), setPopup(false), setExpertId('')]} type="button">تخصیص به کارشناس</button>

                            : <button className="btn btn-sm bg-success text-white " disabled={expertId === ''} onClick={() => [changeExpert(expertId), setPopup(false), setExpertId('')]} type="button">تغییر کارشناس</button>

                            : <button className="btn btn-sm bg-success text-white " disabled={expertId === ''} onClick={() => [convertToCustomer(expertId), setPopup(false)]} type="button">تبدیل و تخصیص به کارشناس</button>}
                        {/* پایان شرطی  */}
                    </section>
                </div> : ''}

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
                                            <option value=''>منبع ورودی را انتخاب کنید</option>
                                            <option value='سایت'>سایت</option>
                                            <option value='نمایشگاه'>نمایشگاه</option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">عنوان </label>
                                        {!editInfo ? <p>{singleLead?.contactId?.title !== '' ? singleLead?.contactId?.title : '---'} </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue3('title', e.target.value)}>
                                            <option value=''>عنوان برای سرنخ  انتخاب کنید</option>
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
                                    <button type='button' onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>
                                </div>}
                        </section>
                        <section className="main-body-container rounded">
                            <h5>لیست مکالمات</h5>
                            <form className="w-100" action="post" onSubmit={handleSubmit(handleCreateDialog)}>
                                <textarea className="form-control input-group" rows={1} placeholder='خلاصه مکالمه' {...register('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                                <button type="submit" style={{ margin: '10px 0', padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
                            </form>
                            {reverseArray?.map((el: any, idx: number) => {
                                if (el._id !== dialogId) {
                                    return (
                                        <div key={nanoid()} className="d-flex align-items-end border-1 border-bottom p-2 mb-2">
                                            <div className="w-100">
                                                <p>{el.text}</p>
                                                <div className="d-flex w-100 justify-content-between"  ><p className="mb-0">{convertToPersianDate(el.time, 'YMDHM')}</p>
                                                    {el?.editedTime && <p className="mb-0"><i className="fa fa-edit mx-1"></i> {convertToPersianDate(el?.editedTime, 'YMDHM')}</p>}</div>
                                            </div>
                                            <div><button type="button" className="btn btn-sm bg-primary text-white mx-1" onClick={() => [setDialogId(el?._id), setDialogText(el?.text)]}>ویرایش</button></div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <form className="w-100" action="post" onSubmit={handleSubmit2(handleEditDialog)}>
                                            <textarea className="form-control input-group" rows={1} placeholder='خلاصه مکالمه' {...register2('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                                            <button type="submit" className="btn btn-sm bg-success text-white my-2">ثبت ویرایش</button>
                                        </form>
                                    )
                                }
                            })}
                        </section>
                    </section>
                    <section className="col-md-4 pe-2">
                        <section className="main-body-container rounded">
                            {singleLead?.expert !== undefined && <p className="w-100 d-flex justify-content-between align-item-center"><span>نام کارشناس: <Link href={`/account/expert/${singleLead?.expert?._id}`}> {singleLead?.expert?.employe_id?.name}</Link></span>
                                <span onClick={() => { setPopup(true), setChangeExpertPopup(true) }} className="text-danger cursorPointer">تغییر کارشناس</span></p>}
                            <p>زمان اختصاص به کارشناس <b> {convertToPersianDate(singleLead?.assignedAt, 'YMDHM')}</b></p>
                            <p>زمان ساخت سرنخ <b>{convertToPersianDate(singleLead?.createdAt, "YMDHM")}</b></p>
                            <p>آخرین فعالیت روی سرنخ <b>{convertToPersianDate(lastActivityResult, "YMDHM")}  </b></p>

                            <div className="d-flex gap-1 align-items-center mb-3">
                                <span className="text-nowrap" >شرکت مربوطه سرنخ:</span>
                                {singleLead?.contactId?.companyId == undefined ? <>  <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                                    <option value=''>یک شرکت را انتخاب کنید</option>
                                    {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                                </select>
                                    <button onClick={() => { addToCategory(singleLead?.contactId?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button></> : <Link href={`/account/companeis/${singleLead?.contactId?.companyId?._id}`}>{singleLead?.contactId?.companyId?.name}</Link>}
                            </div>

                            <div className="d-flex gap-1 align-items-center mb-3">
                                <span className="text-nowrap" >زمینه فعالیتی سرنخ:</span>
                                {singleLead?.contactId?.categoryId == undefined ? <>  <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                                    <option value=''>یک زمینه را انتخاب کنید</option>
                                    {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                                </select>
                                    <button onClick={() => { addToCategory(singleLead?.contactId?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button></> : <Link href={`/account/customers/categoreis/${singleLead?.contactId?.categoryId?._id}`}>{singleLead?.contactId?.categoryId?.name}</Link>}
                            </div>
                            <div className="d-flex gap-1 align-items-center mb-2">
                                <span >وضعیت:</span>
                                <select onChange={(e: any) => setStatus(e.target.value)} className="form-control form-control-sm">
                                    <option value={singleLead?.contactId?.status} hidden>{singleLead?.contactId?.status}</option>
                                    {singleLead?.contactId?.status !== 'در حال بررسی' && <option value='در حال بررسی'>در حال بررسی</option>}
                                    {singleLead?.contactId?.status !== 'نامرتبط' && <option value='نامرتبط'>نامرتبط</option>}
                                    {singleLead?.contactId?.status !== 'از دست رفته' && <option value='از دست رفته'>از دست رفته</option>}
                                    {singleLead?.contactId?.status !== 'بازیابی شده' && <option value='بازیابی شده'>بازیابی شده</option>}
                                    {singleLead?.expert == undefined && <option value='ارجاع به کارشناس'>ارجاع به کارشناس</option>}
                                    <option value='تبدیل به مشتری'>تبدیل به مشتری</option>
                                </select>
                                <button onClick={() => { status === 'تبدیل به مشتری' ? singleLead?.expert == undefined ? [setPopup(true), setCustomerPopup(true)] : convertToCustomer() : status === 'ارجاع به کارشناس' ? setPopup(true) : changeStatus(status) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                            </div>
                        </section>
                        <section className="main-body-container rounded">
                            <div className="d-flex justify-content-between mb-2"> <b>یادآور</b>
                                <div className="d-flex gap-1 align-items-center">
                                    <button className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-calendar"></i></button>
                                    <button className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-phone"></i></button>
                                    <button className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-birthday-cake"></i></button>
                                    <button className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-calendar-check-o"></i></button>
                                </div>
                            </div>
                            <p><i className="fa fa-calendar-check-o"></i> جلسه حضوری <b>سه شنبه 12:30 الی 15:00</b></p>
                            <p><i className="fa fa-phone"></i> تماس مجدد <b>یکشنبه 12:30</b></p>
                            <p><i className="fa fa-calendar"></i> مناسبت تقویمی<b> 20 شهریور</b></p>
                            <p><i className="fa fa-birthday-cake"></i> تولد سرنخ <b> 21 آذر</b></p>
                        </section>
                        <section className="main-body-container rounded">
                            <div className="d-flex align-items-center justify-content-between mb-2"><b>تماس ها:  {singleLead.call.length} عدد</b>
                                <div className="d-flex  gap-1">
                                    <button onClick={() => handleCallStatus('تماس ورودی')} className="btn btn-sm border-1 d-flex p-1 bg-primary text-white" type="button" title="تماس ورودی">ورودی</button>
                                    <button onClick={() => handleCallStatus('تماس موفق')} className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button" title="تماس موفق">موفق</button>
                                    <button onClick={() => handleCallStatus('تماس بی پاسخ')} className="btn btn-sm border-1 d-flex p-1 bg-warning text-white" type="button" title="تماس بی پاسخ">بی پاسخ</button>
                                    <button onClick={() => handleCallStatus('دردسترس نبود')} className="btn btn-sm border-1 d-flex p-1 bg-danger text-white" type="button" title="دردسترس نبود">دردسترس نبود</button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, padding: ' 10px 0', fontSize: 13 }}>
                                <p> ورودی: {inCall.length} عدد</p>
                                <p> موفق: {successCall.length} عدد</p>
                                <p> بی پاسخ: {brokenCall.length} عدد</p>
                                <p>دردسترس نبود: {offCall.length} عدد</p>
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