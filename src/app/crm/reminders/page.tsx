'use client'

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { deleteReminder, editReminder, getReminders } from "../../action/reminder.action"
import { toast } from "react-toastify"
import { Confirmation } from "../../components/Confirmation"
import { useUser } from "@/app/context/UserProvider"
import { useSearchParams } from "next/navigation"
import { convertToPersianDate } from "@/app/utils/helpers"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function RemindersList() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    let val = type == 'meetings' ? 'جلسه حضوری' : type == 'calls' ? 'تماس تلفنی' : type == 'events' ? 'مناسبت تقویمی' : type == 'birthdays' && "مناسبت تولد"

    const { user } = useUser()
    const [popup, setPopup] = useState(false)
    const [mutated, setMutated] = useState(false)
    const [reminderId, setReminderId] = useState<any>([])
    const [RemindersList, setRemindersList] = useState([])
    const { handleSubmit, reset, control, register } = useForm()
    const fetchReminders = useCallback(async () => {
        if (user?._id !== undefined) {
            let list = await getReminders({ isDeleted: false })
            setRemindersList(list)
        }
    }, [user])

    useEffect(() => { fetchReminders() }, [fetchReminders, mutated])
    const handleDelete = async (ReminderId: any) => {
        await editReminder(ReminderId, { status: 'حذف شد' })
        let res = await deleteReminder(ReminderId)
        if (!res.error) { setMutated(!mutated) }
    }
    const handleEditReminder = async (obj: any) => {
        let final = JSON.parse(JSON.stringify(obj))
        let res = await editReminder(reminderId?._id, final)
        if (!res.error) { setPopup(false); setMutated(!mutated); reset() }
    }
    const complateReminder = async () => {
        await editReminder(reminderId?._id, { status: 'انجام شد' })
        let res = await deleteReminder(reminderId?._id)
        if (!res.error) { toast.success('یادآور با موفقیت تکمیل شد'), setMutated(!mutated), setPopup(false), reset() }
    }
    const cancelReminder = async () => {
        await editReminder(reminderId?._id, { status: 'کنسل شد' })
        let res = await deleteReminder(reminderId?._id)
        if (!res.error) { toast.success('یادآور با متاسفانه کنسل شد'), setMutated(!mutated), setPopup(false), reset() }
    }

    return (
        < >
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/expert/">خانه</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">لیست مشتریان</li>
                </ol>
            </nav>
            {popup && <div className="popupCustom">
                <section className="main-body-container rounded">
                    <div className="d-flex justify-content-between"> <h5>ویرایش یادآور </h5>
                        <button onClick={() => { setPopup(false), reset() }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={handleSubmit(handleEditReminder)} method="post" className="col-12 d-flex flex-column gap-2">
                        <div className="col-12">
                            <label className="my-1" >{reminderId?.type} - مربوط به {reminderId?.opportunityId !== undefined ? <> فرصت فروش: <Link href={`/expert/opportunity/${reminderId?.opportunityId?._id}`} > {reminderId?.opportunityId?.title}</Link></> : <>سرنخ: <Link href={`/expert/leads/${reminderId?.leadId?._id}`} > {reminderId?.leadId?.name}</Link></>}</label>
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
                        {reminderId?.expertId == user?._id && <div className="col-12"><button type="submit" className="btn w-100 btn-sm bg-custom-4 text-white px-3" >ثبت ویرایش</button></div>}
                    </form>
                    {reminderId?.expertId == user?._id && <div className="col-12 d-flex gap-2"><button type="button" onClick={() => toast(<Confirmation type='تکمیل' onDelete={() => complateReminder()} />, { autoClose: false, })} className="btn mt-2 w-100 btn-sm bg-custom-2 text-white px-3" >تکمیل یادآور</button>
                        <button type="button" onClick={() => toast(<Confirmation type='کنسل' onDelete={() => cancelReminder()} />, { autoClose: false, })} className="btn mt-2 w-100 btn-sm bg-custom-3 text-white px-3" >کنسل کردن یادآور</button></div>}
                </section>
            </div>}
            <section className="main-body-container rounded">

                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>عنوان</th>
                                <th>وضعیت</th>
                                <th>زمان</th>
                                <th>تایپ</th>
                                <th className="text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                            </tr>
                        </thead>
                        <tbody>
                            {RemindersList.map((Reminder: any, idx: number) => {
                                if (val !== undefined && Reminder?.type.includes(val)) {
                                    return (<tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{Reminder?.type}</td>
                                        <td>{Reminder?.status}</td>
                                        <td>{convertToPersianDate(Reminder?.schedule, 'YYMDHM')}</td>
                                        <td><Link href={Reminder?.opportunityId?._id !== undefined ? `/expert/opportunity/${Reminder?.opportunityId?._id}` : `/expert/leads/${Reminder?.leadId?._id}`} >{Reminder?.opportunityId !== undefined ? 'فرصت فروش' : 'سرنخ'}</Link></td>
                                        <td className="text-center">
                                            <button type="button" onClick={() => { setPopup(!popup), setReminderId(Reminder) }} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-eye px-1"></i>نمایش</button>
                                            {Reminder?.expertId == user?._id && <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(Reminder?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>}
                                        </td>
                                    </tr>)
                                } else if (!val) {
                                    return (<tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{Reminder?.type}</td>
                                        <td>{Reminder?.status}</td>
                                        <td>{convertToPersianDate(Reminder?.schedule, 'YYMDHM')}</td>
                                        <td><Link href={Reminder?.opportunityId?._id !== undefined ? `/expert/opportunity/${Reminder?.opportunityId?._id}` : `/expert/leads/${Reminder?.leadId?._id}`} >{Reminder?.opportunityId !== undefined ? 'فرصت فروش' : 'سرنخ'}</Link></td>
                                        <td className="text-center">
                                            <button type="button" onClick={() => { setPopup(!popup), setReminderId(Reminder) }} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-eye px-1"></i>نمایش</button>
                                            {Reminder?.expertId == user?._id && <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(Reminder?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>}
                                        </td>
                                    </tr>)
                                }
                            })}
                        </tbody>
                    </table>
                </section>
            </section>
        </>
    )
}