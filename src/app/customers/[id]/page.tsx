'use client'

import { createCustomer, getSingleCustomer } from "@/app/action/customer.action"
 import { addCallStatus, addDialog, deleteCustomer, editDialog, editCustomer } from "@/app/action/customer.action"
import { addCustomerToExpert } from "@/app/action/expert.action"
import { convertToPersianDate } from "@/app/utils/helpers"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
interface FormValues {
    text: string
}
interface FormValues2 {
    text: string
}
interface FormValues3 {
    name: string
    mobile_number: number
    website: string
    title: string
    source: string
    description: string
    address: string
    email: string
}
export default function addDialogs() {
    const [mutated, setMutated] = useState(false)
    const [dialogId, setDialogId] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [singleCustomer, setSingleCustomer] = useState<any>([])
    const [deletedCheck, setDeletedCheck] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const customer = useCallback(async () => {
        let customer = await getSingleCustomer(id)
        customer.isDeleted === false ? setSingleCustomer(customer) : setDeletedCheck(true)
    }, [])
    useEffect(() => {
        customer()
    }, [customer, mutated])

    const handleCallStatus = async (obj: any) => {
        await addCallStatus(singleCustomer?._id, obj)
        setMutated(!mutated)
    }
    const { handleSubmit, register, setValue } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
    const handleCreateDialog = async (obj: any) => {
        let res = await addDialog(singleCustomer?._id, obj.text)
        if (!res?.error) {
            setValue('text', '')
            setMutated(!mutated)
        }
    }
    const handleEditDialog = async (obj: any) => {
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialog(singleCustomer?._id, data)
        setDialogId('')
        setMutated(!mutated)
    }
    const { handleSubmit: handleSubmit3, register: register3 } = useForm<FormValues3>({ values: { name: singleCustomer?.name, mobile_number: singleCustomer?.mobile_number, email: singleCustomer?.email, website: singleCustomer?.website, title: singleCustomer?.title, address: singleCustomer?.address, source: singleCustomer?.source, description: singleCustomer?.description } })
    const handleEditCustomer = async (obj: any) => {
        let res = await editCustomer(singleCustomer?._id, obj)
        if (!res.error) {
            setMutated(!mutated)
        } else {
            console.log('ridi')
        }
        setEditInfo(false)
    }
    const toExpert = async () => {
        await addCustomerToExpert(singleCustomer?._id, '66df45492fb20a02ef105996')
        await editCustomer(singleCustomer?._id, { expert: '66df45492fb20a02ef105996' })
    }
  
    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editCustomer(singleCustomer?._id, status)
        if (!res.error) {
            setMutated(!mutated)
        } else {
            console.log('ridi')
        }
    }
    let reverseArray = singleCustomer?.dialog?.slice()?.reverse()
    let reverseArrayCall = singleCustomer?.call?.slice()?.reverse()
    let successCall = singleCustomer?.call?.filter((el: any) => el.status == 'تماس موفق')
    let brokenCall = singleCustomer?.call?.filter((el: any) => el.status == 'تماس بی پاسخ')
    let offCall = singleCustomer?.call?.filter((el: any) => el.status == 'دردسترس نبود')
    if (deletedCheck) {
        return <p>این سرنخ حذف یا تبدیل گردیده است</p>
    }
    if (singleCustomer?.length !== 0) {
        return (
            <>
                <h2 style={{ width: '100%', textAlign: 'center' }}>ثبت گزارش برای : {singleCustomer.name} {singleCustomer.mobile_number}</h2>
                <div style={{ width: '100%', }}>
                    <div style={{ width: '100%', padding: 10 }}>
                        <form style={{ width: '100%' }} action="post" onSubmit={handleSubmit3(handleEditCustomer)}>
                            <div style={{ display: 'flex', width: '100%' }}>
                                <div style={{ width: '50%' }}>
                                    <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام و نام خانوادگی'	{...register3('name', { required: 'نام سرنخ را وارد کنید', })} />
                                    <input type="number" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شماره موبایل'	{...register3('mobile_number', { required: 'شماره تلفن را وارد کنید', })} />
                                    <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='منبع ورودی  '{...register3('source')} />
                                    <textarea rows={2} disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='توضیحات تکمیلی  '	{...register3('description')} ></textarea>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <input type="email" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='ایمیل  '{...register3('email')} />
                                    <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='وب سایت  '{...register3('website')} />
                                    <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='عنوان  '	{...register3('title')} />
                                    <textarea rows={2} disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='آدرس کامل  '	{...register3('address')} ></textarea>
                                </div>
                            </div>
                            {editInfo ? <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت ویرایش</button> : ""}
                        </form>
                        {editInfo ? "" : <button type="button" onClick={() => setEditInfo(!editInfo)} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>درخواست ویرایش</button>}
                    </div>
                    {singleCustomer?.expert !== undefined && <div>نام کارشناس: <Link href={`/expert/${singleCustomer?.expert?._id}`} > {singleCustomer?.expert?.employe_id?.name}</Link></div>}
                    <div>
                        وضعیت: {singleCustomer?.status} | تغییر وضعیت به:
                        {singleCustomer?.status !== 'در حال بررسی' && <button type="button" onClick={() => changeStatus('در حال بررسی')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#17e9', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>درحال بررسی</button>}
                        {singleCustomer?.status !== 'نامرتبط' && <button type="button" onClick={() => changeStatus('نامرتبط')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1919', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>نامرتبط</button>}
                        {singleCustomer?.status !== 'از دست رفته' && <button type="button" onClick={() => changeStatus('از دست رفته')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1719', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>از دست رفته</button>}
                        {singleCustomer?.status !== 'بازیابی شده' && <button type="button" onClick={() => changeStatus('بازیابی شده')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#46a9', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>بازیابی شده</button>}
                        {singleCustomer?.expert === undefined && <button type="button" onClick={() => toExpert()} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1859', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>تغییر کارشناس</button>}
                     </div>
                    <div>تماس :
                        <button type="button" onClick={() => handleCallStatus('تماس موفق')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1e19', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>تماس گرفته شد</button>
                        <button type="button" onClick={() => handleCallStatus('تماس بی پاسخ')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#19b9', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>تماس بی پاسخ</button>
                        <button type="button" onClick={() => handleCallStatus('دردسترس نبود')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#a919', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>در دسترس نبود</button>
                    </div>
                    <ul style={{ display: 'flex', gap: 10, padding: ' 10px' }}><li>تعداد تماس ها: {singleCustomer.call.length} عدد</li>
                        <li>تماس موفق: {successCall.length} عدد</li>
                        <li>تماس بی پاسخ: {brokenCall.length} عدد</li>
                        <li>دردسترس نبود: {offCall.length} عدد</li>
                    </ul>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '30%', padding: 10 }}>
                            <h2 style={{ marginBottom: 10 }}>لیست تماس ها</h2>
                            {reverseArrayCall?.map((call: any, idx: number) => {
                                return (
                                    <p key={idx} style={{ marginBottom: 5, border: '1px solid #3333', padding: '5px 10px' }}>{call.status} {convertToPersianDate(call?.time)}</p>
                                )
                            })}</div>
                        <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '68%', padding: 10 }}>
                            <h2 style={{ marginBottom: 10 }}>لیست مکالمات</h2>
                            <form style={{ width: '100%' }} action="post" onSubmit={handleSubmit(handleCreateDialog)}>
                                <textarea style={{ display: 'block', width: '98%', margin: ' 10px 0', padding: 10 }} rows={2} placeholder='خلاصه مکالمه' {...register('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                                <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
                            </form>
                            {reverseArray?.map((el: any, idx: number) => {
                                if (el._id !== dialogId) {
                                    return (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'start', direction: 'rtl', border: '1px solid #0006', marginBottom: 3, padding: '5px 10px', borderRadius: '6px' }}>
                                            <div style={{ width: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><p style={{ margin: 0 }}>{convertToPersianDate(el.time)}</p>
                                                    {el?.editedTime && <p>زمان آخرین ویرایش  {convertToPersianDate(el?.editedTime)}</p>}</div>
                                                <p style={{ margin: 0 }}>{el.text}</p></div>
                                            <div><button type="button" onClick={() => [setDialogId(el?._id), setDialogText(el?.text)]}>ویرایش</button></div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <form style={{ width: '100%' }} action="post" onSubmit={handleSubmit2(handleEditDialog)}>
                                            <textarea style={{ display: 'block', width: '95%', margin: ' 10px 1%', padding: 10 }} rows={4} placeholder='خلاصه مکالمه' {...register2('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                                            <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ویرایش</button>
                                        </form>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return <p>درحال دریافت اطلاعات</p>
    }
}