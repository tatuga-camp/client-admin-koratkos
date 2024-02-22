import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"

const AuthLayout = ({children}) => {
    return (
        <div>
            <Navbar/>
            {children}
            <Footer/>
        </div>
    )
}

export default AuthLayout