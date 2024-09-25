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
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست زمینه های فعالیت مشتریان</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateCustomerCats)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">عنوان زمینه فعالیت </label>
                            <input type="text" className="form-control form-control-sm" {...register('name', { required: 'عنوان زمینه فعالیت را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">زمینه فعالیت والد </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('parent', e.target.value)}><option value=''>یک زمینه فعالیت را انتخاب کنید</option>
                                {customerCats?.map((team: any, idx: number) => { return (<option key={idx} value={team?._id}>{team?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت</button>
                        </div>
                    </section>
                </form>
            </section>
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
                                <th className=" text-center">
                                    <i className="fa fa-cogs px-1"></i>تنظیمات
                                </th>
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
                                        <td className="text-center">
                                            <Link href={`/account/customers/categories/${cat?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>جزئیات</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(cat?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>
                                        </td>
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