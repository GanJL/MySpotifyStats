import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import  { requestAuthorization, getCode, callAuthorizationApi } from '../api/api'



const Login = () => {

    const router = useRouter()

    useEffect(()=>{

      if (typeof window !== 'undefined') {

        if ( window.location.search.length > 0) {
        
            let code = getCode()   

            if (code) {
              console.log("Code Retrieved"); 

              callAuthorizationApi(code)
              .then(()=>{
                router.push('/Home')
              })

            }
      
        }
                    
      }    

    
    },[])
    
      return (
        <div className={styles.container}>
          <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <main className={styles.main}>

            <button onClick={requestAuthorization}>Login to Spotify</button> 
          

          </main>
    
          <footer className={styles.footer}>
            
          </footer>
        </div>
      )
}

export default Login