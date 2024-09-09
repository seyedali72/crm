'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createLead, getLeads } from '../action/lead.action'
interface FormValues1 {
  name: string
  mobile_number: number
  province: string
  city: string
  address: string
  email: string
}
export default function Home() {
  const {
    handleSubmit,
    register,
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
          <form style={{ width: '30%', padding: 10 }} action="post" onSubmit={handleSubmit(handleCreateLead)}>
            <h2 style={{ width: '100%', textAlign: 'start' }}>  افزودن سرنخ </h2>
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام و نام خانوادگی'	{...register('name', { required: 'نام سرنخ را وارد کنید', })} />
            <input type="number" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شماره موبایل'	{...register('mobile_number', { required: 'شماره تلفن را وارد کنید', })} />
            <input type="email" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='ایمیل  '	{...register('email')} />
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='استان  '	{...register('province')} />
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شهر  '	{...register('city')} />
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='آدرس کامل  '	{...register('address')} />
            <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
          </form>
          <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '70%', padding: 10 }}>
          <h2 style={{ width: '100%', textAlign: 'start' }}> لیست سرنخ ها</h2>

            <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام یا شماره موبایل فیلتر کنید' />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th>نام و فامیلی</th>
                <th>وضعیت</th>
                <th>شماره موبایل</th>
                <th>تماس ها</th>
                <th>کارشناس</th>
              </tr></thead>
              <tbody>
                {leadList.map((lead: any) => {
                  if (lead.name.includes(filter) || lead.mobile_number.includes(filter)) {
                    return (<tr>
                      <td style={{ textAlign: 'start' }}> <Link href={`/leads/${lead?._id}`} >{lead.name}  </Link></td>
                      <td>{lead.status}</td>
                      <td>{lead.mobile_number}</td>
                      <td>{lead.call.length && lead.call.length}</td>
                      <td>----</td>
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
