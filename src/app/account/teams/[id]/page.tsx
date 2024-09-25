'use client'

import { editTeam, getSingleTeam, getTeams } from "@/app/action/teams.action"
import { Confirmation } from "@/app/components/Confirmation"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
interface IForm {
    name: string
    status: string
    parent: string
}
export default function TeamDetail() {
    const { id }: any = useParams()
    const [singleTeam, setSingleTeam] = useState<any>([])
    const [filter, setFilter] = useState('')
    const [teams, setTeams] = useState([])
    const [editInfo, setEditInfo] = useState(false)
    const [change, setChange] = useState(false)
    const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const fetchTeamsList = useCallback(async () => {
        let single = await getSingleTeam(id)
        setSingleTeam(single)
    }, [])
    const { handleSubmit, register, setValue } = useForm<IForm>({
        values: {
            name: singleTeam.name,
            status: singleTeam.status,
            parent: singleTeam.parent?._id,
        }
    })
    const allTeams = useCallback(async () => {
        let teams = await getTeams({})
        setTeams(teams)
    }, [])
    const handleEditTeams = async (obj: any) => {
        let res = await editTeam(singleTeam?._id, obj)
        if (!res.error) {
            router.replace('/account/teams')
        }
    }
    useEffect(() => { fetchTeamsList(), allTeams() }, [fetchTeamsList, mutated])
    const handleDelete = async (expertId: any) => {
        let filter = singleTeam?.users?.filter((expert: any) => expert?._id !== expertId)
        singleTeam.users = filter
        let res = await editTeam(singleTeam?._id, singleTeam)
        if (!res.error) { setMutated(!mutated) }
    }
    if (singleTeam?.length !== 0) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                        <li className="breadcrumb-item "><Link href="/account/teams"> لیست تیم ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page"> {singleTeam?.name}</li>
                    </ol>
                </nav>
                <section className="main-body-container rounded">
                    <form action="post" onSubmit={handleSubmit(handleEditTeams)} method='Post'>
                        <section className="row">
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">عنوان تیم </label>
                                <input disabled={!editInfo} type="text" className="form-control form-control-sm" {...register('name', { required: 'عنوان تیم را وارد کنید', })} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">تیم والد </label>
                                <select disabled={!editInfo} className="form-control form-control-sm" defaultValue={singleTeam?.parent?._id} onChange={(e: any) => [setValue('parent', e.target.value), setChange(true)]}>
                                    {!change && <option value={singleTeam?.parent?._id !== undefined ? singleTeam?.parent?._id : ''}>{singleTeam?.parent?.name !== undefined ? singleTeam?.parent?.name : 'بدون والد'}</option>}
                                    {teams?.map((team: any, idx: number) => {
                                        if (team?._id !== singleTeam?._id) {
                                            if (!change) {
                                                if (team?._id !== singleTeam?.parent?._id) {
                                                    return (<option key={idx} value={team?._id}>{team?.name}</option>)
                                                }
                                            } else { return (<option key={idx} value={team?._id}>{team?.name}</option>) }
                                        }
                                    })}
                                </select>
                            </div>
                            <div className="col-12 my-2">
                                {editInfo && <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>}
                            </div>
                        </section>
                    </form>
                    <div className="col-12 my-2">
                        {!editInfo && <button type="button" onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>}
                    </div>
                </section>

                {singleTeam?.users.length !== 0 && <section className="main-body-container rounded">
                    <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                        <section className="main-body-title">
                            <h5 className="mb-0">لیست اعضا</h5>
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
                                    <th>نام عضو</th>
                                    <th>نام کاربری</th>
                                    <th>عنوان</th>
                                    <th>دسترسی</th>
                                    <th>وضعیت</th>
                                    <th className=" text-center">
                                        <i className="fa fa-cogs px-1"></i>تنظیمات
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {singleTeam?.users.map((expert: any, idx: number) => {
                                    if (expert?.employe_id.name.includes(filter)) {
                                        return (<tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{expert?.employe_id?.name} </td>
                                            <td>{expert.user_name}</td>
                                            <td>{expert.title}</td>
                                            <td>{expert.roles}</td>
                                            <td>{expert.status}</td>
                                            <td className="text-center">
                                                <Link href={`/account/expert/${expert?._id}`} className="btn btn-sm bg-custom-2 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                                                <Link href={`/account/expert/edit/${expert?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>ویرایش</Link>
                                                <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(expert?._id)} />, { autoClose: false, })}>
                                                    <i className="fa fa-trash px-1"></i>حذف
                                                </button>
                                            </td>
                                        </tr>)
                                    }
                                })}
                            </tbody>
                        </table>
                    </section>
                </section>}

            </>
        )
    } else { return (<p>درحال دریافت اطلاعات</p>) }
}