'use client'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { editContact, editLeadFromSource, getSingleContact } from '@/app/action/contact.action'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { getCustomerCats } from '@/app/action/customerCat.action'
import { nanoid } from 'nanoid'
import { getCompanies } from '@/app/action/company.action'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { useUser } from '@/app/context/UserProvider'

interface FormValues1 {
    name: string
    phone_number_1: number
    phone_number_2: number
    title: string
    birthdayDate: number
    source: string
    description: string
    address: string
    email: string
    status: string
    categoryId: string
    companyId: string
}
export default function EditContact() {
    const { id }: any = useParams()
    const { user } = useUser()
    const [mutated, setMutated] = useState(false)
    const [owner, setOwner] = useState(false)
    const [companyList, setCompanyList] = useState<any>([])
    const [catList, setCatList] = useState<any>([])
    const [singleContact, setSingleContact] = useState<any>()
    const router = useRouter()
    const handleEditContact = async (obj: any) => {
        let res = await editContact(singleContact?._id, obj)
        if (!res.error) {
            await editLeadFromSource({ contactId: res?._id }, obj, user?._id)
            toast.success('ایجاد شد')
            setMutated(!mutated)
            reset()
            router.replace('/crm/contacts')
        } else {
            toast.error('ناموفق بود')
        }
    }

    const fetchData = useCallback(async () => {
        if (user?._id !== undefined) {
            let single = await getSingleContact(id)
            setSingleContact(single)
            single?.creator == user?._id ? setOwner(true) : setOwner(false)
            let categories = await getCustomerCats({ isDeleted: false })
            setCatList(categories)
            let companies = await getCompanies({ isDeleted: false })
            setCompanyList(companies)
        }
    }, [user])
    const { handleSubmit, register, reset, setValue, control } = useForm<FormValues1>({
        values: {
            name: singleContact?.name,
            phone_number_1: singleContact?.phone_number_1,
            phone_number_2: singleContact?.phone_number_2,
            title: singleContact?.title,
            source: singleContact?.source,
            description: singleContact?.description,
            address: singleContact?.address,
            birthdayDate: singleContact?.birthdayDate !== undefined ? Date.parse(singleContact?.birthdayDate) : 0,
            email: singleContact?.email,
            status: singleContact?.status,
            categoryId: singleContact?.categoryId,
            companyId: singleContact?.companyId,
        }
    })
    useEffect(() => {
        fetchData()
    }, [fetchData, mutated])
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/crm/">داشبورد</Link></li>
                    <li className="breadcrumb-item "> <Link href="/crm/contacts"> مخاطبان</Link> </li>
                    {owner ? <li className="breadcrumb-item  active" aria-current="page">ویرایش: {singleContact?.name} </li>
                        : <li className="breadcrumb-item  active" aria-current="page">نمایش: {singleContact?.name} </li>}
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleEditContact)} method='Post'>
                    <section className="row">

                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام و نام خانوادگی </label>
                            <input disabled={!owner} type="text" className="form-control form-control-sm" {...register('name', { required: 'نام و نام خانوادگی را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره تماس یک </label>
                            <input disabled={!owner} type="number" className="form-control form-control-sm" {...register('phone_number_1', { required: 'شماره تماس یک را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شماره تماس دو </label>
                            <input disabled={!owner} type="number" className="form-control form-control-sm" {...register('phone_number_2', { required: 'شماره تماس دو را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">آدرس ایمیل </label>
                            <input disabled={!owner} type="text" className="form-control form-control-sm" {...register('email')} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">منبع ورودی </label>
                            <select disabled={!owner} className="form-control form-control-sm" onChange={(e: any) => setValue('source', e.target.value)}>
                                {singleContact?.source !== undefined ? <option value={singleContact?.source} hidden>{singleContact?.source}</option> : <option value='' hidden>منبع ورودی را انتخاب کنید</option>}
                                <option value='سایت'>سایت</option>
                                <option value='نمایشگاه'>نمایشگاه</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">وضعیت </label>
                            <input disabled={!owner} type='text' className="form-control form-control-sm" value={singleContact?.status} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">زمینه فعالیتی </label>
                            <select disabled={!owner} onChange={(e: any) => setValue('categoryId', e.target.value)} className="form-control form-control-sm">
                                {singleContact?.categoryId !== undefined ? <option value={singleContact?.categoryId?._id} hidden>{singleContact?.categoryId?.name}</option> : <option value='' hidden>یک زمینه را انتخاب کنید</option>}
                                {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">شرکت مربوطه </label>
                            <select disabled={!owner} onChange={(e: any) => setValue('companyId', e.target.value)} className="form-control form-control-sm">
                                {singleContact?.companyId !== undefined ? <option value={singleContact?.companyId?._id} hidden>{singleContact?.companyId?.name}</option> : <option value='' hidden>یک زمینه را انتخاب کنید</option>}
                                {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">عنوان </label>
                            <select disabled={!owner} className="form-control form-control-sm" onChange={(e: any) => setValue('title', e.target.value)}>
                                {singleContact?.title !== undefined ? <option value={singleContact?.title} hidden>{singleContact?.title}</option> : <option value='' hidden>عنوان برای سرنخ  انتخاب کنید</option>}
                                <option value='مدیر گروه'>مدیر گروه </option>
                                <option value='کارشناس'>کارشناس </option>
                                <option value='سرپرست'>سرپرست </option>
                                <option value='کاربر'>کاربر </option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">تاریخ تولد </label>
                            <div className='datePicker'>
                                <Controller
                                    control={control}
                                    name="birthdayDate"
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker disabled={!owner} className="form-control " format="YYYY/MM/DD" value={value || ''} calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date); }} />
                                    )} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">آدرس  </label>
                            <textarea disabled={!owner} className="form-control form-control-sm" placeholder='آدرس کامل  ' {...register('address')} ></textarea>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">توضیحات  </label>
                            <textarea disabled={!owner} className="form-control form-control-sm" placeholder='توضیحات  ' {...register('description')} ></textarea>
                        </div>
                        {owner && <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>
                        </div>}
                    </section>
                </form>
            </section>


        </div>

    );
}
