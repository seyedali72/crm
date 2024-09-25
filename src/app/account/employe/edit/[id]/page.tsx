'use client'
import { Controller, useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { editEmploye, getSingleEmploye } from '@/app/action/employe.action'
import { useParams, useRouter } from 'next/navigation'
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
  joinDate: number
  birthdayDate: number
}
export default function Home() {
  const router = useRouter()
  const { id }: any = useParams()
  const [mutated, setMutated] = useState(false)
  const [singleEmploye, setSingleEmploye] = useState<any>()
  const [departments, setDepartments] = useState([])
  const [department, setDepartment] = useState<any>()
  const [eContactOne, setEContactOne] = useState<any>()
  const [eContactTwo, setEContactTwo] = useState<any>()
  const fetchDepartments = useCallback(async () => {
    let department = await getDepartments({})
    setDepartments(department)
  }, [])
  const fetchSingle = useCallback(async () => {
    let single = await getSingleEmploye(id)
    setSingleEmploye(single)

    setEContactOne(single?.emergencyContacts[0])
    setEContactTwo(single?.emergencyContacts[1])
  }, [])
  const { handleSubmit, register, reset, control, setValue } = useForm<FormValues1>({
    values: {
      name: singleEmploye?.name,
      national_code: singleEmploye?.national_code,
      mobile_number: singleEmploye?.mobile_number,
      phone_number: singleEmploye?.phone_number,
      gender: singleEmploye?.gender,
      department_id: singleEmploye?.department_id,
      skill: singleEmploye?.skill,
      empolyeCode: singleEmploye?.empolyeCode,
      email: singleEmploye?.email,
      address: singleEmploye?.address,
      joinDate: singleEmploye?.joinDate !== undefined ? Date.parse(singleEmploye?.joinDate) : 0,
      birthdayDate: singleEmploye?.birthdayDate !== undefined ? Date.parse(singleEmploye?.birthdayDate) : 0,
    }
  })

  const handleEditEmploye = async (obj: any) => {
    obj.emergencyContacts = [eContactOne, eContactTwo]
    obj.joinDate = singleEmploye?.joinDate !== undefined ? obj.joinDate !== Date.parse(singleEmploye?.joinDate) ? convertToTimeStamp(obj.joinDate) : obj.joinDate : convertToTimeStamp(obj.joinDate)
    obj.birthdayDate = singleEmploye?.birthdayDate !== undefined ? obj.birthdayDate !== Date.parse(singleEmploye?.birthdayDate) ? convertToTimeStamp(obj.birthdayDate) : obj.birthdayDate : convertToTimeStamp(obj.birthdayDate)

    let res = await editEmploye(singleEmploye?._id, obj)
    if (!res.error) {
      toast.success('انجام شده')
      setMutated(!mutated)
      reset()
      router.replace('/account/employe')
    } else {
      toast.error('ridi')
    }
  }
  useEffect(() => {
    fetchSingle()
    fetchDepartments()
  }, [fetchSingle, mutated])
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
          <li className="breadcrumb-item"> <Link href="/account/employe"> لیست کارمندان</Link> </li>
          <li className="breadcrumb-item active" aria-current="page"> ویرایش کارمند</li>
        </ol>
      </nav>
      <form action="post" onSubmit={handleSubmit(handleEditEmploye)} method='Post'>
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
              <select className="form-control form-control-sm" defaultValue={singleEmploye?.department_id?._id} onChange={(e: any) => { setValue('department_id', e.target.value), setDepartment(e.target.value) }} >
                {department !== '' ? <option value={singleEmploye?.department_id?._id}>{singleEmploye?.department_id?.name}</option> : <option value=''>دپارتمان مورد نظر را انتخاب کنید</option>}
                {departments?.map((department: any, idx: number) => department?._id !== singleEmploye?.department_id?._id && <option key={idx} value={department?._id} >{department?.name}</option>)}
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
        <EmergencyContact edit={true} data={singleEmploye?.emergencyContacts} contactInfo={(a: any) => { setEContactOne(a[0]); setEContactTwo(a[1]); }} />
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
