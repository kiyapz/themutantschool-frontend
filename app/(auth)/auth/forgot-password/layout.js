import { ForgotPasswordProvider } from "./_components/ForgotpasswordContex"

export const metadata = {
  title: 'Mutant School | Forgot Password Portal',
  description: 'Recover your Mutant School portal password to regain access to your dashboard, assignments, and messages.',
}


export default function RootLayout({ children }) {
  return (
   
    <div>
      <ForgotPasswordProvider>
        {children}
      </ForgotPasswordProvider>
      
    </div>
  )
}
