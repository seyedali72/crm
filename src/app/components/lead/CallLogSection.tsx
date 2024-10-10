'use client'

import { addCallToEx } from "@/app/action/expert.action"
import { addCallStatus } from "@/app/action/lead.action"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"

export default function CallLogSection({ singleLead, mutated, owner }: any) {
    const handleCallStatus = async (obj: any) => {
        await addCallStatus(singleLead?._id, obj, singleLead?.expert?._id)
        await addCallToEx(singleLead?.expert?._id, singleLead?.contactId?._id, obj)
        mutated()
    }
    let reverseArrayCall = singleLead?.call?.slice()?.reverse()
    let inCall = singleLead?.call?.filter((el: any) => el.status == 'تماس ورودی')
    let successCall = singleLead?.call?.filter((el: any) => el.status == 'تماس موفق')
    let brokenCall = singleLead?.call?.filter((el: any) => el.status == 'تماس بی پاسخ')
    let offCall = singleLead?.call?.filter((el: any) => el.status == 'دردسترس نبود')
    return (
        <section className="main-body-container rounded">
            <div className="d-flex align-items-center justify-content-between mb-2"><b>تماس ها:  {singleLead.call.length} عدد</b>
                {owner && <div className="d-flex  gap-1">
                    <button onClick={() => handleCallStatus('تماس ورودی')} className="btn btn-sm border-1 fs80 d-flex p-1 bg-primary text-white" type="button" title="تماس ورودی">ورودی</button>
                    <button onClick={() => handleCallStatus('تماس موفق')} className="btn btn-sm border-1 fs80 d-flex p-1 bg-success text-white" type="button" title="تماس موفق">موفق</button>
                    <button onClick={() => handleCallStatus('تماس بی پاسخ')} className="btn btn-sm border-1 fs80 d-flex p-1 bg-warning text-white" type="button" title="تماس بی پاسخ">بی پاسخ</button>
                    <button onClick={() => handleCallStatus('دردسترس نبود')} className="btn btn-sm border-1 fs80 d-flex p-1 bg-danger text-white" type="button" title="دردسترس نبود">دردسترس نبود</button>
                </div>}
            </div>
            <div className="d-flex gap-1 py-1 fs75 justify-content-between w-100"  >
                <p> ورودی: {inCall.length} عدد</p>
                <p> موفق: {successCall.length} عدد</p>
                <p> بی پاسخ: {brokenCall.length} عدد</p>
                <p>دردسترس نبود: {offCall.length} عدد</p>
            </div>
            <div style={{ overflowY: 'scroll', maxHeight: 200 }}>
                {reverseArrayCall?.map((call: any) => {
                    return (
                        <p key={nanoid()} className="mb-1 py-1 px-2 border-bottom fs90"  >{call.status} {convertToPersianDate(call?.time, 'YYMDHM')}</p>
                    )
                })}
            </div>
        </section>
    )
}