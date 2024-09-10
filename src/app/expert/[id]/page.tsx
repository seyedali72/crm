'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { editExpert, getSingleExpert } from '@/app/action/expert.action'
import { getTeams } from '@/app/action/teams.action'
import { useParams } from 'next/navigation'
interface FormValues1 {
    user_name: string
    title: string
    status: string
    type: string
    roles: string
    description: string
    email: string
}
export default function ExpertDetail() {
    const { id }: any = useParams()
    const [singleExpert, setSingleExpert] = useState<any>([])
    const [teamsList, setTeamsList] = useState([])
    const [filter, setFilter] = useState('')
    const [teamId, setTeamId] = useState<any>()
    const [mutated, setMutated] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const fetchExpertList = useCallback(async () => {
        let experts = await getSingleExpert(id)
        setSingleExpert(experts)
    }, [])
    const fetchTeamsList = useCallback(async () => {
        let teams = await getTeams({})
        setTeamsList(teams)
    }, [])
    const { handleSubmit, register, } = useForm<FormValues1>({
        values: {
            user_name: singleExpert?.user_name,
            title: singleExpert?.title,
            roles: singleExpert?.roles,
            status: singleExpert?.status,
            description: singleExpert?.description,
            type: singleExpert?.type,
            email: singleExpert?.email,
        }
    })
    const handleCreateExpert = async (obj: any) => {
        obj.teams = teamId !== undefined ? teamId : singleExpert?.teams?._id
        let res = await editExpert(id, obj)
        if (!res.error) {
            setMutated(!mutated)
            setEditInfo(!editInfo)
        } else {
            console.log('ridi')
        }
    }
    useEffect(() => {
        fetchExpertList()
        fetchTeamsList()
    }, [fetchExpertList, mutated])
    return (
        <div>
            <main>
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ width: '30%', padding: 10 }} >
                        <form action="post" onSubmit={handleSubmit(handleCreateExpert)}>
                            <h2 style={{ width: '100%', textAlign: 'start', marginBottom: 15 }}>   اطلاعات کارشناس </h2>
                            <select style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} disabled={!editInfo} defaultValue={singleExpert?.teams?._id} onChange={(e: any) => setTeamId(e.target.value)}>
                                {teamId === undefined ? <option value={singleExpert?.teams?._id}>{singleExpert?.teams?.name}</option> : ""}
                                {teamsList?.map((team: any, idx: number) => { return (<option key={idx} value={team?._id}>{team?.name}</option>) })}
                            </select>
                            <input disabled={!editInfo} type="email" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='ایمیل  '	{...register('email')} />
                            <input disabled={!editInfo} type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='وضعیت  '	{...register('status')} />
                            <input disabled={!editInfo} type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='تایپ  '	{...register('type')} />
                            <input disabled={!editInfo} type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='عنوان  '	{...register('title')} />
                            <input disabled={!editInfo} type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='دسترسی ها  '	{...register('roles')} />

                            <textarea disabled={!editInfo} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='توضیحات تکمیلی  '	{...register('description')} ></textarea>

                            {editInfo && <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>}
                        </form>
                        {!editInfo && <button type="button" onClick={() => setEditInfo(!editInfo)} style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ویرایش</button>}
                    </div>
                    <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '70%', padding: 10 }}>
                        <h2 style={{ width: '100%', textAlign: 'start', marginBottom: 15 }}> لیست سرنخ ها</h2>

                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام یا شماره موبایل فیلتر کنید' />
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr>
                                <th>نام و فامیلی</th>
                                <th>وضعیت</th>
                                <th>شماره موبایل</th>
                                <th>تعداد تماس ها</th>
                            </tr></thead>
                            <tbody>
                                {singleExpert?.leads?.length > 0 &&
                                    singleExpert?.leads?.map((expert: any, idx: number) => {
                                        if (expert?.name.includes(filter) || expert?.mobile_number.includes(filter)) {
                                            return (<tr key={idx}>
                                                <td style={{ textAlign: 'start' }}><Link href={`/leads/${expert?._id}`}>{expert?.name}</Link></td>
                                                <td>{expert.status}</td>
                                                <td>{expert?.mobile_number}</td>
                                                <td>{expert?.call?.length}</td>
                                            </tr>)
                                        }
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
