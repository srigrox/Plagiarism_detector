import { FileSearchOutlined } from "@ant-design/icons";
import { Row, Col, Button, Tooltip, Select } from "antd";
import Content from "antd/lib/layout/layout";
import React from "react";
import { PlagiarismAppState } from "./plagiarism.interface";
import { FormInstance } from 'antd/lib/form';
import { DataService } from "./data-service";
import Text from "antd/lib/typography/Text";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";

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

const samplecode1 = ['style={{padding: 100}}><Button size="large" onClick={this.showLogin}',
    'okButtonProps={{form:',
    'okButtonProps={{form:',
    'this is diff',
    'WOW',
    'okButtonProps={{form:',
    'this is diff',
    'WOW',
    'okButtonProps={{form:',
    'this is diff',
    'WOW',
    'okButtonProps={{form:'];

const plagiarism1 = { plagiarism: 60, compare: [[1, 1, 3, 4], [5, 6, 1, 2]] }
const plagiarism2 = { plagiarism: 80, compare: [[1, 2, 4, 5, "var change", "60%"], [5, 6, 2, 3, "name change", "80%"]] }

export default class FileComparisonComponent extends React.Component<{}, any> {
    constructor(props: {}) {
        super(props);

        this.state = {
            select1: "No File",
            select2: "No File",
            files: [],
            tab: "textdiff",
            comparison: null,
            textDiff: null,
        }

        DataService.getListFiles()
            .then((response: any) => {
                this.setState({ files: response.data.files });
            });
    }

    onConfirm(file1: any, file2: any) {
        if (file1){
        console.log("okau") 
        this.setState({
            select1: file1.label[0],
            select2: file2.label[0],
        })
    }
        DataService.postFileSelection(file1.value, file2.value)
        .then(() => DataService.getComparisons().then((response) => console.log("i made it", response)))
    }

    onChangeTab() {
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
        DataService.getComparisons()
        .then((response) => {
            console.log("i got here!!!", response)
            this.setState({
                file1code: response.file1,
                file2code: response.file2,
                comparison: response.content,
                textDiff: response.textDiff,
            })
        })
        const { file1code, file2code, comparison } = this.state;
        const compare = comparison.compare;
        let out1 = file1code.map((line: any) => {
            return { "code": line, "detect": false, "codeLines": [] as any};
        });
        let out2 = file2code.map((line: any) => {
            return { "code": line, "detect": false, "codeLines": [] as any};
        });
        for (let i = 0; i < file1code.length; i++) {
            for (let j = 0; j < compare.length; j++) {
                if (file === 0) {
                    if (i >= compare[j][0] && i <= compare[j][1]) {
                        let lines1 = [compare[j][2].toString(), compare[j][3].toString()]
                        out1[i].detect = true;
                        out1[i].codeLines = lines1;
                    }
                } else {
                    if (i >= compare[j][2] && i <= compare[j][3]) {
                        let lines2 = [compare[j][0].toString(), compare[j][1].toString()]
                        out2[i].detect = true;
                        out2[i].codeLines = lines2;
                    }
                }
            }
        }

        let out = file === 0 ? out1 : out2;
        return <div>
            {out.map((line: any, index: number = 0) => {
                let tipText;
                if (line.detect) {
                    tipText = <div className='tooltip'><p className='percent'>{line.percent}</p>
                    <p>Lines Compared: </p>
                    <p> {line.codeLines[0]} to {line.codeLines[1]}</p>
                    </div>
                }
                return <Tooltip placement="leftTop" title={tipText}>
                    <code className={"line"}>{index + 1}</code>
                    <code className={line.detect ? 'is-plagerized' : ''}>{line.code}</code>
                </Tooltip>
            })}
        </div>
    }

