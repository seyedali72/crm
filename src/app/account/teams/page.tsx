'use client'
interface IForm {
    name: string;
    parent: string;
}
import { useForm } from "react-hook-form"
import { createTeam, deleteTeam, getTeams } from "../../action/teams.action";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";

export default function Teams() {
    const [mutated, setMutated] = useState(false)
    const [filter, setFilter] = useState('')
    const [teams, setTeams] = useState([])
    const { register, handleSubmit, reset, setValue } = useForm<IForm>()
    const handleCreateTeams = async (obj: any) => {
        let res = await createTeam(obj)
        if (!res.error) {
            setMutated(!mutated)
            reset()
        }
    }
    const allTeams = useCallback(async () => {
        let teams = await getTeams({})
        setTeams(teams)
    }, [])
    useEffect(() => {
        allTeams()
    }, [mutated, allTeams])
    const handleDelete = async (teamId: any) => {
        let res = await deleteTeam(teamId)
        if (!res.error) { setMutated(!mutated) }
    }
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست تیم ها</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateTeams)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">عنوان تیم </label>
                            <input type="text" className="form-control form-control-sm" {...register('name', { required: 'عنوان تیم را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">تیم والد </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('parent', e.target.value)}><option value=''>یک تیم را انتخاب کنید</option>
                                {teams?.map((team: any, idx: number) => { return (<option key={idx} value={team?._id}>{team?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت</button>
                        </div>
                    </section>
                </form>
            </section>

            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <section className="main-body-title">
                        <h5 className="mb-0">لیست تیم ها</h5>
                    </section>
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام تیم ' className="form-control form-control-sm" />
                    </div>
                </section>
                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام تیم</th>
                                <th>تیم والد</th>
                                <th>تعداد اعضا</th>
                                <th>وضعیت</th>
                                <th className=" text-center">
                                    <i className="fa fa-cogs px-1"></i>تنظیمات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team: any, idx: number) => {
                                if (team.name.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td > {team.name}</td>
                                        <td>{team?.parent !== undefined ? team?.parent?.name : '---'}</td>
                                        <td>{team.users?.length}</td>
                                        <td>{team.status}</td>
                                        <td className="text-center">
                                            <Link href={`/account/teams/${team?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>جزئیات</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(team?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>
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