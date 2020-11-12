
import { Input, Form, Layout, Button, List} from "antd";
import { FormInstance } from "antd/lib/form";
import { DeleteOutlined } from '@ant-design/icons';

import Title from "antd/lib/typography/Title";
import React from "react";
import { DataService } from "./data-service";
import { TodoAppState, TodoItem } from "./todo.interface";


export default class TodoApp extends React.Component<{}, TodoAppState> {
    
    newTodoForm: React.RefObject<FormInstance>;
    

    constructor(props: {}){
        super(props);
        this.newTodoForm = React.createRef();
        this.state = { items: []};
        DataService.getTodos()
            .then((response: any) => {
                this.setState({ items: response.data });
            });
    }

    newTodoItem(values: any){
        let title = values.itemText;
        this.newTodoForm.current?.setFieldsValue({itemText: ""});
        DataService.addTodo({title: title})
            .then((response: any) => {
                this.setState({ items: response.data });
            });
        /* this.setState((prevState)=>({
            items : data
        })); */

    }

    deleteItem(item: TodoItem){
        DataService.removeTodo(item)
            .then((response: any) => {
                this.setState({ items: response.data });
            });
    }

    renderItem(item: TodoItem){
        return <List.Item actions={[<Button onClick={this.deleteItem.bind(this, item)} icon={<DeleteOutlined />} />]}>
            {item.title}
        </List.Item>
    }
    render(){
        return <Layout>
            <Layout.Content>
                <Title>Todolist</Title>
                <Form onFinish={(values)=> this.newTodoItem(values)} ref={this.newTodoForm}>
                    <Form.Item label="Todo Item" name='itemText'><Input /></Form.Item>
                    <Button type="primary" htmlType="submit">New Todo Item</Button>
                </Form>
                <List
                bordered
                dataSource={this.state.items}
                renderItem={this.renderItem.bind(this)}
                />
            </Layout.Content>
        </Layout>
    }
}