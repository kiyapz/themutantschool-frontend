import ProtectedRoute from "../_components/ProtectedRoutes"





export const metadata = {
  title:'mutant school ',
  description:'Student dashboard',
}

export default function RootLayout({ children }) {
  return (

    <ProtectedRoute allowedRoles={["admin"]}>
        {children}
    </ProtectedRoute>
        
      

  )
}
