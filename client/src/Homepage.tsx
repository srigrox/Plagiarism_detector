import axios from 'axios';
import { FileSearchOutlined, HistoryOutlined, UploadOutlined } from '@ant-design/icons';
import { Layout, Button, PageHeader, Row, Col, Modal, Form, Input, Menu, Tooltip, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import Title from "antd/lib/typography/Title";
import React from "react";
import FileComparisonComponent from './file-comparison';
import FileHistoryComponent from './file-history';
import FileUploadComponent from './file-upload';
import { PlagiarismAppState } from "./plagiarism.interface";

export default class Homepage extends React.Component<{}, PlagiarismAppState> {
    loginForm: React.RefObject<FormInstance>;
    signupForm: React.RefObject<FormInstance>;
    constructor(props: {}){
        super(props);

        this.loginForm = React.createRef();
        this.signupForm = React.createRef();
        this.state = { 
            isLoggedIn: true,
            showLogin: false,
            showSignup: false,
            currentMenu: 'upload',
            user: {
                username: "hello",
                password: "there"
            }
        };
    }

    showLogin = () => {
        this.setState({
            showLogin: true,
        });
    };

    showSignup = () => {
        this.setState({
            showSignup: true,
        });
    };

    handleCancelLogin = () => {
        this.loginForm.current?.setFieldsValue({username: "", password: ""});
        this.setState({
            showLogin: false,
        })
    }

    handleCancelSignup = () => {
        this.signupForm.current?.setFieldsValue({username: "", password: ""});
        this.setState({
            showSignup: false,
        })
    }

    handleMenuClick = (e: any) => {
        console.log('click', e);
        this.setState({ currentMenu: e.key })
    }

    onLogin(values: any){
        let username = values.username;
        let password = values.password;
        this.loginForm.current?.setFieldsValue({username: "", password: ""});
        console.log(values)

        

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        axios.post('http://localhost:3001/login', formData)
        .then((response) => {
            console.log(response)
            this.setState({
                user: {
                    username: username,
                    password: password,
                },
                showLogin: false,
                isLoggedIn: true,
            })
        })
        .catch((err) => {
            if (err.response) {
                // Request made and server responded
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                if(err.response.data == 'User not found'){
                    message.error('Invlid Password or Username');
                    console.log('User not found')
                }
              } else if (err.request) {
                // The request was made but no response was received
                console.log(err.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log("error:", err)
              }
        })

    }

    onSignup(values: any){
        let username = values.username;
        let password = values.password;

        this.signupForm.current?.setFieldsValue({username: "", password: ""});

        console.log(values)

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        axios.post('http://localhost:3001/register', formData)
        .then((response) => {
            console.log(response)
            this.setState({
                user: {
                    username: username,
                    password: password,
                },
                showSignup: false,
                isLoggedIn: true,
            })
        })
        .catch((err) => {
            if (err.response) {
                // Request made and server responded
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                if(err.response.data == 'duplicate'){
                    console.log('This user already exsists')
                }
              } else if (err.request) {
                // The request was made but no response was received
                console.log(err.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log("error:", err)
              }
        })

        console.log(this.state)
    }

    renderLogin(){
        return <Modal
        title="Login"
        visible={this.state.showLogin}
        okButtonProps={{form:'loginform', htmlType: 'submit'}}
        onCancel={this.handleCancelLogin}
        >            
        <Form id="loginform" onFinish={(values) => this.onLogin(values)} ref={this.loginForm}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input username' }]}><Input/></Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input password' }]}><Input.Password/></Form.Item>
            </Form>
        </Modal>
    }

    renderSignup(){
        return <Modal
        title="Sign Up"
        visible={this.state.showSignup}
        okButtonProps={{form:'signupform', htmlType: 'submit'}}
        onCancel={this.handleCancelSignup}
        >            
        <Form id="signupform" onFinish={(values) => this.onSignup(values)} ref={this.signupForm}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input username' }]}><Input/></Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input password' }]}><Input.Password/></Form.Item>
            </Form>
        </Modal>
    }

    renderUserButton(){
        const isLoggedIn = this.state.isLoggedIn;
        let button;
        if (!isLoggedIn) {
            button = <Button>Log In</Button>
        } else {
        button = <Button type="primary">User</Button>
        }
        return button;
    }

    renderBeforeLoginHomepage(){
        return <Row>
        <Col style={{width: 500, padding: 24}}>
        <Title level={2}>Welcome Instructors</Title>
        <Title level={3}>
            This website allows you to detect plagiarism between Python files.
            Sign-up or Log-in to get started and use our platform.
            We currently only allow instructors to use our service.
        </Title>
        </Col>
        <Col style={{padding: 100}}><Button size="large" onClick={this.showLogin}>Log In</Button></Col>
        <Col style={{padding: 100}}><Button size="large" type="primary" onClick={this.showSignup}>Sign Up</Button></Col>
    </Row>
    }

    renderAfterLoginHomepage(){
        const { currentMenu } = this.state;
        return <div><Menu onClick={this.handleMenuClick} selectedKeys={[currentMenu]} mode="horizontal">
            <Menu.Item key="upload" icon={<UploadOutlined/>}>Upload Files</Menu.Item>
            <Menu.Item key="compare" icon={<FileSearchOutlined/>}>Compare Files</Menu.Item>
            <Menu.Item key="history" icon={<HistoryOutlined/>}>History</Menu.Item>
        </Menu>
        {currentMenu == 'upload' ? <FileUploadComponent/> : null}
        {currentMenu == 'compare' ? <FileComparisonComponent/> : null}
        {currentMenu == 'history' ? <FileHistoryComponent/> : null}
        </div>
    }

    render(){
        const { isLoggedIn, currentMenu } = this.state;
        return <Layout>
            <PageHeader
            className="site-page-header"
            title="Plagiarism Detector"
            extra={this.renderUserButton()}/>
            <Layout.Content >
                {isLoggedIn ? this.renderAfterLoginHomepage() : this.renderBeforeLoginHomepage()}
                {this.renderLogin()}
                {this.renderSignup()}
            </Layout.Content>
        </Layout>
    }
}