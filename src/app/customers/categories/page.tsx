'use client'
interface IForm {
    name: string;
}
import { useForm } from "react-hook-form"
 import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createCustomerCat, getCustomerCats } from "@/app/action/customerCat.action";

export default function CustomerCategory() {
    const [mutated, setMutated] = useState(false)
    const [filter, setFilter] = useState('')
    const [customerCats, setCustomerCats] = useState([])
    const { register, handleSubmit, reset } = useForm<IForm>()
    const handleCreateCustomerCats = async (obj: any) => {
        let res = await createCustomerCat(obj)
        if (!res.error) {
            setMutated(!mutated)
            reset()
        }
    }
    const allCustomerCats = useCallback(async () => {
        let customerCats = await getCustomerCats({})
        setCustomerCats(customerCats)
    }, [])
    useEffect(() => {
        allCustomerCats()
    }, [mutated, allCustomerCats])
    return (
        <>
            <form method="post" onSubmit={handleSubmit(handleCreateCustomerCats)}>
                <input type="text" style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='عنوان زمینه فعالیت'	{...register('name', { required: 'عنوان زمینه فعالیت را وارد کنید', })} />
                <button type="submit" style={{ margin: 10, padding: '5px 20px', backgroundColor: '#1199', border: 'unset', borderRadius: 5, color: '#fff', fontSize: 14, cursor: 'pointer' }}>ثبت</button>
            </form>
            <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '100%', padding: 10 }}>
                <h2 style={{ width: '100%', textAlign: 'start' }}> لیست زمینه فعالیت ها</h2>

                <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس عنوان زمینه فعالیت فیلتر کنید' />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                        <th>عنوان زمینه فعالیت</th>
                        <th>تعداد مشتریان این زمینه</th>
                        <th>وضعیت</th>
                    </tr></thead>
                    <tbody>
                        {customerCats.map((customerCat: any, idx: number) => {
                            if (customerCat.name.includes(filter)) {
                                return (<tr key={idx}>
                                    <td style={{ textAlign: 'start' }}> <Link href={`/customerCats/${customerCat?._id}`} >{customerCat.name}  </Link></td>
                                    <td>{customerCat.users?.length}</td>
                                    <td>{customerCat.status}</td>
                                </tr>)
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}