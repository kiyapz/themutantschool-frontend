
import ProtectedRoute from "../_components/ProtectedRoutes";



export const metadata = {
  title:'mutant school affliate ',
  description:'affliate store',
}

export default function RootLayout({ children }) {
  return (

    <ProtectedRoute allowedRoles={["affiliate"]}>
        {children}
    </ProtectedRoute>
        
      

  )
}
