import { Button, Space, Table } from "antd";
import Content from "antd/lib/layout/layout";
import React from "react";
import { convertCompilerOptionsFromJson } from "typescript";
import { isNullOrUndefined } from "util";
import { DataService } from "./data-service";
import { PlagiarismAppState } from "./plagiarism.interface";

const dataFake = [
    {
        key: '1',
        date: '10/1/20',
        file1: 'index.tsx',
        file2: 'index.tsx',
        similarity: '100%'
    },
    {
        key: '2',
        date: '10/10/20',
        file1: 'src2.tsx',
        file2: 'src1.tsx',
        similarity: '70%'
    },
    {
        key: '3',
        date: '10/10/20',
        file1: 'app.tsx',
        file2: 'home.tsx',
        similarity: '8%'
    },
    {
        key: '4',
        date: '10/11/20',
        file1: 'hello.tsx',
        file2: 'home.tsx',
        similarity: '0%'
    }
]

export default class FileHistoryComponent extends React.Component<{}, any> {
    columns = [
        {
            title: 'History ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'File 1',
          dataIndex: 'file1',
          key: 'file1',
        },
        {
          title: 'File 2',
          dataIndex: 'file2',
          key: 'file2',
        },
        {
            title: 'Similarity',
            dataIndex: 'similarity',
            key: 'similarity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (value: any) => (
                <Button onClick={() => this.onDelete(value.id)}>Delete</Button>
            )
        },
      ];
    
    constructor(props: {}) {
        super(props);

        this.state={}

        DataService.getHistory()
        .then((response: any) => {
            this.setState({
                history: response.data.history
            })
            console.log(response.data.history);
        })
      }

    onDelete(value: any){
        console.log(value)
        DataService.removeHistory(value).then((response: any) => {
            this.setState({ history: response.data.history });
          });
    }

    render() {
        const { history } = this.state;
        return <Content className='inner'>
            <Table
            columns={this.columns}
            dataSource={history != null ? history : []}>
            </Table>
        </Content>
    }
}