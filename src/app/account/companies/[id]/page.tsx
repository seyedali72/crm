'use client'

import { addLeatToCustomerCat, getCustomerCats } from "@/app/action/customerCat.action"
import { editCompany, getSingleCompany } from "@/app/action/company.action"
import { useUser } from "@/app/context/UserProvider"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
 
interface FormValues3 {
    name: string
    phone_number_1: number
    phone_number_2: number
    website: string
    title: string
    source: string
    description: string
    address: string
    email: string
}
export default function addDialogs() {
    const [mutated, setMutated] = useState(false)
    const [status, setStatus] = useState('')
    const [catId, setCatId] = useState<any>()
    const [catList, setCatList] = useState<any>([])
    const [singleCompany, setSingleCompany] = useState<any>([])
    const [deletedCheck, setDeletedCheck] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const { user } = useUser()
    const company = useCallback(async () => {
        let company = await getSingleCompany(id)
        company.isDeleted === false ? setSingleCompany(company) : setDeletedCheck(true)
        let categories = await getCustomerCats({ isDeleted: false })
        setCatList(categories)
    }, [])
    useEffect(() => {
        company()
    }, [company, mutated])

    const { handleSubmit: handleSubmit3, register: register3, setValue: setValue3 } = useForm<FormValues3>({ values: { name: singleCompany?.name, phone_number_1: singleCompany?.phone_number_1, phone_number_2: singleCompany?.phone_number_2, email: singleCompany?.email, website: singleCompany?.website, title: singleCompany?.title, address: singleCompany?.address, source: singleCompany?.source, description: singleCompany?.description } })


    const handleEditCompany = async (obj: any) => {
        let res = await editCompany(singleCompany?._id, obj )
        if (!res.error) {
            toast.success('انجام شده')
            setMutated(!mutated)
        } else {
            toast.error('ناموفق بود')
        }
        setEditInfo(false)
    }

    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editCompany(singleCompany?._id, status )
        if (!res.error) {
            toast.success('انجام شده')
            setMutated(!mutated)
        } else {
            toast.error('ناموفق بود')
        }
    }

    const addToCategory = async (companyId: any) => {
        let res = await addLeatToCustomerCat(catId, companyId, 'company')
        if (!res?.error) {
            setMutated(!mutated)
        }
    }
    if (deletedCheck) {
        return <p>این شرکت حذف شده است</p>
    }
    if (singleCompany?.length !== 0) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/account/companies">لیست شرکت ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{singleCompany?.name}</li>
                    </ol>
                </nav>
                <section className="d-flex flex-column flex-md-row">
                    <section className="col-md-8 ps-2">
                        <section className="main-body-container rounded">
                            <form action="post" onSubmit={handleSubmit3(handleEditCompany)} method='Post'>
                                <section className="row">
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">نام شرکت </label>
                                        {!editInfo ? <p>{singleCompany?.name} </p> : <input type="text" className="form-control form-control-sm" {...register3('name', { required: 'نام شرکت را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس یک </label>
                                        {!editInfo ? <p>{singleCompany?.phone_number_1} </p> : <input type="number" className="form-control form-control-sm" {...register3('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">شماره تماس دو </label>
                                        {!editInfo ? <p>{singleCompany?.phone_number_2} </p> : <input type="number" className="form-control form-control-sm" {...register3('phone_number_2', { required: 'شماره تماس دو را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس ایمیل </label>
                                        {!editInfo ? <p>{singleCompany?.email !== '' ? singleCompany?.email : '---'}  </p> : <input type="text" className="form-control form-control-sm" {...register3('email')} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس وبسایت </label>
                                        {!editInfo ? <p>{singleCompany?.website !== '' ? singleCompany?.website : '---'}  </p> : <input type="text" className="form-control form-control-sm" {...register3('website')} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">منبع ورودی </label>
                                        {!editInfo ? <p>{singleCompany?.source !== '' ? singleCompany?.source : '---'}  </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue3('source', e.target.value)}>
                                            <option value='' hidden>منبع ورودی را انتخاب کنید</option>
                                            <option value='سایت'>سایت</option>
                                            <option value='نمایشگاه'>نمایشگاه</option>
                                        </select>}
                                    </div>
                                    {/* <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">عنوان </label>
                                        {!editInfo ? <p>{singleCompany?.title !== '' ? singleCompany?.title : '---'} </p> : <select className="form-control form-control-sm" onChange={(e: any) => setValue3('title', e.target.value)}>
                                            <option value=''>عنوان برای سرنخ  انتخاب کنید</option>
                                            <option value='مدیر گروه'>مدیر گروه </option>
                                            <option value='کارشناس'>کارشناس </option>
                                            <option value='سرپرست'>سرپرست </option>
                                            <option value='کاربر'>کاربر </option>
                                        </select>}
                                    </div> */}
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">آدرس  </label>
                                        {!editInfo ? <p>{singleCompany?.address !== '' ? singleCompany?.address : '---'}  </p> : <textarea className="form-control form-control-sm" placeholder='آدرس کامل  ' {...register3('address')} ></textarea>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">توضیحات  </label>
                                        {!editInfo ? <p>{singleCompany?.description !== '' ? singleCompany?.description : '---'} </p> : <textarea className="form-control form-control-sm" placeholder='توضیحات  ' {...register3('description')} ></textarea>}
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
                        {/* لیست سرنخ های مرتبط به این شرکت */}
                        {/* <section className="main-body-container rounded">
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
                                                <div className="d-flex w-100 justify-content-between"  ><p className="mb-0">{convertToPersianDate(el.time,'YMD')}</p>
                                                    {el?.editedTime && <p className="mb-0"><i className="fa fa-edit mx-1"></i> {convertToPersianDate(el?.editedTime,'YMD')}</p>}</div>
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
                        </section> */}
                    </section>
                    <section className="col-md-4 pe-2">
                        <section className="main-body-container rounded">
                            <div className="d-flex gap-1 align-items-center mb-2">
                                <span className="text-nowrap" >زمینه فعالیتی سرنخ:</span>
                                {singleCompany?.categoryId == undefined ? <>  <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                                    <option value='' hidden>یک زمینه را انتخاب کنید</option>
                                    {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                                </select>
                                    <button onClick={() => { addToCategory(singleCompany?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button></> : <b>{singleCompany?.categoryId?.name}</b>}
                            </div>
                            <div className="d-flex gap-1 align-items-center mb-2">
                                <span >وضعیت:</span>
                                <select onChange={(e: any) => setStatus(e.target.value)} className="form-control form-control-sm">
                                    <option value={singleCompany?.status}>{singleCompany?.status}</option>
                                    {singleCompany?.status !== 'در حال بررسی' && <option value='در حال بررسی'>در حال بررسی</option>}
                                    {singleCompany?.status !== 'نامرتبط' && <option value='نامرتبط'>نامرتبط</option>}
                                    {singleCompany?.status !== 'از دست رفته' && <option value='از دست رفته'>از دست رفته</option>}
                                    {singleCompany?.status !== 'بازیابی شده' && <option value='بازیابی شده'>بازیابی شده</option>}
                                    {singleCompany?.expert == undefined && <option value='ارجاع به کارشناس'>ارجاع به کارشناس</option>}
                                    <option value='تبدیل به مشتری'>تبدیل به مشتری</option>
                                </select>
                                <button onClick={() => { changeStatus(status) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
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

                    </section>
                </section>
            </>
        )
    } else {
        return <p>درحال دریافت اطلاعات</p>
    }
}