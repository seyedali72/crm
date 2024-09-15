'use client'

import { editTeam, getSingleTeam } from "@/app/action/teams.action"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
interface IForm {
    name: string
    status: string
}
export default function TeamDetail() {
    const { id }: any = useParams()
    const [singleTeam, setSingleTeam] = useState<any>([])
    const [filter, setFilter] = useState('')
    const [editInfo, setEditInfo] = useState(false)
    const fetchTeamsList = useCallback(async () => {
        let single = await getSingleTeam(id)
        setSingleTeam(single)
    }, [])
    const { handleSubmit, register } = useForm<IForm>({
        values: {
            name: singleTeam.name,
            status: singleTeam.status,
        }
    })
    const handleEditTeams = async (obj: any) => {
        await editTeam(singleTeam?._id, obj)
    }

    useEffect(() => { fetchTeamsList() }, [fetchTeamsList])
    if (singleTeam?.length !== 0) {
        return (
            <>
                <form method="post" onSubmit={handleSubmit(handleEditTeams)}>
                    <input disabled={!editInfo} type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام تیم'	{...register('name', { required: 'نام تیم را وارد کنید', })} />
                    <input disabled={!editInfo} type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام تیم'	{...register('status', { required: 'وضعیت تیم را وارد کنید', })} />
                    {editInfo && <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت ویرایش</button>}
                </form>
                {!editInfo && <button type="button" onClick={() => setEditInfo(!editInfo)} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>درخواست ویرایش</button>}
                {singleTeam?.users !== undefined && <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '100%', padding: 10 }}>
                    <h2 style={{ width: '100%', textAlign: 'start' }}> لیست اعضا</h2>

                    <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام تیم فیلتر کنید' />
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                            <th>نام عضو</th>
                            <th>نام کاربری</th>
                            <th>عنوان</th>
                            <th>تایپ</th>
                            <th>وضعیت</th>
                        </tr></thead>
                        <tbody>
                            {singleTeam?.users.map((team: any, idx: number) => {
                                if (team.employe_id.name.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td style={{ textAlign: 'start' }}> <Link href={`/teams/${team?._id}`} >{team?.employe_id?.name}  </Link></td>
                                        <td>{team.user_name}</td>
                                        <td>{team.title}</td>
                                        <td>{team.type}</td>
                                        <td>{team.status}</td>
                                    </tr>)
                                }
                            })}
                        </tbody>
                    </table>
                </div>}
            </>
        )
    } else { return (<p>درحال دریافت اطلاعات</p>) }
}