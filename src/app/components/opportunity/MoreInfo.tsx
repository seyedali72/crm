'use client'

import { editOpportunity } from "@/app/action/opportunity.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getExperts } from "@/app/action/expert.action"

export default function MoreInfoOppo({ singleOpportunity, mutated, owner, account = false }: any) {
    const [popup, setPopup] = useState(false)
    const [expertsList, setExpertList] = useState<any>([])
    const [expertId, setExpertId] = useState('')
    const { user } = useUser()
    const fetchData = useCallback(async () => {
        let experts = await getExperts({ isDeleted: false })
        setExpertList(experts)
    }, [])

    const changeStatus = async (type: string) => {
        let edit = type == 'fail' ? { failed: true, probability: 0 } : { completed: true, probability: 100 }
        let res = await editOpportunity(singleOpportunity?._id, edit, user?._id)
        if (!res.error) {
            toast.success('انجام شده')
            mutated()
        } else {
            toast.error('ناموفق بود')
        }
    }

    let a = singleOpportunity?.edits?.length > 0 ? Date.parse(singleOpportunity?.edits[singleOpportunity?.edits?.length - 1]?.time) : 0
    let b = singleOpportunity?.call?.length > 0 ? Date.parse(singleOpportunity?.call[singleOpportunity?.call?.length - 1]?.time) : 0
    let c = singleOpportunity?.dialog?.length > 0 ? Date.parse(singleOpportunity?.dialog[singleOpportunity?.dialog?.length - 1]?.time) : 0
    let lastActivityArr = [a, b, c]
    const lastActivityResult = lastActivityArr.reduce((c: any, d: any) => Math.max(c, d));

    const changeExpert = async (expertId: any) => {
        await editOpportunity(singleOpportunity?._id, { expert: expertId }, user?._id)
        mutated()
    }
    useEffect(() => { fetchData() }, [fetchData])
    return (

        <section className="main-body-container rounded fs90">
            {popup ? <div className="popupCustom">
                <section className="main-body-container rounded">
                    <div className="d-flex justify-content-between"> <h5>کارشناس مورد نظر را انتخاب کنید</h5>
                        <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <select className="form-control form-control-sm my-2 w-100" onChange={(e: any) => setExpertId(e?.target?.value)}  >
                        <option value='' hidden>کارشناس مورد نظر را انتخاب کنید</option>
                        {expertsList?.map((expert: any, idx: number) => <option key={nanoid()} value={expert?._id} >{expert?.employe_id?.name}</option>)}
                    </select>
                    <button className="btn btn-sm bg-success text-white " disabled={expertId === ''} onClick={() => [changeExpert(expertId), setPopup(false), setExpertId('')]} type="button">تغییر کارشناس</button>
                </section>
            </div> : ''}

            {singleOpportunity?.expert !== undefined ? <p className="w-100 d-flex justify-content-between align-item-center"><span>نام کارشناس: <Link href={`/account/expert/${singleOpportunity?.expert?._id}`}> {singleOpportunity?.expert?.employe_id?.name}</Link></span>
                {!account && <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تغییر کارشناس</span>}
            </p>

                : <p className="w-100 d-flex justify-content-between align-item-center"><span>بدون کارشناس</span>
                    <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تعریف کارشناس</span></p>}

            <p>زمان ساخت مشتری <b>{convertToPersianDate(singleOpportunity?.createdAt, "YYMDHM")}</b></p>
            <p>آخرین فعالیت روی مشتری <b>{convertToPersianDate(lastActivityResult, "YYMDHM")}  </b></p>


            <div className="d-flex gap-1 align-items-center mb-2">
                <span >وضعیت:</span>
                {owner ? <>
                    <button onClick={() => { changeStatus('complete') }} type="button" className="btn btn-sm fs75 bg-success text-white">فروش موفق</button>
                    <button onClick={() => { changeStatus('fail') }} type="button" className="btn btn-sm fs75 bg-danger text-white">فروش ناموفق</button>
                </> : <b>{singleOpportunity?.completed ? 'فروش موفق' : singleOpportunity?.failed ? 'فروش ناموفق' : 'فرصت فروش باز می باشد'}</b>}
            </div>
        </section>
    )
}