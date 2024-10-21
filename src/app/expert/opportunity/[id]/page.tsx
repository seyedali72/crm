'use client'

import { editOpportunity, getSingleOpportunity } from "@/app/action/opportunity.action"
import CallLogSectionOppo from "@/app/components/opportunity/CallLogSection"
import DialogSectionOppo from "@/app/components/opportunity/DialogSection"
import MoreInfoOppo from "@/app/components/opportunity/MoreInfo"
import ReminderSectionOppo from "@/app/components/opportunity/RimenderSection"
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
    probability: number
    amount: number
    title: string
    description: string
    stage: string
    deadLineDate: number
}
export default function EditOpportunity() {
    const [mutated, setMutated] = useState(false)
    const [singleOpportunity, setSingleOpportunity] = useState<any>([])
    const [owner, setOwner] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { id }: any = useParams()
    const { user } = useUser()
    const fetchOpportunity = useCallback(async () => {
        if (user?._id !== undefined) {
            let opportunity = await getSingleOpportunity(id)
            opportunity?.completed || opportunity?.failed ? setOwner(false) : opportunity?.expert?._id == user?._id ? setOwner(true) : setOwner(false)
            setSingleOpportunity(opportunity)
        }
    }, [user])

    useEffect(() => {
        fetchOpportunity()
    }, [fetchOpportunity, mutated])

    const { handleSubmit, register, setValue, control } = useForm<FormValues3>({ values: { name: singleOpportunity?.name, stage: singleOpportunity?.stage, amount: singleOpportunity?.amount, title: singleOpportunity?.title, probability: singleOpportunity?.probability, description: singleOpportunity?.description, deadLineDate: singleOpportunity?.deadLineDate !== undefined ? Date.parse(singleOpportunity?.deadLineDate) : 0, } })

    const handleEditOpportunity = async (obj: any) => {
        let res = await editOpportunity(singleOpportunity?._id, obj, user?._id)

        if (!res.error) {
            toast.success('انجام شده')
            setMutated(!mutated)
        } else {
            toast.error('ناموفق بود')
        }
        setEditInfo(false)
    }
    if (singleOpportunity?._id !== undefined) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/expert/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/expert/opportunity">لیست فرصت های فروش ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">فرصت فروش: {singleOpportunity?.title}</li>
                    </ol>
                </nav>
                <section className="d-flex flex-column flex-md-row">
                    <section className="col-md-8 ps-2">
                        <section className="main-body-container rounded">
                            <form action="post" onSubmit={handleSubmit(handleEditOpportunity)} method='Post'>
                                <section className="row">
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">عنوان فرصت </label>
                                        {!editInfo ? <p>{singleOpportunity?.title} </p> : <input type="text" className="form-control form-control-sm" {...register('title', { required: 'عنوان فرصت را وارد کنید', })} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">{singleOpportunity?.leadId?.isCompany ? 'شرکت' : 'مخاطب'} </label>
                                        <Link href={`/expert/leads/${singleOpportunity?.leadId?._id}`} className="d-block">{singleOpportunity?.leadId?.isCompany ? singleOpportunity?.leadId?.companyId?.name : singleOpportunity?.leadId?.contatcId?.name}  </Link>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">مرحله </label>
                                        {!editInfo ? <p>{singleOpportunity?.stage}  </p> : <select className="form-control form-control-sm" onChange={(e: any) => { setValue('stage', e.target.value); setValue('probability', e.target.value == 'مرحله یک' ? 20 : e.target.value == 'مرحله دو' ? 40 : e.target.value == 'مرحله سه' ? 60 : e.target.value == 'مرحله چهار' ? 80 : 0) }} >
                                            <option value={singleOpportunity?.stage} hidden>{singleOpportunity?.stage}  </option>
                                            <option value="مرحله یک">مرحله یک</option>
                                            <option value="مرحله دو">مرحله دو</option>
                                            <option value="مرحله سه">مرحله سه</option>
                                            <option value="مرحله چهار">مرحله چهار</option>
                                        </select>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">احتمال فروش </label>
                                        {!editInfo ? <p>{singleOpportunity?.probability} </p> : <input disabled type="text" className="form-control form-control-sm" {...register('probability')} />}
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">مبلغ تخمینی </label>
                                        {!editInfo ? <p>{singleOpportunity?.amount} </p> : <input type="text" className="form-control form-control-sm" {...register('amount')} />}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">تاریخ تحویل </label>
                                        {!editInfo ? <p>{singleOpportunity?.deadLineDate !== '' ? convertToPersianDate(singleOpportunity?.deadLineDate, 'YMD') : '---'}  </p> : <div className='datePicker'>
                                            <Controller
                                                control={control}
                                                name="deadLineDate"
                                                render={({ field: { onChange, value } }) => (
                                                    <DatePicker className="form-control " format="YYYY/MM/DD" value={value || ''} calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date); }} />
                                                )} />
                                        </div>}
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">توضیحات  </label>
                                        {!editInfo ? <p>{singleOpportunity?.description !== '' ? singleOpportunity?.description : '---'} </p> : <textarea className="form-control form-control-sm" placeholder='توضیحات  ' {...register('description')} ></textarea>}
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
                        <DialogSectionOppo owner={owner} singleOpportunity={singleOpportunity} mutated={() => setMutated(!mutated)} />
                    </section>
                    <section className="col-md-4 pe-2">
                        <MoreInfoOppo owner={owner} singleOpportunity={singleOpportunity} mutated={() => setMutated(!mutated)} />
                        <ReminderSectionOppo owner={owner} singleOpportunity={singleOpportunity} mutated={() => setMutated(!mutated)} />
                        <CallLogSectionOppo owner={owner} singleOpportunity={singleOpportunity} mutated={() => setMutated(!mutated)} />
                    </section>
                </section>
            </>
        )
    } else {
        return <p>درحال دریافت اطلاعات</p>
    }
}