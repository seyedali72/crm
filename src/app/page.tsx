'use client'

import { useRouter } from "next/navigation"
import { useUser } from "./context/UserProvider"

export default function home() {
  const { user } = useUser()
  const router = useRouter()
  if (user?._id !== undefined) { router.replace('/dashboard') }
  else { router.replace('/auth/signin') }
  return (
    < >
      درحال پردازش اطلاعات
    </>)
}