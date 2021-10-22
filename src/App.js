import React, { useEffect, useState } from 'react';
import './App.css';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import { listDreams } from './graphql/queries';
import { createDream as createDreamMutation, updateDream as updateDreamMutation, deleteDream as deleteDreamMutation } from './graphql/mutations';
import { Auth, Hub, API } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'


const initialFormState = {  
  name: '',
  date: '',
  location: '',
  theme: '',
  description: '',
  interpertation: '',
  user: '',
}
const initialUpdateState = {  
  name: '',
  date: '',
  location: '',
  theme: '',
  description: '',
  interpertation: '',
  user: '', 
}

function App() {
  /* dream form/crud code */
  const [dreams, setDreams] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [updateData, setUpdateData] = useState(initialUpdateState);

  useEffect(() => {
    fetchDreams();
  }, []);

  async function fetchDreams() {
    const apiData = await API.graphql({ query: listDreams });
    setDreams(apiData.data.listDreams.items);
  }

  async function createDream() {
    if(!formData.name || !formData.description) return;
    formData.user = user.username;
    console.log(formData.theme);
    await API.graphql({ query: createDreamMutation, variables: { input: formData } });
    setDreams([ ...dreams, formData ]);
    console.log(formData);
    setFormData(initialFormState);

  }
  async function updateDream({ id }) {
    const selectDream = dreams.filter(dream => dream.id === id);
    const updateDream = {  
      id: selectDream[0].id,
      name: updateData.name,
      date: updateData.date,
      location: updateData.location,
      theme: updateData.theme,
      description: updateData.description,
      interpertation: updateData.interpertation,
      user: user.username,
    }
    const newDreamsArray = dreams.filter(dream => dream.id !== id);
    await API.graphql({ query: updateDreamMutation, variables: { input: updateDream } });
    newDreamsArray.push(updateDream)
    setDreams(newDreamsArray);
    setFormData(initialUpdateState);
    hideModal();
  }
  async function deleteDream({ id }) {
    const selectDream = dreams.filter(dream => dream.id === id);
    const newDreamsArray = dreams.filter(dream => dream.id !== id);
    const deleteDream = {
      id: selectDream[0].id
    }
    setDreams(newDreamsArray);
    await API.graphql({ query: deleteDreamMutation, variables: { input: deleteDream} });
  }

  /* modal code */
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };


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
        <p onLoad= {e => setFormData({...formData, 'user': user.username})}
        value={user.username}
        >Hello {user.username}, and welcome to Dream Catch!</p>
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
                <p>User: { dream.user }</p>
                { dream.user === user.username &&
                <><button onClick={() => deleteDream(dream)}>Remove dream</button><button onClick={showModal}>Modify dream</button></>
                }
                <Modal show={isOpen} onHide={hideModal}>
                  <Modal.Header>
                    <Modal.Title>Update Dream</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <input onChange= { e => setUpdateData({ ...updateData, 'name': e.target.value})} placeholder={ dream.name }value={updateData.name}/>
                    <input type= 'date' onChange= { e => setUpdateData({ ...updateData, 'date': e.target.value})} placeholder={ dream.date } value={updateData.date}/>
                    <input onChange= { e => setUpdateData({ ...updateData, 'location': e.target.value})} placeholder={ dream.location } value={updateData.location}/>
                    <input onChange= { e => setUpdateData({ ...updateData, 'theme': e.target.value})} placeholder={ dream.theme } value={updateData.theme}/>
                    <input onChange= { e => setUpdateData({ ...updateData, 'description': e.target.value})} placeholder={ dream.description } value={updateData.description}/>
                    <input onChange= { e => setUpdateData({ ...updateData, 'interpertation': e.target.value})} placeholder={ dream.interpertation } value={updateData.interpertation}/>
                  </Modal.Body>
                  <Modal.Footer>
                    <button onClick={hideModal}>Cancel</button>
                    <button onClick={ () => updateDream(dream)}>Update</button>
                  </Modal.Footer>
                </Modal>
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
