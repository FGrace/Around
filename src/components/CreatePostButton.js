import { Modal, Button ,message} from 'antd';
import React from 'react';
import {WrappedCreatePostForm} from './CreatePostForm';
import $ from 'jquery';
import {API_ROOT, AUTH_HEADER, POS_KEY, TOKEN_KEY,LOC_SHAKE} from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        //collect values
        //send request
        //upload nearby post
        this.form.validateFields((err,values) => {
            if(!err){
                //send request
                const {lat,lon} = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                formData.set('lat',lat + Math.random()* LOC_SHAKE);
                formData.set('lon',lon + Math.random() * LOC_SHAKE);
                formData.set('message',values.message);
                formData.set('image',values.image[0].originFileObj);
                $.ajax({
                    url:`${API_ROOT}/post`,
                    method:'POST',
                    data:'formData',
                    headers:{
                        Authorization: `${AUTH_HEADER} ${localStorage.getItem(TOKEN_KEY)}`
                    },
                    processData: false,
                    contentType: false,
                    dataType: 'text',

                }).then(() => {
                    this.form.resetFields();
                    this.setState({visible: false, confirmLoading: false});
                    this.props.loadNearbyPost();
                }, (response) => {
                    message.error(response.responseText);
                }).catch((e) => {
                    console.log(e);
                })
            }
        });

        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }


    saveFormRef = (formInstance) => {
        this.form = formInstance;
    }


    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Post</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="Create"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <WrappedCreatePostForm ref = {this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}
