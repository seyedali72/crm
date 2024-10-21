'use client'

import { createReminder, deleteReminder, editReminder, getReminders } from "@/app/action/reminder.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import { useCallback, useEffect, useState } from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import { toast } from "react-toastify"
import { Confirmation } from "../Confirmation"
interface FormValues {
    description: string
    schedule: Date
}
interface FormValues1 {
    description: string
    schedule: Date
}
export default function ReminderSection({ singleLead, mutated, owner }: any) {
    const [reminderId, setReminderId] = useState<any>()
    const [typeReminder, setTypeReminder] = useState('')
    const [reminderPopup, setReminderPopup] = useState(false)
    const [edited, setEdited] = useState(false)
    const { user } = useUser()
    const [reminders, setReminders] = useState<any>([])
    const { handleSubmit, register, reset, control } = useForm<FormValues>()
    const { handleSubmit: handleSubmit1, register: register1, reset: reset1, control: control1 } = useForm<FormValues1>()
    const fetchData = useCallback(async () => {
        let data = await getReminders({ isDeleted: false, leadId: singleLead?._id })
        setReminders(data)
    }, [])
    const handleCreateReminder = async (obj: any) => {
        obj.name = `reminder-${typeReminder}${nanoid(6)}`
        obj.type = typeReminder
        obj.expertId = user?._id
        obj.leadId = singleLead?._id
        let final = JSON.parse(JSON.stringify(obj))
        let res = await createReminder(final)
        if (!res.error) { setReminderPopup(false); mutated(); reset1() }
    }
    const handleEditReminder = async (obj: any) => {
        let final = JSON.parse(JSON.stringify(obj))
        let res = await editReminder(reminderId?._id, final)
        if (!res.error) { setReminderPopup(false); mutated(); reset(), setReminderPopup(false), setEdited(false) }
    }
    const complateReminder = async () => {
        await editReminder(reminderId?._id, { status: 'انجام شد' })
        let res = await deleteReminder(reminderId?._id)
        if (!res.error) { toast.success('یادآور با موفقیت تکمیل شد'), mutated(), setReminderPopup(false), setEdited(false), reset() }
    }
    const cancelReminder = async () => {
        await editReminder(reminderId?._id, { status: 'کنسل شد' })
        let res = await deleteReminder(reminderId?._id)
        if (!res.error) { toast.success('یادآور با متاسفانه کنسل شد'), mutated(), setReminderPopup(false), reset() }
    }
    useEffect(() => { fetchData() }, [fetchData, mutated])
    return (
        <>
            {reminderPopup && <div className="popupCustom">
                {edited ?
                    <section className="main-body-container rounded">
                        <div className="d-flex justify-content-between"> <h5>ویرایش یادآور </h5>
                            <button onClick={() => { setReminderPopup(false), setEdited(false), reset() }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSubmit(handleEditReminder)} method="post" className="col-12 d-flex flex-column gap-2">
                            <div className="col-12">
                                <label className="my-1" >{reminderId?.type}</label>
                                <div className='datePicker'>
                                    <Controller
                                        control={control}
                                        defaultValue={reminderId?.schedule}
                                        name="schedule"
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker className="form-control " value={value || ''} placeholder="زمان و تاریخ مورد نظر را انتخاب کنید"
                                                format=" HH:mm:ss - YYYY/MM/DD" calendarPosition="bottom-right"
                                                plugins={[<TimePicker position="right" />]}
                                                calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date) }} />
                                        )} />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="my-1" >توضیحات اضافی</label>
                                <textarea className="form-control" placeholder="توضیحات اضافی" defaultValue={reminderId?.description} {...register('description')} ></textarea>
                            </div>
                            {owner && <div className="col-12"><button type="submit" className="btn w-100 btn-sm bg-custom-4 text-white px-3" >ثبت ویرایش</button></div>}
                        </form>

                        {owner && <div className="col-12 d-flex gap-2"><button type="button" onClick={() => toast(<Confirmation type='تکمیل' onDelete={() => complateReminder()} />, { autoClose: false, })} className="btn mt-2 w-100 btn-sm bg-custom-2 text-white px-3" >تکمیل یادآور</button>
                            <button type="button" onClick={() => toast(<Confirmation type='کنسل' onDelete={() => cancelReminder()} />, { autoClose: false, })} className="btn mt-2 w-100 btn-sm bg-custom-3 text-white px-3" >کنسل کردن یادآور</button>
                        </div>
                        }
                    </section>
                    : <section className="main-body-container rounded">
                        <div className="d-flex justify-content-between"> <h5>زمان یادآوری را مشخص کنید</h5>
                            <button onClick={() => setReminderPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSubmit1(handleCreateReminder)} method="post" className="col-12 d-flex flex-column gap-2">
                            <div className="col-12">
                                <label className="my-1" >{typeReminder}</label>
                                <div className='datePicker'>
                                    <Controller
                                        control={control1}
                                        name="schedule"
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker className="form-control " value={value || ''} placeholder="زمان و تاریخ مورد نظر را انتخاب کنید"
                                                format=" HH:mm:ss - YYYY/MM/DD" calendarPosition="bottom-right"
                                                plugins={[<TimePicker position="right" />]}
                                                calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date) }} />
                                        )} />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="my-1" >توضیحات اضافی</label>
                                <textarea className="form-control" placeholder="توضیحات اضافی" {...register1('description')} ></textarea>
                            </div>
                            <div className="col-12"><button type="submit" className="btn w-100 btn-sm bg-custom-2 text-white px-3" >ثبت</button></div>
                        </form>
                    </section>}
            </div>}
            <section className="main-body-container rounded">
                <div className="d-flex justify-content-between mb-2"> <b>یادآور</b>
                    {owner && <div className="d-flex gap-1 align-items-center">
                        <button onClick={() => { setReminderPopup(!reminderPopup), setTypeReminder('مناسبت تقویمی') }} className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-calendar"></i></button>
                        <button onClick={() => { setReminderPopup(!reminderPopup), setTypeReminder('تماس تلفنی') }} className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-phone"></i></button>
                        <button onClick={() => { setReminderPopup(!reminderPopup), setTypeReminder('مناسبت تولد') }} className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-birthday-cake"></i></button>
                        <button onClick={() => { setReminderPopup(!reminderPopup), setTypeReminder('جلسه حضوری') }} className="btn btn-sm border-1 d-flex p-1 bg-success text-white" type="button"><i className="fa fa-calendar-check-o"></i></button>
                    </div>}
                </div>
                {reminders?.map((reminder: any) => {
                    return (<p key={nanoid()} className="mb-1 py-1 cursorPointer fs90" onClick={() => { setReminderId(reminder), setReminderPopup(!reminderPopup), setEdited(!edited) }}><i className={`fa ${reminder?.type == 'مناسبت تقویمی' ? 'fa-calendar' : reminder?.type == 'مناسبت تولد' ? 'fa-birthday-cake' : reminder?.type == 'تماس تلفنی' ? 'fa-phone' : 'fa-calendar-check-o'}`}></i>{' '}{reminder?.type}{' '}<b>{convertToPersianDate(reminder?.schedule, 'YYMDHM')}</b></p>)
                })}
            </section>
        </>
    )
}