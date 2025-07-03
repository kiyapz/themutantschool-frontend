
import { GloblaxcontexProvider } from "@/context/Globlaxcontex";
import "../globals.css";




export const metadata = {
  title: 'Mutant School | Registration Portal',
  description: 'Registration to the Mutant School portal to access your dashboard, assignments, and messages.'

}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
    
        {/* <main> */}
          
           <GloblaxcontexProvider>
           {children}
           </GloblaxcontexProvider>
        {/* </main> */}
       
      </body>
    </html>
  );
}
