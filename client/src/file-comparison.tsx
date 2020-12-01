import { FileSearchOutlined } from "@ant-design/icons";
import { Row, Col, Button, Tooltip } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export default class FileComparisonComponent extends React.Component<{}, any> {
    
    render() {

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


        const plagerism2 = [['this is diff', false, "100%", "Textual Diff"], 
        ['WOW', false, "100%", "Textual Diff"], 
        ['okButtonProps={{form:', true, "100%", "Textual Diff"]];

        return <Content className="inner">
            <Row style={{paddingLeft: '20px', paddingTop: '10px'}}>
                <h2 style={{color: 'red', paddingRight: '5px'}}>40%</h2>
                <h2>Similarity</h2>
            </Row>
        <Row>
            <Col span="12" className='code-body'>
            <h2>index.tsx</h2>
        <div className="code-container col-12">
            {plagerism1.map((value, index) => {
                let tipText;
                if (value[1]){
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
            </Col>

            <Col span="12" className='code-body'>
            <h2>index.tsx</h2>
        <div className="code-container col-12">
            {plagerism2.map((value, index) => {
                let tipText;
                if (value[1]){
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
            </Col>
            
        </Row>
    </Content>
    }
}