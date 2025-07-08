'use client'

import { useContext } from "react"
import Image from "next/image"
import { InstructorContext } from "../../_components/context/InstructorContex"

export default function UserProfileImage() {
  const { userUpdatedValue } = useContext(InstructorContext)

  return (
    <div className="relative w-full h-full max-w-[200px] max-h-[200px] rounded-full overflow-hidden">
      <Image
        src={userUpdatedValue?.url || "/images/default-avatar.jpg"}
        alt="User Profile"
        fill 
        onError={(e) => {
          e.currentTarget.src = "/images/default-avatar.jpg"
        }}
        className="object-cover"
      />
    </div>
  )
}
