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
            setOwner(false)
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
                        <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
                        <li className="breadcrumb-item"><Link href="/account/opportunity">لیست فرصت های فروش ها</Link></li>
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
                                        <p>{singleOpportunity?.title} </p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">{singleOpportunity?.leadId?.isCompany ? 'شرکت' : 'مخاطب'} </label>
                                        <Link href={`/account/leads/${singleOpportunity?.leadId?._id}`} className="d-block">{singleOpportunity?.leadId?.isCompany ? singleOpportunity?.leadId?.companyId?.name : singleOpportunity?.leadId?.contatcId?.name}  </Link>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">مرحله </label>
                                        <p>{singleOpportunity?.stage}  </p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">احتمال فروش </label>
                                        <p>{singleOpportunity?.probability} </p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">مبلغ تخمینی </label>
                                        <p>{singleOpportunity?.amount} </p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">تاریخ تحویل </label>
                                        <p>{singleOpportunity?.deadLineDate !== '' ? convertToPersianDate(singleOpportunity?.deadLineDate, 'YMD') : '---'}  </p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className='my-1' htmlFor="">توضیحات  </label>
                                        <p>{singleOpportunity?.description !== '' ? singleOpportunity?.description : '---'} </p>
                                    </div>
                                </section>
                            </form>
                        </section>
                        <DialogSectionOppo owner={owner} singleOpportunity={singleOpportunity} mutated={() => setMutated(!mutated)} />
                    </section>
                    <section className="col-md-4 pe-2">
                        <MoreInfoOppo account={true} owner={owner} singleOpportunity={singleOpportunity} mutated={() => setMutated(!mutated)} />
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