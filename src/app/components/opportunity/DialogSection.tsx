'use client'

import { addDialogOpp, editOpportunity, editDialogOpp } from "@/app/action/opportunity.action"
 import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
interface FormValues {
    text: string
}
interface FormValues2 {
    text: string
}
export default function DialogSectionOppo({ singleOpportunity, mutated, owner }: any) {
    const { user } = useUser()
    const [dialogText, setDialogText] = useState('')
    const [dialogId, setDialogId] = useState('')

    const { handleSubmit, register, reset } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
    let reverseArray = singleOpportunity?.dialog?.slice()?.reverse()
    const handleCreateDialog = async (obj: any) => {
        let res = await addDialogOpp(singleOpportunity?._id, obj.text, user?._id)
        if (!res?.error) {
            toast.success('درخواست شما ثبت شد')
            await editOpportunity(singleOpportunity?._id, {}, user?._id)
            reset()
            mutated()
        }
    }
    const handleEditDialog = async (obj: any) => {
        toast.success('درخواست شما ثبت شد')
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialogOpp(singleOpportunity?._id, data, singleOpportunity?.expert?._id)
        await editOpportunity(singleOpportunity?._id, {}, user?._id)
        setDialogId('')
        mutated()
    }
    return (
        <section className="main-body-container rounded">
            <h5>لیست مکالمات</h5>
            {owner && <form className="w-100" action="post" onSubmit={handleSubmit(handleCreateDialog)}>
                <textarea className="form-control input-group fs80" rows={1} placeholder='خلاصه مکالمه' {...register('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                <button type="submit" className="btn btn-sm fs80 bg-success text-white mx-1 my-2 px-3">ثبت</button>
            </form>}
            {reverseArray?.map((el: any) => {
                if (el._id !== dialogId) {
                    return (
                        <div key={nanoid()} className="d-flex align-items-end border-1 border-bottom p-2 mb-2">
                            <div className="w-100">
                                <p className="fs85">{el.text}</p>
                                <div className="d-flex w-100 justify-content-between fs75"  ><p className="mb-0">{convertToPersianDate(el.time, 'YMDHM')}</p>
                                    {el?.editedTime && <p className="mb-0"><i className="fa fa-edit mx-1"></i> {convertToPersianDate(el?.editedTime, 'YMDHM')}</p>}</div>
                            </div>
                            <div>{owner && <button type="button" className="btn btn-sm fs80 bg-primary text-white mx-1" onClick={() => [setDialogId(el?._id), setDialogText(el?.text)]}>ویرایش</button>}</div>
                        </div>
                    )
                } else {
                    return (
                        <form key={nanoid()} className="w-100" action="post" onSubmit={handleSubmit2(handleEditDialog)}>
                            <textarea className="form-control input-group fs80" rows={1} placeholder='خلاصه مکالمه' {...register2('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                            <button type="submit" className="btn btn-sm fs80 bg-success text-white my-2">ثبت ویرایش</button>
                        </form>
                    )
                }
            })}
        </section>
    )
}