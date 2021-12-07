import { getProviders,signIn, getCsrfToken,useSession } from "next-auth/react"
import styles from '../../styles/Auth.module.scss'
import {InferGetServerSidePropsType} from 'next'
import {FaGithub,FaTwitter,FaGoogle} from "react-icons/fa";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";


const SignIn =({providers,csrfToken}:InferGetServerSidePropsType<typeof getServerSideProps>)=>{
    const { data: session } = useSession()
    const router = useRouter()
    console.log(providers);
    
    useEffect(()=>{
        if(session){         
          router.push('/')
        }
    },[session])
    return (
        <>
       <section className={styles.signup}>
           <h1>SignIn to Continue</h1>

           <div className={styles.formDiv}>

                <form method="post" action="/api/auth/signin/email">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <input type="email" id="email" name="email"  placeholder="Email" />
                    <button className={styles.btn} type="submit">Sign in with Email</button>
                </form>
            <h1>OR</h1>

            <div className={styles.icons}>

            {providers ? (  Object.values(providers).map((provider,i) =>{
                if(provider.id !== 'email'){
                   return (
                      <div key={provider.name} className={styles.icon}>
                          <div className={styles.icon}><FaGithub onClick={() => signIn(provider.id)} /></div>
                       </div>
                   )
                }
            }         
      )):('')}
      
          <div className={styles.icon}><FaTwitter /></div>
          <div className={styles.icon}><FaGoogle /></div>
      </div>

           </div>

       </section>
   
    </>
    )
}


export const getServerSideProps = async (context: CtxOrReq | undefined)=>{
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
        return {
            props:{providers,csrfToken},
        }
}

export default SignIn

