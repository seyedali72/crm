'use client'

import { editCustomerCat, getCustomerCats, getSingleCustomerCat, removeContactFromCustomerCat } from "@/app/action/customerCat.action"
import { Confirmation } from "@/app/components/Confirmation"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
interface IForm {
    name: string
    status: string
    parent: string
}
export default function CustomerCatDetail() {
    const { id }: any = useParams()
    const [singleCategory, setSingleCategory] = useState<any>([])
    const [filter, setFilter] = useState('')
    const [categories, setCategories] = useState([])
    const [editInfo, setEditInfo] = useState(false)
    const [mutated, setMutated] = useState(false)
    const [change, setChange] = useState(false)
    const router = useRouter()
    const fetchCategoriesList = useCallback(async () => {
        let single = await getSingleCustomerCat(id)
        setSingleCategory(single)
    }, [])
    const { handleSubmit, register, setValue } = useForm<IForm>({
        values: {
            name: singleCategory.name,
            status: singleCategory.status,
            parent: singleCategory.parent?._id,
        }
    })
    const allCategories = useCallback(async () => {
        let categories = await getCustomerCats({})
        setCategories(categories)
    }, [])
    const handleEditCategories = async (obj: any) => {
        let res = await editCustomerCat(singleCategory?._id, obj)
        if (!res.error) {
            router.replace('/crm/customers/categories')
        }
    }
    useEffect(() => { fetchCategoriesList(), allCategories() }, [fetchCategoriesList,mutated])
    const handleDelete = async (userId: any) => {
        let res = await removeContactFromCustomerCat(singleCategory?._id,userId)
        if (!res.error) { setMutated(!mutated) }
    }
    if (singleCategory?.length !== 0) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item "><Link href="/crm/">داشبورد</Link></li>
                        <li className="breadcrumb-item "><Link href="/crm/customers/categories"> لیست زمینه فعالیت مشتریان</Link></li>
                        <li className="breadcrumb-item active" aria-current="page"> {singleCategory?.name}</li>
                    </ol>
                </nav>
                <section className="main-body-container rounded">
                    <form action="post" onSubmit={handleSubmit(handleEditCategories)} method='Post'>
                        <section className="row">
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">عنوان زمینه فعالیت </label>
                                <input disabled={!editInfo} type="text" className="form-control form-control-sm" {...register('name', { required: 'عنوان زمینه فعالیت را وارد کنید', })} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">زمینه فعالیت والد </label>
                                <select disabled={!editInfo} className="form-control form-control-sm" defaultValue={singleCategory?.parent?._id} onChange={(e: any) => [setValue('parent', e.target.value), setChange(true)]}>
                                    {!change && <option value={singleCategory?.parent?._id !== undefined ? singleCategory?.parent?._id : ''}>{singleCategory?.parent?.name !== undefined ? singleCategory?.parent?.name : 'بدون والد'}</option>}
                                    {categories?.map((category: any, idx: number) => {
                                        if (category?._id !== singleCategory?._id) {
                                            if (!change) {
                                                if (category?._id !== singleCategory?.parent?._id) {
                                                    return (<option key={idx} value={category?._id}>{category?.name}</option>)
                                                }
                                            } else { return (<option key={idx} value={category?._id}>{category?.name}</option>) }
                                        }
                                    })}
                                </select>
                            </div>
                            <div className="col-12 my-2">
                                {editInfo && <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>}
                            </div>
                        </section>
                    </form>
                    <div className="col-12 my-2">
                        {!editInfo && <button type="button" onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>}
                    </div>
                </section>

                {singleCategory?.users.length !== 0 && <section className="main-body-container rounded">
                    <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                        <section className="main-body-title">
                            <h5 className="mb-0">لیست مشتریان</h5>
                        </section>
                        <div className="col-md-6">
                            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام  ' className="form-control form-control-sm" />
                        </div>
                    </section>
                    <section className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>نام مخاطب</th>
                                    <th>عنوان</th>
                                    <th>منبع</th>
                                    <th>وضعیت</th>
                                    <th className=" text-center">
                                        <i className="fa fa-cogs px-1"></i>تنظیمات
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {singleCategory?.users.map((user: any, idx: number) => {
                                    if (user?.name.includes(filter)) {
                                        return (<tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td > <Link href={`/crm/contacts/${user?._id}`} >{user?.name}  </Link></td>
                                            <td>{user.title}</td>
                                            <td>{user.source}</td>
                                            <td>{user.status}</td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(user?._id)} />, { autoClose: false, })}>
                                                    <i className="fa fa-trash px-1"></i>حذف
                                                </button>
                                            </td>
                                        </tr>)
                                    }
                                })}
                            </tbody>
                        </table>
                    </section>
                </section>}

            </>
        )
    } else { return (<p>درحال دریافت اطلاعات</p>) }
}