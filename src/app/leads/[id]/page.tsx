'use client'

import { createCustomer } from "@/app/action/customer.action"
import { addLeadToExpert, getExperts } from "@/app/action/expert.action"
import { addCallStatus, addDialog, deleteLead, editDialog, editLead, getSingleLead } from "@/app/action/lead.action"
import { convertToPersianDate } from "@/app/utils/helpers"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
    const [expertId, setExpertId] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [expertsList, setExpertList] = useState<any>([])
    const [singleLead, setSingleLead] = useState<any>([])
    const [deletedCheck, setDeletedCheck] = useState(false)
    const [popup, setPopup] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const router = useRouter()
    const lead = useCallback(async () => {
        let lead = await getSingleLead(id)
        lead.isDeleted === false ? setSingleLead(lead) : setDeletedCheck(true)
        let experts = await getExperts({ isDeleted: false })
        setExpertList(experts)
    }, [])
    useEffect(() => {
        lead()
    }, [lead, mutated])

    const handleCallStatus = async (obj: any) => {
        await addCallStatus(singleLead?._id, obj)
        setMutated(!mutated)
    }
    const { handleSubmit, register, setValue } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
    const handleCreateDialog = async (obj: any) => {
        let res = await addDialog(singleLead?._id, obj.text)
        if (!res?.error) {
            setValue('text', '')
            setMutated(!mutated)
        }
    }
    const handleEditDialog = async (obj: any) => {
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialog(singleLead?._id, data)
        setDialogId('')
        setMutated(!mutated)
    }
    const { handleSubmit: handleSubmit3, register: register3 } = useForm<FormValues3>({ values: { name: singleLead?.name, mobile_number: singleLead?.mobile_number, email: singleLead?.email, website: singleLead?.website, title: singleLead?.title, address: singleLead?.address, source: singleLead?.source, description: singleLead?.description } })
    const handleEditLead = async (obj: any) => {
        let res = await editLead(singleLead?._id, obj)
        if (!res.error) {
            setMutated(!mutated)
        } else {
            console.log('ridi')
        }
        setEditInfo(false)
    }
    const toExpert = async (expertId: any) => {
        await addLeadToExpert(singleLead?._id, expertId)
        await editLead(singleLead?._id, { expert: expertId })
        router.replace('/leads')
    }
    const convertToCustomer = async () => {
        let data = singleLead
        data.status = 'مشتری جدید'
        let res = await createCustomer(data, '66e0756ac157ff0ef6b5ae50')
        if (!res.error) {
            await deleteLead(singleLead?._id)
            router.replace('/leads')
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
    if (deletedCheck) {
        return <p>این سرنخ حذف یا تبدیل گردیده است</p>
    }
    if (singleLead?.length !== 0) {
        return (
            <>
                {popup ? <div style={{ position: 'absolute', right: '25%', left: '25%', width: '50%', top: 200, backgroundColor: '#0003', padding: 15 }}>
                    <h3>کارشناس مورد نظر را انتخاب کنید</h3>
                    <select onChange={(e: any) => setExpertId(e?.target?.value)} style={{ width: '90%' }} ><option value=''>کارشناس مورد نظر را انتخاب کنید</option>{expertsList?.map((expert: any, idx: number) => <option key={idx} value={expert?._id} >{expert?.employe_id?.name}</option>)}</select>
                    <button disabled={expertId === ''} onClick={() => [toExpert(expertId), setPopup(false), setMutated(!mutated)]} type="button">تخصیص به کارشناس</button>
                </div> : ''}
                <h2 style={{ width: '100%', textAlign: 'center' }}>ثبت گزارش برای : {singleLead.name} {singleLead.mobile_number}</h2>
                <div style={{ width: '100%', }}>
                    <div style={{ width: '100%', padding: 10 }}>
                        <form style={{ width: '100%' }} action="post" onSubmit={handleSubmit3(handleEditLead)}>
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
                    {singleLead?.expert !== undefined && <div>نام کارشناس: <Link href={`/expert/${singleLead?.expert?._id}`} > {singleLead?.expert?.employe_id?.name}</Link></div>}
                    <div>
                        وضعیت: {singleLead?.status} | تغییر وضعیت به:
                        {singleLead?.status !== 'در حال بررسی' && <button type="button" onClick={() => changeStatus('در حال بررسی')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#17e9', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>درحال بررسی</button>}
                        {singleLead?.status !== 'نامرتبط' && <button type="button" onClick={() => changeStatus('نامرتبط')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1919', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>نامرتبط</button>}
                        {singleLead?.status !== 'از دست رفته' && <button type="button" onClick={() => changeStatus('از دست رفته')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1719', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>از دست رفته</button>}
                        {singleLead?.status !== 'بازیابی شده' && <button type="button" onClick={() => changeStatus('بازیابی شده')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#46a9', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>بازیابی شده</button>}
                        {singleLead?.expert === undefined && <button type="button" onClick={() => setPopup(true)} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1859', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ارجاع به کارشناس</button>}
                        {singleLead?.status !== 'مشتری' && <button type="button" onClick={() => convertToCustomer()} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1569', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>تبدیل به مشتری</button>}
                    </div>
                    <div>تماس :
                        <button type="button" onClick={() => handleCallStatus('تماس موفق')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1e19', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>تماس گرفته شد</button>
                        <button type="button" onClick={() => handleCallStatus('تماس بی پاسخ')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#19b9', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>تماس بی پاسخ</button>
                        <button type="button" onClick={() => handleCallStatus('دردسترس نبود')} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#a919', border: 'unset', borderRadius: 5, color: '#000', fontSize: 14, cursor: 'pointer' }}>در دسترس نبود</button>
                    </div>
                    <ul style={{ display: 'flex', gap: 10, padding: ' 10px' }}><li>تعداد تماس ها: {singleLead.call.length} عدد</li>
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