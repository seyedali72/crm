'use client'

import { addCallStatus, editCustomer } from "@/app/action/customer.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import { toast } from "react-toastify"

export default function CallLogSectionCus({ singleCustomer, mutated }: any) {
    const { user } = useUser()
    const handleCallStatus = async (obj: any) => {
        toast.success('ثبت درخواست')
        await addCallStatus(singleCustomer?._id, obj, singleCustomer?.expert?._id)
        await editCustomer(singleCustomer?._id, {}, user?._id)
        mutated()
    }

    let reverseArrayCall = singleCustomer?.call?.slice()?.reverse()
    let inCall = singleCustomer?.call?.filter((el: any) => el.status == 'تماس ورودی')
    let successCall = singleCustomer?.call?.filter((el: any) => el.status == 'تماس موفق')
    let brokenCall = singleCustomer?.call?.filter((el: any) => el.status == 'تماس بی پاسخ')
    let offCall = singleCustomer?.call?.filter((el: any) => el.status == 'دردسترس نبود')
    return (
        <section className="main-body-container rounded">
            <div className="d-flex align-items-center justify-content-between mb-2"><b>تماس ها:  {singleCustomer.call.length} عدد</b>
                <div className="d-flex gap-1">
                    <button onClick={() => handleCallStatus('تماس ورودی')} className="btn btn-sm border-1 d-flex p-1 bg-primary text-white" type="button" title="تماس ورودی">ورودی</button>
                    <button onClick={() => handleCallStatus('تماس موفق')} className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button" title="تماس موفق">موفق</button>
                    <button onClick={() => handleCallStatus('تماس بی پاسخ')} className="btn btn-sm border-1 d-flex p-1 bg-warning text-white" type="button" title="تماس بی پاسخ">بی پاسخ</button>
                    <button onClick={() => handleCallStatus('دردسترس نبود')} className="btn btn-sm border-1 d-flex p-1 bg-danger text-white" type="button" title="دردسترس نبود">دردسترس نبود</button>
                </div>
            </div>
            <div className="d-flex gap-2 py-2 fs80 justify-content-between" >
                <p> ورودی: {inCall.length} عدد</p>
                <p> موفق: {successCall.length} عدد</p>
                <p> بی پاسخ: {brokenCall.length} عدد</p>
                <p>دردسترس نبود: {offCall.length} عدد</p>
            </div>
            <div style={{ overflowY: 'scroll', maxHeight: 200 }}>
                {reverseArrayCall?.map((call: any ) => {
                    return (
                        <p key={nanoid()} className="mb-1 border-bottom py-1 px-2 fs90" >{call.status} {convertToPersianDate(call?.time, 'YYMDHM')}</p>
                    )
                })}
            </div>
        </section>
    )
}