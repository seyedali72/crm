'use client'
interface IForm {
    name: string;
    parent: string;
}
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createCustomerCat, deleteCustomerCat, getCustomerCats } from "@/app/action/customerCat.action";
import { toast } from "react-toastify";
import { Confirmation } from "@/app/components/Confirmation";

export default function CustomerCategory() {
    const [mutated, setMutated] = useState(false)
    const [filter, setFilter] = useState('')
    const [customerCats, setCustomerCats] = useState([])
    const { register, handleSubmit, reset, setValue } = useForm<IForm>()
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
    const handleDelete = async (catId: any) => {
        let res = await deleteCustomerCat(catId)
        if (!res.error) { setMutated(!mutated) }
    }
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/expert/">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست زمینه های فعالیت مشتریان</li>
                </ol>
            </nav>
           
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <section className="main-body-title">
                        <h5 className="mb-0">لیست زمینه های فعالیت مشتریان</h5>
                    </section>
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس عنوان زمینه فعالیت ' className="form-control form-control-sm" />
                    </div>
                </section>
                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>عنوان زمینه فعالیت</th>
                                <th>زمینه فعالیت والد</th>
                                <th>تعداد اعضا</th>
                                <th>وضعیت</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {customerCats.map((cat: any, idx: number) => {
                                if (cat.name.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td>{cat.name}</td>
                                        <td>{cat?.parent !== undefined ? cat?.parent?.name : '---'}</td>
                                        <td>{cat.users?.length}</td>
                                        <td>{cat.status}</td>
                                    
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