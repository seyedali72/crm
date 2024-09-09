'use client'

import { addCallStatus, addDialog, editDialog, editLead, getSingleLead } from "@/app/action/lead.action"
import { convertToPersianDate } from "@/app/utils/helpers"
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
    province: string
    city: string
    address: string
    email: string
}
export default function addDialogs() {
    const [mutated, setMutated] = useState(false)
    const [dialogId, setDialogId] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [singleLead, setSingleLead] = useState<any>([])
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const lead = useCallback(async () => {
        let lead = await getSingleLead(id)
        setSingleLead(lead)
    }, [])
    useEffect(() => {
        lead()
    }, [lead, mutated])

    const handleCallStatus = async (obj: any) => {
        await addCallStatus(singleLead?._id, obj)
        setMutated(!mutated)
    }
    const { handleSubmit, register,setValue } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
    const handleCreateDialog = async (obj: any) => {
        let res = await addDialog(singleLead?._id, obj.text)
        if (!res?.error) {
            setValue('text','')
            setMutated(!mutated)
        }
    }
    const handleEditDialog = async (obj: any) => {
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialog(singleLead?._id, data)
        setDialogId('')
        setMutated(!mutated)
    }
    const { handleSubmit: handleSubmit3, register: register3 } = useForm<FormValues3>({ values: { name: singleLead?.name, mobile_number: singleLead?.mobile_number, email: singleLead?.email, province: singleLead?.province, city: singleLead?.city, address: singleLead?.address } })
    const handleEditLead = async (obj: any) => {
        let res = await editLead(singleLead?._id, obj)
        if (!res.error) {
            setMutated(!mutated)
        } else {
            console.log('ridi')
        }
    }
    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editLead(singleLead?._id, status)
        if (!res.error) {
            setMutated(!mutated)
        } else {
            console.log('ridi')
        }
    }
    let reverseArray = singleLead?.dialog?.slice()?.reverse()
    let reverseArrayCall = singleLead?.call?.slice()?.reverse()
    let successCall = singleLead?.call?.filter((el: any) => el.status == 'تماس موفق')
    let brokenCall = singleLead?.call?.filter((el: any) => el.status == 'تماس بی پاسخ')
    let offCall = singleLead?.call?.filter((el: any) => el.status == 'دردسترس نبود')
    if (singleLead?.length !== 0) {
        return (
            <>
                <h2 style={{ width: '100%', textAlign: 'center' }}>ثبت گزارش برای : {singleLead.name} {singleLead.mobile_number}</h2>
                <div style={{ width: '100%', }}>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <form style={{ width: '40%', padding: 10 }} action="post" onSubmit={handleSubmit3(handleEditLead)}>
                            <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام و نام خانوادگی'	{...register3('name', { required: 'نام سرنخ را وارد کنید', })} />
                            <input type="number" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شماره موبایل'	{...register3('mobile_number', { required: 'شماره تلفن را وارد کنید', })} />
                            <input type="email" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='ایمیل  '	{...register3('email')} />
                            <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='استان  '	{...register3('province')} />
                            <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شهر  '	{...register3('city')} />
                            <input type="text" disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='آدرس کامل  '	{...register3('address')} />

                            {editInfo ? <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت ویرایش</button> : <button type="button" onClick={() => setEditInfo(!editInfo)} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>درخواست ویرایش</button>}
                        </form>
                        <form style={{ width: '60%' }} action="post" onSubmit={handleSubmit(handleCreateDialog)}>
                            <textarea style={{ display: 'block', width: '95%', margin: ' 10px 1%', padding: 10 }} rows={4} placeholder='خلاصه مکالمه' {...register('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                            <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
                        </form>
                    </div>
                    <div>
                        وضعیت: {singleLead?.status} | تغییر وضعیت به:
                        {singleLead?.status !== 'در حال بررسی' && <button type="button" onClick={() => changeStatus('در حال بررسی')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#17e9', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>درحال بررسی</button>}
                        {singleLead?.status !== 'نامرتبط' && <button type="button" onClick={() => changeStatus('نامرتبط')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1919', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>نامرتبط</button>}
                        {singleLead?.status !== 'از دست رفته' && <button type="button" onClick={() => changeStatus('از دست رفته')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1719', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>از دست رفته</button>}
                        {singleLead?.status !== 'بازیابی شده' && <button type="button" onClick={() => changeStatus('بازیابی شده')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#46a9', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>بازیابی شده</button>}
                        {singleLead?.status !== 'ارجاع به کارشناس' && <button type="button" onClick={() => changeStatus('ارجاع به کارشناس')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1859', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ارجاع به کارشناس</button>}
                        {singleLead?.status !== 'مشتری' && <button type="button" onClick={() => changeStatus('مشتری')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1569', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>مشتری</button>}
                    </div>
                    <div>تماس :
                        <button type="button" onClick={() => handleCallStatus('تماس موفق')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1e19', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>تماس گرفته شد</button>
                        <button type="button" onClick={() => handleCallStatus('تماس بی پاسخ')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#19b9', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>تماس بی پاسخ</button>
                        <button type="button" onClick={() => handleCallStatus('دردسترس نبود')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#a919', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>در دسترس نبود</button>
                    </div>
                    <ul style={{ display: 'flex', gap: 10, padding: '0 10px' }}><li>تعداد تماس ها: {singleLead.call.length} عدد</li>
                        <li>تماس موفق: {successCall.length} عدد</li>
                        <li>تماس بی پاسخ: {brokenCall.length} عدد</li>
                        <li>دردسترس نبود: {offCall.length} عدد</li>
                    </ul>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '30%', padding: 10 }}>
                            <h2 style={{ marginBottom: 10 }}>لیست تماس ها</h2>
                            {reverseArrayCall?.map((call: any) => {
                                return (
                                    <p style={{ marginBottom: 5, border: '1px solid #3333', padding: '5px 10px' }}>{call.status} {convertToPersianDate(call?.time)}</p>
                                )
                            })}</div>
                        <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '68%', padding: 10 }}>
                            <h2 style={{ marginBottom: 10 }}>لیست مکالمات</h2>  {reverseArray?.map((el: any) => {
                                if (el._id !== dialogId) {
                                    return (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'start', direction: 'rtl', border: '1px solid #0006', marginBottom: 3, padding: '5px 10px', borderRadius: '6px' }}>
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