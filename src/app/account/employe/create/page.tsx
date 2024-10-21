'use client'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect,  useState } from 'react'
import Link from 'next/link'
import { createEmploye } from '@/app/action/employe.action'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { convertToTimeStamp } from '@/app/utils/helpers'
import { getDepartments } from '@/app/action/department.action'
import EmergencyContact from '@/app/components/EmergencyContact'

interface FormValues1 {
  name: string
  national_code: number
  mobile_number: number
  phone_number: number
  gender: string
  department_id: string
  skill: string
  empolyeCode: string
  email: string
  address: string
  joinDate: string
  birthdayDate: string
}
export default function Home() {
  const { handleSubmit, register, reset, control, setValue } = useForm<FormValues1>()
  const [mutated, setMutated] = useState(false)
  const [departments, setDepartments] = useState([])
  const [eContactOne, setEContactOne] = useState<any>()
  const [eContactTwo, setEContactTwo] = useState<any>()
  const router = useRouter()
  const fetchDepartments = useCallback(async () => {
    let department = await getDepartments({})
    setDepartments(department)
  }, [])
  const handleCreateEmploye = async (obj: any) => {
    obj.emergencyContacts = [eContactOne, eContactTwo]

    obj.joinDate = obj.joinDate !== undefined ? convertToTimeStamp(obj.joinDate) : undefined
    obj.birthdayDate = obj.birthdayDate !== undefined ? convertToTimeStamp(obj.birthdayDate) : undefined
    let res = await createEmploye(obj)
    if (!res.error) {
      toast.success('انجام شده')
      setMutated(!mutated)
      reset()
      router.replace('/account/employe')
    } else {
      toast.error('ناموفق بود')
    }
  }
  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
          <li className="breadcrumb-item"> <Link href="/account/employe"> لیست کارمندان</Link> </li>
          <li className="breadcrumb-item active" aria-current="page"> تعریف کارمند جدید </li>
        </ol>
      </nav>
      <form action="post" onSubmit={handleSubmit(handleCreateEmploye)} method='Post'>
        <section className="main-body-container rounded">
          <section className="row">
            <h5>اطلاعات شخصی</h5>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">نام کارمند </label>
              <input type="text" className="form-control form-control-sm" {...register('name', { required: 'نام کارمند را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">شماره ملی</label>
              <input type="text" className="form-control form-control-sm" {...register('national_code', { required: 'شماره ملی را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">دپارتمان</label>
              <select className="form-control form-control-sm" onChange={(e: any) => setValue('department_id', e.target.value)} >
                <option value="">دپارتمان مورد نظر را انتخاب کنید</option>
                {departments?.map((department: any, idx: number) => <option key={idx} value={department?._id} >{department?.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">عنوان شغلی</label>
              <input type="text" className="form-control form-control-sm" {...register('skill')} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">کد پرسنلی</label>
              <input type="text" className="form-control form-control-sm" {...register('empolyeCode')} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">تاریخ عضویت</label>
              <div className='datePicker'>
                <Controller
                  control={control}
                  name="joinDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker className="form-control " format="YYYY/MM/DD" value={value || ''} calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date); }} />
                  )} />
              </div>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">تاریخ تولد</label>
              <div className='datePicker'>
                <Controller
                  control={control}
                  name="birthdayDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker className="form-control " format="YYYY/MM/DD" value={value || ''} calendar={persian} locale={persian_fa} onChange={(date) => { onChange(date); }} />
                  )} />
              </div>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">تلفن ثابت</label>
              <input type="text" className="form-control form-control-sm" {...register('phone_number')} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">شماره موبایل</label>
              <input type="text" className="form-control form-control-sm" {...register('mobile_number', { required: 'شماره همراه را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">آدرس ایمیل </label>
              <input type="text" className="form-control form-control-sm" {...register('email')} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">آدرس سکونت </label>
              <input type="text" className="form-control form-control-sm" {...register('address')} />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <label className='my-1' htmlFor="">جنسیت </label>
              <input type="text" className="form-control form-control-sm" {...register('gender')} />
            </div>
            {/* انتخاب دسترسی  */}
            {/* <section className="row col-12 mt-3">
                <div className="col-6 col-md-3 d-flex mt-1">
                  <input type="checkbox" className="mx-2" id="check1" checked />
                  <label htmlFor="check1">گزینه یک</label>
                </div>

                <div className="col-6 col-md-3 d-flex mt-1">
                  <input type="checkbox" className="mx-2" id="check2" checked />
                  <label htmlFor="check2">گزینه یک</label>
                </div>

                <div className="col-6 col-md-3 d-flex mt-1">
                  <input type="checkbox" className="mx-2" id="check3" checked />
                  <label htmlFor="check3">گزینه یک</label>
                </div>

                <div className="col-6 col-md-3 d-flex mt-1">
                  <input type="checkbox" className="mx-2" id="check4" checked />
                  <label htmlFor="check4">گزینه یک</label>
                </div>
              </section> */}
          </section>
        </section>
        <EmergencyContact contactInfo={(a: any) => { setEContactOne(a[0]); setEContactTwo(a[1]); setMutated(!mutated) }} />
        <section className="main-body-container rounded">
          <section className="row">
            <div className="col-12 ">
              <button type='submit' className="btn btn-primary btn-sm px-5">ثبت</button>
            </div>
          </section></section>
      </form>
    </>
  );
}
