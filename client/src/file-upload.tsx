
import axios from 'axios';
import { Input, Form, Layout, Button } from "antd";
import { FormInstance } from "antd/lib/form";
import React from "react";


export default class FileUploadComponent extends React.Component<{}, any> {
  
  fileUploadForm: React.RefObject<FormInstance>;
  
  constructor(props: {}){
      super(props);
      this.fileUploadForm = React.createRef();
      this.state = { selectedFile: null };
  }

  uploadFile(value: any) {
    console.log('value: ', value);
  }

  onFileChange = (event: any) => { 
     
    // Update the state 
    this.setState({ selectedFile: event.target.files[0] }); 
   
  }; 

  // On file upload (click the upload button) 
  onFileUpload = () => { 
     
    // Create an object of formData 
    const formData = new FormData(); 
   
    // Update the formData object 
    formData.append( 
      "myFile", 
      this.state.selectedFile, 
      this.state.selectedFile.name 
    ); 
   
    // Details of the uploaded file 
    console.log(this.state.selectedFile); 
   
    // Request made to the backend api 
    // Send formData object 
    axios.post('http://localhost:3001/file', formData); 
  }; 

  fileData = () => { 
     
    if (this.state.selectedFile) { 
        
      return ( 
        <div> 
          <h2>File Details:</h2> 
          <p>File Name: {this.state.selectedFile.name}</p> 
          <p>File Type: {this.state.selectedFile.type}</p> 
          <p> 
            Last Modified:{" "} 
            {this.state.selectedFile.lastModifiedDate.toDateString()} 
          </p> 
        </div> 
      ); 
    } else { 
      return ( 
        <div> 
          <br /> 
          <h4>Choose before Pressing the Upload button</h4> 
        </div> 
      ); 
    } 
  }; 

  render(){
      return <Layout>
        <Layout.Content className='inner'>
            <h1>File Upload using React</h1>
            <Form> 
                <Form.Item><Input type="file" multiple onChange={this.onFileChange} /></Form.Item> 
                <Button onClick={this.onFileUpload}> 
                  Upload! 
                </Button> 
            </Form> 
          {this.fileData()}
          </Layout.Content> 
      </Layout>
  }
}
