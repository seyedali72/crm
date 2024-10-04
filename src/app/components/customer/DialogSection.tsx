'use client'

import { addDialog, editCustomer, editDialog } from "@/app/action/customer.action"
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
export default function DialogSectionCus({ singleCustomer, mutated }: any) {
    const { user } = useUser()
    const [dialogText, setDialogText] = useState('')
    const [dialogId, setDialogId] = useState('')
  
    const { handleSubmit, register, reset } = useForm<FormValues>()
    const { handleSubmit: handleSubmit2, register: register2, } = useForm<FormValues2>({ values: { text: dialogText } })
      let reverseArray = singleCustomer?.dialog?.slice()?.reverse()
    const handleCreateDialog = async (obj: any) => {
        let res = await addDialog(singleCustomer?._id, obj.text, user?._id)
        if (!res?.error) {
            toast.success('درخواست شما ثبت شد')
            await editCustomer(singleCustomer?._id, {}, user?._id)
            reset()
            mutated()
        }
    }
    const handleEditDialog = async (obj: any) => {
        toast.success('درخواست شما ثبت شد')
        let data = { text: obj.text, dialogTextId: dialogId, }
        await editDialog(singleCustomer?._id, data, singleCustomer?.expert?._id)
        await editCustomer(singleCustomer?._id, {}, user?._id)
        setDialogId('')
        mutated()
    }
    return (
        <section className="main-body-container rounded">
        <h5>لیست مکالمات</h5>
        <form className="w-100" action="post" onSubmit={handleSubmit(handleCreateDialog)}>
            <textarea className="form-control input-group" rows={1} placeholder='خلاصه مکالمه' {...register('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
            <button type="submit" style={{ margin: '10px 0', padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
        </form>
        {reverseArray?.map((el: any ) => {
            if (el._id !== dialogId) {
                return (
                    <div key={nanoid()} className="d-flex align-items-end border-1 border-bottom p-2 mb-2">
                        <div className="w-100">
                            <p>{el.text}</p>
                            <div className="d-flex w-100 justify-content-between"  ><p className="mb-0">{convertToPersianDate(el.time, 'YMDHM')}</p>
                                {el?.editedTime && <p className="mb-0"><i className="fa fa-edit mx-1"></i> {convertToPersianDate(el?.editedTime, 'YMDHM')}</p>}</div>
                        </div>
                        <div><button type="button" className="btn btn-sm bg-primary text-white mx-1" onClick={() => [setDialogId(el?._id), setDialogText(el?.text)]}>ویرایش</button></div>
                    </div>
                )
            } else {
                return (
                    <form className="w-100" action="post" onSubmit={handleSubmit2(handleEditDialog)}>
                        <textarea className="form-control input-group" rows={1} placeholder='خلاصه مکالمه' {...register2('text', { required: 'متن مکالمه را وارد کنید', })} ></textarea>
                        <button type="submit" className="btn btn-sm bg-success text-white my-2">ثبت ویرایش</button>
                    </form>
                )
            }
        })}
    </section>
    )
}