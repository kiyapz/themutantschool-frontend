import ProtectedRoute from "../_components/libs/ProtectedRotes"




export const metadata = {
  title:'mutant school ',
  description:'Student dashboard',
}

export default function RootLayout({ children }) {
  return (

    <ProtectedRoute allowedRoles={["Training Center"]}>
        {children}
    </ProtectedRoute>
        
      

  )
}
