import * as React from "react"
import {Button, List} from "antd"

interface Props {
    data: string[]
}

const ViewRepos = (props: Props) => {
    return <div>
        <List
            size="large"
            dataSource={props.data}
            renderItem={item => <List.Item>
                <Button type="primary">{item}</Button>
            </List.Item>}
        />
    </div>
};

export default ViewRepos