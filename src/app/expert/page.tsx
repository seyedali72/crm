'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { getUsers } from '../action/usser.action'
import { createExpert, getExperts } from '../action/expert.action'
import { getTeams } from '../action/teams.action'
interface FormValues1 {
    user_name: string
    title: string
    status: string
    description: string
    type: string
    roles: string
    email: string
}
export default function Home() {
    const { handleSubmit, register,setValue } = useForm<FormValues1>()
    const [expertsList, setExpertsList] = useState([])
    const [teamsList, setTeamsList] = useState([])
    const [userList, setUserList] = useState([])
    const [filter, setFilter] = useState('')
    const [userId, setUserId] = useState<any>()
    const [teamId, setTeamId] = useState<any>()
    const [mutated, setMutated] = useState(false)

    const fetchUserList = useCallback(async () => {
        let users = await getUsers({})
        let experts = await getExperts({})
        setExpertsList(experts)
        setUserList(users)
    }, [])
    const fetchTeamsList = useCallback(async () => {
        let teams = await getTeams({})
        setTeamsList(teams)
    }, [])
    const handleCreateExpert = async (obj: any) => {
        if (userId !== undefined && teamId !== undefined) {
            obj.user_id = userId
            obj.teams = teamId
            let res = await createExpert(obj)
            if (!res.error) {
                setMutated(!mutated)
                setValue('description','')
                setValue('email','')
                setValue('roles','')
                setValue('status','')
                setValue('title','')
                setValue('type','')
                setValue('user_name','')
            } else {
                console.log('ridi')
            }
        } else { console.log('nashod') }
    }
    const userChanged = expertsList?.map((ex: any) => ex?.user_id?._id)
    const checkedUser = (userId: any) => {
        if (userChanged?.includes(userId)) { return false } else { return true }
    }
    useEffect(() => {
        fetchUserList()
        fetchTeamsList()
    }, [fetchUserList, mutated])

    return (
        <div>
            <main>
                <div style={{ display: 'flex', width: '100%' }}>
                    <form style={{ width: '30%', padding: 10 }} action="post" onSubmit={handleSubmit(handleCreateExpert)}>
                        <h2 style={{ width: '100%', textAlign: 'start' }}>  افزودن کارشناس </h2>
                        <select style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} onChange={(e: any) => setUserId(e.target.value)}><option  value=''>کاربر را انتخاب کنید</option>
                            {userList?.map((user: any, idx: number) => { if (checkedUser(user?._id)) { return (<option key={idx} value={user?._id}>{user?.name}</option>) } })}
                        </select>
                        <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام کاربری  '	{...register('user_name')} />
                        <select style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} onChange={(e: any) => setTeamId(e.target.value)}><option  value=''>تیم را انتخاب کنید</option>
                            {teamsList?.map((team: any, idx: number) => { return (<option key={idx} value={team?._id}>{team?.name}</option>) })}
                        </select>
                        <input type="email" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='ایمیل  '	{...register('email')} />
                        <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='وضعیت  '	{...register('status')} />
                        <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='تایپ  '	{...register('type')} />
                        <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='عنوان  '	{...register('title')} />
                        <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='دسترسی  '	{...register('roles')} />
                        <textarea style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='توضیحات تکمیلی  '	{...register('description')} ></textarea>

                        <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
                    </form>
                    <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '70%', padding: 10 }}>
                        <h2 style={{ width: '100%', textAlign: 'start' }}> لیست کارشناس ها</h2>

                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام یا شماره موبایل فیلتر کنید' />
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr>
                                <th>نام و فامیلی</th>
                                <th>وضعیت</th>
                                <th>شماره موبایل</th>
                                <th>تیم</th>
                                <th>سرنخ ها</th>
                                <th>مشتریان</th>
                            </tr></thead>
                            <tbody>
                                {expertsList.map((expert: any, idx: number) => {
                                    if (expert?.user_id?.name.includes(filter) || expert?.user_id?.mobile_number.includes(filter)) {
                                        return (<tr key={idx}>
                                            <td style={{ textAlign: 'start' }}> <Link href={`/expert/${expert?._id}`} >{expert?.user_id?.name}  </Link></td>
                                            <td>{expert.status}</td>
                                            <td>{expert.user_id?.mobile_number}</td>
                                            <td>{expert?.teams?.name}</td>
                                            <td>{expert?.leads?.length}</td>
                                            <td>{expert?.customers?.length}</td>
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