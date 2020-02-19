import * as React from "react"
import { useParams } from "react-router-dom";

import {Button, List} from "antd"
import routes from "../../../constants/routes";

interface Props {
    data: string[]
}

const ViewRepos = (props: Props) => {
    let { user } = useParams();

    if (!user) {
        return <div></div>;
    }

    let userString: string = user;

    return <div>
        <List
            size="large"
            dataSource={props.data}
            renderItem={item => <List.Item>
                <Button type="primary" href={routes.getRepoDir(userString, item, "")}>{item}</Button>
            </List.Item>}
        />
    </div>
};

export default ViewRepos