'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createEmploye, getEmployes } from '../action/employe.action'
 interface FormValues1 {
  name: string
  mobile_number: number 
  gender: string 
}
export default function Home() {
  const { handleSubmit, register,setValue } = useForm<FormValues1>()
  const [employeList, setEmployeList] = useState([])
  const [filter, setFilter] = useState('')
  const [mutated, setMutated] = useState(false)
  const fetchLeatList = useCallback(async () => {
    let employes = await getEmployes({})
    setEmployeList(employes)
  }, [])
  const handleCreateEmploye = async (obj: any) => {
    let res = await createEmploye(obj)
    if (!res.error) {
      setMutated(!mutated)
      setValue('name','')
      setValue('gender','')
      setValue('mobile_number',0)
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
          <form style={{ width: '30%', padding: 10 }} action="post" onSubmit={handleSubmit(handleCreateEmploye)}>
            <h2 style={{ width: '100%', textAlign: 'start' }}>  افزودن کارمند </h2>
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='نام و نام خانوادگی'	{...register('name', { required: 'نام کارمند را وارد کنید', })} />
            <input type="number" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='شماره موبایل'	{...register('mobile_number', { required: 'شماره تلفن را وارد کنید', })} />
            <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='جنسیت  '	{...register('gender')} />
          
            <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
          </form>
          <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '70%', padding: 10 }}>
            <h2 style={{ width: '100%', textAlign: 'start' }}> لیست کارمند ها</h2>

            <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام یا شماره موبایل فیلتر کنید' />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th>نام و فامیلی</th>
                 <th>شماره موبایل</th>
                <th>جنسیت</th> 
              </tr></thead>
              <tbody>
                {employeList.map((employe: any,idx:number) => {
                  if (employe.name.includes(filter) || employe.mobile_number.includes(filter)) {
                    return (<tr key={idx}>
                      <td style={{ textAlign: 'start' }}> <Link href={`/employes/${employe?._id}`} >{employe.name}  </Link></td>
                      <td>{employe.mobile_number}</td> 
                      <td>{employe.gender}</td>
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