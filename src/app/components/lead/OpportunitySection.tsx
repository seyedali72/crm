'use client'

import { createCompany } from "@/app/action/company.action"
import { createContact } from "@/app/action/contact.action"
import { editLead } from "@/app/action/lead.action"
import { createOpportunity } from "@/app/action/opportunity.action"
import { useUser } from "@/app/context/UserProvider"
import { spliteNumber } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

interface FormValue { title: string, stage: string, amount: number, probability: number, description: string }

export default function OpportunitySection({ singleLead, mutated, opportunitiesList, owner }: any) {
    const [popup, setPopup] = useState(false)
    const [convertId, setConvertId] = useState('')
    const { user } = useUser()

    const { handleSubmit, register, setValue, reset } = useForm<FormValue>()
    const handleCreateOpportunity = async (obj: any) => {
        obj.leadId = singleLead?._id
        obj.expert = user?._id
        let res = await createOpportunity(obj)
        if (!res.error) {
            toast.success('فرصت جدید ساخته شد')
            setPopup(false)
            mutated()
            reset()
        } else { toast.error(res.error) }
    }

    const handleConvert = async () => {
        singleLead.converted = true
        if (convertId == "مخاطب") {
            let res = await createContact(singleLead)
            if (!res?.error) { await editLead(singleLead?._id, { converted: true, contactId: res?._id }, user?._id); toast.success('با موفقیت مخاطب ساخته شد'); mutated() } else { toast.error(res.error) }
        } else {
            let res = await createCompany(singleLead)
            if (!res?.error) { await editLead(singleLead?._id, { converted: true, companyId: res?._id, isCompany: true }, user?._id); toast.success('با موفقیت شرکت ساخته شد'); mutated() } else { toast.error(res.error) }
        }
    }
    if (owner) {
        return (
            <section className="main-body-container rounded">
                {popup && <div className="popupCustom"><section className="main-body-container rounded fs85">
                    <div className="d-flex justify-content-between"> <h5>ساخت فرصت فروش جدید</h5>
                        <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={handleSubmit(handleCreateOpportunity)} method="post" className="col-12 d-flex flex-column gap-2">
                        <div className="col-12">
                            <label className="my-1" >عنوان فرصت فروش</label>
                            <input type="text" className="form-control fs85" placeholder="عنوان فرصت فروش" {...register('title', { required: 'عنوان فرصت را وارد کنید' })} />
                        </div>
                        <div className="col-12">
                            <label className="my-1" >مرحله</label>
                            <select required onChange={(e: any) => { setValue('stage', e.target.value); setValue('probability', e.target.value == 'مرحله یک' ? 20 : e.target.value == 'مرحله دو' ? 40 : e.target.value == 'مرحله سه' ? 60 : e.target.value == 'مرحله چهار' ? 80 : 0) }} className="form-control fs85" >
                                <option hidden value="">این فرصت در چه مرحله ای است</option>
                                <option value="مرحله یک">مرحله یک</option>
                                <option value="مرحله دو">مرحله دو</option>
                                <option value="مرحله سه">مرحله سه</option>
                                <option value="مرحله چهار">مرحله چهار</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="my-1" >بودجه احتمالی (تومان)</label>
                            <input type="number" className="form-control fs85" placeholder="میزان مبلغ فروش به تومان" {...register('amount', { required: 'مبلغ را به تومان وارد کنید' })} />
                        </div>
                        <div className="col-12">
                            <label className="my-1" >درصد احتمال فروش</label>
                            <input type="text" disabled className="form-control fs85" {...register('probability')} />
                        </div>
                        <div className="col-12">
                            <label className="my-1" >توضیحات اضافی</label>
                            <textarea className="form-control fs85" placeholder="توضیحات اضافی" {...register('description')} ></textarea>
                        </div>
                        <div className="col-12"><button type="submit" className="btn w-100 btn-sm bg-custom-2 text-white px-3" >ثبت</button></div>
                    </form>
                </section></div>}
                <div className="d-flex gap-1 align-items-center mb-2 fs85">
                    <span className="text-nowrap" >تبدیل به:</span>
                    {!singleLead?.converted ? <select onChange={(e: any) => setConvertId(e.target.value)} className="form-control fs85 form-control-sm">
                        <option value='یک گزینه تبدیل انتخاب کنید' hidden> یک گزینه تبدیل انتخاب کنید</option>
                        <option value='مخاطب'>مخاطب</option>
                        <option value='شرکت'>شرکت</option>
                    </select> : <p className="mb-0 w-100">فرصت فروش</p>}
                    {singleLead?.converted ? <button onClick={() => { setPopup(true) }} type="button" className="btn btn-sm bg-custom-4 text-white text-nowrap fs85">ساخت فرصت جدید</button> : <button onClick={() => handleConvert()} type="button" className="btn btn-sm bg-custom-1 text-white text-nowrap fs85">تبدیل</button>}
                </div>
                {opportunitiesList?.length > 0 && <span className="fs85 mb-2 d-block border-top pt-2">لیست فرصت های مربوط به این سرنخ</span>}
                {opportunitiesList?.map((oppo: any) => {
                    return (
                        <Link key={nanoid()} href={`/${user?.role == 2 ? 'crm' : 'expert'}/opportunity/${oppo?._id}`}
                            className={`d-flex justify-content-between text-dark fs75 mb-1 p-1 border rounded
                            ${(!oppo?.completed && !oppo?.failed) ? oppo?.probability <= 20 ? 'bg-custom-1' : oppo?.probability <= 40 ? 'bg-custom-3' : oppo?.probability <= 60 ? 'bg-custom-4' : oppo?.probability <= 80 && 'bg-custom-2' : oppo?.completed ? 'bg-success text-white' : 'bg-danger text-white'} `}><span>عنوان: {oppo?.title}</span><span>{spliteNumber(oppo?.amount)} تومان</span></Link>
                    )
                })}
            </section>
        )
    }
}