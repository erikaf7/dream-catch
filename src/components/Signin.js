import React from 'react'

const Signin = ()=>{


    return( 
        <div>
        <h1>Dream Catch</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>

        <AmplifyAuthenticator>
        <AmplifySignUp
            slot="sign-up"
            formFields={[
            { 
                type: "username", 
                label: "Username",
                placeholder: "Choose a username..."
            },
            {
                type: "password",
                label: "Password",
                placeholder: "Choose a password..."
            },
            { 
                type: "email",
                label: "Email Address",
                placeholder: "Enter your email address..."
            }
            ]} 
        />
        </AmplifyAuthenticator>
        </div>
        </div>
    )
      
}

export default Signin