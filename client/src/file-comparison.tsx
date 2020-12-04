import { FileSearchOutlined } from "@ant-design/icons";
import { Row, Col, Button, Tooltip, Select } from "antd";
import Content from "antd/lib/layout/layout";
import React from "react";
import { PlagiarismAppState } from "./plagiarism.interface";
import { FormInstance } from 'antd/lib/form';
import { DataService } from "./data-service";

const { Option } = Select;

const plagerism1 = [['style={{padding: 100}}><Button size="large" onClick={this.showLogin}', true, "100%", "Textual Diff"],
        ['okButtonProps={{form:', true, "100%", "Textual Diff"],
        ['okButtonProps={{form:', true, "100%", "Textual Diff"],
        ['this is diff', false, "100%", "Textual Diff"],
        ['WOW', false, "100%", "Textual Diff"],
        ['okButtonProps={{form:', true, "100%", "Textual Diff"],
        ['this is diff', false, "100%", "Textual Diff"],
        ['WOW', false, "100%", "Textual Diff"],
        ['okButtonProps={{form:', true, "100%", "Textual Diff"],
        ['this is diff', false, "100%", "Textual Diff"],
        ['WOW', false, "100%", "Textual Diff"],
        ['okButtonProps={{form:', true, "100%", "Textual Diff"]];

        const fileSelected = false;

        const plagerism2 = [['this is diff', false, "100%", "Textual Diff"],
        ['WOW', false, "100%", "Textual Diff"],
        ['okButtonProps={{form:', true, "100%", "Textual Diff"]];

export default class FileComparisonComponent extends React.Component<{}, any> {
    constructor(props: {}) {
        super(props);

        this.state = {
            select1: "No File",
            select2: "No File",
            files: [],
            tab: "textdiff",
        }

        DataService.getListFiles()
            .then((response: any) => {
                this.setState({ files: response.data.files });
            });
    }

    onConfirm(file1: any, file2: any) {
        console.log("hellooo", file1, file2)
        this.setState({
            select1: file1,
            select2: file2,
        })
        DataService.postFileSelection(file1, file2)
    }

    onChangeTab(){
        const { tab } = this.state;
        if (tab === "textdiff") {
            this.setState({
                tab: "other"
            })
        } else {
            this.setState({
                tab: "textdiff"
            })
        }
    }

    renderTextDiff(file: number) {
        let pla;
        file === 0 ? pla = plagerism1 : pla = plagerism2;
        return <div>
        {pla.map((value, index) => {
            let tipText;
            if (value[1]) {
                tipText = <div className='tooltip'><p className='percent'>{value[2]}</p>
                    <p>Similarity</p>
                    <p>Type: {value[3]}</p>
                    <Button icon={<FileSearchOutlined />} size={'small'}>
                        See All
</Button>
                </div>
            }
            return <Tooltip placement="leftTop" title={tipText}>
                <code className={"line"}>{index + 1}</code>
                <code className={value[1] ? 'is-plagerized' : ''}>{value[0]}</code>
            </Tooltip>
        })}
        </div>
    }

    render() {

        let fileSelection1: string = "";
        let fileSelection2: string = "";

        const { files, select1, select2, tab} = this.state;

        return <Content className="inner">
            <Row>
                <Col span="12" className='file-select'>
                    <Select placeholder="Select a File" style={{ width: 300 }} onChange={(value) => fileSelection1 = value.toString()}>
                        {files.map((value: any) => {
                            return <Option key={value.id} value={value.name}>{value.name}</Option>
                        })}
                    </Select>
                    <br></br>
                    <br></br>
                    <Button type="primary" onClick={() => this.onConfirm(fileSelection1, fileSelection2)}>Confirm Selection</Button>
                </Col>
                <Col span="12" className='file-select'>
                    <Select placeholder="Select a File" style={{ width: 300 }} onChange={(value) => fileSelection2 = value.toString()}>
                        {files.map((value: any) => {
                            return <Option key={value.id} value={value.name}>{value.name}</Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <Row style={{ paddingLeft: '20px', paddingTop: '5px', marginBottom: '-20px' }}>
                <h2 style={{ color: 'red', paddingRight: '5px' }}>40%</h2>
                <h2>Similarity</h2>
                    <Button onClick={() => this.onChangeTab()} style={{ marginLeft : '20px' }}>{tab === "textdiff" ? "See Other Comparison" : "See Textual Diff"}</Button>
            </Row>
            <Row>
                <Col span="12" className='code-body'>
                    <h2>{select1}</h2>
                    <div className="code-container col-12">
                        {this.renderTextDiff(0)}
                    </div>
                </Col>

                <Col span="12" className='code-body'>
                    <h2>{select2}</h2>
                    <div className="code-container col-12">
                        {this.renderTextDiff(1)}
                    </div>
                </Col>

            </Row>
        </Content>
    }
}