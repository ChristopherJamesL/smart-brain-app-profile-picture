import React, { Component } from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
import PropTypes from 'prop-types';

class ProfileIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false
        }
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    handleSignout = () => {
        fetch('http://localhost:3000/signout', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            }
        })
        .then(res => {
            if (res.ok) {
                sessionStorage.removeItem('token');
                this.props.onRouteChange('signout');
            } else {
                return res.json().then(data => console.error(data));
            }
        })
        .catch(err => console.error('Error', err));
    }

    render() {
        const { direction="down", onRouteChange } = this.props;
        return(
            <div className='pa4 tc'>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} direction={direction}>
                    <DropdownToggle
                        data-toggle="dropdown"
                        tag="span"
                    >
                            <img
                                src={this.props.user.uploadedImageUrl}
                                className="br-100 ba h3 w3 dib" alt="avatar" 
                            />
                    </DropdownToggle>
                    <DropdownMenu 
                        className='b--transparent shadow-5' 
                        style={{
                            marginTop: '20px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
                        <DropdownItem onClick={this.handleSignout}>Sign Out</DropdownItem>                        
                    </DropdownMenu>
                </Dropdown>                
            </div>
        )
    }
}

ProfileIcon.propTypes = {
    direction: PropTypes.string,
    onRouteChange: PropTypes.func.isRequired,
};

export default ProfileIcon;