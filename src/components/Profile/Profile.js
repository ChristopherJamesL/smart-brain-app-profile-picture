import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            age: this.props.user.age || '',
            pet: this.props.user.pet || '',
            // profilePicture: null,
            uploadedImageUrl: this.props.user.uploadedImageUrl,
            loading: false
        };
    }

    onFormChange = (event) => {
        switch(event.target.name) {
            case 'user-name':
                this.setState({name: event.target.value})
                break;
            case 'user-age':
                this.setState({age: event.target.value})
                break;
            case 'user-pet':
                this.setState({pet: event.target.value})
                break;
            default:
                return;
        }
    }

    onProfileUpdate =  (data) => {
        console.log('data to onProfileUpdate:', data);
        console.log('user id:', this.props.user.id);
        const { uploadedImageUrl } = this.state;
        console.log('this.state.uploadImageUrl to onProfileUpdate:', this.state.uploadedImageUrl);
        fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({ formInput: { ...data, imageUrl: uploadedImageUrl } })
        }).then(res => {
            if (res.status === 200 || res.status === 304) {
                this.props.toggleModal();
                console.log('Profile Updates loadUser for user:', this.props.user);
                console.log('Profile Updates loadUser for image:', {...this.props.user, ...data, uploadedImageUrl});              
                this.props.loadUser({ ...this.props.user, ...data, imageurl: uploadedImageUrl });
            }
        }).catch(console.log)
    }

    onFileChange = (event) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        console.log('Selected file:', file); 
        this.setState({ /*profilePicture: file, imageUrl,*/ loading: true }); // Keep this as the blob URL for preview.
        this.uploadProfilePicture(file); // Upload the file.
    }
    
    uploadProfilePicture = async (file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result;
    
            const response = await fetch('https://jxxyawvng8.execute-api.us-east-1.amazonaws.com/prod/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ file: base64data }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Upload failed:', errorData);
                alert('Upload failed: ' + errorData.error);
                return;
            }
    
            const data = await response.json();
            console.log('data.imageUrl:', data.imageUrl);
            // Only set the uploaded image URL when the upload is complete
            this.setState({ uploadedImageUrl: data.imageUrl, loading: false }, () => {
                console.log(`State updated with uploadedImageUrl`, this.state.uploadedImageUrl);
            });
        };
    
        reader.readAsDataURL(file);
    };
    

    render() {
        const { user, isProfileOpen, toggleModal } = this.props;
        const { name, age, pet, uploadedImageUrl, loading } = this.state;
        return (
            <div 
                className='profile-modal'
            >
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
                    <main className="pa4 black-80 w-80">
                        <div className='image-upload-container'>
                            {loading ? (
                                <div className="loader-container">
                                    <div className="loader"></div> {/* Flashing loader */}
                                    <span className="loading-text">Loading...</span>
                                </div>
                            ) : (
                                uploadedImageUrl && (
                                    <img
                                        src={uploadedImageUrl} // Final uploaded image
                                        className="h5 w5 dib"
                                        alt="uploaded avatar"
                                    />
                                )
                            )}
                            <label className="custom-file-upload">
                                Choose Profile Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={this.onFileChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        <h1>{this.state.name}</h1>
                        <h4>{`Image Submitted: ${user.entries}`}</h4>
                        <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                        <hr />                     
                        <label className="mt2 fw6" htmlFor="user-name">Name</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.name}
                            type="text"
                            name="user-name"                            
                            id="name"
                        />
                        <label className="mt2 fw6" htmlFor="user-age">Age</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.age}
                            type="text"
                            name="user-age"
                            id="age"
                        />
                        <label className="mt2 fw6" htmlFor="user-pet">Pet</label>
                        <input
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.pet}
                            type="text"
                            name="user-pet"
                            id="pet"
                        />
                        <div className='mt4' style={{ display: 'flex', justifyContent: 'space-evenly' }} >
                            <button 
                                onClick={() => this.onProfileUpdate({ name, age, pet, uploadedImageUrl })}
                                className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20' 
                            >
                                Save
                            </button>
                            <button 
                                className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'
                                onClick={toggleModal} 
                            >
                                Cancel
                            </button>
                        </div>
                    </main>
                    <div 
                        className='modal-close'
                        onClick={toggleModal} 
                    >
                        <h1>&times;</h1>
                    </div>
                </article>    
            </div>
        )
    }
} 

export default Profile;