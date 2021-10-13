import React from 'react';
import './App.css';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth, Hub } from 'aws-amplify';

function App() {
  const [user, updateUser] = React.useState(null);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('No signed in user.'));
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          return updateUser(data.payload.data);
        case 'signOut':
          return updateUser(null);
        default: return null;
      }
    });
  }, [])
  if (user) {
    return (
      <div>
        <h1>Dream Catch</h1>
        <h1>Hello {user.username}</h1>
        <AmplifySignOut />
      </div>
    )
  }
  return (
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
  );
}

export default App
