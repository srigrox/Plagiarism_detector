
import axios from 'axios';
import { Input, Form, Layout, Button, message, Table, Modal } from "antd";
import { FormInstance } from "antd/lib/form";
import React from "react";
import { DataService } from './data-service';

export default class FileUploadComponent extends React.Component<{}, any> {
  
  fileUploadForm: React.RefObject<FormInstance>;

  constructor(props: {}) {
    super(props);
    this.fileUploadForm = React.createRef();
    this.state = {
      selectedFile: null,
    };
    DataService.getListFiles().then((response: any) => {
      this.setState({ uploadedFiles: response.data.files });
    });
  }

  onFileChange = (event: any) => {
    // Update the state 
    this.setState({ selectedFile: event.target.files });
  };

  // On file upload (click the upload button) 
  onFileUpload = () => {
    const { selectedFile } = this.state

    // Create an object of formData 
    const formData = new FormData();
    

    if (selectedFile == null) {
      message.error('Please select a file to upload');
      return;
    }

    // Update the formData object 
    for(let i = 0; i < selectedFile.length; i++)
      formData.append(
        `files[${i}]`,
        selectedFile[i],
        selectedFile[i].name
      );

    // Details of the uploaded file 
    console.log(this.state.selectedFile);

    // Request made to the backend api 
    // Send formData object 
    axios.post('http://localhost:3001/file', formData).then((response: any) => {
      this.setState({ uploadedFiles: response.data.files });
    });
  };

  fileData = () => {
    const { selectedFile } = this.state
    let dom_content = []
    if (selectedFile) {
      dom_content.push( <h2>File Details:</h2> )
      for (let i = 0; i < selectedFile.length; i++) {
        let file = selectedFile[i];
        dom_content.push (
          <div>
            <p>File Name: {file.name}</p>
            <p>File Type: {file.type}</p>
            <p>
              Last Modified:{" "}
              {file.lastModifiedDate.toDateString()}
            </p>
          </div>
        );
      }
    } else {
      dom_content.push (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
    return dom_content;
  };

  deleteUploaded(fileName: any) {
    DataService.removeFile(fileName).then((response: any) => {
        this.setState({ uploadedFiles: response.data.files });
      });
  }

  render() {
    const { uploadedFiles } = this.state;
    let uploaded = [];
    if (uploadedFiles) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        let transform = { key: i.toString(), date: uploadedFiles[i].date, fileName: uploadedFiles[i].name, id: uploadedFiles[i].id }
        uploaded.push(transform)
      }
    }

    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'File name',
        dataIndex: 'fileName',
        key: 'fileName',
      },
      {
        title: 'Action',
        key: 'action',
        render: (record: any) => (
          <Button onClick={ () => this.deleteUploaded(record.id) }>Delete</Button>
        )
      },
    ];

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
        <div style={{ paddingTop: '20px' }}>
          <h1>Uploaded Files</h1>
          <Table columns={columns} dataSource={uploaded}/>
        </div>
      </Layout.Content>
    </Layout>
  }
}
