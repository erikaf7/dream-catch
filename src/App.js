import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { listDreams } from './graphql/queries';
import { createDream as createDreamMutation, updateDream as updateDreamMutation, deleteDream as deleteDreamMutation } from './graphql/mutations';
import { Auth, Hub, API } from 'aws-amplify';
import Modal from 'react-bootstrap/Modal'
import Signin from './components/Signin';

const initialFormState = {  
  name: '',
  date: '',
  location: '',
  theme: '',
  description: '',
  interpretation: '',
  user: '',
}
const initialUpdateState = {  
  name: '',
  date: '',
  location: '',
  theme: '',
  description: '',
  interpretation: '',
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
      interpretation: updateData.interpretation,
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
        <p className="intro-text">Hello {user.username}, and welcome to Dream Catch! Enter your dreams below, and view dreams created by others here.</p>
        <div className="dream-form">
          <input className="form a"
          onChange= { e => setFormData({ ...formData, 'name': e.target.value})}
          placeholder="Name of your dream..."
          value={formData.name}
          />
          <input 
          type= 'date' className="form b"
          onChange= { e => setFormData({ ...formData, 'date': e.target.value})}
          placeholder="Date of Dream..."
          value={formData.date}
          />
          <input className="form c"
          onChange= { e => setFormData({ ...formData, 'location': e.target.value})}
          placeholder="Location of your dream..."
          value={formData.location}
          />
          <input className="form d"
          onChange= { e => setFormData({ ...formData, 'theme': e.target.value})}
          placeholder="Theme of your dream..."
          value={formData.theme}
          />
          <textarea className="form e" rows="4" cols="50"
          onChange= { e => setFormData({ ...formData, 'description': e.target.value})}
          placeholder="Description of your dream..."
          value={formData.description}
          />
          <textarea className="form f" rows="4" cols="50"
          onChange= { e => setFormData({ ...formData, 'interpretation': e.target.value})}
          placeholder="Interpretation of the dream..."
          value={formData.interpretation}
          />
          <button className="form g" onClick = {createDream} >Create your dream</button>
        </div>
        <div className="dreamlist">
          {
            dreams.map(dream => (
              <div className="dreamlist-item" key= { dream.id || dream.name}>
                <h2>{ dream.name }</h2>
                <p>Date: { dream.date }</p>
                <p>Location: { dream.location }</p>
                <p>Theme: { dream.theme }</p>
                <p>Description: { dream.description }</p>
                <p>Interpretation: { dream.interpretation }</p>
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
                    <input onChange= { e => setUpdateData({ ...updateData, 'interpretation': e.target.value})} placeholder={ dream.interpretation } value={updateData.interpretation}/>
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
      <Signin />
  );
}

export default App
