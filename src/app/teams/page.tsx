'use client'
interface IForm {
    name: string;
}
import { useForm } from "react-hook-form"
import { createTeam, getTeams } from "../action/teams.action";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function Teams() {
    const [mutated, setMutated] = useState(false)
    const [filter, setFilter] = useState('')
    const [teams, setTeams] = useState([])
    const { register, handleSubmit, setValue } = useForm<IForm>()
    const handleCreateTeams = async (obj: any) => {
        let res = await createTeam(obj)
        if (!res.error) {
            setMutated(!mutated)
            setValue('name', '')
        }
    }
    const allTeams = useCallback(async () => {
        let teams = await getTeams({})
        setTeams(teams)
    }, [])
    useEffect(() => {
        allTeams()
    }, [mutated, allTeams])
    return (
        <>
            <form method="post" onSubmit={handleSubmit(handleCreateTeams)}>
                <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام تیم'	{...register('name', { required: 'نام تیم را وارد کنید', })} />
                <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
            </form>
            <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '100%', padding: 10 }}>
                <h2 style={{ width: '100%', textAlign: 'start' }}> لیست تیم ها</h2>

                <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام تیم فیلتر کنید' />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                        <th>نام تیم</th>
                        <th>تعداد اعضا</th>
                        <th>وضعیت</th>
                    </tr></thead>
                    <tbody>
                        {teams.map((team: any,idx:number) => {
                            if (team.name.includes(filter)) {
                                return (<tr key={idx}>
                                    <td style={{ textAlign: 'start' }}> <Link href={`/teams/${team?._id}`} >{team.name}  </Link></td>
                                    <td>{team.users?.length}</td>
                                    <td>{team.status}</td>
                                </tr>)
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}