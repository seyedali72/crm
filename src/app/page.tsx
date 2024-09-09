'use client'
import { useForm } from 'react-hook-form'
import { createLead, getLeads } from './action/lead.action'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
interface FormValues1 {
  name: string
  mobile_number: number
}
export default function Home() {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues1>()
  const [leadList, setLeadList] = useState([])
  const [filter, setFilter] = useState('')
  const [mutated, setMutated] = useState(false)
  const fetchLeatList = useCallback(async () => {
    let leads = await getLeads({})
    setLeadList(leads)
  }, [])
  const handleCreateLead = async (obj: any) => {
    let res = await createLead(obj)
    if (!res.error) {
      setMutated(!mutated)
    } else {
      console.log('ridi')
    }
  }
  useEffect(() => {
    fetchLeatList()
  }, [fetchLeatList, mutated])
  return (
    <div>
      <main>
        <div style={{ display: 'flex', width: '100%' }}>
          <form style={{ width: '40%', padding: 10 }} action="post" onSubmit={handleSubmit(handleCreateLead)}>
            <h1 style={{ width: '100%', textAlign: 'start' }}>  افزودن سرنخ </h1>
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام و نام خانوادگی'	{...register('name', { required: 'نام سرنخ را وارد کنید', })} />
            <input type="number" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شماره موبایل'	{...register('mobile_number', { required: 'متید', })} />
            <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
          </form>
          <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '60%', padding: 10 }}>
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام یا شماره موبایل فیلتر کنید' />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th>نام و فامیلی</th>
                <th>شماره موبایل</th>
                <th>ثبت گزارش</th>
                <th>ویرایش</th>
              </tr></thead>
              <tbody>
                {leadList.map((lead: any) => {
                  if (lead.name.includes(filter) || lead.mobile_number.includes(filter)) {
                    return (<tr>
                      <td style={{ textAlign: 'start' }}>{lead.name}</td>
                      <td>{lead.mobile_number}</td>
                      <td>  <Link href={`/lead/${lead?._id}`} >ثبت گزارش</Link> </td>
                      <td> <Link href={`/lead/edit/${lead?._id}`} >ویرایش سرنخ</Link></td>
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
