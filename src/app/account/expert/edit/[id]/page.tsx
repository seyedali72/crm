'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { editExpert, getSingleExpert } from '@/app/action/expert.action'
import { getTeams } from '@/app/action/teams.action'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface FormValues1 {
    user_name: string
    status: string
    roles: string
    password: string
    teams: string
    employe_id: string
}
export default function Home() {
    const { id }: any = useParams()
    const [teamsList, setTeamsList] = useState([])
    const [singleExpert, setSingleExpert] = useState<any>()
    const [change, setChange] = useState(false)
    const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const fetchSingle = useCallback(async () => {
        let expert = await getSingleExpert(id)
        setSingleExpert(expert)
    }, [])
    const fetchTeamsList = useCallback(async () => {
        let teams = await getTeams({})
        setTeamsList(teams)
    }, [])
    const { handleSubmit, register, reset, setValue } = useForm<FormValues1>({
        values: {
            user_name: singleExpert?.user_name,
            roles: singleExpert?.roles,
            password: singleExpert?.password,
            status: singleExpert?.status,
            teams: singleExpert?.teams?._id,
            employe_id: singleExpert?.employe_id?._id,
        }
    })

    const handleEditExpert = async (obj: any) => {
        let res = await editExpert(singleExpert?._id, obj)
        if (!res.error) {
            toast.success('موفق بود')
            setMutated(!mutated)
            reset()
            router.replace('/account/expert')
        } else {
            toast.error('ridi')
        }
    }

    useEffect(() => {
        fetchSingle()
        fetchTeamsList()
    }, [fetchSingle, mutated])

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item "> <Link href="/account/expert"> کارشناس ها</Link> </li>
                    <li className="breadcrumb-item  active" aria-current="page">ویرایش اطلاعات {singleExpert?.employe_id?.name}</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleEditExpert)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6 mb-2">نام : {singleExpert?.employe_id?.name}</div>
                        <div className="col-12 col-md-6 mb-2">شماره ملی : {singleExpert?.employe_id?.national_code}</div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">گروه فعالیتی </label>
                            <select className="form-control form-control-sm" defaultValue={singleExpert?.teams?._id} onChange={(e: any) => [setValue('teams', e.target.value), setChange(true)]}>
                                {!change && <option value={singleExpert?.teams?._id !== undefined ? singleExpert?.teams?._id : ''}>{singleExpert?.teams?.name !== undefined ? singleExpert?.teams?.name : 'بدون گروه'}</option>}
                                {teamsList?.map((team: any, idx: number) => {
                                    if (!change) {
                                        if (team?._id !== singleExpert?.teams?._id) {
                                            return (<option key={idx} value={team?._id}>{team?.name}</option>)
                                        }
                                    } else { return (<option key={idx} value={team?._id}>{team?.name}</option>) }
                                })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">رمز عبور </label>
                            <input type="text" className="form-control form-control-sm" {...register('password', { required: 'رمز عبور را وارد کنید', })} />
                        </div>

                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">وضعیت همکاری </label>
                            <select className="form-control form-control-sm" defaultValue={singleExpert?.status} onChange={(e: any) => [setValue('status', e.target.value)]}>
                                <option value={singleExpert?.status}>{singleExpert?.status == 'همکاری' ? 'درحال همکاری' : 'قطع همکاری'}</option>
                                {singleExpert?.status !== 'همکاری' && <option value='همکاری'>درحال همکاری </option>}
                                {singleExpert?.status !== 'قطع همکاری' && <option value='قطع همکاری'>قطع همکاری </option>}
                            </select>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">سطح دسترسی </label>
                            <select className="form-control form-control-sm" defaultValue={singleExpert?.roles} onChange={(e: any) => setValue('roles', e.target.value)}>
                                <option value={singleExpert?.roles}>{singleExpert?.roles}</option>
                                {singleExpert?.roles !== 'مدیر گروه' && <option value='مدیر گروه'>مدیر گروه </option>}
                                {singleExpert?.roles !== 'کارشناس' && <option value='کارشناس'>کارشناس </option>}
                                {singleExpert?.roles !== 'سرپرست' && <option value='سرپرست'>سرپرست </option>}
                                {singleExpert?.roles !== 'کاربر' && <option value='کاربر'>کاربر </option>}
                            </select>
                        </div>

                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>
                        </div>
                    </section>
                </form>
            </section>
        </>
    );
}