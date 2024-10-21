'use client'

import { addDialogToEx } from "@/app/action/expert.action"
import { addDialog, editDialog } from "@/app/action/lead.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import { useState } from "react"
import { useForm } from "react-hook-form"
interface FormValues2 {
    text: string
}
interface FormValues {
    text: string
}
export default function DialogSection({ singleLead, mutated, owner }: any) {
    const { user } = useUser()
    const [dialogId, setDialogId] = useState('')
    const [dialogText, setDialogText] = useState('')
    const { handleSubmit, register, reset } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
    const handleCreateDialog = async (obj: any) => {
        let res = await addDialog(singleLead?._id, obj.text, user?._id)
        if (!res?.error) {
            await addDialogToEx(user?._id, obj.text, singleLead?.contactId?._id)
            reset()
            mutated()
        }
    }
    const handleEditDialog = async (obj: any) => {
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialog(singleLead?._id, data, singleLead?.expert?._id)
        setDialogId('')
        mutated()
    }
    let reverseArray = singleLead?.dialog?.slice()?.reverse()
    return (
        <section className="main-body-container rounded">
            <h5>لیست مکالمات</h5>
            {owner && <form className="w-100" action="post" onSubmit={handleSubmit(handleCreateDialog)}>
                <textarea className="form-control input-group fs90" rows={1} placeholder='خلاصه مکالمه' {...register('text', { required: 'متن مکالمه را وارد کنید' })} ></textarea>
                <button type="submit" className="my-2 py-1 px-3 rounded-2 text-white fs90 cursorPointer border-0 bg-success">ثبت</button>
            </form>}
            {reverseArray?.map((el: any) => {
                if (el?._id !== dialogId) {
                    return (
                        <div key={nanoid()} className="d-flex align-items-end border-1 border-bottom p-2 mb-2">
                            <div className="w-100 d-flex justify-content-between">
                                <p className="mb-0 fs90">{el.text}</p>
                                <div className="d-flex flex-column text-nowrap justify-content-end align-items-end pTime"  >
                                    <p className="mb-0">زمان ساخت: {convertToPersianDate(el.time, 'YMDHM')}</p>
                                    {el?.editedTime && <p className="mb-0">زمان ویرایش: {convertToPersianDate(el?.editedTime, 'YMDHM')}</p>}
                                </div>
                            </div>
                            <div>{owner && <button type="button" className="btn btn-sm bg-primary text-white mx-1" onClick={() => [setDialogId(el?._id), setDialogText(el?.text)]}>ویرایش</button>}</div>
                        </div>
                    )
                } else {
                    return (
                        <form key={nanoid()} className="w-100" action="post" onSubmit={handleSubmit2(handleEditDialog)}>
                            <textarea className="form-control input-group" rows={1} placeholder='خلاصه مکالمه' {...register2('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                            <button type="submit" className="btn btn-sm bg-success text-white my-2">ثبت ویرایش</button>
                        </form>
                    )
                }
            })}
        </section>
    )
}