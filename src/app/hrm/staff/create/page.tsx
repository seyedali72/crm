'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { getEmployes } from '@/app/action/employe.action'
import { createExpert, getExperts } from '@/app/action/expert.action'
import { getTeams } from '@/app/action/teams.action'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface FormValues1 {
    user_name: string
    status: string
    role: number
    password: string
    teams: string
    employe_id: string
}
export default function Home() {
    const { handleSubmit, register, reset, setValue } = useForm<FormValues1>()
    const [expertsList, setExpertsList] = useState([])
    const [teamsList, setTeamsList] = useState([])
    const [EmployesList, setEmployesList] = useState([])
    const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const fetchEmployesList = useCallback(async () => {
        let employes = await getEmployes({})
        let experts = await getExperts({})
        setExpertsList(experts)
        setEmployesList(employes)
    }, [])
    const fetchTeamsList = useCallback(async () => {
        let teams = await getTeams({})
        setTeamsList(teams)
    }, [])

    const handleCreateExpert = async (obj: any) => {
        if (obj.employe_id !== undefined && obj.teams !== undefined) {
            let res = await createExpert(obj)
            if (!res.error) {
                toast.success('انجام شد')
                setMutated(!mutated)
                reset()
                router.replace('/hrm/staff')
            } else {
                toast.error('ناموفق بود')
            }
        } else { toast.error('nashod') }
    }
    const userChanged = expertsList?.map((ex: any) => ex?.employe_id?._id)
    const checkedUser = (userId: any) => {
        if (userChanged?.includes(userId)) { return false } else { return true }
    }
    useEffect(() => {
        fetchEmployesList()
        fetchTeamsList()
    }, [fetchEmployesList, mutated])

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/hrm/">داشبورد</Link></li>
                    <li className="breadcrumb-item "> <Link href="/hrm/staff"> کارشناس ها</Link> </li>
                    <li className="breadcrumb-item  active" aria-current="page"> افزودن کارشناس جدید </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateExpert)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">کارمند  </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('employe_id', e.target.value)}><option value='' hidden>کارمند را انتخاب کنید</option>
                                {EmployesList?.map((user: any, idx: number) => { if (checkedUser(user?._id)) { return (<option key={idx} value={user?._id}>{user?.name}</option>) } })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">گروه فعالیتی </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('teams', e.target.value)}><option value='' hidden>گروه را انتخاب کنید</option>
                                {teamsList?.map((team: any, idx: number) => { return (<option key={idx} value={team?._id}>{team?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">نام کاربری </label>
                            <input type="text" className="form-control form-control-sm" placeholder='نام کاربری' {...register('user_name', { required: 'نام کاربری را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">رمزعبور </label>
                            <input type="text" className="form-control form-control-sm" placeholder='رمزعبور ' {...register('password', { required: 'آدرس ایمیل را وارد کنید', })} />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">وضعیت کارمند </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('status', e.target.value)}>
                                <option value='' hidden>وضعیت کارمند را انتخاب کنید</option>
                                <option value='همکاری'>در حال همکاری</option>
                                <option value='قطع همکاری'>قطع همکاری</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">سطح دسترسی </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('role', e.target.value)}>
                                <option value='' hidden>سطح دسترسی کارشناس را انتخاب کنید</option>
                                <option value={2}>مدیر فروش </option>
                                <option value={3}>مدیر منابع انسانی </option>
                                <option value={4}>کارمند فروش </option>
                                <option value={5}>کارمند منابع انسانی </option>
                                <option value={6}>مدیر تدارکات </option>
                                <option value={7}>مسئول خرید </option>
                                <option value={8}>کاربر </option>
                            </select>
                        </div>

                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت</button>
                        </div>
                    </section>
                </form>
            </section>
        </>
    );
}