    renderComparison(file: number){
        const compare = plagiarism2.compare;
        let out1 = samplecode1.map(element => {
            return { "code": element, "detect": false, "type": "", "percent": ''};
        });
        let out2 = samplecode1.map(element => {
            return { "code": element, "detect": false, "type": "", "percent": ''};
        });
        for (let i = 0; i < samplecode1.length; i++) {
            for (let j = 0; j < compare.length; j++) {
                if (file === 0) {
                    if (i >= compare[j][0] && i <= compare[j][1]) {
                        out1[i].detect = true
                        out1[i].type = compare[j][4].toString()
                        out1[i].percent = compare[j][5].toString()
                    }
                } else {
                    if (i >= compare[j][2] && i <= compare[j][3]) {
                        out2[i].detect = true;
                        out2[i].type = compare[j][4].toString()
                        out2[i].percent = compare[j][5].toString()
                    }
                }
            }
        }

        let out = file === 0 ? out1 : out2;
        return <div>
        {out.map((line, index) => {
            let tipText;
            if (line.detect) {
                tipText = <div className='tooltip'><p className='percent'>{line.percent}</p>
                    <p>Similarity</p>
                    <p>Type: {line.type}</p>
                </div>
            }
            return <Tooltip placement="leftTop" title={tipText}>
                <code className={"line"}>{index + 1}</code>
                <code className={line.detect ? 'is-plagerized' : ''}>{line.code}</code>
            </Tooltip>
        })}
        </div>


    }

    renderPercentage(){
        const { tab } = this.state;
        let color = "";
        let percentage = tab === "textdiff" ? plagiarism1.plagiarism : plagiarism2.plagiarism

        if(percentage >= 0 && percentage < 30){
            color = "green"
        } else if (percentage >= 30 && percentage < 60){
            color = "yellow"
        } else if (percentage >= 60 && percentage < 80){
            color = "orange"
        } else {
            color = "red"
        }

    return <h2 style={{ color: color, paddingRight: '5px' }}>{percentage + "%"}</h2>
    }
//{tab === "textdiff" ? this.renderTextDiff(1) : this.renderComparison(1)}
    render() {
        let fileSelection1: any;
        let fileSelection2: any;

        const { files, select1, select2, tab, comparison } = this.state;

        return <Content className="inner">
            <Row>
                <Col span="12" className='file-select'>
                    <Select labelInValue placeholder="Select a File" style={{ width: '100%' }} onChange={(value) => fileSelection1 = value}>
                        {files.map((file: any) => {
                            return <Option key={file.name} value={file.id}><Text className='select-option'>{file.name + `\t\t`}</Text><Text>{file.date}</Text></Option>
                        })}
                    </Select>
                    <br></br>
                    <br></br>
                    <Button type="primary" onClick={() => {
                        this.onConfirm(fileSelection1, fileSelection2)}}>Confirm Selection</Button>
                </Col>
                <Col span="12" className='file-select'>
                    <Select labelInValue placeholder="Select a File" style={{ width: '100%' }} onChange={(value) => fileSelection2 = value}>
                        {files.map((file: any) => {
                            return <Option key={file.name} value={file.id}><Text className='select-option'>{file.name + `\t\t`}</Text><Text>{file.date}</Text></Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <Row style={{ paddingLeft: '20px', paddingTop: '5px', marginBottom: '-20px' }}>
                {this.renderPercentage()}
                <h2>Similarity</h2>
                <Button onClick={() => this.onChangeTab()} style={{ marginLeft: '20px' }}>{tab === "textdiff" ? "See Other Comparison" : "See Textual Diff"}</Button>
            </Row>
            <Row>
                <Col span="12" className='code-body'>
                    <h2>{select1}</h2>
                    <div className="code-container col-12">
                        {comparison != null ? this.renderTextDiff(0) : ""}
                    </div>
                </Col>

                <Col span="12" className='code-body'>
                    <h2>{select2}</h2>
                    <div className="code-container col-12">
                        {comparison != null ? this.renderTextDiff(1) : ""}
                    </div>
                </Col>

            </Row>
        </Content>
    }
}