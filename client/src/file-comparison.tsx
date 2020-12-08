import { FileSearchOutlined } from "@ant-design/icons";
import { Row, Col, Button, Tooltip, Select, message } from "antd";
import Content from "antd/lib/layout/layout";
import React from "react";
import { DataService } from "./data-service";
import Text from "antd/lib/typography/Text";
const { Option } = Select;

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
            fileSelection1: null,
            fileSelection2: null,
        }

        DataService.getListFiles()
            .then((response: any) => {
                this.setState({ files: response.data.files });
            });
    }

    onConfirm(file1: any, file2: any) {
        if (file1 != null && file2 != null) {
            this.setState({
                select1: file1.label[0],
                select2: file2.label[0],
            })
            DataService.postComparison(file1.value, file2.value)
                .then(() => DataService.getComparisons())
                .then((response) => {
                    this.setState({
                        file1code: response.data.file1,
                        file2code: response.data.file2,
                        comparison: response.data.content,
                        textDiff: response.data.textDiff,
                    })
                })
        } else {
            message.error('Please reselect files');
            return;
        }
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

    handleChange(value: any, file: number){
        if(file === 0){
        this.setState({
            fileSelection1: value
        })
    } else {
        this.setState({
            fileSelection2: value
        })
    }
    }

    renderTextDiff(file: number) {
        const { file1code, file2code, textDiff } = this.state;
        if (textDiff != null) {
            const compare = textDiff.compare;
            let out1 = file1code.map((line: any) => {
                return { "code": line, "detect": false, "codeLines": [] as any };
            });
            let out2 = file2code.map((line: any) => {
                return { "code": line, "detect": false, "codeLines": [] as any };
            });
            for (let i = 0; i < file1code.length; i++) {
                for (let j = 0; j < compare.length; j++) {
                        if (i >= compare[j][0] && i <= compare[j][1]) {
                            let lines1 = [compare[j][2] + 1, compare[j][3] + 1]
                            out1[i].detect = true;
                            out1[i].codeLines = lines1;
                        }
            }

            for (let i = 0; i < file1code.length; i++) {
                for (let j = 0; j < compare.length; j++) {
                        if (i >= compare[j][2] && i <= compare[j][3]) {
                            let lines2 = [compare[j][0] + 1, compare[j][1] + 1]
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
    }

    renderComparison(file: number) {
        console.log("render comaprison", this.state)
        const { file1code, file2code, comparison } = this.state;
        if (comparison != null) {
            const compare = comparison.compare;
            let out1 = file1code.map((file: any) => {
                return { "code": file, "detect": false, "type": ""};
            });
            let out2 = file2code.map((file: any) => {
                return { "code": file, "detect": false, "type": ""};
            });

            for (let i = 0; i < file1code.length; i++) {
                for (let j = 0; j < compare.length; j++) {
                        if (i >= compare[j][0] && i <= compare[j][1]) {
                            let lines1 = [compare[j][2] + 1, compare[j][3] + 1]
                            out1[i].detect = true;
                            out1[i].codeLines = lines1;
                            out1[i].type = compare[j][4].toString()
                        }
            }

            for (let i = 0; i < file1code.length; i++) {
                for (let j = 0; j < compare.length; j++) {
                        if (i >= compare[j][2] && i <= compare[j][3]) {
                            let lines2 = [compare[j][0] + 1, compare[j][1] + 1]
                            out2[i].detect = true;
                            out2[i].codeLines = lines2;
                            out2[i].type = compare[j][4].toString()
                        }
                    }
                }

            }

            let out = file === 0 ? out1 : out2;
            return <div>
                {out.map((line: any, index: number = 0) => {
                    let tipText;
                    if (line.detect) {
                        tipText = <div className='tooltip'>
                            <p>Similarity</p>
                            <p>Type: {line.type}</p>
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

    }

    renderPercentage() {
        const { tab, comparison, textDiff} = this.state;
        if (comparison != null && textDiff != null){
        let color = "";
        let percentage = tab === "textdiff" ? Math.round(textDiff.plagiarism) : Math.round(comparison.plagiarism)
        console.log("what is my percentage", percentage);

        if (percentage >= 0 && percentage < 30) {
            color = "green"
        } else if (percentage >= 30 && percentage < 60) {
            color = "yellow"
        } else if (percentage >= 60 && percentage < 80) {
            color = "orange"
        } else {
            color = "red"
        }

        return <h2 style={{ color: color, paddingRight: '5px' }}>{percentage + "%"}</h2>
    }
    }

    render() {
    const { files, select1, select2, tab, fileSelection1, fileSelection2 } = this.state;

        return <Content className="inner">
            <Row>
                <Col span="12" className='file-select'>
                    <Select labelInValue placeholder="Select a File" style={{ width: '100%' }} onChange={(value) => this.handleChange(value, 0)}>
                        {files.map((file: any) => {
                            return <Option key={file.name} value={file.id}><Text className='select-option'>{file.name + `\t\t`}</Text><Text>{file.date}</Text></Option>
                        })}
                    </Select>
                    <br></br>
                    <br></br>
                    <Button type="primary" onClick={() => {
                        this.onConfirm(fileSelection1, fileSelection2)
                        this.setState({
                            fileSelection1: null,
                            fileSelection2: null,
                        })
                    }}>Confirm Selection</Button>
                </Col>
                <Col span="12" className='file-select'>
                    <Select labelInValue placeholder="Select a File" style={{ width: '100%' }} onChange={(value) => this.handleChange(value, 1)}>
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
                        {tab === "textdiff" ? this.renderTextDiff(0) : this.renderComparison(0)}
                    </div>
                </Col>

                <Col span="12" className='code-body'>
                    <h2>{select2}</h2>
                    <div className="code-container col-12">
                        {tab === "textdiff" ? this.renderTextDiff(1) : this.renderComparison(1)}
                    </div>
                </Col>

            </Row>
        </Content>
    }
}