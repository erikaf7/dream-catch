import React, { useEffect, useState } from 'react';
import './App.css';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import { listDreams } from './graphql/queries';
import { createDream as createDreamMutation, updateDream as updateDreamMutation, deleteDream as deleteDreamMutation } from './graphql/mutations';
import { Auth, Hub, API } from 'aws-amplify';

const initialFormState = {  
  name: '',
  date: '',
  location: '',
  theme: '',
  description: '',
  interpertation: '',
}

function App() {
  /* dream form/crud code */
  const [dreams, setDreams] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchDreams();
  }, []);

  async function fetchDreams() {
    const apiData = await API.graphql({ query: listDreams });
    setDreams(apiData.data.listDreams.items);
  }

  async function createDream() {
    if(!formData.name || !formData.description) return;
    await API.graphql({ query: createDreamMutation, variables: { input: formData } });
    setDreams([ ...dreams, formData ]);
    setFormData(initialFormState);
  }
  async function updateDream({id}) {
    const updateDream = dreams.filter(dream => dream.id == id);
    updateDream = initialFormState
    await API.graphql({ query: updateDreamMutation, variables: { input: updateDream} });
    setDreams([ ...dreams, updateDream ]);
    setFormData(initialFormState);
  }
  async function deleteDream({ id }) {
    const newDreamsArray = dreams.filter(dream => dream.id !== id);
    setDreams(newDreamsArray);
    await API.graphql({ query: deleteDreamMutation, variables: { input: id } });
  }

  /* user auth code*/
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
        /* logged in page*/
      <div>
        <h1>Dream Catch</h1>
        <p>Hello {user.username}, and welcome to Dream Catch!</p>
        <input 
        onChange= { e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Name of your dream..."
        value={formData.name}
        />
        <input 
        type= 'date'
        onChange= { e => setFormData({ ...formData, 'date': e.target.value})}
        placeholder="Date your dream happened..."
        value={formData.date}
        />
        <input 
        onChange= { e => setFormData({ ...formData, 'location': e.target.value})}
        placeholder="Where your dream took place..."
        value={formData.location}
        />
        <input 
        onChange= { e => setFormData({ ...formData, 'theme': e.target.value})}
        placeholder="The theme of your dream..."
        value={formData.theme}
        />
        <input 
        onChange= { e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="A description of your dream..."
        value={formData.description}
        />
        <input 
        onChange= { e => setFormData({ ...formData, 'interpertation': e.target.value})}
        placeholder="An interpertation of the dream..."
        value={formData.interpertation}
        />
        <button onClick = {createDream} >Save your dream</button>
        <div>
          {
            dreams.map(dream => (
              <div key= { dream.id || dream.name}>
                <h2>{ dream.name }</h2>
                <p>Date: { dream.date }</p>
                <p>Location: { dream.location }</p>
                <p>Theme: { dream.theme }</p>
                <p>Description: { dream.description }</p>
                <p>Interpertation: { dream.interpertation }</p>
                <button onClick={ () => deleteDream(dream)}>Remove dream</button>
                <button onClick={ () => updateDream(dream)}>Update dream</button>
              </div>
            ))
          }
        </div>
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
